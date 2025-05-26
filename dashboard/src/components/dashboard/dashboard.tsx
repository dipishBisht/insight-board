"use client"
import React, { useEffect, useState } from 'react';
import { Clock, Activity, CalendarCheck, Globe } from 'lucide-react';
import { fetchAllUserUsage } from '@/services/dashboard';
import { auth } from '@/lib/firebase';
import StatCard from './StatCard';
import LineChart from './LineChart';
import BarChart from './BarChart';
import DonutChart from './DonutChart';
import ActivityTimeline from './ActivityTimeline';
import DataTable, { TableColumn } from './DataTable';
import { onAuthStateChanged } from 'firebase/auth';

interface ResponseData {
    activity: { time: string, title: string, description: string }[]
    dailyUsage: { date: string, value: number }[],
    siteUsage: { name: string, value: number }[],
    stats: { averageTime: number, mostActiveDay: string, mostVisitedSite: string, totalTime: number },
    topSites: { name: string, totalTime: number, daysActive: number, avgTime: number }[]
}

const Dashboard: React.FC = () => {
    const [data, setData] = useState<null | ResponseData>(null);
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setAuthChecked(true);

            if (user) {
                try {
                    const dashboardData = await fetchAllUserUsage(user.uid);
                    console.log(dashboardData);

                    setData(dashboardData);
                } catch (error) {
                    console.error('Error fetching dashboard data:', error);
                }
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (!authChecked || loading) return <div className="p-6">Loading dashboard...</div>;
    if (!data) return <div className="p-6">No data available</div>;

    const topSitesColumns: TableColumn<{ name: string; totalTime: number; daysActive: number; avgTime: number }>[] = [
        { key: 'name', title: 'Site Name' },
        { key: 'totalTime', title: 'Total Time (mins)' },
        { key: 'daysActive', title: 'Days Active' },
        { key: 'avgTime', title: 'Avg Time per Day (mins)' },
    ];

    return (
        <div className="p-6">
            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    title="Total Time"
                    value={`${Math.round(data.stats.totalTime / 60)} mins`}
                    icon={<Clock className="h-5 w-5 text-blue-600" />}
                    subtitle="All time tracked"
                />

                <StatCard
                    title="Average Daily Time"
                    value={`${Math.round(data.stats.averageTime / 60)} mins`}
                    icon={<Activity className="h-5 w-5 text-purple-600" />}
                    subtitle="Across last 3 days"
                />

                <StatCard
                    title="Most Active Day"
                    value={data.stats.mostActiveDay}
                    icon={<CalendarCheck className="h-5 w-5 text-emerald-600" />}
                    subtitle="Highest tracked usage"
                />

                <StatCard
                    title="Top Site"
                    value={data.stats.mostVisitedSite}
                    icon={<Globe className="h-5 w-5 text-amber-600" />}
                    subtitle="By total time"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Daily Productive Time</h2>
                    <LineChart
                        data={data.dailyUsage.map((d) => ({ x: d.date, y: d.value }))}
                        height={240}
                        color="#3b82f6"
                        areaChart
                    />
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Monthly Usage Performance</h2>
                    <BarChart
                        data={data.dailyUsage.map((item) => ({
                            label: item.date,
                            value: item.value,
                            color: '#3b82f6',
                        }))}
                        height={240}
                    />
                </div>
            </div>

            {/* Traffic Sources and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
                    <h2 className="text-lg font-semibold mb-4">Traffic Sources</h2>
                    <DonutChart
                        data={data.siteUsage.map((item, i: number) => ({
                            label: item.name,
                            value: item.value,
                            color: ['#3b82f6', '#8b5cf6', '#f97316', '#10b981'][i % 4],
                        }))}
                        size={220}
                    />
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <ActivityTimeline items={data.activity} />
                </div>
            </div>

            {/* Usage Summary Table */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Usage Summary</h2>
                <DataTable data={data.topSites} columns={topSitesColumns} />
            </div>
        </div>
    );
};

export default Dashboard;
