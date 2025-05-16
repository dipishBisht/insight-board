import React, { useState } from 'react';
import { Bell, ChevronDown, Menu } from 'lucide-react';

interface NavbarProps {
    onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    return (
        <div className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Left: Logo and hamburger */}
                    <div className="flex items-center">
                        <button
                            type="button"
                            className="lg:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            onClick={onMenuToggle}
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <div className="flex items-center lg:mx-0">
                            <div className="flex items-center">
                                <div className="h-8 w-8 flex items-center justify-center rounded-md bg-blue-600 text-white">
                                    <svg width="20" height="20" viewBox="0 0 200 200" fill="currentColor">
                                        <path d="M114,100l49-49a9.9,9.9,0,0,0-14-14L100,86,51,37A9.9,9.9,0,0,0,37,51l49,49L37,149a9.9,9.9,0,0,0,14,14l49-49,49,49a9.9,9.9,0,0,0,14-14Z" />
                                    </svg>
                                </div>
                                <span className="ml-2 text-lg font-semibold text-gray-900">Analytix</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Navigation items */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                type="button"
                                className="relative rounded-full p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <span className="sr-only">View notifications</span>
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                            </button>

                            {/* Notification dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {[1, 2, 3].map((item) => (
                                            <a
                                                key={item}
                                                href="#"
                                                className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                        <Bell className="h-4 w-4" />
                                                    </div>
                                                    <div className="ml-3 w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900">New report available</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">3 hours ago</p>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                    <a
                                        href="#"
                                        className="block text-center text-xs font-medium text-blue-600 hover:text-blue-500 px-4 py-2 border-t border-gray-100"
                                    >
                                        View all notifications
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Profile dropdown */}
                        <div className="relative ml-3">
                            <div>
                                <button
                                    type="button"
                                    className="flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onClick={() => setShowProfile(!showProfile)}
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
                                        alt="User"
                                    />
                                    <span className="hidden md:flex md:items-center ml-2">
                                        <span className="text-sm font-medium text-gray-700 mr-1">John Doe</span>
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                    </span>
                                </button>
                            </div>

                            {/* Profile menu dropdown */}
                            {showProfile && (
                                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;