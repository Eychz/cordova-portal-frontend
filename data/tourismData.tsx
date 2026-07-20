import React from 'react';
import { Palmtree, Flower2, Waves } from 'lucide-react';

export interface TourismHighlight {
    id: string;
    name: string;
    category: string;
    icon: React.ComponentType<{ className?: string }>;
    image: string;
    tagline: string;
    location: string;
    description: string;
    highlights: string[];
}

export const highlightsData: TourismHighlight[] = [
    {
        id: 'solea',
        name: 'Solea Mactan Resorts',
        category: 'Luxury Resort & Waterpark',
        icon: Palmtree,
        image: '/Solea-Mactan-Resorts.png',
        tagline: 'Premier coastal resort destination featuring sprawling lagoon pools, aquaparks, and panoramic sea views.',
        location: 'Victor Wahing Street, Barangay Alegria, Cordova, Cebu',
        description: 'Solea Mactan Resort is a flagship luxury resort situated along the coastline of Barangay Alegria in Cordova. Boasting expansive lagoon infinity pools, modern waterpark amenities, rooftop lounge dining, and executive suites, it serves as a cornerstone of Cordova\'s booming eco-tourism and hospitality sector.',
        highlights: [
            'Sprawling lagoon infinity pools and inflatable waterpark',
            'Seaside luxury accommodations with balcony ocean views',
            'Al-fresco dining, rooftop sky bar, and international cuisine',
            'Comprehensive convention, wedding, and event spaces'
        ]
    },
    {
        id: 'roses',
        name: '10,000 Roses Cafe',
        category: 'Coastal Floral & Sunset Landmark',
        icon: Flower2,
        image: '/10000-roses.png',
        tagline: 'Iconic seaside destination featuring 10,000 LED white roses that glow at dusk along the Cordova shore.',
        location: 'Day-as Barangay Road, Cordova, Cebu',
        description: 'Inspired by Dongdaemun Design Plaza in Seoul, South Korea, the 10,000 Roses Cafe & More is a celebrated coastal landmark in Barangay Day-as. Featuring a grand outdoor field of ten thousand synthetic LED white roses that illuminate at twilight alongside a multi-level seaside viewing deck, it offers unparalleled sunset vistas over the Mactan channel and CCLEX bridge.',
        highlights: [
            'Field of 10,000 glowing LED white roses illuminating at dusk',
            'Panoramic Mactan channel sunset and sea breeze viewing deck',
            'Korean-inspired indoor and outdoor alfresco cafe space',
            'Prime vantage point for photographing the CCLEX expressway'
        ]
    },
    {
        id: 'gilutongan',
        name: 'Gilutongan Marine Sanctuary',
        category: 'Island Marine Protected Area & Diving',
        icon: Waves,
        image: '/Gilutongan-Marine.png',
        tagline: 'Renowned Marine Protected Area featuring crystal waters, thriving coral reefs, and marine biodiversity.',
        location: 'Gilutongan Island, Cordova, Cebu',
        description: 'Gilutongan Marine Sanctuary is one of the pioneer and most successful Marine Protected Areas (MPA) in the Central Visayas. Located off the coast of Cordova on Gilutongan Island, it features crystal-clear marine waters, vibrant coral gardens, and an abundance of tropical fish, making it the premier island-hopping, snorkeling, and scuba diving destination in Cebu.',
        highlights: [
            'Pioneer Marine Protected Area with rich coral reef ecosystems',
            'World-class snorkeling and scuba diving with tropical fish',
            'Crystal clear turquoise waters ideal for island hopping tours',
            'LGU-managed marine conservation and community eco-tourism'
        ]
    }
];
