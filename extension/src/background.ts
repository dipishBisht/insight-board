
let currentDomain: string | null = null;
let startTime: number | null = null;
let isPaused: boolean = false;
let midnightTimer: NodeJS.Timeout | null = null;


const MessageType = {
    TOGGLE_PAUSE: 'togglePause',
    FORCE_SYNC: 'forceSync',
    USER_LOGGED_IN: 'userLoggedIn',
    DAY_CHANGED: 'dayChanged',
    SYNC_COMPLETE: 'syncComplete'
};

const getLocalDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getTodayKey = (): string => {
    return `usage-${getLocalDate()}`;
};

const getMillisToMidnight = (): number => {
    const now = new Date();
    const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0, 0
    );
    return midnight.getTime() - now.getTime();
};

// Initialize extension state
chrome.storage.local.get(['paused'], (result) => {
    isPaused = result.paused || false;
    console.log('[InsightBoard] Extension initialized, paused status:', isPaused);

    // Make sure we have today's storage key initialized
    const todayKey = getTodayKey();
    chrome.storage.local.get([todayKey], (result) => {
        if (!result[todayKey]) {
            chrome.storage.local.set({ [todayKey]: {} });
            console.log(`[InsightBoard] Created today's storage key: ${todayKey}`);
        }
    });
});

const getDomainFromUrl = (url: string): string => {
    try {
        return new URL(url).hostname;
    } catch {
        return 'unknown';
    }
};

const saveTimeSpent = (): void => {
    if (!currentDomain || !startTime || isPaused) return;

    const now = Date.now();
    const duration = now - startTime;
    if (duration < 1000) return; // Skip very short durations

    const todayKey = getTodayKey();

    chrome.storage.local.get([todayKey], (data) => {
        const todayData: Record<string, number> = data[todayKey] || {};
        todayData[currentDomain!] = (todayData[currentDomain!] || 0) + duration;

        chrome.storage.local.set({ [todayKey]: todayData }, () => {
            console.log(`[InsightBoard] Saved ${Math.round(duration / 1000)}s for ${currentDomain}`);
        });

        startTime = now;
    });
};

const saveToFirestoreViaPopup = (data: Record<string, number>) => {
    chrome.runtime.sendMessage({
        type: MessageType.FORCE_SYNC,
        payload: {
            key: getTodayKey(),
            sites: data,
        }
    }, (res) => {
        if (chrome.runtime.lastError) {
            console.error('[Background] Save failed:', chrome.runtime.lastError.message);
        } else {
            console.log('[Background] Save message sent:', res);

            // Notify popup that data is synced
            chrome.runtime.sendMessage({
                type: MessageType.SYNC_COMPLETE
            });
        }
    });
};

const updateCurrentDomain = (tabId: number): void => {
    saveTimeSpent();

    chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError || !tab || !tab.url) {
            console.error('[InsightBoard] Error getting tab:', chrome.runtime.lastError);
            currentDomain = null;
            return;
        }

        currentDomain = getDomainFromUrl(tab.url);
        startTime = Date.now();
        console.log(`[InsightBoard] Now tracking: ${currentDomain}`);
    });
};

// Tab events
chrome.tabs.onActivated.addListener((activeInfo) => {
    updateCurrentDomain(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
    if (tab.active && changeInfo.url) {
        saveTimeSpent();
        currentDomain = getDomainFromUrl(changeInfo.url);
        startTime = Date.now();
        console.log(`[InsightBoard] URL changed, now tracking: ${currentDomain}`);
    }
});

// Idle state handling
chrome.idle.onStateChanged.addListener((state) => {
    if (state === 'idle' || state === 'locked') {
        saveTimeSpent();
        currentDomain = null;
        startTime = null;
        console.log('[InsightBoard] Idle or locked, pausing tracking');
    } else if (state === 'active') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0 && tabs[0].url) {
                currentDomain = getDomainFromUrl(tabs[0].url);
                startTime = Date.now();
                console.log(`[InsightBoard] Active again, now tracking: ${currentDomain}`);
            }
        });
    }
});

// Message handling
chrome.runtime.onMessage.addListener((message: any, _, sendResponse) => {
    // Handle pause/resume
    if (message.type === MessageType.TOGGLE_PAUSE) {
        isPaused = message.value;
        chrome.storage.local.set({ paused: isPaused });

        if (isPaused) {
            saveTimeSpent();
            currentDomain = null;
            startTime = null;
            console.log('[InsightBoard] Tracking paused');
        } else {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0 && tabs[0].url) {
                    currentDomain = getDomainFromUrl(tabs[0].url);
                    startTime = Date.now();
                    console.log(`[InsightBoard] Tracking resumed for: ${currentDomain}`);
                }
            });
        }

        sendResponse({ success: true, paused: isPaused });
    }
    // Handle manual sync
    else if (message.type === MessageType.FORCE_SYNC) {
        saveTimeSpent(); // Save latest time first

        const todayKey = getTodayKey();
        chrome.storage.local.get([todayKey], (result) => {
            const siteData = result[todayKey] || {};
            if (Object.keys(siteData).length > 0) {
                // Forward to Firestore
                saveToFirestoreViaPopup(siteData);
                console.log('[InsightBoard] Manual sync triggered');
            }
            sendResponse({ success: true });
        });
    }
    // Handle user login
    else if (message.type === MessageType.USER_LOGGED_IN) {
        // Force a sync of local data with Firestore data
        const todayKey = getTodayKey();
        chrome.storage.local.get([todayKey], (result) => {
            const localData = result[todayKey] || {};
            console.log('[InsightBoard] User logged in, syncing data');
            console.log(localData);


            // Send response immediately to prevent chrome.runtime.lastError
            sendResponse({ success: true });
        });
    }

    return true; // Keep the message channel open for async responses
});

// Regular save interval
setInterval(saveTimeSpent, 30000);

// Initialize tracking on startup
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].id) {
        updateCurrentDomain(tabs[0].id!);
    }
});

// The definitive midnight reset handler
const scheduleMidnightReset = () => {
    // Clear any existing timer to prevent duplicates
    if (midnightTimer) {
        clearTimeout(midnightTimer);
    }

    const millisTillMidnight = getMillisToMidnight();
    console.log(`[InsightBoard] Scheduled midnight reset in ${Math.round(millisTillMidnight / 1000 / 60)} minutes`);

    midnightTimer = setTimeout(() => {
        const oldKey = getTodayKey(); // This is still "yesterday" at this point

        console.log(`[InsightBoard] Midnight reset triggered for ${oldKey}`);

        // Save any pending data
        saveTimeSpent();

        chrome.storage.local.get([oldKey], (result) => {
            const yesterdayData = result[oldKey] || {};

            if (Object.keys(yesterdayData).length > 0) {
                console.log(`[InsightBoard] Saving ${oldKey} data before reset`);
                saveToFirestoreViaPopup(yesterdayData);
            }

            // After a small delay to ensure sync completes
            setTimeout(() => {
                // Now create the new day's key
                const newKey = getTodayKey(); // This will now be "today"

                // Create empty storage for the new day
                chrome.storage.local.set({ [newKey]: {} }, () => {
                    console.log(`[InsightBoard] Created new storage for ${newKey}`);

                    // Notify popup components about the day change
                    chrome.runtime.sendMessage({
                        type: MessageType.DAY_CHANGED,
                        payload: { oldKey, newKey }
                    });
                });

                // Schedule the next reset
                scheduleMidnightReset();
            }, 2000);
        });
    }, millisTillMidnight);
};

// Start the midnight reset scheduler
scheduleMidnightReset();

console.log('[InsightBoard] Background script running');