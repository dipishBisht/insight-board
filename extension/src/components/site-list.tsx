import React from 'react';
import type { SiteStats } from '../types';
import { formatTime } from '../utils/time';

interface SiteListProps {
    stats: SiteStats;
}

const getFavicon = (domain: string): string =>
    `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;

const cleanDomain = (domain: string): string =>
    domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

const SiteList: React.FC<SiteListProps> = ({ stats }) => {
    const topSites = Object.entries(stats)
        .sort(([, aTime], [, bTime]) => bTime - aTime)
        .slice(0, 5);

    const maxTime = topSites.length > 0 ? topSites[0][1] : 0;

    if (topSites.length === 0) {
        return (
            <div className="py-6 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <div className="w-12 h-12 mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-lg">📊</span>
                </div>
                <p className="text-center text-sm">No activity tracked yet today</p>
            </div>
        );
    }

    return (
        <ul className="space-y-3">
            {topSites.map(([domain, time], index) => {
                const clean = cleanDomain(domain);
                const percent = maxTime ? (time / maxTime) * 100 : 0;

                return (
                    <li key={domain} className="group transition-all duration-200">
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 dark:text-gray-500 w-4">{index + 1}</span>
                                <img
                                    src={getFavicon(domain)}
                                    alt=""
                                    className="w-4 h-4 rounded"
                                    loading="lazy"
                                />
                                <span
                                    className="truncate max-w-[140px] text-sm font-medium"
                                    title={clean}
                                >
                                    {clean}
                                </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {formatTime(time)}
                            </span>
                        </div>

                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-600"
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default SiteList;
