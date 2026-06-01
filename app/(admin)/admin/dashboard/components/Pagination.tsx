import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                        Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                        <span className="font-bold">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
                        <span className="font-bold">{totalItems}</span> results
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => onPageChange(i + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    currentPage === i + 1
                                        ? 'z-10 bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400'
                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
