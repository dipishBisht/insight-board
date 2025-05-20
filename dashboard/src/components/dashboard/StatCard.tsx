import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, subtitle }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
                {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
        </div>
    );
};

export default StatCard;
