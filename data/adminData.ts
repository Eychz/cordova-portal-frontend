export interface Post {
  id?: number;
  title: string;
  content: string;
  imageUrl?: string;
  type: 'news' | 'announcement' | 'event';
  priority?: string;
  createdAt?: string;
  status?: 'published' | 'draft';
  uuid?: string;
  location?: string;
  eventDate?: string;
  eventTime?: string;
  eventStatus?: string;
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

export interface Service {
  id: number;
  name: string;
  details: string;
  requirements: string[];
  fee: string;
  steps: string[];
}

export interface MunicipalOfficial {
  id: number;
  name: string;
  position: string;
  imageUrl?: string;
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
    type: "announcement",
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

export const initialServices: Service[] = [];

export const initialMunicipalOfficials: MunicipalOfficial[] = [
  { id: 1, name: "Hon. Cesar E. Suan", position: "Municipal Mayor", imageUrl: "/officials/mayor.jpg" },
  { id: 2, name: "Hon. Victor Boyet Tago III", position: "Municipal Vice Mayor", imageUrl: "/officials/vice-mayor.jpg" },
  { id: 3, name: "Atty. Mary Joy S. Ligan", position: "Municipal Administrator", imageUrl: "/officials/admin.jpg" }
];

// Barangay Officials with population data
export const initialBarangayOfficials: BarangayOfficial[] = [
  // Alegria (Pop: 7500)
  { id: 1, name: "Juan Dela Cruz", position: "Barangay Captain", barangay: "Alegria", contact: "09171234567", imageUrl: "/officials/default.jpg" },
  { id: 2, name: "Maria Santos", position: "Kagawad", barangay: "Alegria", contact: "09171234568", imageUrl: "/officials/default.jpg" },
  { id: 3, name: "Pedro Reyes", position: "Kagawad", barangay: "Alegria", contact: "09171234569", imageUrl: "/officials/default.jpg" },
  { id: 4, name: "Miguel Torres", position: "SK Chairperson", barangay: "Alegria", contact: "09171234570", imageUrl: "/officials/default.jpg" },

  // Bangbang (Pop: 6200)
  { id: 5, name: "Roberto Silva", position: "Barangay Captain", barangay: "Bangbang", contact: "09181234567", imageUrl: "/officials/default.jpg" },
  { id: 6, name: "Elena Cruz", position: "Kagawad", barangay: "Bangbang", contact: "09181234568", imageUrl: "/officials/default.jpg" },
  { id: 7, name: "Isabella Gomez", position: "SK Chairperson", barangay: "Bangbang", contact: "09181234569", imageUrl: "/officials/default.jpg" }
];

export const STORAGE_KEYS = {
  POSTS: 'adminPosts',
  USERS: 'adminUsers',
  SETTINGS: 'adminSettings',
  SERVICES: 'adminServices',
  MUNICIPAL_OFFICIALS: 'municipalOfficials',
  BARANGAY_OFFICIALS: 'barangayOfficials'
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
