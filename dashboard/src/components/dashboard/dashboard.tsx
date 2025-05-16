import React from 'react';
import StatCard from './StatCard';
import LineChart from './LineChart';
import BarChart from './BarChart';
import DonutChart from './DonutChart';
import DataTable, { TableColumn } from './DataTable';
import ActivityTimeline from './ActivityTimeline';
import {
    statsData,
    weeklyStats,
    monthlySales,
    trafficSources,
    topProducts,
    activityData
} from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import { ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {

    const productColumns: TableColumn<typeof topProducts[number]>[] = [
        { key: 'name', title: 'Product Name' },
        { key: 'category', title: 'Category' },
        { key: 'revenue', title: 'Revenue' },
        { key: 'sales', title: 'Sales' },
        { key: 'growth', title: 'Growth', },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500">Analytics and statistics for the current period</p>
            </div>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(statsData[0].value)}
                    change={statsData[0].change}
                    icon={<DollarSign className="h-5 w-5 text-blue-600" />}
                />
                <StatCard
                    title="Total Orders"
                    value={statsData[1].value.toLocaleString()}
                    change={statsData[1].change}
                    icon={<ShoppingCart className="h-5 w-5 text-purple-600" />}
                />
                <StatCard
                    title="Conversion Rate"
                    value={`${statsData[2].value}%`}
                    change={statsData[2].change}
                    icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
                />
                <StatCard
                    title="Avg. Order Value"
                    value={formatCurrency(statsData[3].value)}
                    change={statsData[3].change}
                    icon={<DollarSign className="h-5 w-5 text-amber-600" />}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Weekly Revenue</h2>
                    <LineChart
                        data={weeklyStats}
                        height={240}
                        color="#3b82f6"
                        areaChart={true}
                    />
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Monthly Sales Performance</h2>
                    <BarChart
                        data={monthlySales}
                        height={240}
                    />
                </div>
            </div>

            {/* Traffic Sources and Activity Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
                    <h2 className="text-lg font-semibold mb-4">Traffic Sources</h2>
                    <DonutChart
                        data={trafficSources}
                        size={220}
                    />
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <ActivityTimeline items={activityData} />
                </div>
            </div>

            {/* Data Tables */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Top Performing Products</h2>
                <DataTable
                    data={topProducts}
                    columns={productColumns}
                />
            </div>
        </div>
    );
};

export default Dashboard;