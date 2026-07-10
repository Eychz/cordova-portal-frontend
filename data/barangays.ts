export type Official = {
    position: string;
    name: string;
    imageUrl: string;
};

export type BarangayInfoType = {
    id: string; // the slug, e.g. 'alegria'
    name: string;
    tagline: string;
    previewImage: string; // for the list view preview
    info: {
        description: string;
        population: string;
        area: string;
        density?: string;
        established: string;
        mapIframe: string;
        keyFeatures: { title: string; description: string }[];
        zipCode: string;
    };
    barangayOfficials: Official[];
    skOfficials: Official[];
};

export const barangays: BarangayInfoType[] = [
    {
        id: 'alegria',
        name: "Alegria",
        tagline: "A Joyful Community",
        previewImage: "/Alegria.png",
        info: {
            description: "Barangay Alegria is a vibrant coastal community known for its friendly residents and beautiful natural scenery.",
            population: "4,472",
            area: "71.53 Hectares",
            density: "6,251.92 per Sq. Km",
            established: "1950",
            mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7852.158865123446!2d123.95539124448648!3d10.255177459454531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a6399e7265f%3A0x11728c272f93469d!2sAlegria%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1764845797564!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            keyFeatures: [
                { title: "Beachfront Park", description: "A popular spot for families and tourists to relax and enjoy the sea breeze." },
                { title: "Annual Fiesta", description: "A week-long celebration featuring parades, food fairs, and cultural performances." }
            ],
            zipCode: "6017"
        },
        barangayOfficials: [],
        skOfficials: []
    },
    {
        id: 'bangbang',
        name: "Bangbang",
        tagline: "The Heart of Tradition",
        previewImage: "/Bangbang.png",
        info: {
            description: "Barangay Bangbang features a mix of traditional livelihoods and modern development, showcasing the rich cultural heritage of Cordova.",
            population: "6,566",
            area: "59.96 Hectares",
            density: "10,950.63 per Sq. Km",
            established: "1952",
            mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7852.722872884886!2d123.94367147004809!3d10.259257145137145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a59f99abe83%3A0x2df86bef56d58830!2sBangbang%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1777001743962!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            keyFeatures: [
                { title: "Heritage Sites", description: "Historical landmarks that reflect the deep history of the municipality." },
                { title: "Local Market", description: "A bustling market offering fresh local produce and seafood." }
            ],
            zipCode: "6017"
        },
        barangayOfficials: [],
        skOfficials: []
    },
    {
        id: 'buagsong',
        name: "Buagsong",
        tagline: "A Peaceful Haven",
        previewImage: "/Buagsong.png",
        info: {
            description: "A tranquil residential barangay known for its serene environment and tight-knit community.",
            population: "5,754",
            area: "100.85 Hectares",
            density: "4,465.66 per Sq. Km",
            established: "1955",
            mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7852.303102784993!2d123.93658629486146!3d10.249358559476544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99af8d918f469%3A0xa335cfedefab4537!2sBuagsong%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1777001899695!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            keyFeatures: [],
            zipCode: "6017"
        },
        barangayOfficials: [],
        skOfficials: []
    },
    {
        id: 'catarman',
        name: 'Catarman',
        tagline: 'Gateway to Adventure',
        previewImage: '/Catarman.png',
        info: {
            description: 'Catarman is a coastal barangay known for its beautiful beaches and vibrant fishing community.',
            population: "5,868",
            area: "49.56 Hectares",
            density: "11,840.19 per Sq. Km",
            established: '1948',
            mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7852.326918503227!2d123.94452492109853!3d10.2483974607668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99af12c93c837%3A0x672133904d36ffe1!2sCatarman%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1777002018061!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            keyFeatures: [{ title: 'Beach Resorts', description: 'Popular weekend destinations for locals and tourists.' }],
            zipCode: '6017'
        },
        barangayOfficials: [],
        skOfficials: []
    },
    {
        id: 'cogon',
        name: 'Cogon',
        tagline: 'The Green Community',
        previewImage: '/Cogon.png',
        info: {
            description: 'A lush agricultural area in Cordova, focusing on sustainable farming and local produce.',
            population: "3,055",
            area: "46.77 Hectares",
            density: "6,531.96 per Sq. Km",
            established: '1950',
            mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7851.9737615164395!2d123.94985425192527!3d10.262640209420626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a680757ebaf%3A0xb46a42ef293f0fc3!2sCogon%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1777002069722!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            keyFeatures: [{ title: 'Local Farms', description: 'Providing fresh vegetables and fruits to the municipality.' }],
            zipCode: '6017'
        },
        barangayOfficials: [],
        skOfficials: []
    },
    {
        id: 'dapitan',
        name: 'Dapitan',
        tagline: 'Safe Haven of Cordova',
        previewImage: '/Dapitan.png',
        info: {
            description: 'A peaceful residential barangay with a strong focus on community safety and family values.',
            population: "3,050",
            area: "25.05 Hectares",
            density: "12,175.65 per Sq. Km",
            established: '1953',
            mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7851.970898126624!2d123.94420074486204!3d10.262755609425843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a439515d5c1%3A0x97d4d49651fd71b!2sDapitan%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1777002241151!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            keyFeatures: [{ title: 'Community Park', description: 'A space for families to gather and relax.' }],
            zipCode: '6017'
        },
        barangayOfficials: [],
        skOfficials: []
    },
    {
        id: 'day-as',
        name: 'Day-as',
        tagline: 'Home of the Coastal Wonders',
        previewImage: '/Day-as.png',
        info: {
            description: 'Day-as is famous for its mangroves and boardwalk, offering a unique coastal experience.',
            population: "4,696",
            area: "62.41 Hectares",
            density: "6,667.61 per Sq. Km",
            established: '1947',
            mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7852.159081482716!2d123.9379162205034!3d10.255168733438683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99bb1ffecd115%3A0xe987885f85b392e4!2sDay-as%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1777002940571!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            keyFeatures: [{ title: 'Mangrove Boardwalk', description: 'A scenic walk through the protected mangrove forests.' }],
            zipCode: '6017'
        },
        barangayOfficials: [],
        skOfficials: []
    },
    {
        id: 'gabi',
        name: 'Gabi',
        tagline: 'Bridging Communities',
        previewImage: '/Gabi.png',
        info: {
            description: 'Barangay Gabi serves as a vital link between different parts of Cordova, fostering trade and interaction.',
            population: "6,847",
            area: "136.30 Hectares",
            density: "4,421.70 per Sq. Km",
            established: '1951',
            mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7852.001585410312!2d123.95815274990966!3d10.261518787216742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a6e4a6232d9%3A0x1b88bab83cf73fb1!2sGabi%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1777002300594!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            keyFeatures: [{ title: 'Local Commerce', description: 'A hub for small businesses and local entrepreneurs.' }],
            zipCode: '6017'
        },
        barangayOfficials: [],
        skOfficials: []
    },
    {
        id: 'gilutongan',
        name: 'Gilutongan',
        tagline: 'Island Paradise',
        previewImage: '/Gilutongan.png',
        info: {
            description: 'An island barangay renowned for its marine sanctuary and world-class diving spots.',
            population: "1,851",
            area: "12.27 Hectares",
            density: "14,216.59 per Sq. Km",
            established: '1960',
            mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7852.929076988547!2d123.98758498866846!3d10.206819033090076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a98fe63a570ed1%3A0xc9b8275ad45a525a!2sGilutongan%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1777002845463!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            keyFeatures: [{ title: 'Marine Sanctuary', description: 'A protected area with diverse coral reefs and fish species.' }],
            zipCode: '6017'
        },
        barangayOfficials: [],
        skOfficials: []
    },
    {
        id: 'ibabao',
        name: 'Ibabao',
        tagline: 'Highlands of Cordova',
        previewImage: '/Ibabao.png',
        info: {
            description: 'Barangay Ibabao offers elevated views of the municipality and a cool, pleasant atmosphere.',
            population: "11,725",
            area: "140.18 Hectares",
            density: "7,819.79 per Sq. Km",
            established: '1954',
            mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7852.1208279372235!2d123.95377981865645!3d10.256577771261817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a92e70d772d%3A0x1f83b3ef014b50bc!2sIbabao%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1777002376753!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            keyFeatures: [{ title: 'Viewpoints', description: 'Scenic spots overlooking the coastline and town center.' }],
            zipCode: '6017'
        },
        barangayOfficials: [],
        skOfficials: []
    },
    {
        id: 'pilipog',
        name: 'Pilipog',
        tagline: 'Unity in Diversity',
        previewImage: '/Pilipog.png',
        info: {
            description: 'A diverse and inclusive community working together for the progress of the barangay.',
            population: "4,661",
            area: "47.42 Hectares",
            density: "8,930.83 per Sq. Km",
            established: '1949',
            mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7852.260892048719!2d123.96343779829699!3d10.247013313033973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a8f75bb8321%3A0x64e784c84c2ff6fc!2sPilipog%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1777002399102!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            keyFeatures: [{ title: 'Multi-purpose Hall', description: 'A center for community gatherings and activities.' }],
            zipCode: '6017'
        },
        barangayOfficials: [],
        skOfficials: []
    },
    {
        id: 'poblacion',
        name: 'Poblacion',
        tagline: 'The Municipal Center',
        previewImage: '/Poblacion.png',
        info: {
            description: 'The administrative and commercial heart of Cordova, home to the municipal hall and main plaza.',
            population: "10,221",
            area: "84.80 Hectares",
            density: "12,053.07 per Sq. Km",
            established: '1864',
            mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7851.416117362581!2d123.9412868342917!3d10.258782737232241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99b9fe5a33b35%3A0x72c3ed14b7313f7!2sPoblacion%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1777003061527!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            keyFeatures: [{ title: 'Municipal Plaza', description: 'The central gathering place for town celebrations.' }],
            zipCode: '6017'
        },
        barangayOfficials: [],
        skOfficials: []
    },
    {
        id: 'san-miguel',
        name: 'San Miguel',
        tagline: 'Spirit of Resilience',
        previewImage: '/San Miguel.png',
        info: {
            description: 'Barangay San Miguel is known for its resilient residents and strong community spirit.',
            population: "4,149",
            area: "46.38 Hectares",
            density: "8,417.53 per Sq. Km",
            established: '1956',
            mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7852.327641128541!2d123.94258562035557!3d10.252496739486873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99b9fa89d7a9d%3A0x79cf05659b98d0cc!2sSan%20Miguel%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1777003089087!5m2!1sen!2sph" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            keyFeatures: [{ title: 'Community Garden', description: 'A collaborative space for urban gardening.' }],
            zipCode: '6017'
        },
        barangayOfficials: [],
        skOfficials: []
    }
];
