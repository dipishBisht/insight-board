let currentDomain: string | null = null;
let startTime: number | null = null;
let isPaused: boolean = false;

// Initialize extension state
chrome.storage.local.get(['paused'], (result) => {
    isPaused = result.paused || false;
    console.log('[InsightBoard] Extension initialized, paused status:', isPaused);
});

const getTodayKey = (): string => {
    return `usage-${new Date().toISOString().split('T')[0]}`;
};

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
    if (duration < 1000) return;

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
        type: 'saveToFirestore',
        payload: {
            key: getTodayKey(),
            sites: data,
        }
    }, (res) => {
        if (chrome.runtime.lastError) {
            console.error('[Background] Save failed:', chrome.runtime.lastError.message);
        } else {
            console.log('[Background] Save message sent:', res);
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

chrome.runtime.onMessage.addListener((message: any, _, sendResponse) => {
    if (message.type === 'togglePause') {
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
    return true;
});

// Listen for login events
chrome.runtime.onMessage.addListener((message: any, _, sendResponse) => {
    if (message.type === 'userLoggedIn') {
        // Force a sync of local data with Firestore data
        const todayKey = getTodayKey();
        chrome.storage.local.get([todayKey], (result) => {
            const localData = result[todayKey] || {};
            console.log('[InsightBoard] User logged in, syncing data');
            console.log(localData);

            // Send response immediately to prevent chrome.runtime.lastError
            sendResponse({ success: true });

            // The popup component will handle the actual data fetching from Firestore
        });
        return true;
    }

    // Handle other message types as before
    if (message.type === 'togglePause') {
        // Existing code...
    } else if (message.type === 'forceSync') {
        // Handle force sync
        const todayKey = getTodayKey();
        chrome.storage.local.get([todayKey], (result) => {
            const siteData = result[todayKey] || {};
            if (Object.keys(siteData).length > 0) {
                saveToFirestoreViaPopup(siteData);
                console.log('[InsightBoard] Manual sync triggered');
            }
            sendResponse({ success: true });
        });
        return true;
    }
    return true;
});

setInterval(saveTimeSpent, 30000);

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].id) {
        updateCurrentDomain(tabs[0].id!);
    }
});

// Midnight reset and Firestore sync
const scheduleMidnightReset = () => {
    const now = new Date();
    const millisTillMidnight = new Date(
        now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0
    ).getTime() - now.getTime();

    setTimeout(() => {
        const todayKey = getTodayKey();

        chrome.storage.local.get([todayKey], (result) => {
            const siteData = result[todayKey] || {};
            if (Object.keys(siteData).length > 0) {
                saveToFirestoreViaPopup(siteData);
            }

            chrome.storage.local.remove(todayKey, () => {
                chrome.storage.local.set({ [getTodayKey()]: {} });
                console.log('[InsightBoard] New day started');
            });
        });

        scheduleMidnightReset(); // Reschedule
    }, millisTillMidnight);
};

scheduleMidnightReset();

console.log('[InsightBoard] Background script running');
