import React, { useState } from 'react';
import { Search, Filter, Shield, User as UserIcon, Trash2, Edit, X, Check, Phone, Calendar } from 'lucide-react';
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
        contactNumber: '',
        role: 'citizen',
    });

    const itemsPerPage = 15;

    const barangays = ['All', 'Alegria', 'Bangbang', 'Buagsong', 'Catarman', 'Cogon', 'Dapitan', 'Day-as', 'Gabi', 'Gilutongan', 'Ibabao', 'Pilipog', 'Poblacion', 'San Miguel'];
    const selectableBarangays = barangays.filter(b => b !== 'All');

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                             user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role?.toLowerCase() === roleFilter.toLowerCase();
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
            contactNumber: user.contactNumber || '',
            role: user.role || 'citizen',
        });
    };

    const handleSave = () => {
        if (!editUser) return;
        onUpdateUser(editUser.id, formData);
        setEditUser(null);
    };

    const getRoleBadgeStyle = (role: string = 'citizen') => {
        const r = role.toUpperCase();
        if (r === 'SUPERADMIN') return 'bg-red-500/10 text-red-500 border border-red-500/30';
        if (r === 'ADMIN') return 'bg-purple-500/10 text-purple-500 border border-purple-500/30';
        if (r === 'PIO') return 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/30';
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700';
    };

    return (
        <div className="space-y-6 relative">
            {/* Search and Filters Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                <div className="lg:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search citizens by name or email..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-none focus:ring-2 focus:ring-red-600 font-bold text-sm text-gray-900 dark:text-white placeholder-gray-400"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        value={roleFilter}
                        onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-10 pr-8 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-none focus:ring-2 focus:ring-red-600 font-bold text-sm text-gray-900 dark:text-white appearance-none"
                    >
                        <option value="all">All Roles</option>
                        <option value="SUPERADMIN">Super Administrators</option>
                        <option value="ADMIN">ICT Administrators</option>
                        <option value="PIO">PIO Officers</option>
                        <option value="citizen">Citizens</option>
                        <option value="visitor">Visitors</option>
                    </select>
                </div>
                <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        value={barangayFilter}
                        onChange={(e) => { setBarangayFilter(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-10 pr-8 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-none focus:ring-2 focus:ring-red-600 font-bold text-sm text-gray-900 dark:text-white appearance-none"
                    >
                        {barangays.map(b => <option key={b} value={b}>{b === 'All' ? 'All Barangays' : b}</option>)}
                    </select>
                </div>
            </div>

            {/* Registry Table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Citizen</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Location & Contact</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">System Role</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Registered Date</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Registry Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center">
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No citizens found in the registry</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center flex-shrink-0 font-black text-white text-xs">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{user.name}</p>
                                                    <p className="text-[11px] text-gray-500 font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{user.barangay}</p>
                                                <p className="text-[11px] text-gray-500 flex items-center gap-1">
                                                    <Phone className="w-3 h-3 text-gray-400" />
                                                    {user.contactNumber || 'No contact'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded ${getRoleBadgeStyle(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-xs text-gray-500 font-medium">
                                            {user.registeredAt || 'Recent'}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="px-3 py-1.5 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-black uppercase tracking-widest hover:border-gray-900 hover:text-gray-900 dark:hover:border-white dark:hover:text-white transition-all flex items-center gap-1.5 rounded"
                                                >
                                                    <Edit className="w-3 h-3" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => onDelete(user.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50 dark:hover:bg-red-950/20"
                                                    title="Delete User"
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
                </div>

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
                    <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-xl w-full max-w-lg shadow-2xl relative flex flex-col my-8">
                        
                        {/* Close button */}
                        <button 
                            onClick={() => setEditUser(null)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 hover:text-red-600 transition-colors z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">Edit Citizen Profile</h3>
                            <p className="text-xs text-gray-500 mt-0.5">{editUser.email}</p>
                        </div>

                        <div className="p-6 space-y-4 flex-1">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">First Name</label>
                                <input 
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Middle Name</label>
                                <input 
                                    type="text"
                                    value={formData.middleName}
                                    onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Last Name</label>
                                <input 
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Barangay</label>
                                    <select 
                                        value={formData.barangay}
                                        onChange={(e) => setFormData({...formData, barangay: e.target.value})}
                                        className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors"
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
                                        className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors"
                                    >
                                        <option value="citizen">Citizen</option>
                                        <option value="PIO">PIO Officer</option>
                                        <option value="ADMIN">ICT Administrator</option>
                                        <option value="SUPERADMIN">Super Administrator</option>
                                        <option value="visitor">Visitor</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Contact Number</label>
                                <input 
                                    type="text"
                                    value={formData.contactNumber}
                                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                                    placeholder="+63 900 000 0000"
                                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#151515] rounded-b-xl">
                            <button
                                onClick={handleSave}
                                className="w-full py-3.5 bg-red-700 hover:bg-red-800 text-white text-xs font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 shadow-md"
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
