import { useEffect, useState } from 'react';
import SiteList from '../site-list';
import TrackingButton from '../tracking-btn';
import TimeTracker from '../time-tracker';
import StatusBadge from '../status-badge';
import { MoonIcon, SunIcon, LogOutIcon, RefreshCcwIcon, BarChart2 } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Popup() {
    const [stats, setStats] = useState<any>({});
    const [total, setTotal] = useState<any>(0);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    const getTodayKey = () => `usage-${new Date().toISOString().split('T')[0]}`;

    useEffect(() => {
        const todayKey = getTodayKey();

        const fetchData = async () => {
            if (typeof chrome !== 'undefined' && chrome.storage?.local) {
                chrome.storage.local.get([todayKey, 'paused', 'darkMode'], async (result) => {
                    let siteData = result[todayKey] || {};
                    const pausedStatus = result['paused'] || false;
                    const darkModeStatus = result['darkMode'] || false;

                    const user = auth.currentUser;
                    if (user) {
                        setUserEmail(user.email);

                        // Get Firestore data - using the correct document ID format
                        const today = new Date().toISOString().split('T')[0];
                        const docId = `${user.uid}_${today}`;
                        const usageRef = doc(db, 'usage', docId);

                        try {
                            const usageSnap = await getDoc(usageRef);

                            if (usageSnap.exists()) {
                                const firestoreData = usageSnap.data();
                                const firestoreSites = firestoreData?.sites || {};
                                console.log("Firestore data retrieved:", firestoreSites);

                                // Merge Firestore sites data with local storage data
                                Object.entries(firestoreSites).forEach(([site, time]) => {
                                    if (!siteData[site] || (time as number) > siteData[site]) {
                                        siteData[site] = time as number;
                                    }
                                });

                                // Update local storage with merged data
                                chrome.storage.local.set({ [todayKey]: siteData }, () => {
                                    console.log("Local storage updated with Firestore data");
                                });
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
        handleOutdatedKeys();
        scheduleMidnightReset();
    }, []);

    useEffect(() => {
        const handleSaveRequest = async (message: any, _: any, sendResponse: any) => {
            if (message.type === 'saveToFirestore') {
                const { key, sites } = message.payload;
                const user = auth.currentUser;

                if (user) {
                    const today = key.replace('usage-', '');
                    const docId = `${user.uid}_${today}`;
                    const usageRef = doc(db, 'usage', docId);

                    try {
                        // Calculate total time
                        const totalTime = Object.values(sites).reduce((a: any, b: any) => a + b, 0);

                        // Save to Firestore
                        await setDoc(usageRef, {
                            date: today,
                            sites: sites,
                            totalTime: totalTime,
                            userId: user.uid
                        }, { merge: true });

                        console.log('[Popup] Data saved to Firestore');
                        sendResponse({ success: true });
                    } catch (err) {
                        console.error('[Popup] Firestore save error:', err);
                        sendResponse({ success: false, error: err });
                    }
                } else {
                    console.warn('[Popup] No authenticated user');
                    sendResponse({ success: false, error: 'No user' });
                }
            }

            return true; // Required for async sendResponse
        };

        chrome.runtime.onMessage.addListener(handleSaveRequest);
        return () => chrome.runtime.onMessage.removeListener(handleSaveRequest);
    }, []);

    // Update the scheduleMidnightReset function in Popup.tsx
    const scheduleMidnightReset = () => {
        const now = new Date();
        const millisTillMidnight = new Date(
            now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0
        ).getTime() - now.getTime();

        setTimeout(() => {
            const todayKey = getTodayKey();
            chrome.storage.local.get([todayKey], async (result) => {
                const siteData = result[todayKey] || {};
                const user = auth.currentUser;

                if (user) {
                    const today = new Date().toISOString().split('T')[0];
                    const docId = `${user.uid}_${today}`;
                    const usageRef = doc(db, 'usage', docId);

                    try {
                        // Calculate total time
                        const totalTime = Object.values(siteData).reduce((acc: any, ms: any) => acc + ms, 0);

                        // Save to Firestore
                        await setDoc(usageRef, {
                            date: today,
                            sites: siteData,
                            totalTime: totalTime,
                            userId: user.uid
                        }, { merge: true });

                        console.log('[Midnight] Data saved to Firestore');
                        chrome.storage.local.remove(todayKey, () => {
                            const newKey = getTodayKey();
                            chrome.storage.local.set({ [newKey]: {} });
                            setStats({});
                            setTotal(0);
                            console.log('[Midnight] Local storage cleared for new day');
                        });
                    } catch (err) {
                        console.error('[Midnight] Failed to save:', err);
                    }
                }
            });

            scheduleMidnightReset(); // Reschedule for next day
        }, millisTillMidnight);
    };

    // 🔎 Remove any outdated day keys if app opened after midnight
    const handleOutdatedKeys = () => {
        const todayKey = getTodayKey();
        chrome.storage.local.get(null, (result) => {
            const keys = Object.keys(result).filter(key => key.startsWith('usage-') && key !== todayKey);
            chrome.storage.local.remove(keys);
        });
    };

    const togglePause = () => {
        const newStatus = !isPaused;
        chrome.runtime?.sendMessage({ type: 'togglePause', value: newStatus }, (response) => {
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
                const today = new Date().toISOString().split('T')[0];
                const docId = `${user.uid}_${today}`;
                const usageRef = doc(db, 'usage', docId);

                try {
                    // Calculate total time
                    const totalTime = Object.values(siteData).reduce((acc: any, ms: any) => acc + ms, 0);

                    // Save to Firestore using the document ID format from your database
                    await setDoc(usageRef, {
                        date: today,
                        sites: siteData,
                        totalTime: totalTime,
                        userId: user.uid
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

    const syncNow = () => {
        chrome.runtime?.sendMessage({ type: 'forceSync' }, (_) => {
            if (chrome.runtime.lastError) {
                console.error('Sync failed:', chrome.runtime.lastError.message);
            } else {
                console.log('[Popup] Manual sync triggered');
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
                        <button onClick={syncNow} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                            <RefreshCcwIcon size={14} /> Sync Now
                        </button>
                    </div>
                    <SiteList stats={stats} />
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-4 py-2 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
                <span>{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <button onClick={handleLogout} className="text-red-500 flex items-center gap-1 hover:underline">
                    <LogOutIcon size={14} /> Logout
                </button>
            </div>
        </div>
    );
}
