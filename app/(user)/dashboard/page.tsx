'use client';

import React, { useState, useEffect } from 'react';
import { 
    User, 
    Settings, 
    Calendar as CalendarIcon, 
    ShieldCheck, 
    ShieldAlert,
    LayoutDashboard,
    FileText,
    Bell,
    ChevronRight,
    LogOut,
    CheckCircle,
    Building2,
    Briefcase,
    Users,
    Heart,
    Info
} from 'lucide-react';
import { format } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';

const DashboardPage: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsVerified(parsedUser.isVerified || parsedUser.is_verified || false);
            } catch (e) {
                console.error('Failed to parse user data');
            }
        }
        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        setTimeout(() => {
            window.location.href = '/home';
        }, 1000);
    };

    const today = new Date();
    const currentDate = format(today, 'EEEE, MMMM do, yyyy');
    const currentDay = today.getDate();
    const currentMonthName = format(today, 'MMMM yyyy');
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const emptyCells = Array.from({ length: firstDayIndex });
    const days = Array.from({ length: daysInMonth });

    const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
    const displayName = fullName || user?.username || 'CITIZEN';

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-red-700 border-t-transparent animate-spin rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Toaster position="top-right" />
            
            {/* Full-Width Header */}
            <div className="w-full bg-white border-b border-gray-200">
                <div className="maximize-width px-6 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            WELCOME BACK, <span className="text-red-600 uppercase">{displayName}</span>
                        </h1>
                        <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm font-medium">
                            <CalendarIcon size={14} className="text-red-500" />
                            {currentDate}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-3 bg-gray-100 border border-gray-200 hover:border-red-600 transition-colors rounded-lg">
                            <Bell size={20} />
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            {user?.faceVerificationUrl ? (
                                <img 
                                    src={user.faceVerificationUrl} 
                                    alt="Profile Selfie" 
                                    className="w-10 h-10 rounded-full object-cover border border-gray-200" 
                                />
                            ) : user?.profileImageUrl ? (
                                <img 
                                    src={user.profileImageUrl} 
                                    alt="Profile Avatar" 
                                    className="w-10 h-10 rounded-full object-cover border border-gray-200" 
                                />
                            ) : (
                                <div className="w-10 h-10 bg-red-700 flex items-center justify-center font-bold text-white rounded-full">
                                    {(user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'C').toUpperCase()}
                                </div>
                            )}
                            <div className="hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Resident Account</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Alert Banner */}
            {!isVerified && (
                <div className="w-full bg-red-50 border-b border-red-200">
                    <div className="maximize-width px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="text-red-500" size={24} />
                            <div>
                                <p className="text-sm font-bold text-red-900 uppercase tracking-wide">Account Not Verified</p>
                                <p className="text-xs text-red-800">Verify your identity to access all municipal services and receive official documents.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => window.location.href = '/dashboard/verification'}
                            className="px-6 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest transition-all rounded-lg"
                        >
                            Start Verification
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="maximize-width py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Services or Edit Settings Tab */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {activeTab === 'overview' && (
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter border-l-4 border-red-600 pl-4">
                                        Municipal Services
                                    </h2>
                                    <button 
                                        onClick={() => window.location.href = '/services'}
                                        className="text-xs font-bold text-gray-500 hover:text-gray-900 uppercase tracking-widest flex items-center gap-1 transition-colors"
                                    >
                                        View All <ChevronRight size={14} />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <ServiceCard 
                                        title="News & Updates" 
                                        desc="Read the latest press releases, announcements, and municipal notices."
                                        icon={<FileText size={24} />}
                                        accent="red"
                                        href="/community/news"
                                    />
                                    <ServiceCard 
                                        title="E-Services Portal" 
                                        desc="Access online application forms, business permit guides, and e-governance services."
                                        icon={<Building2 size={24} />}
                                        accent="gray"
                                        href="/services"
                                    />
                                    <ServiceCard 
                                        title="Rescue Desk" 
                                        desc="Immediate emergency response contacts and disaster preparedness resources."
                                        icon={<Heart size={24} />}
                                        accent="gray"
                                        href="/rescue-desk"
                                    />
                                    <ServiceCard 
                                        title="Our Barangays" 
                                        desc="Explore updates, profiles, and directories of the different Cordova barangays."
                                        icon={<Users size={24} />}
                                        accent="gray"
                                        href="/barangay"
                                    />
                                    <ServiceCard 
                                        title="About Cordova" 
                                        desc="Discover the history, leadership, vision, and mission of the municipality."
                                        icon={<Info size={24} />}
                                        accent="gray"
                                        href="/about"
                                    />
                                </div>
                            </section>
                        )}

                        {activeTab === 'profile' && (
                            <section className="bg-white border border-gray-200 p-8 shadow-sm rounded-xl">
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter border-l-4 border-red-600 pl-4 mb-6">
                                    Update Profile Information
                                </h2>
                                <ProfileEditForm user={user} onUpdate={(updated: any) => setUser(updated)} />
                            </section>
                        )}

                        {activeTab === 'security' && (
                            <section className="bg-white border border-gray-200 p-8 shadow-sm rounded-xl">
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter border-l-4 border-red-600 pl-4 mb-6">
                                    Change Security Password
                                </h2>
                                <SecurityForm />
                            </section>
                        )}

                    </div>

                    {/* Right Column: Profile, Calendar & Settings */}
                    <div className="lg:col-span-4 space-y-8">
                        
                        {/* Dynamic Calendar Component */}
                        <section className="bg-white border border-gray-200 overflow-hidden rounded-xl">
                            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
                                    <CalendarIcon size={14} className="text-red-500" />
                                    Events Calendar
                                </h3>
                                <span className="text-[10px] text-gray-500 font-bold uppercase">{currentMonthName}</span>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-7 gap-2 mb-4">
                                    {['S','M','T','W','T','F','S'].map((day, idx) => (
                                        <div key={`${day}-${idx}`} className="text-center text-[10px] font-bold text-gray-600">{day}</div>
                                    ))}
                                    
                                    {/* Empty padding cells */}
                                    {emptyCells.map((_, idx) => (
                                        <div key={`empty-${idx}`} className="h-8"></div>
                                    ))}

                                    {/* Dynamic day cells */}
                                    {days.map((_, i) => {
                                        const dayNumber = i + 1;
                                        const isToday = dayNumber === currentDay;
                                        return (
                                            <div 
                                                key={dayNumber} 
                                                className={`h-8 flex items-center justify-center text-xs font-medium border rounded-lg ${
                                                    isToday 
                                                        ? 'bg-red-700 border-red-600 text-white font-bold' 
                                                        : 'border-transparent text-gray-500 hover:border-gray-300 cursor-pointer transition-colors'
                                                }`}
                                            >
                                                {dayNumber}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="space-y-3">
                                    <div className="p-3 bg-gray-100 border-l-2 border-red-600 rounded-lg">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Upcoming</p>
                                        <p className="text-xs font-bold text-gray-900 mt-1">Town Hall Meeting</p>
                                        <p className="text-[10px] text-gray-500 mt-1">Tomorrow, 10:00 AM • Municipal Hall</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Verification Progress checklist (only rendered if unverified) */}
                        {!isVerified && (
                            <section className="bg-white border border-gray-200 p-6 space-y-6 rounded-xl">
                                <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-red-500" />
                                    Verification Process
                                </h3>
                                <div className="space-y-4">
                                    <VerificationStep title="Account Registration" status="complete" />
                                    <VerificationStep title="Email Authentication" status="complete" />
                                    <VerificationStep title="Identity Documents" status={user?.frontIdDocumentUrl ? "complete" : "pending"} />
                                    <VerificationStep title="Official Approval" status="pending" />
                                </div>
                            </section>
                        )}

                        {/* Quick Settings Navigation */}
                        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
                                    <Settings size={14} className="text-red-500" />
                                    Account Settings
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                <button 
                                    onClick={() => setActiveTab('overview')}
                                    className={`w-full px-6 py-4 flex items-center justify-between transition-colors group ${activeTab === 'overview' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                                        <LayoutDashboard size={16} className={activeTab === 'overview' ? 'text-red-700' : 'text-gray-400 group-hover:text-red-600'} />
                                        Dashboard Overview
                                    </span>
                                    <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-900" />
                                </button>
                                <button 
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full px-6 py-4 flex items-center justify-between transition-colors group ${activeTab === 'profile' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                                        <User size={16} className={activeTab === 'profile' ? 'text-red-700' : 'text-gray-400 group-hover:text-red-600'} />
                                        Update Profile
                                    </span>
                                    <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-900" />
                                </button>
                                <button 
                                    onClick={() => setActiveTab('security')}
                                    className={`w-full px-6 py-4 flex items-center justify-between transition-colors group ${activeTab === 'security' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                                        <ShieldCheck size={16} className={activeTab === 'security' ? 'text-red-700' : 'text-gray-400 group-hover:text-red-600'} />
                                        Security & Password
                                    </span>
                                    <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-900" />
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full px-6 py-4 flex items-center justify-between text-red-500 hover:bg-red-50 transition-colors group"
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                                        <LogOut size={16} />
                                        Log Out
                                    </span>
                                </button>
                            </div>
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
};

interface ServiceCardProps {
    title: string;
    desc: string;
    icon: React.ReactNode;
    accent: 'red' | 'gray';
    href: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, desc, icon, accent, href }) => {
    return (
        <div 
            onClick={() => window.location.href = href}
            className="p-8 bg-white border border-gray-200 transition-all cursor-pointer group relative overflow-hidden hover:border-red-200 hover:shadow-md rounded-xl"
        >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-transparent group-hover:bg-red-600 transition-all"></div>
            
            <div className={`w-14 h-14 flex items-center justify-center mb-6 border border-gray-200 group-hover:border-red-600/50 group-hover:bg-red-50 transition-all rounded-lg ${accent === 'red' ? 'text-red-600' : 'text-gray-500 group-hover:text-red-500'}`}>
                {icon}
            </div>
            
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2 transition-colors group-hover:text-red-600">
                {title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {desc}
            </p>
            
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-900 transition-colors">
                Open Portal <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    );
};

const VerificationStep: React.FC<{ title: string; status: 'complete' | 'pending' }> = ({ title, status }) => {
    return (
        <div className="flex items-center gap-4">
            <div className={`w-6 h-6 flex items-center justify-center border rounded ${status === 'complete' ? 'bg-red-50 border-red-600 text-red-600' : 'border-gray-200 text-gray-300'}`}>
                {status === 'complete' ? <CheckCircle size={14} /> : <div className="w-1.5 h-1.5 bg-gray-300"></div>}
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${status === 'complete' ? 'text-gray-900' : 'text-gray-400'}`}>
                {title}
            </span>
        </div>
    );
};

const ProfileEditForm: React.FC<{ user: any; onUpdate: (updated: any) => void }> = ({ user, onUpdate }) => {
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [barangay, setBarangay] = useState(user?.barangay || '');
    const [contactNumber, setContactNumber] = useState(user?.contactNumber || '');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ firstName, lastName, barangay, contactNumber })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to update profile');
            
            const updatedUser = { ...user, firstName, lastName, barangay, contactNumber };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            onUpdate(updatedUser);
            toast.success('Profile updated successfully!');
        } catch (err: any) {
            toast.error(err.message || 'Failed to update profile');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">First Name</label>
                <input 
                    type="text" 
                    value={firstName} 
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full border border-gray-200 px-4 py-3 bg-white text-gray-900 focus:outline-none rounded-lg"
                    required
                />
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
                <input 
                    type="text" 
                    value={lastName} 
                    onChange={e => setLastName(e.target.value)}
                    className="w-full border border-gray-200 px-4 py-3 bg-white text-gray-900 focus:outline-none rounded-lg"
                    required
                />
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Barangay</label>
                <input 
                    type="text" 
                    value={barangay} 
                    onChange={e => setBarangay(e.target.value)}
                    className="w-full border border-gray-200 px-4 py-3 bg-white text-gray-900 focus:outline-none rounded-lg"
                    required
                />
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Contact Number</label>
                <input 
                    type="text" 
                    value={contactNumber} 
                    onChange={e => setContactNumber(e.target.value)}
                    className="w-full border border-gray-200 px-4 py-3 bg-white text-gray-900 focus:outline-none rounded-lg"
                />
            </div>
            <button 
                type="submit" 
                disabled={submitting}
                className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-widest disabled:opacity-50 rounded-lg"
            >
                {submitting ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
    );
};

const SecurityForm: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            toast.error('New passwords do not match');
            return;
        }
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to change password');
            
            toast.success('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err: any) {
            toast.error(err.message || 'Failed to change password');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Current Password</label>
                <input 
                    type="password" 
                    value={currentPassword} 
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full border border-gray-200 px-4 py-3 bg-white text-gray-900 focus:outline-none rounded-lg"
                    required
                />
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">New Password</label>
                <input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full border border-gray-200 px-4 py-3 bg-white text-gray-900 focus:outline-none rounded-lg"
                    required
                />
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Confirm New Password</label>
                <input 
                    type="password" 
                    value={confirmNewPassword} 
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    className="w-full border border-gray-200 px-4 py-3 bg-white text-gray-900 focus:outline-none rounded-lg"
                    required
                />
            </div>
            <button 
                type="submit" 
                disabled={submitting}
                className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-widest disabled:opacity-50 rounded-lg"
            >
                {submitting ? 'Updating...' : 'Update Password'}
            </button>
        </form>
    );
};

export default DashboardPage;
