import React from 'react';
import { PlayIcon, PauseIcon } from 'lucide-react';

interface TrackingButtonProps {
    isPaused: boolean;
    togglePause: () => void;
}

const TrackingButton: React.FC<TrackingButtonProps> = ({ isPaused, togglePause }) => {
    return (
        <button
            onClick={togglePause}
            className={`w-full py-2.5 px-4 rounded-lg text-white font-medium 
        transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
        flex items-center justify-center space-x-2
        ${isPaused
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600'
                }`}
        >
            {isPaused ? (
                <>
                    <PlayIcon size={16} />
                    <span>Resume Tracking</span>
                </>
            ) : (
                <>
                    <PauseIcon size={16} />
                    <span>Pause Tracking</span>
                </>
            )}
        </button>
    );
};

export default TrackingButton;
