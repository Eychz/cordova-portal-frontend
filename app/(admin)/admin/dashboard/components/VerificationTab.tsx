import React, { useState } from 'react';
import { UserCheck, Eye, Check, X, AlertCircle } from 'lucide-react';
import { type User } from 'data/adminData';
import Pagination from './Pagination';

interface VerificationTabProps {
    users: User[];
    onApprove: (id: number, updatedData?: any) => void;
    onReject: (id: number) => void;
}

const VerificationTab: React.FC<VerificationTabProps> = ({ users, onApprove, onReject }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewUser, setReviewUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        barangay: '',
        role: 'citizen'
    });

    const itemsPerPage = 15;

    const pendingVerifications = users.filter(u => u.frontIdDocumentUrl && !u.isVerified);

    const paginatedVerifications = pendingVerifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const openReview = (user: User) => {
        setReviewUser(user);
        setFormData({
            firstName: user.firstName || '',
            middleName: user.middleName || '',
            lastName: user.lastName || '',
            barangay: user.barangay || '',
            role: user.role || 'citizen'
        });
    };

    const handleApprove = () => {
        if (!reviewUser) return;
        onApprove(reviewUser.id, formData);
        setReviewUser(null);
    };

    const handleReject = () => {
        if (!reviewUser) return;
        onReject(reviewUser.id);
        setReviewUser(null);
    };

    return (
        <div className="space-y-6 relative">
            <div className="bg-red-50 dark:bg-red-900/10 p-6 border-l-4 border-red-700">
                <div className="flex gap-4">
                    <AlertCircle className="w-6 h-6 text-red-700" />
                    <div>
                        <h3 className="text-sm font-black text-red-900 dark:text-red-400 uppercase tracking-tight">Identity Verification Required</h3>
                        <p className="text-xs text-red-700 dark:text-red-300/70 font-bold mt-1">There are {pendingVerifications.length} citizens waiting for identity document review.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Citizen</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Documents</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Barangay</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Verification Review</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {paginatedVerifications.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-12 text-center">
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No pending verification requests</p>
                                </td>
                            </tr>
                        ) : (
                            paginatedVerifications.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                                <UserCheck className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{user.firstName} {user.lastName}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-2">
                                            {user.frontIdDocumentUrl && (
                                                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30 flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> ID Uploaded
                                                </span>
                                            )}
                                            {user.faceVerificationUrl && (
                                                <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-100 dark:border-green-900/30 flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> Face Scan
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{user.barangay}</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => openReview(user)}
                                            className="px-6 py-2 bg-red-700 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-800 transition-all flex items-center gap-2 ml-auto"
                                        >
                                            <Eye className="w-3 h-3" /> Review & Approve
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalItems={pendingVerifications.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* Review Modal */}
            {reviewUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 w-full max-w-5xl my-8 flex flex-col md:flex-row shadow-2xl relative md:h-[85vh] md:max-h-[85vh] overflow-y-auto md:overflow-hidden">

                        {/* Close button */}
                        <button
                            onClick={() => setReviewUser(null)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-600 transition-colors z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Documents Section (Left) */}
                        <div className="w-full md:w-3/5 bg-gray-50 dark:bg-[#111111] p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 md:overflow-y-auto md:h-full">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">Verification Documents</h3>

                            <div className="space-y-8">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Face Verification (Selfie)</p>
                                    {reviewUser.faceVerificationUrl ? (
                                        <div className="border-4 border-white shadow-sm overflow-hidden bg-gray-200 aspect-square max-w-[300px] mx-auto">
                                            <img src={reviewUser.faceVerificationUrl} alt="Face Scan" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">No face scan provided.</p>
                                    )}
                                </div>

                                <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Valid ID Document</p>
                                    {reviewUser.frontIdDocumentUrl ? (
                                        <div className="border-4 border-white shadow-sm overflow-hidden bg-gray-200">
                                            <img src={reviewUser.frontIdDocumentUrl} alt="Valid ID" className="w-full h-auto object-contain max-h-[400px] aspect-square" />
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">No ID provided.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* User Details & Edit Form (Right) */}
                        <div className="w-full md:w-2/5 p-6 md:p-8 bg-white dark:bg-gray-900 md:overflow-y-auto md:h-full flex flex-col">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">Align Citizen Information</h3>
                            <p className="text-xs text-gray-500 mb-6">Verify and edit the information below to exactly match the provided identity documents before approving.</p>

                            <div className="space-y-4 flex-1">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">First Name</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111111] p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Middle Name</label>
                                    <input
                                        type="text"
                                        value={formData.middleName}
                                        onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                                        className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111111] p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111111] p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Barangay</label>
                                    <select
                                        value={formData.barangay}
                                        onChange={(e) => setFormData({ ...formData, barangay: e.target.value })}
                                        className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111111] p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors appearance-none"
                                    >
                                        <option value="">Select Barangay</option>
                                        {['Alegria', 'Bangbang', 'Buagsong', 'Catarman', 'Cogon', 'Dapitan', 'Day-as', 'Gabi', 'Gilutongan', 'Ibabao', 'Pilipog', 'Poblacion', 'San Miguel'].map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Assign Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111111] p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-700 transition-colors appearance-none"
                                    >
                                        <option value="citizen">Citizen</option>
                                        <option value="visitor">Visitor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-3">
                                <button
                                    onClick={handleApprove}
                                    className="w-full py-4 bg-green-700 text-white text-xs font-black uppercase tracking-widest hover:bg-green-800 transition-all flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" /> Save & Approve Verification
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="w-full py-4 border border-red-700 text-red-700 text-xs font-black uppercase tracking-widest hover:bg-red-700 hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <X className="w-4 h-4" /> Reject Verification
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerificationTab;
