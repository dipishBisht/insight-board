// Mock data for the dashboard statistics

import { TimelineStatus } from "@/utils/constant";

// Activity timeline data
export const activityData = [
    {
        id: 1,
        title: 'New user registered',
        description: 'John Smith created an account',
        time: '4h ago',
        status: TimelineStatus.SUCCESS,
    },
    {
        id: 2,
        title: 'Daily report generated',
        description: 'System automatically generated the daily analytics report',
        time: '6h ago',
        status: TimelineStatus.INFO,
    },
    {
        id: 3,
        title: 'Unusual traffic detected',
        description: 'Traffic spike on marketing landing page',
        time: '8h ago',
        status: TimelineStatus.WARNING,
    },
    {
        id: 4,
        title: 'System maintenance',
        description: 'Scheduled maintenance completed',
        time: '1d ago',
        status: TimelineStatus.INFO,
    },
    {
        id: 5,
        title: 'Database backup',
        description: 'Automatic backup completed successfully',
        time: '1d ago',
        status: TimelineStatus.SUCCESS,
    },
];

// Weekly statistics for line chart
export const weeklyStats = [
    { x: 'Mon', y: 12500 },
    { x: 'Tue', y: 18200 },
    { x: 'Wed', y: 15700 },
    { x: 'Thu', y: 22100 },
    { x: 'Fri', y: 19800 },
    { x: 'Sat', y: 14500 },
    { x: 'Sun', y: 12800 },
];

// Monthly sales data
export const monthlySales = [
    {
        label: 'Jan',
        value: 12500,
        color: '#3b82f6'
    },
    {
        label: 'Feb',
        value: 18200,
        color: '#3b82f6'
    },
    {
        label: 'Mar',
        value: 15700,
        color: '#3b82f6'
    },
    {
        label: 'Apr',
        value: 22100,
        color: '#3b82f6'
    },
    {
        label: 'May',
        value: 19800,
        color: '#3b82f6'
    },
    {
        label: 'Jun',
        value: 24600,
        color: '#3b82f6'
    },
    {
        label: 'Jul',
        value: 27300,
        color: '#ec4899'
    },
    {
        label: 'Aug',
        value: 25100,
        color: '#ec4899'
    },
];

// Donut chart data for traffic sources
export const trafficSources = [
    {
        label: 'Direct',
        value: 42,
        color: '#3b82f6'
    },
    {
        label: 'Social',
        value: 28,
        color: '#8b5cf6'
    },
    {
        label: 'Organic',
        value: 16,
        color: '#ec4899'
    },
    {
        label: 'Referral',
        value: 14,
        color: '#10b981'
    },
];

// Table data for top products
export const topProducts = [
    {
        id: 1,
        name: 'Premium License',
        category: 'Software',
        revenue: 285200,
        sales: 1462,
        growth: 14.6,
    },
    {
        id: 2,
        name: 'Enterprise Solution',
        category: 'Software',
        revenue: 176400,
        sales: 854,
        growth: 8.2,
    },
    {
        id: 3,
        name: 'Mobile App',
        category: 'Software',
        revenue: 98700,
        sales: 543,
        growth: 12.8,
    },
    {
        id: 4,
        name: 'Consulting Services',
        category: 'Services',
        revenue: 89600,
        sales: 271,
        growth: -2.4,
    },
    {
        id: 5,
        name: 'Support Package',
        category: 'Services',
        revenue: 63400,
        sales: 457,
        growth: 6.9,
    },
];

// Top customers table data
export const topCustomers = [
    {
        id: 1,
        name: 'Acme Corp',
        email: 'info@acmecorp.com',
        spent: 42500,
        country: 'United States',
        lastOrder: '2023-08-14',
    },
    {
        id: 2,
        name: 'TechGiant Inc',
        email: 'orders@techgiant.com',
        spent: 38700,
        country: 'Germany',
        lastOrder: '2023-08-12',
    },
    {
        id: 3,
        name: 'Global Solutions',
        email: 'billing@globalsolutions.co',
        spent: 27800,
        country: 'Japan',
        lastOrder: '2023-08-10',
    },
    {
        id: 4,
        name: 'InnovateTech',
        email: 'accounts@innovatetech.org',
        spent: 24300,
        country: 'United Kingdom',
        lastOrder: '2023-08-07',
    },
    {
        id: 5,
        name: 'Apex Industries',
        email: 'sales@apexind.net',
        spent: 19500,
        country: 'Australia',
        lastOrder: '2023-08-05',
    },
];

// Stats for the StatCards
export const statsData = [
    {
        title: 'Total Revenue',
        value: 841250,
        change: 12.5,
    },
    {
        title: 'Total Orders',
        value: 3827,
        change: 8.2,
    },
    {
        title: 'Conversion Rate',
        value: 3.75,
        change: -2.8,
        prefix: '',
    },
    {
        title: 'Avg. Order Value',
        value: 219.82,
        change: 4.3,
        prefix: '$',
    },
];