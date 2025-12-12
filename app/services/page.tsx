'use client';

import React, { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Building2, Construction, FileText, CheckCircle, Baby, Heart, Bird, Diamond, Home, Map, Hospital, DollarSign, Hammer, Fence, Pickaxe, Sprout } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; fill?: string; stroke?: string; strokeWidth?: string }>;
  category: string;
  requirements?: string[];
  processingTime?: string;
  fee?: string;
  iconColor?: string;
}

const ServicesPage = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestDescription, setRequestDescription] = useState('');

  const servicesData: Service[] = [
    {
      id: 1,
      title: 'Business Permit',
      description: 'Apply for a new business permit or renew existing permits to operate businesses within Cordova.',
      icon: Building2,
      category: 'Business',
      requirements: ['DTI/SEC Registration', 'Barangay Clearance', 'Proof of Business Location', 'Valid ID'],
      processingTime: '5-7 business days',
      fee: 'Varies based on business type',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 2,
      title: 'Building Permit',
      description: 'Secure permits for new construction, renovation, or repair of buildings and structures.',
      icon: Construction,
      category: 'Construction',
      requirements: ['Approved Building Plans', 'Lot Title/Tax Declaration', 'Barangay Clearance', 'Engineering Documents'],
      processingTime: '10-15 business days',
      fee: 'Based on project cost',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      id: 3,
      title: 'Community Tax Certificate (Cedula)',
      description: 'Obtain your Community Tax Certificate for various transactions and legal purposes.',
      icon: FileText,
      category: 'Certificates',
      requirements: ['Valid ID', 'Proof of Income/Employment'],
      processingTime: 'Same day',
      fee: '₱50-₱100',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 4,
      title: 'Barangay Clearance',
      description: 'Get barangay clearance for employment, business, or other legal requirements.',
      icon: CheckCircle,
      category: 'Certificates',
      requirements: ['Valid ID', 'Proof of Residency', '2x2 Photo'],
      processingTime: '1-2 business days',
      fee: '₱50-₱100',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      id: 5,
      title: 'Birth Certificate',
      description: 'Request certified copies of birth certificates registered in Cordova.',
      icon: Baby,
      category: 'Civil Registry',
      requirements: ['Valid ID', 'Authorization Letter (if representative)'],
      processingTime: '3-5 business days',
      fee: '₱140 per copy',
      iconColor: 'text-pink-600 dark:text-pink-400'
    },
    {
      id: 6,
      title: 'Marriage Certificate',
      description: 'Obtain certified copies of marriage certificates registered in the municipality.',
      icon: Heart,
      category: 'Civil Registry',
      requirements: ['Valid ID', 'Authorization Letter (if representative)'],
      processingTime: '3-5 business days',
      fee: '₱140 per copy',
      iconColor: 'text-rose-600 dark:text-rose-400'
    },
    {
      id: 7,
      title: 'Death Certificate',
      description: 'Request certified copies of death certificates for legal and insurance purposes.',
      icon: Bird,
      category: 'Civil Registry',
      requirements: ['Valid ID', 'Authorization Letter (if representative)'],
      processingTime: '3-5 business days',
      fee: '₱140 per copy',
      iconColor: 'text-slate-600 dark:text-slate-400'
    },
    {
      id: 8,
      title: 'Marriage License',
      description: 'Apply for a marriage license to legally marry in Cordova or elsewhere.',
      icon: Diamond,
      category: 'Civil Registry',
      requirements: ['Birth Certificates', 'CENOMAR', 'Valid IDs', 'Marriage Counseling Certificate'],
      processingTime: '10-day waiting period',
      fee: '₱210',
      iconColor: 'text-fuchsia-600 dark:text-fuchsia-400'
    },
    {
      id: 9,
      title: 'Occupancy Permit',
      description: 'Get certification that your building is fit and safe for occupancy.',
      icon: Home,
      category: 'Construction',
      requirements: ['Building Permit', 'As-Built Plans', 'Electrical/Plumbing Inspection'],
      processingTime: '5-7 business days',
      fee: 'Based on building type',
      iconColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      id: 10,
      title: 'Zoning Clearance',
      description: 'Verify that your property use complies with zoning regulations.',
      icon: Map,
      category: 'Construction',
      requirements: ['Lot Title/Tax Declaration', 'Location Plan', 'Valid ID'],
      processingTime: '3-5 business days',
      fee: '₱200-₱500',
      iconColor: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      id: 11,
      title: 'Health Certificate',
      description: 'Obtain health certificates required for employment and business operations.',
      icon: Hospital,
      category: 'Health',
      requirements: ['Valid ID', 'Medical Examination Results', '2x2 Photo'],
      processingTime: 'Same day (after medical exam)',
      fee: '₱100-₱200',
      iconColor: 'text-red-600 dark:text-red-400'
    },
    {
      id: 12,
      title: 'Tax Clearance',
      description: 'Get certification of no pending real property tax obligations.',
      icon: DollarSign,
      category: 'Tax',
      requirements: ['Property Tax Declaration', 'Valid ID', 'Latest Tax Payment Receipt'],
      processingTime: '1-2 business days',
      fee: '₱100',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 13,
      title: 'Demolition Permit',
      description: 'Secure permit for legal demolition of structures.',
      icon: Hammer,
      category: 'Construction',
      requirements: ['Proof of Ownership', 'Engineering Plans', 'Barangay Clearance'],
      processingTime: '5-7 business days',
      fee: 'Based on structure size',
      iconColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      id: 14,
      title: 'Fencing Permit',
      description: 'Apply for permit to construct fences around your property.',
      icon: Fence,
      category: 'Construction',
      requirements: ['Lot Title', 'Fencing Plans', 'Barangay Clearance'],
      processingTime: '3-5 business days',
      fee: '₱300-₱800',
      iconColor: 'text-stone-600 dark:text-stone-400'
    },
    {
      id: 15,
      title: 'Excavation Permit',
      description: 'Get authorization for excavation activities on your property.',
      icon: Pickaxe,
      category: 'Construction',
      requirements: ['Lot Title', 'Engineering Plans', 'Safety Plan'],
      processingTime: '5-7 business days',
      fee: 'Based on excavation scope',
      iconColor: 'text-brown-600 dark:text-amber-700'
    },
    {
      id: 16,
      title: 'Environmental Compliance Certificate',
      description: 'Obtain ECC for projects with potential environmental impact.',
      icon: Sprout,
      category: 'Business',
      requirements: ['Project Description', 'EIA Report', 'Business Registration'],
      processingTime: '15-30 business days',
      fee: 'Varies based on project',
      iconColor: 'text-lime-600 dark:text-lime-400'
    }
  ];

  const categories = ['all', 'Business', 'Construction', 'Certificates', 'Civil Registry', 'Health', 'Tax'];

  const filteredServices = selectedCategory === 'all' 
    ? servicesData 
    : servicesData.filter(service => service.category === selectedCategory);

  return (
    <PageTransition>
      <Navbar activePage="services" />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20 px-4 transition-colors">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-red-900 dark:text-white mb-4">
              Municipal Services
            </h1>
            <p className="text-lg text-red-800 dark:text-gray-300 max-w-3xl mx-auto">
              Access a wide range of government services offered by the Municipality of Cordova. 
              Select a service below to view requirements and processing information.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-red-900 text-white shadow-lg transform scale-105'
                    : 'bg-white dark:bg-gray-800 text-red-900 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700'
                }`}
              >
                {category === 'all' ? 'All Services' : category}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-red-500 dark:hover:border-red-400"
              >
                <div className={`${service.iconColor || 'text-red-600 dark:text-red-400'} mb-4`}>
                  <service.icon className="w-12 h-12" fill="currentColor" stroke="white" strokeWidth="1.5" />
                </div>
                <h3 className="text-xl font-bold text-red-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                  {service.description}
                </p>
                <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-300 text-xs font-semibold rounded-full">
                  {service.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Service Details Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedService(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={selectedService.iconColor || 'text-red-600 dark:text-red-400'}>
                    <selectedService.icon className="w-16 h-16" fill="currentColor" stroke="white" strokeWidth="1.5" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-red-900 dark:text-white mb-2">
                      {selectedService.title}
                    </h2>
                    <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-300 text-sm font-semibold rounded-full">
                      {selectedService.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-gray-500 hover:text-red-900 dark:text-gray-400 dark:hover:text-red-400 text-3xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-red-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedService.description}</p>
                </div>

                {selectedService.requirements && (
                  <div>
                    <h3 className="text-lg font-bold text-red-900 dark:text-white mb-2">Requirements</h3>
                    <ul className="space-y-2">
                      {selectedService.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <span className="text-red-900 dark:text-red-400 mt-1">✓</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {selectedService.processingTime && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-red-900 dark:text-red-300 mb-1">Processing Time</h4>
                      <p className="text-gray-700 dark:text-gray-300">{selectedService.processingTime}</p>
                    </div>
                  )}
                  {selectedService.fee && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-red-900 dark:text-red-300 mb-1">Fee</h4>
                      <p className="text-gray-700 dark:text-gray-300">{selectedService.fee}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => {
                      // Check if user is logged in
                      const token = localStorage.getItem('token');
                      if (!token) {
                        toast.error('Please log in to request services');
                        router.push('/auth/login');
                        return;
                      }
                      
                      // Check if user is verified
                      const userStr = localStorage.getItem('user');
                      if (userStr) {
                        const user = JSON.parse(userStr);
                        if (!user.isVerified) {
                          toast.error('You need to verify first to access this feature. Please complete verification in your dashboard.');
                          return;
                        }
                      }
                      
                      setShowRequestForm(true);
                      setRequestDescription('');
                    }}
                    className="w-full bg-red-900 text-white py-3 rounded-xl font-bold hover:bg-red-800 transition-colors"
                  >
                    Apply for this Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Request Form Modal */}
        {showRequestForm && selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
              <div className="mb-6">
                <h2 className="text-2xl font-black text-red-900 dark:text-white mb-2">
                  Request Service
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Submit your request for: <span className="font-semibold">{selectedService.title}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Service Type
                  </label>
                  <input
                    type="text"
                    value={selectedService.title}
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Description / Additional Details
                  </label>
                  <textarea
                    value={requestDescription}
                    onChange={(e) => setRequestDescription(e.target.value)}
                    placeholder="Please provide any additional information about your request..."
                    rows={5}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowRequestForm(false);
                      setRequestDescription('');
                    }}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!requestDescription.trim()) {
                        toast.error('Please provide a description for your request');
                        return;
                      }

                      try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                          toast.error('Please login to submit a service request');
                          router.push('/auth/login');
                          return;
                        }

                        const response = await fetch('http://localhost:5000/api/service-requests', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            serviceType: selectedService.title,
                            description: requestDescription
                          })
                        });

                        if (!response.ok) {
                          throw new Error('Failed to submit service request');
                        }

                        toast.success('Service request submitted successfully! You can track it in your dashboard.');
                        setShowRequestForm(false);
                        setSelectedService(null);
                        setRequestDescription('');
                      } catch (error: any) {
                        console.error('Error submitting service request:', error);
                        toast.error(error.message || 'Failed to submit service request');
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-red-900 text-white rounded-xl font-bold hover:bg-red-800 transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Toaster position="top-right" />
      </div>
      <Footer />
    </PageTransition>
  );
};

export default ServicesPage;