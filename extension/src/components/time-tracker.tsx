import React from 'react';
import { formatTime } from '../utils/time';

interface TimeTrackerProps {
    total: number;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ total }) => {
    // Calculate percentage of day tracked (assuming 8 hours is a full day)
    const maxDailyTracking = 8 * 60 * 60 * 1000; // 8 hours in ms
    const percentage = Math.min(100, (total / maxDailyTracking) * 100);

    return (
        <div className="mb-4">
            <div className="flex justify-between items-end mb-1.5">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Tracked Today</span>
                <span className="text-xl font-semibold">{formatTime(total)}</span>
            </div>

            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default TimeTracker;
