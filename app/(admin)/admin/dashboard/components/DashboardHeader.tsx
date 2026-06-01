import React from 'react';
import { Bell } from 'lucide-react';

interface DashboardHeaderProps {
    title: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
    return (
        <header className="h-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-12 z-40">
            <div className="flex items-center gap-4">
                <div className="w-1 h-8 bg-red-700"></div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                    {title}
                </h2>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-800">
                    <div className="text-right">
                        <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">Administrator</p>
                    </div>
                    <div className="w-10 h-10 bg-red-700 flex items-center justify-center font-black text-white"><img src="/municipal-logo.jpg" alt="Cordova Logo" width={50} height={50} /></div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
