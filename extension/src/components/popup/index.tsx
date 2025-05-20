import { useEffect, useState } from 'react';
import SiteList from '../site-list';
import TrackingButton from '../tracking-btn';
import TimeTracker from '../time-tracker';
import StatusBadge from '../status-badge';
import { MoonIcon, SunIcon, LogOutIcon, BarChart2 } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';


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

const getTodayDocId = (userId: string): string => {
    return `${userId}_${getLocalDate()}`;
};

const formatDisplayDate = (dateKey: string): string => {
    const datePart = dateKey.replace('usage-', '');
    const [year, month, day] = datePart.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function Popup() {
    const [stats, setStats] = useState<any>({});
    const [total, setTotal] = useState<any>(0);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState<string>('');

    useEffect(() => {
        const todayKey = getTodayKey();
        setCurrentDate(formatDisplayDate(todayKey));

        const fetchData = async () => {
            if (typeof chrome !== 'undefined' && chrome.storage?.local) {
                chrome.storage.local.get([todayKey, 'paused', 'darkMode'], async (result) => {
                    // Create today's key if it doesn't exist
                    let siteData = result[todayKey] || {};
                    if (!result[todayKey]) {
                        chrome.storage.local.set({ [todayKey]: {} });
                        console.log(`[Popup] Created new storage for ${todayKey}`);
                    }

                    const pausedStatus = result['paused'] || false;
                    const darkModeStatus = result['darkMode'] || false;

                    const user = auth.currentUser;
                    if (user) {
                        setUserEmail(user.email);

                        // Get Firestore data using consistent ID format
                        const docId = getTodayDocId(user.uid);
                        const usageRef = doc(db, 'usage', docId);

                        try {
                            const usageSnap = await getDoc(usageRef);

                            if (usageSnap.exists()) {
                                const firestoreData = usageSnap.data();
                                const firestoreSites = firestoreData?.sites || {};
                                console.log("Firestore data retrieved:", firestoreSites);

                                // Merge data with local storage - only take higher values
                                let dataChanged = false;
                                Object.entries(firestoreSites).forEach(([site, time]) => {
                                    if (!siteData[site] || (time as number) > siteData[site]) {
                                        siteData[site] = time as number;
                                        dataChanged = true;
                                    }
                                });

                                // Only update if data changed
                                if (dataChanged) {
                                    chrome.storage.local.set({ [todayKey]: siteData }, () => {
                                        console.log("Local storage updated with Firestore data");
                                    });
                                }
                            }
                        } catch (err) {
                            console.error('[Fetch] Failed to load Firestore data:', err);
                        }
                    }

                    setStats(siteData);
                    setIsPaused(pausedStatus);
                    setDarkMode(darkModeStatus);
                    setTotal(Object.values(siteData).reduce((acc: any, ms: any) => acc + ms, 0));
                    setIsLoading(false);
                });
            } else {
                console.error('[Popup] chrome.storage.local is not available.');
                setStats({});
                setIsLoading(false);
            }
        };

        fetchData();

        // Clean up outdated keys
        handleOutdatedKeys();

        // Listen for data updates from background script
        const handleMessages = (message: any, _: any, sendResponse: any) => {
            if (message.type === MessageType.SYNC_COMPLETE) {
                console.log('[Popup] Received sync complete notification, refreshing data');
                fetchData();
                sendResponse({ success: true });
            } else if (message.type === MessageType.DAY_CHANGED) {
                console.log('[Popup] Day changed notification received, reloading...');
                window.location.reload();
                sendResponse({ success: true });
            }
            return true;
        };

        chrome.runtime.onMessage.addListener(handleMessages);

        // Check for date changes every minute
        const dateCheckInterval = setInterval(() => {
            const newTodayKey = getTodayKey();
            if (newTodayKey !== todayKey) {
                console.log('[Popup] Date changed, reloading...');
                window.location.reload();
            }
        }, 60000);

        return () => {
            clearInterval(dateCheckInterval);
            chrome.runtime.onMessage.removeListener(handleMessages);
        };
    }, []);

    useEffect(() => {
        const handleSaveRequest = async (message: any, _: any, sendResponse: any) => {
            if (message.type === MessageType.FORCE_SYNC) {
                const todayKey = getTodayKey();
                const user = auth.currentUser;

                if (user) {
                    chrome.storage.local.get([todayKey], async (result) => {
                        const sites = result[todayKey] || {};

                        if (Object.keys(sites).length === 0) {
                            sendResponse({ success: true, message: "No data to sync" });
                            return;
                        }

                        const docId = getTodayDocId(user.uid);
                        const usageRef = doc(db, 'usage', docId);

                        try {
                            // Calculate total time
                            const totalTime = Object.values(sites).reduce((a: any, b: any) => a + b, 0);

                            // Save to Firestore
                            await setDoc(usageRef, {
                                date: docId.split('_')[1],
                                sites: sites,
                                totalTime: totalTime,
                                userId: user.uid,
                                lastUpdated: new Date().toISOString()
                            }, { merge: true });

                            console.log('[Popup] Data saved to Firestore');

                            // Update UI with latest data
                            setStats(sites);
                            setTotal(totalTime);

                            sendResponse({ success: true });
                        } catch (err) {
                            console.error('[Popup] Firestore save error:', err);
                            sendResponse({ success: false, error: err });
                        }
                    });
                    return true;
                } else {
                    console.warn('[Popup] No authenticated user');
                    sendResponse({ success: false, error: 'No user' });
                }
            }
            return true;
        };

        chrome.runtime.onMessage.addListener(handleSaveRequest);
        return () => chrome.runtime.onMessage.removeListener(handleSaveRequest);
    }, []);

    // Remove any outdated day keys
    const handleOutdatedKeys = () => {
        const todayKey = getTodayKey();
        chrome.storage.local.get(null, (result) => {
            const keys = Object.keys(result).filter(key => key.startsWith('usage-') && key !== todayKey);
            if (keys.length > 0) {
                chrome.storage.local.remove(keys, () => {
                    console.log(`[Popup] Removed ${keys.length} outdated storage keys`);
                });
            }
        });
    };

    const togglePause = () => {
        const newStatus = !isPaused;
        chrome.runtime?.sendMessage({ type: MessageType.TOGGLE_PAUSE, value: newStatus }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('[Popup] Runtime error:', chrome.runtime.lastError.message);
                return;
            }
            if (response?.success) {
                setIsPaused(response.paused);
            }
        });
    };

    const toggleDarkMode = () => {
        const newStatus = !darkMode;
        setDarkMode(newStatus);
        chrome.storage?.local.set({ darkMode: newStatus });
    };

    const handleLogout = async () => {
        const todayKey = getTodayKey();
        chrome.storage.local.get([todayKey], async (result) => {
            const siteData = result[todayKey] || {};
            const user = auth.currentUser;

            if (user) {
                const docId = getTodayDocId(user.uid);
                const usageRef = doc(db, 'usage', docId);

                try {
                    // Calculate total time
                    const totalTime = Object.values(siteData).reduce((acc: any, ms: any) => acc + ms, 0);

                    // Save to Firestore
                    await setDoc(usageRef, {
                        date: docId.split('_')[1],
                        sites: siteData,
                        totalTime: totalTime,
                        userId: user.uid,
                        lastUpdated: new Date().toISOString()
                    }, { merge: true });

                    chrome.storage.local.clear(async () => {
                        console.log('[Logout] Local storage cleared');
                        await signOut(auth);
                        window.location.reload();
                    });
                } catch (err) {
                    console.error('[Logout] Error saving data:', err);
                    await signOut(auth);
                    window.location.reload();
                }
            }
        });
    };

    if (isLoading) {
        return (
            <div className="p-4 w-full h-56 flex items-center justify-center bg-white dark:bg-gray-900 rounded-xl shadow-lg animate-pulse">
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className={`w-full p-4 font-sans rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
            {/* Header */}
            <div className="border-b border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                            <BarChart2 size={16} />
                        </div>
                        <h1 className="text-lg font-semibold">InsightBoard</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <StatusBadge isPaused={isPaused} />
                        <button onClick={toggleDarkMode} className="hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-full">
                            {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
                        </button>
                    </div>
                </div>
                {userEmail && (
                    <div className="text-xs mt-1 text-gray-500 dark:text-gray-400 truncate">
                        Signed in as: <span className="font-medium">{userEmail}</span>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="p-4">
                <TimeTracker total={total} />
                <TrackingButton isPaused={isPaused} togglePause={togglePause} />

                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="font-medium text-sm">Top Sites Today</h2>
                    </div>
                    <SiteList stats={stats} />
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-4 py-2 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
                <span>{currentDate}</span>
                <button onClick={handleLogout} className="text-red-500 flex items-center gap-1 hover:underline">
                    <LogOutIcon size={14} /> Logout
                </button>
            </div>
        </div>
    );
}