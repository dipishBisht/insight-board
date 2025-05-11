import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    change: number;
    icon: React.ReactNode;
    prefix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, prefix = '' }) => {
    const isPositive = change >= 0;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-semibold text-gray-900">{prefix}{value}</h3>

                <div className="flex items-center">
                    <span className={`text-sm font-medium flex items-center ${isPositive ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                        {isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                        {Math.abs(change)}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last period</span>
                </div>
            </div>
        </div>
    );
};

export default StatCard;