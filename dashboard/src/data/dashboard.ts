import { BarChart3, LayoutDashboard, PieChart, Settings, Users } from 'lucide-react';

export const navigation = [
    { name: 'Dashboard', href: '#', icon: LayoutDashboard, current: true },
    { name: 'Analytics', href: '#', icon: BarChart3, current: false },
    { name: 'Reports', href: '#', icon: PieChart, current: false },
    { name: 'Team', href: '#', icon: Users, current: false },
    { name: 'Settings', href: '#', icon: Settings, current: false },
];