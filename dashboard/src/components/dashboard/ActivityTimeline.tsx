import { TimelineStatus } from '@/utils/constant';
import React from 'react';

interface TimelineItem {
    id: string | number;
    title: string;
    description?: string;
    time: string;
    icon?: React.ReactNode;
    status?: TimelineStatus;
}

interface ActivityTimelineProps {
    items: TimelineItem[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ items }) => {
    const getStatusColor = (status?: TimelineItem['status']) => {
        switch (status) {
            case 'success':
                return 'bg-emerald-500';
            case 'warning':
                return 'bg-amber-500';
            case 'error':
                return 'bg-rose-500';
            case 'info':
            default:
                return 'bg-blue-500';
        }
    };

    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {items.map((item, itemIdx) => (
                    <li key={item.id} className="relative pb-8">
                        {itemIdx !== items.length - 1 ? (
                            <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                            />
                        ) : null}
                        <div className="relative flex space-x-3">
                            <div>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getStatusColor(item.status)}`}>
                                    {item.icon || (
                                        <div className="h-2.5 w-2.5 rounded-full bg-white" />
                                    )}
                                </div>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                    {item.description && (
                                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                                    )}
                                </div>
                                <div className="text-right text-xs whitespace-nowrap text-gray-500">
                                    <time dateTime={item.time}>{item.time}</time>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityTimeline;