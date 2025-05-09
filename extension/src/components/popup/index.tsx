import { useEffect, useState } from 'react';
import SiteList from '../site-list';
import TrackingButton from '../tracking-btn';
import TimeTracker from '../time-tracker';
import StatusBadge from '../status-badge';
import { MoonIcon, SunIcon } from 'lucide-react';
import type { SiteStats } from '../../types';

export default function Popup() {
    const [stats, setStats] = useState<SiteStats>({});
    const [total, setTotal] = useState<number>(0);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [darkMode, setDarkMode] = useState<boolean>(false);

    // Load data from Chrome storage
    useEffect(() => {
        const todayKey = `usage-${new Date().toISOString().split('T')[0]}`;

        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
            chrome.storage.local.get([todayKey, 'paused'], (result) => {
                console.log('[InsightBoard] Data from storage:', result);

                const siteData: SiteStats = result[todayKey] || {};
                const pausedStatus: boolean = result['paused'] || false;
                const darkModeStatus: boolean = result['darkMode'] || false;

                setStats(siteData);
                setIsPaused(pausedStatus);
                setIsLoading(false);
                setDarkMode(darkModeStatus);

                const totalTime: number = Object.values(siteData).reduce((acc, ms) => acc + ms, 0);
                setTotal(totalTime);
            });
        } else {
            console.warn('chrome.storage.local is not available');
            setIsLoading(false);
        }
    }, []);

    // Toggle pause status via messaging to background script
    const togglePause = () => {
        const newStatus = !isPaused;

        chrome.runtime.sendMessage(
            { type: 'togglePause', value: newStatus },
            (response) => {
                if (response && response.success) {
                    setIsPaused(newStatus);
                    console.log('[InsightBoard] Tracking ' + (newStatus ? 'paused' : 'resumed'));
                }
            }
        );
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        const newStatus = !darkMode;
        setDarkMode(newStatus);

        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
            chrome.storage.local.set({ 'darkMode': newStatus });
        }
    };

    // Render loading state
    if (isLoading) {
        return (
            <div className="p-4 w-80 text-sm font-sans flex items-center justify-center h-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg animate-pulse">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 mb-2"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-80 text-sm font-sans rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                            <span className="text-xs">🧠</span>
                        </div>
                        <h1 className="text-lg font-semibold">InsightBoard</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <StatusBadge isPaused={isPaused} />
                        <button
                            onClick={toggleDarkMode}
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <TimeTracker total={total} />

                <TrackingButton isPaused={isPaused} togglePause={togglePause} />

                <div className="mt-4">
                    <h2 className="font-medium mb-3 flex items-center">
                        <span className="mr-2">Top Sites Today</span>
                        <div className="h-px flex-grow bg-gray-100 dark:bg-gray-800"></div>
                    </h2>

                    <SiteList stats={stats} />
                </div>
            </div>

            {/* Footer */}
            <div className={`px-4 py-2 text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
        </div>
    );
}
