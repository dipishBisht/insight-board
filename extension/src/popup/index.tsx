import { useEffect, useState } from 'react';

// Type definitions
type SiteStats = Record<string, number>;

// Helper function to format milliseconds as hours and minutes
function formatTime(ms: number): string {
    const mins = Math.floor(ms / 60000);
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return `${hrs}h ${rem}m`;
}

export default function Popup() {
    const [stats, setStats] = useState<SiteStats>({});
    const [total, setTotal] = useState<number>(0);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Load data from Chrome storage
    useEffect(() => {
        const todayKey = `usage-${new Date().toISOString().split('T')[0]}`; // e.g., "usage-2025-05-08"

        chrome.storage.local.get([todayKey, 'paused'], (result) => {
            console.log('[InsightBoard] Data from storage:', result);

            const siteData: SiteStats = result[todayKey] || {};
            const pausedStatus: boolean = result['paused'] || false;

            setStats(siteData);
            setIsPaused(pausedStatus);
            setIsLoading(false);

            // Calculate total time
            const totalTime: number = Object.values(siteData).reduce((acc, ms) => acc + ms, 0);
            setTotal(totalTime);
        });
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

    // Render loading state
    if (isLoading) {
        return (
            <div className="p-4 w-64 text-sm font-sans flex items-center justify-center h-32">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-4 w-72 text-sm font-sans">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-lg font-bold">🧠 InsightBoard</h1>
                <span className={`px-2 py-1 rounded-full text-xs ${isPaused ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {isPaused ? 'Paused' : 'Active'}
                </span>
            </div>

            <p className="mb-3">
                Total Tracked: <strong>{formatTime(total)}</strong>
            </p>

            {/* Pause/Resume Button */}
            <button
                onClick={togglePause}
                className={`w-full py-2 px-4 rounded-md text-white font-medium mb-3 ${isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
            >
                {isPaused ? 'Resume Tracking' : 'Pause Tracking'}
            </button>

            <h2 className="font-medium mb-2">Top Sites Today:</h2>

            {Object.keys(stats).length === 0 ? (
                <p className="text-gray-500 italic">No activity tracked yet today</p>
            ) : (
                <ul className="space-y-2">
                    {Object.entries(stats)
                        .sort(([, aTime], [, bTime]) => bTime - aTime)
                        .slice(0, 5)
                        .map(([domain, time]: [string, number]) => (
                            <li key={domain} className="flex justify-between items-center pb-1 border-b border-gray-100">
                                <span className="truncate max-w-36">{domain}</span>
                                <span className="font-medium">{formatTime(time)}</span>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
}
