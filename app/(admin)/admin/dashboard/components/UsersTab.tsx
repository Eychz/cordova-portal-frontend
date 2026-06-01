import React, { useState } from 'react';
import { Search, Filter, Shield, User as UserIcon, Trash2, Edit, X, Check } from 'lucide-react';
import { type User } from 'data/adminData';
import Pagination from './Pagination';

interface UsersTabProps {
    users: User[];
    onUpdateUser: (id: number, updatedData: any) => void;
    onDelete: (id: number) => void;
}

const UsersTab: React.FC<UsersTabProps> = ({ users, onUpdateUser, onDelete }) => {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [barangayFilter, setBarangayFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Edit Modal State
    const [editUser, setEditUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        barangay: '',
        role: 'user',
        isVerified: false
    });

    const itemsPerPage = 15;

    const barangays = ['All', 'Alegria', 'Bangbang', 'Buagsong', 'Catarman', 'Cogon', 'Dapitan', 'Day-as', 'Gabi', 'Gilutongan', 'Ibabao', 'Pilipog', 'Poblacion', 'San Miguel'];
    const selectableBarangays = barangays.filter(b => b !== 'All');

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                             user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesBarangay = barangayFilter === 'All' || user.barangay === barangayFilter;
        return matchesSearch && matchesRole && matchesBarangay;
    });

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openEditModal = (user: User) => {
        setEditUser(user);
        setFormData({
            firstName: user.firstName || '',
            middleName: user.middleName || '',
            lastName: user.lastName || '',
            barangay: user.barangay || '',
            role: user.role || 'user',
            isVerified: user.isVerified || false
        });
    };

    const handleSave = () => {
        if (!editUser) return;
        onUpdateUser(editUser.id, formData);
        setEditUser(null);
    };

    return (
        <div className="space-y-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800">
                <div className="lg:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search citizens by name or email..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-red-600 font-bold text-sm text-gray-900 dark:text-white"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        value={roleFilter}
                        onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-10 pr-8 py-3 bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-red-600 font-bold text-sm text-gray-900 dark:text-white appearance-none"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Administrators</option>
                        <option value="user">Registered Citizens</option>
                        <option value="visitor">Visitors</option>
                    </select>
                </div>
                <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        value={barangayFilter}
                        onChange={(e) => { setBarangayFilter(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-10 pr-8 py-3 bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-red-600 font-bold text-sm text-gray-900 dark:text-white appearance-none"
                    >
                        {barangays.map(b => <option key={b} value={b}>{b === 'All' ? 'All Barangays' : b}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Citizen</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Location</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Registry Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {paginatedUsers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-12 text-center">
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No citizens found in the registry</p>
                                </td>
                            </tr>
                        ) : (
                            paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-red-700 flex items-center justify-center flex-shrink-0 font-black text-white text-xs">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{user.name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{user.barangay}</p>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                                user.role === 'admin' ? 'text-purple-600' : 'text-gray-400'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                                            user.isVerified ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                                        }`}>
                                            {user.isVerified ? 'Verified' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest hover:border-gray-900 hover:text-gray-900 dark:hover:border-white dark:hover:text-white transition-all flex items-center gap-2"
                                            >
                                                <Edit className="w-3 h-3" /> Edit Profile
                                            </button>
                                            <button
                                                onClick={() => onDelete(user.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalItems={filteredUsers.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* Edit User Modal */}
            {editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 w-full max-w-lg shadow-2xl relative flex flex-col my-8">
                        
                        {/* Close button */}
                        <button 
                            onClick={() => setEditUser(null)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-600 transition-colors z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="p-8 pb-6 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Edit Citizen Profile</h3>
                            <p className="text-xs text-gray-500 mt-1">{editUser.email}</p>
                        </div>

                        <div className="p-8 space-y-4 flex-1">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">First Name</label>
                                <input 
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111111] p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Middle Name</label>
                                <input 
                                    type="text"
                                    value={formData.middleName}
                                    onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111111] p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Last Name</label>
                                <input 
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111111] p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Barangay</label>
                                    <select 
                                        value={formData.barangay}
                                        onChange={(e) => setFormData({...formData, barangay: e.target.value})}
                                        className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111111] p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors appearance-none"
                                    >
                                        <option value="">None</option>
                                        {selectableBarangays.map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">System Role</label>
                                    <select 
                                        value={formData.role}
                                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                                        className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111111] p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors appearance-none"
                                    >
                                        <option value="user">Citizen</option>
                                        <option value="official">Official</option>
                                        <option value="admin">Administrator</option>
                                        <option value="visitor">Visitor</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.isVerified}
                                            onChange={(e) => setFormData({...formData, isVerified: e.target.checked})}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${formData.isVerified ? 'bg-red-700 border-red-700' : 'bg-gray-50 border-gray-300 dark:bg-[#111111] dark:border-gray-700 group-hover:border-red-500'}`}>
                                            {formData.isVerified && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest">
                                        Account Verified
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="p-8 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111111]">
                            <button
                                onClick={handleSave}
                                className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                            >
                                <Check className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersTab;
