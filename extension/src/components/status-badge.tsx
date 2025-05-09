import React from 'react';

interface StatusBadgeProps {
    isPaused: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ isPaused }) => {
    return (
        <div
            className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 flex items-center
        ${isPaused
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-30 dark:text-red-400'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-400'
                }`}
        >
            <span
                className={`w-1.5 h-1.5 rounded-full mr-1 ${isPaused ? 'bg-red-600 dark:bg-red-400' : 'bg-green-600 dark:bg-green-400'}`}
            ></span>
            {isPaused ? 'Paused' : 'Active'}
        </div>
    );
};

export default StatusBadge;
