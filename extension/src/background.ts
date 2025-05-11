import { doc, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

// Background script for InsightBoard extension

let currentDomain: string | null = null;
let startTime: number | null = null;
let isPaused: boolean = false;
const userId = 'some-unique-id';

// Initialize extension state
chrome.storage.local.get(['paused'], (result) => {
    isPaused = result.paused || false;
    console.log('[InsightBoard] Extension initialized, paused status:', isPaused);
});

const getTodayKey = (): string => {
    return `usage-${new Date().toISOString().split('T')[0]}`; // e.g., "usage-2025-05-08"
};

const getDomainFromUrl = (url: string): string => {
    try {
        return new URL(url).hostname;
    } catch {
        return 'unknown';
    }
};

// Save the time spent on the current domain
const saveTimeSpent = (): void => {
    if (!currentDomain || !startTime || isPaused) return;

    const now = Date.now();
    const duration = now - startTime;
    if (duration < 1000) return; // Ignore very short durations (< 1 second)

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

// Handle tab changes
const updateCurrentDomain = (tabId: number): void => {
    // Save current domain time before switching
    saveTimeSpent();

    chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError || !tab || !tab.url) {
            console.error('[InsightBoard] Error getting tab:', chrome.runtime.lastError);
            currentDomain = null;
            return;
        }

        if (tab && tab.url) {
            currentDomain = getDomainFromUrl(tab.url);
            startTime = Date.now();
            console.log(`[InsightBoard] Now tracking: ${currentDomain}`);
        } else {
            currentDomain = null;
        }
    });
};

// Function to sync current day's usage to Firestore
const syncToFirebase = async () => {
    const todayKey = `usage-${new Date().toISOString().split('T')[0]}`;

    chrome.storage.local.get([todayKey], async (result) => {
        const usageData = result[todayKey];

        if (!usageData) return;

        try {
            await setDoc(doc(db, 'users', userId, 'usage', todayKey), {
                ...usageData,
                syncedAt: new Date().toISOString()
            });
            console.log('[InsightBoard] Synced usage to Firebase');
        } catch (err) {
            console.error('[InsightBoard] Sync failed:', err);
        }
    });
};

// Set up event listeners

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

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message: any, _, sendResponse) => {
    if (message.type === 'togglePause') {
        isPaused = message.value;
        chrome.storage.local.set({ paused: isPaused });

        if (isPaused) {
            saveTimeSpent();
            currentDomain = null;
            startTime = null;
            console.log('[InsightBoard] Tracking paused');
        } else if (!isPaused) {
            // Resume tracking current tab
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
    return true; // Required for async sendResponse
});

// Set up periodic saving (every 30 seconds)
setInterval(saveTimeSpent, 30000);

console.log('[InsightBoard] Background script running');

// Initialize tracking for the current tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].id) {
        updateCurrentDomain(tabs[0].id!);
    }
});

// Sync every 60 seconds
setInterval(() => {
    syncToFirebase();
}, 60000);
