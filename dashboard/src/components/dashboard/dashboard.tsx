"use client"
import React, { useEffect, useState } from 'react';
import { formatCurrency } from '@/utils/formatters';
import { ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';
import { fetchDashboardData } from '@/services/dashboard';
import { auth } from '@/lib/firebase';
import StatCard from './StatCard';
import LineChart from './LineChart';
import BarChart from './BarChart';
import DonutChart from './DonutChart';
import ActivityTimeline from './ActivityTimeline';
import DataTable from './DataTable';
import { onAuthStateChanged } from 'firebase/auth';

const Dashboard: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setAuthChecked(true);
            console.log(user?.uid);
            
            if (user) {
                try {
                    const dashboardData = await fetchDashboardData(user.uid);
                    console.log(dashboardData);
                    
                    setData(dashboardData);
                } catch (error) {
                    console.error('Error fetching dashboard data:', error);
                }
            }

            setLoading(false);
        });

        return () => unsubscribe(); // cleanup on unmount
    }, []);

    if (!authChecked || loading) return <div className="p-6">Loading dashboard...</div>;
    if (!data) return <div className="p-6">No data available</div>;

    const productColumns = [
        { key: 'name', title: 'Product Name' },
        { key: 'category', title: 'Category' },
        { key: 'revenue', title: 'Revenue' },
        { key: 'sales', title: 'Sales' },
        { key: 'growth', title: 'Growth' },
    ];

    return (
        <div className="p-6">
            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(data.stats[0].value)}
                    change={data.stats[0].change}
                    icon={<DollarSign className="h-5 w-5 text-blue-600" />}
                />
                <StatCard
                    title="Total Orders"
                    value={data.stats[1].value.toLocaleString()}
                    change={data.stats[1].change}
                    icon={<ShoppingCart className="h-5 w-5 text-purple-600" />}
                />
                <StatCard
                    title="Conversion Rate"
                    value={`${data.stats[2].value}%`}
                    change={data.stats[2].change}
                    icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
                />
                <StatCard
                    title="Avg. Order Value"
                    value={formatCurrency(data.stats[3].value)}
                    change={data.stats[3].change}
                    icon={<DollarSign className="h-5 w-5 text-amber-600" />}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Weekly Revenue</h2>
                    <LineChart data={data.weeklyStats} height={240} color="#3b82f6" areaChart />
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Monthly Sales Performance</h2>
                    <BarChart data={data.monthlySales} height={240} />
                </div>
            </div>

            {/* Traffic Sources and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
                    <h2 className="text-lg font-semibold mb-4">Traffic Sources</h2>
                    <DonutChart data={data.trafficSources} size={220} />
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <ActivityTimeline items={data.activity} />
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Top Performing Products</h2>
                <DataTable data={data.topProducts} columns={productColumns} />
            </div>
        </div>
    );
};

export default Dashboard;
