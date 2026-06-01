import React, { useState } from 'react';
import { Users, Edit, Trash2, Plus, X, Save, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { type MunicipalOfficial } from 'data/adminData';

interface MunicipalTabProps {
    officials: MunicipalOfficial[];
    onEdit: (official: MunicipalOfficial) => void;
    onDelete: (id: number) => void;
    onAdd: () => void;
}

const MunicipalTab: React.FC<MunicipalTabProps> = ({ officials, onEdit, onDelete, onAdd }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const executiveSchema = z.object({
        name: z.string().min(2, 'Name is required'),
        position: z.string().min(2, 'Position is required'),
        department: z.string().optional(),
    });

    type ExecutiveFormData = z.infer<typeof executiveSchema>;

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ExecutiveFormData>({
        resolver: zodResolver(executiveSchema)
    });

    const onSubmit = async (data: ExecutiveFormData) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            toast.success('Executive added successfully!');
            setIsAddModalOpen(false);
            reset();
            setImageUrl('');
            // onAdd() could trigger refresh here
        } catch (err) {
            toast.error('Failed to add executive');
        }
    };

    return (
        <>
            <div className="space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Municipal Leadership</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Management of core municipality executive team</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-8 py-4 bg-red-700 text-white font-black text-sm uppercase tracking-widest hover:bg-red-800 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Executive
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {officials.map(official => (
                    <div key={official.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 premium-flag-container group overflow-hidden hover:scale-[1.01] hover:border-red-700 transition-all duration-200">
                        <div className="h-64 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                            <div className="absolute inset-0 bg-red-900/10 group-hover:bg-transparent transition-colors z-10" />
                            {official.imageUrl ? (
                                <img src={official.imageUrl} alt={official.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Users className="w-20 h-20" />
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20">
                                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">{official.position}</p>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">{official.name}</h3>
                            </div>
                        </div>
                        <div className="p-4 flex gap-2">
                            <button
                                onClick={() => onEdit(official)}
                                className="flex-1 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-red-700 hover:text-white text-gray-900 dark:text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                            >
                                <Edit className="w-4 h-4" /> Edit Profile
                            </button>
                            <button
                                onClick={() => onDelete(official.id)}
                                className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-red-700 hover:text-white text-gray-900 dark:text-white transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

            {/* Add Executive Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-md border border-gray-200 dark:border-gray-800 shadow-none">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Add Municipal Executive</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Full Name</label>
                                <input 
                                    {...register('name')}
                                    className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm focus:outline-none focus:border-red-700 text-gray-900 dark:text-white"
                                    placeholder="Enter full name"
                                />
                                {errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.name.message}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Position / Title</label>
                                <input 
                                    {...register('position')}
                                    className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm focus:outline-none focus:border-red-700 text-gray-900 dark:text-white"
                                    placeholder="e.g. Municipal Mayor"
                                />
                                {errors.position && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.position.message}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Department (Optional)</label>
                                <input 
                                    {...register('department')}
                                    className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm focus:outline-none focus:border-red-700 text-gray-900 dark:text-white"
                                    placeholder="e.g. Office of the Mayor"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Profile Image URL (Optional)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <ImageIcon className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <input 
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 pl-9 text-sm focus:outline-none focus:border-red-700 text-gray-900 dark:text-white"
                                        placeholder="https://example.com/photo.jpg"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-xs font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-red-700 text-white text-xs font-black uppercase tracking-widest hover:bg-red-800 flex justify-center items-center gap-2">
                                    {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4"/> Save</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default MunicipalTab;
