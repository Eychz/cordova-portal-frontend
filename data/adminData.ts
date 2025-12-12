export interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  type: 'news' | 'announcements' | 'event';
  priority: 'high' | 'normal' | 'low';
  createdAt: string;
  status?: 'published' | 'draft';
  uuid?: string;
  location?: string;
  eventDate?: string;
  eventTime?: string;
  eventStatus?: 'featured' | 'upcoming' | 'done';
  category?: string;
  author?: string;
  authorName?: string;
  locationLat?: number;
  locationLng?: number;
  isFeatured?: boolean;
}

export interface User {
  id: number;
  name: string;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  email: string;
  role: 'admin' | 'user' | 'visitor';
  avatar?: string;
  barangay?: string;
  verified?: boolean;
  isVerified?: boolean;
  points?: number;
  registeredAt?: string;
  verifiedBarangay?: string;
  contactNumber?: string;
  profileImageUrl?: string | null;
  frontIdDocumentUrl?: string | null;
  backIdDocumentUrl?: string | null;
  faceVerificationUrl?: string | null;
}

export interface ServiceRequest {
  id: number;
  type: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'processing' | 'rejected';
  createdAt: string;
  userId: number;
  submittedAt?: string;
  userName?: string;
  serviceType?: string;
  adminNote?: string;
  details?: string;
}

export interface BarangayOfficial {
  id: number;
  name: string;
  position: string;
  barangay: string;
  contact: string;
  imageUrl?: string;
  termStart?: string;
  contactEmail?: string;
}

export const initialPosts: Post[] = [
  {
    id: 1,
    title: "Cordova Municipality Annual Festival 2025",
    content: "Join us for the annual festival featuring cultural performances, food stalls, and community activities. Special events include the Dinagat Festival celebration honoring our fishing heritage.",
    imageUrl: "https://picsum.photos/seed/festival/400/500",
    type: "event",
    priority: "high",
    createdAt: "2025-11-30T10:00:00Z"
  },
  {
    id: 2,
    title: "Emergency Preparedness Workshop",
    content: "Learn essential skills for disaster preparedness. Topics include evacuation procedures, first aid, and emergency communication.",
    imageUrl: "https://picsum.photos/seed/emergency/400/500",
    type: "announcements",
    priority: "high",
    createdAt: "2025-11-29T14:00:00Z"
  },
  {
    id: 3,
    title: "New Community Health Center Opening",
    content: "The new health center in Barangay Poblacion is now open, providing comprehensive medical services to residents.",
    imageUrl: "https://picsum.photos/seed/health/400/500",
    type: "news",
    priority: "high",
    createdAt: "2025-11-28T09:00:00Z"
  },
  {
    id: 4,
    title: "Barangay Council Meeting Schedule",
    content: "Regular barangay council meetings are held every first Monday of the month at 7 PM in the municipal hall.",
    imageUrl: "https://picsum.photos/seed/meeting/400/500",
    type: "announcements",
    priority: "normal",
    createdAt: "2025-11-27T16:00:00Z"
  },
  {
    id: 5,
    title: "Environmental Cleanup Drive",
    content: "Join the monthly coastal cleanup to keep our beaches and waterways clean. Volunteers needed for December 5th.",
    imageUrl: "https://picsum.photos/seed/cleanup/400/500",
    type: "event",
    priority: "normal",
    createdAt: "2025-11-26T11:00:00Z"
  },
  {
    id: 6,
    title: "Updated Business Permit Requirements",
    content: "New requirements for business permits are now in effect. Please visit the municipal office for detailed information.",
    imageUrl: "https://picsum.photos/seed/business/400/500",
    type: "news",
    priority: "normal",
    createdAt: "2025-11-25T08:00:00Z"
  }
];

export const initialUsers: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@cordova.gov.ph",
    role: "admin"
  }
];

export const initialServiceRequests: ServiceRequest[] = [];

// Barangay Officials for all 13 barangays
export const initialBarangayOfficials: BarangayOfficial[] = [
  // Alegria
  { id: 1, name: "Juan Dela Cruz", position: "Barangay Captain", barangay: "Alegria", contact: "09171234567", imageUrl: "/officials/default.jpg" },
  { id: 2, name: "Maria Santos", position: "Kagawad", barangay: "Alegria", contact: "09171234568", imageUrl: "/officials/default.jpg" },
  { id: 3, name: "Pedro Reyes", position: "Kagawad", barangay: "Alegria", contact: "09171234569", imageUrl: "/officials/default.jpg" },
  { id: 4, name: "Miguel Torres", position: "SK Chairperson", barangay: "Alegria", contact: "09171234570", imageUrl: "/officials/default.jpg" },
  
  // Bangbang
  { id: 5, name: "Roberto Silva", position: "Barangay Captain", barangay: "Bangbang", contact: "09181234567", imageUrl: "/officials/default.jpg" },
  { id: 6, name: "Elena Cruz", position: "Kagawad", barangay: "Bangbang", contact: "09181234568", imageUrl: "/officials/default.jpg" },
  { id: 7, name: "Isabella Gomez", position: "SK Chairperson", barangay: "Bangbang", contact: "09181234569", imageUrl: "/officials/default.jpg" },
  
  // Buagsong
  { id: 8, name: "Ernesto Aguilar", position: "Barangay Captain", barangay: "Buagsong", contact: "09191234567", imageUrl: "/officials/default.jpg" },
  { id: 9, name: "Lucia Navarro", position: "Kagawad", barangay: "Buagsong", contact: "09191234568", imageUrl: "/officials/default.jpg" },
  { id: 10, name: "Gabriel Valdez", position: "SK Chairperson", barangay: "Buagsong", contact: "09191234569", imageUrl: "/officials/default.jpg" },
  
  // Catarman
  { id: 11, name: "Leonardo Ramos", position: "Barangay Captain", barangay: "Catarman", contact: "09201234567", imageUrl: "/officials/default.jpg" },
  { id: 12, name: "Patricia Gutierrez", position: "Kagawad", barangay: "Catarman", contact: "09201234568", imageUrl: "/officials/default.jpg" },
  { id: 13, name: "Camila Reyes", position: "SK Chairperson", barangay: "Catarman", contact: "09201234569", imageUrl: "/officials/default.jpg" },
  
  // Cogon
  { id: 14, name: "Eduardo Hernandez", position: "Barangay Captain", barangay: "Cogon", contact: "09211234567", imageUrl: "/officials/default.jpg" },
  { id: 15, name: "Irene Castro", position: "Kagawad", barangay: "Cogon", contact: "09211234568", imageUrl: "/officials/default.jpg" },
  { id: 16, name: "Valentina Cortez", position: "SK Chairperson", barangay: "Cogon", contact: "09211234569", imageUrl: "/officials/default.jpg" },
  
  // Dapitan
  { id: 17, name: "Alfredo Iglesias", position: "Barangay Captain", barangay: "Dapitan", contact: "09221234567", imageUrl: "/officials/default.jpg" },
  { id: 18, name: "Dolores Nunez", position: "Kagawad", barangay: "Dapitan", contact: "09221234568", imageUrl: "/officials/default.jpg" },
  { id: 19, name: "Sebastian Mendez", position: "SK Chairperson", barangay: "Dapitan", contact: "09221234569", imageUrl: "/officials/default.jpg" },
  
  // Day-as
  { id: 20, name: "Arturo Campos", position: "Barangay Captain", barangay: "Day-as", contact: "09231234567", imageUrl: "/officials/default.jpg" },
  { id: 21, name: "Lidia Paredes", position: "Kagawad", barangay: "Day-as", contact: "09231234568", imageUrl: "/officials/default.jpg" },
  { id: 22, name: "Adriana Silva", position: "SK Chairperson", barangay: "Day-as", contact: "09231234569", imageUrl: "/officials/default.jpg" },
  
  // Gabi
  { id: 23, name: "Domingo Rojas", position: "Barangay Captain", barangay: "Gabi", contact: "09241234567", imageUrl: "/officials/default.jpg" },
  { id: 24, name: "Amparo Salazar", position: "Kagawad", barangay: "Gabi", contact: "09241234568", imageUrl: "/officials/default.jpg" },
  { id: 25, name: "Mateo Cruz", position: "SK Chairperson", barangay: "Gabi", contact: "09241234569", imageUrl: "/officials/default.jpg" },
  
  // Gilutongan
  { id: 26, name: "Rodrigo Navarro", position: "Barangay Captain", barangay: "Gilutongan", contact: "09251234567", imageUrl: "/officials/default.jpg" },
  { id: 27, name: "Estrella Mendoza", position: "Kagawad", barangay: "Gilutongan", contact: "09251234568", imageUrl: "/officials/default.jpg" },
  { id: 28, name: "Luna Martinez", position: "SK Chairperson", barangay: "Gilutongan", contact: "09251234569", imageUrl: "/officials/default.jpg" },
  
  // Ibabao
  { id: 29, name: "Gregorio Santos", position: "Barangay Captain", barangay: "Ibabao", contact: "09261234567", imageUrl: "/officials/default.jpg" },
  { id: 30, name: "Aurora Reyes", position: "Kagawad", barangay: "Ibabao", contact: "09261234568", imageUrl: "/officials/default.jpg" },
  { id: 31, name: "Diego Herrera", position: "SK Chairperson", barangay: "Ibabao", contact: "09261234569", imageUrl: "/officials/default.jpg" },
  
  // Pilipog
  { id: 32, name: "Mariano Jimenez", position: "Barangay Captain", barangay: "Pilipog", contact: "09271234567", imageUrl: "/officials/default.jpg" },
  { id: 33, name: "Felicidad Ortega", position: "Kagawad", barangay: "Pilipog", contact: "09271234568", imageUrl: "/officials/default.jpg" },
  { id: 34, name: "Aurora Velasco", position: "SK Chairperson", barangay: "Pilipog", contact: "09271234569", imageUrl: "/officials/default.jpg" },
  
  // Poblacion
  { id: 35, name: "Augusto Hernandez", position: "Barangay Captain", barangay: "Poblacion", contact: "09281234567", imageUrl: "/officials/default.jpg" },
  { id: 36, name: "Carmela Castro", position: "Kagawad", barangay: "Poblacion", contact: "09281234568", imageUrl: "/officials/default.jpg" },
  { id: 37, name: "Nicolas Cortez", position: "SK Chairperson", barangay: "Poblacion", contact: "09281234569", imageUrl: "/officials/default.jpg" },
  
  // San Miguel
  { id: 38, name: "Fortunato Iglesias", position: "Barangay Captain", barangay: "San Miguel", contact: "09291234567", imageUrl: "/officials/default.jpg" },
  { id: 39, name: "Asuncion Nunez", position: "Kagawad", barangay: "San Miguel", contact: "09291234568", imageUrl: "/officials/default.jpg" },
  { id: 40, name: "Isabela Mendez", position: "SK Chairperson", barangay: "San Miguel", contact: "09291234569", imageUrl: "/officials/default.jpg" }
];

export const STORAGE_KEYS = {
  POSTS: 'adminPosts',
  USERS: 'adminUsers',
  SETTINGS: 'adminSettings',
  SERVICE_REQUESTS: 'serviceRequests'
};

export function loadData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export async function loadDataAsync<T>(key: string, defaultValue: T): Promise<T> {
  // For now, just synchronous, but can be made async if needed
  return loadData(key, defaultValue);
}

export async function saveData<T>(key: string, data: T): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Handle error
  }
}