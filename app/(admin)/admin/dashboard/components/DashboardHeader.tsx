import { Bell, Menu } from 'lucide-react';

interface DashboardHeaderProps {
    title: string;
    onMenuClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, onMenuClick }) => {
    return (
        <header className="h-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-12 z-40">
            <div className="flex items-center gap-2 sm:gap-4">
                <button 
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-gray-500 hover:text-gray-950 dark:hover:text-white lg:hidden"
                    aria-label="Open Sidebar"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="w-1 h-8 bg-red-700 hidden sm:block"></div>
                <h2 className="text-sm sm:text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight truncate max-w-[150px] sm:max-w-none">
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
