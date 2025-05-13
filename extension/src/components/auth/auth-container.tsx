import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface AuthContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ children, title, subtitle }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 overflow-auto">
      <div className="w-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all duration-300">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50 dark:bg-indigo-900/30">
            <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">{title}</h1>
          
          {subtitle && (
            <p className="mt-2 text-center text-gray-600 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        
        {children}
        
        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
          <p>By continuing, you agree to our</p>
          <p className="mt-1">
            <a href="#" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">Terms of Service</a>
            {' '}&amp;{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;