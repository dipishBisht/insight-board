import React from 'react';
import type { SiteStats } from '../types';
import { formatTime } from '../utils/time';

interface SiteListProps {
    stats: SiteStats;
}

const SiteList: React.FC<SiteListProps> = ({ stats }) => {
    // Get top 5 sites by time
    const topSites = Object.entries(stats)
        .sort(([, aTime], [, bTime]) => bTime - aTime)
        .slice(0, 5);

    // Find the maximum time for relative sizing
    const maxTime = topSites.length > 0 ? topSites[0][1] : 0;

    if (Object.keys(stats).length === 0) {
        return (
            <div className="py-6 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <div className="w-12 h-12 mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-lg">📊</span>
                </div>
                <p className="text-center">No activity tracked yet today</p>
            </div>
        );
    }

    return (
        <ul className="space-y-3">
            {topSites.map(([domain, time]: [string, number], index) => (
                <li key={domain} className="group transition-all duration-200">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                            <span className="text-xs text-gray-400 dark:text-gray-500 w-4 mr-2">{index + 1}</span>
                            <span className="truncate max-w-40 font-medium">{domain}</span>
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{formatTime(time)}</span>
                    </div>

                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-600"
                            style={{ width: `${(time / maxTime) * 100}%` }}
                        ></div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default SiteList;
