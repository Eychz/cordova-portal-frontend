export interface BarangayOfficial {
    position: string;
    name: string;
    imageUrl: string;
}

export interface BarangayInfo {
    name: string;
    tagline: string;
    info: {
        description: string;
        population?: string;
        area?: string;
        established?: string;
        coordinates?: { lat: number; lng: number };
        keyFeatures?: { title: string; description: string }[];
    };
    barangayOfficials: BarangayOfficial[];
    skOfficials: BarangayOfficial[];
}

export interface BarangayData {
    [key: string]: BarangayInfo;
}

export const barangayData: BarangayData = {
    alegria: {
        name: "Alegria",
        tagline: "A Joyful Community",
        info: {
            description: "Barangay Alegria is a vibrant coastal community known for its friendly residents and beautiful natural scenery.",
            population: "~2,500",
            area: "1.2 km²",
            established: "1950",
            coordinates: { lat: 10.1234, lng: 123.4567 },
            keyFeatures: [
                { title: "Beachfront Park", description: "A popular spot for families and tourists to relax and enjoy the sea breeze." },
                { title: "Annual Fiesta", description: "A week-long celebration featuring parades, food fairs, and cultural performances." }
            ]
        },
        barangayOfficials: [
            { position: "Barangay Captain", name: "Juan Dela Cruz", imageUrl: "https://lh3.googleusercontent.com/a/ACg8ocLJxkw2EnYUh0IdZJPROvlGKvt-soMykUl9l-5gvxVSRvtPbf8t=s40-p" },
            { position: "Kagawad", name: "Maria Santos", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Pedro Reyes", imageUrl: "municipal-logo.jpg" },
            { position: "Kagawad", name: "Ana Garcia", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Jose Rodriguez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Carmen Lopez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Ricardo Martinez", imageUrl: "/officials/default.jpg" },
            { position: "SK Chairperson", name: "Miguel Torres", imageUrl: "/officials/default.jpg" }
        ],
        skOfficials: [
            { position: "SK Chairperson", name: "Miguel Torres", imageUrl: "/officials/default.jpg" },
            { position: "SK Kagawad", name: "Sofia Ramos", imageUrl: "/officials/default.jpg" },
            { position: "SK Kagawad", name: "Luis Hernandez", imageUrl: "/officials/default.jpg" }
        ]
    },
    bangbang: {
        name: "Bangbang",
        tagline: "United in Progress",
        info: {
            description: "Barangay Bangbang is a growing community with a strong agricultural foundation and dedicated residents.",
            population: "~3,200",
            area: "2.1 km²",
            coordinates: { lat: 10.2500, lng: 123.9500 }
        },
        barangayOfficials: [
            { position: "Barangay Captain", name: "Roberto Silva", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Elena Cruz", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Carlos Mendoza", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Teresa Flores", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Francisco Diaz", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Gloria Morales", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Antonio Castillo", imageUrl: "/officials/default.jpg" }
        ],
        skOfficials: [
            { position: "SK Chairperson", name: "Isabella Gomez", imageUrl: "/officials/default.jpg" },
            { position: "SK Kagawad", name: "Daniel Vargas", imageUrl: "/officials/default.jpg" }
        ]
    },
    buagsong: {
        name: "Buagsong",
        tagline: "Prosperity Through Unity",
        info: {
            description: "Barangay Buagsong is known for its tight-knit community and commitment to sustainable development.",
            population: "~2,800",
            coordinates: { lat: 10.2600, lng: 123.9600 }
        },
        barangayOfficials: [
            { position: "Barangay Captain", name: "Ernesto Aguilar", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Lucia Navarro", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Ramon Pascual", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Rosario Santos", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Alberto Fernandez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Margarita Jimenez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Vicente Ortega", imageUrl: "/officials/default.jpg" }
        ],
        skOfficials: [
            { position: "SK Chairperson", name: "Gabriel Valdez", imageUrl: "/officials/default.jpg" }
        ]
    },
    catarman: {
        name: "Catarman",
        tagline: "Heritage and Progress",
        info: {
            description: "Barangay Catarman balances tradition with modern development, creating a unique community atmosphere.",
            population: "~4,100",
            coordinates: { lat: 10.2700, lng: 123.9700 }
        },
        barangayOfficials: [
            { position: "Barangay Captain", name: "Leonardo Ramos", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Patricia Gutierrez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Miguel Romero", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Sandra Ramirez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Enrique Torres", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Beatriz Suarez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Fernando Velasco", imageUrl: "/officials/default.jpg" }
        ],
        skOfficials: [
            { position: "SK Chairperson", name: "Camila Reyes", imageUrl: "/officials/default.jpg" }
        ]
    },
    cogon: {
        name: "Cogon",
        tagline: "Green and Growing",
        info: {
            description: "Barangay Cogon is characterized by its lush greenery and agricultural productivity.",
            population: "~2,600",
            coordinates: { lat: 10.2800, lng: 123.9800 }
        },
        barangayOfficials: [
            { position: "Barangay Captain", name: "Eduardo Hernandez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Irene Castro", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Jorge Perez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Nora Alvarez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Rodolfo Medina", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Cristina Ruiz", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Guillermo Sanchez", imageUrl: "/officials/default.jpg" }
        ],
        skOfficials: [
            { position: "SK Chairperson", name: "Valentina Cortez", imageUrl: "/officials/default.jpg" }
        ]
    },
    dapitan: {
        name: "Dapitan",
        tagline: "Community First",
        info: {
            description: "Barangay Dapitan prides itself on strong community bonds and active civic participation.",
            population: "~3,500",
            coordinates: { lat: 10.2900, lng: 123.9900 }
        },
        barangayOfficials: [
            { position: "Barangay Captain", name: "Alfredo Iglesias", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Dolores Nunez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Marcos Fuentes", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Angelica Molina", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Sergio Carrillo", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Victoria Delgado", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Hector Herrera", imageUrl: "/officials/default.jpg" }
        ],
        skOfficials: [
            { position: "SK Chairperson", name: "Sebastian Mendez", imageUrl: "/officials/default.jpg" }
        ]
    },
    'day-as': {
        name: "Day-as",
        tagline: "Forward Together",
        info: {
            description: "Barangay Day-as is a progressive community focused on education and youth development.",
            population: "~2,900",
            coordinates: { lat: 10.3000, lng: 124.0000 }
        },
        barangayOfficials: [
            { position: "Barangay Captain", name: "Arturo Campos", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Lidia Paredes", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Pablo Guerrero", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Silvia Vazquez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Ignacio Pena", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Rafaela Mora", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Tomas Lara", imageUrl: "/officials/default.jpg" }
        ],
        skOfficials: [
            { position: "SK Chairperson", name: "Adriana Silva", imageUrl: "/officials/default.jpg" }
        ]
    },
    gabi: {
        name: "Gabi",
        tagline: "Strong Roots, Bright Future",
        info: {
            description: "Barangay Gabi maintains its cultural heritage while embracing modern progress.",
            population: "~3,100",
            coordinates: { lat: 10.3100, lng: 124.0100 }
        },
        barangayOfficials: [
            { position: "Barangay Captain", name: "Domingo Rojas", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Amparo Salazar", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Cesar Aguilera", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Esperanza Vargas", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Baltazar Mendoza", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Concepcion Ortiz", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Salvador Diaz", imageUrl: "/officials/default.jpg" }
        ],
        skOfficials: [
            { position: "SK Chairperson", name: "Mateo Cruz", imageUrl: "/officials/default.jpg" }
        ]
    },
    gilutongan: {
        name: "Gilutongan",
        tagline: "Island Paradise",
        info: {
            description: "Barangay Gilutongan is a beautiful island community known for its marine resources and tourism.",
            population: "~1,800",
            coordinates: { lat: 10.3200, lng: 124.0200 }
        },
        barangayOfficials: [
            { position: "Barangay Captain", name: "Rodrigo Navarro", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Estrella Mendoza", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Manuel Rivera", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Josefa Ramos", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Felipe Gonzalez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Remedios Torres", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Emilio Castro", imageUrl: "/officials/default.jpg" }
        ],
        skOfficials: [
            { position: "SK Chairperson", name: "Luna Martinez", imageUrl: "/officials/default.jpg" }
        ]
    },
    ibabao: {
        name: "Ibabao",
        tagline: "Unity in Diversity",
        info: {
            description: "Barangay Ibabao is a diverse community that celebrates its multicultural heritage.",
            population: "~3,400",
            coordinates: { lat: 10.3300, lng: 124.0300 }
        },
        barangayOfficials: [
            { position: "Barangay Captain", name: "Gregorio Santos", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Aurora Reyes", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Lorenzo Garcia", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Pilar Lopez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Benito Martinez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Soledad Fernandez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Fabian Rodriguez", imageUrl: "/officials/default.jpg" }
        ],
        skOfficials: [
            { position: "SK Chairperson", name: "Diego Herrera", imageUrl: "/officials/default.jpg" }
        ]
    },
    pilipog: {
        name: "Pilipog",
        tagline: "Thriving Community",
        info: {
            description: "Barangay Pilipog is a dynamic community with strong economic activity and social cohesion.",
            population: "~2,700",
            coordinates: { lat: 10.3400, lng: 124.0400 }
        },
        barangayOfficials: [
            { position: "Barangay Captain", name: "Mariano Jimenez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Felicidad Ortega", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Alejandro Valdez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Delia Gutierrez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Raul Romero", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Leonor Ramirez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Claudio Suarez", imageUrl: "/officials/default.jpg" }
        ],
        skOfficials: [
            { position: "SK Chairperson", name: "Aurora Velasco", imageUrl: "/officials/default.jpg" }
        ]
    },
    poblacion: {
        name: "Poblacion",
        tagline: "Heart of Cordova",
        info: {
            description: "Barangay Poblacion serves as the municipal center and administrative hub of Cordova.",
            population: "~5,200",
            coordinates: { lat: 10.2530, lng: 123.9510 }
        },
        barangayOfficials: [
            { position: "Barangay Captain", name: "Augusto Hernandez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Carmela Castro", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Esteban Perez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Guadalupe Alvarez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Pascual Medina", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Teresita Ruiz", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Valentin Sanchez", imageUrl: "/officials/default.jpg" }
        ],
        skOfficials: [
            { position: "SK Chairperson", name: "Nicolas Cortez", imageUrl: "/officials/default.jpg" }
        ]
    },
    'san-miguel': {
        name: "San Miguel",
        tagline: "Faith and Community",
        info: {
            description: "Barangay San Miguel is a faith-based community with strong religious traditions and values.",
            population: "~2,950",
            coordinates: { lat: 10.3500, lng: 124.0500 }
        },
        barangayOfficials: [
            { position: "Barangay Captain", name: "Fortunato Iglesias", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Asuncion Nunez", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Modesto Fuentes", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Milagros Molina", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Casimiro Carrillo", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Purificacion Delgado", imageUrl: "/officials/default.jpg" },
            { position: "Kagawad", name: "Lazaro Herrera", imageUrl: "/officials/default.jpg" }
        ],
        skOfficials: [
            { position: "SK Chairperson", name: "Isabela Mendez", imageUrl: "/officials/default.jpg" }
        ]
    }
};
