import { useEffect, useState } from 'react';
import SiteList from '../site-list';
import TrackingButton from '../tracking-btn';
import TimeTracker from '../time-tracker';
import StatusBadge from '../status-badge';
import { MoonIcon, SunIcon, LogOutIcon, RefreshCcwIcon, BarChart2 } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Popup() {
    const [stats, setStats] = useState<any>({});  // Store website stats
    const [total, setTotal] = useState<any>(0);  // Store total time for today
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const todayKey = `usage-${new Date().toISOString().split('T')[0]}`;

        // Fetch usage data (either from local storage or from Firestore)
        const fetchData = () => {
            if (typeof chrome !== 'undefined' && chrome.storage?.local) {
                chrome.storage.local.get([todayKey, 'paused', 'darkMode'], (result) => {
                    const siteData = result[todayKey] || {};  // Site stats for the day
                    const pausedStatus = result['paused'] || false;
                    const darkModeStatus = result['darkMode'] || false;

                    setStats(siteData);
                    setIsPaused(pausedStatus);
                    setDarkMode(darkModeStatus);
                    setTotal(Object.values(siteData).reduce((acc: any, ms: any) => acc + ms, 0)); // Total time spent today
                    setIsLoading(false);

                    // Save usage data to Firestore
                    const user = auth.currentUser;
                    if (user) {
                        const today = new Date().toISOString().split('T')[0]; // '2025-05-11'
                        const usageRef = doc(db, 'usage', `${user.uid}_${today}`);

                        setDoc(usageRef, {
                            userId: user.uid,
                            date: today,
                            sites: siteData,  // Usage data for sites
                            totalTime: Object.values(siteData).reduce((acc: any, ms: any) => acc + ms, 0), // Total time spent today
                        }, { merge: true }).catch((err) => {
                            console.error('Error saving usage data:', err);
                        });
                    }
                });
            } else {
                console.error('[Popup] chrome.storage.local is not available. Please use inside Chrome Extension.');
                setStats({});
                setIsLoading(false);
            }
        };

        fetchData();

        // Set Firebase user email
        const user = auth.currentUser;
        if (user) {
            setUserEmail(user.email);
        }
    }, []);

    // Toggle pause status
    const togglePause = () => {
        const newStatus = !isPaused;
        chrome.runtime?.sendMessage({ type: 'togglePause', value: newStatus }, (response) => {
            if (response?.success) {
                setIsPaused(newStatus);
            }
        });
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        const newStatus = !darkMode;
        setDarkMode(newStatus);
        chrome.storage?.local.set({ darkMode: newStatus });
    };

    // Handle user logout
    const handleLogout = async () => {
        await signOut(auth);
        window.location.reload();  // Trigger app to show auth screen
    };

    // Manually trigger sync
    const syncNow = () => {
        chrome.runtime?.sendMessage({ type: 'forceSync' }, (_) => {
            if (chrome.runtime.lastError) {
                console.error('Sync failed:', chrome.runtime.lastError.message);
            } else {
                console.log('[Popup] Manual sync triggered');
            }
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="p-4 w-80 h-56 flex items-center justify-center bg-white dark:bg-gray-900 rounded-xl shadow-lg animate-pulse">
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className={`w-80 font-sans rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
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
