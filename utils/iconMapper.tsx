import React from 'react';
import * as LucideIcons from 'lucide-react';
import { 
    Building2, 
    Construction, 
    FileText, 
    CheckCircle, 
    Baby, 
    Heart, 
    Hospital, 
    DollarSign, 
    Hammer, 
    Fence, 
    Pickaxe, 
    Sprout, 
    HelpCircle 
} from 'lucide-react';

export const getIconByName = (name: string): React.ComponentType<{ className?: string }> => {
    // Try to find the icon in LucideIcons by name
    const Icon = (LucideIcons as any)[name];
    
    if (Icon) return Icon;

    // Fallback mapping for common identifiers
    const mapping: Record<string, React.ComponentType<{ className?: string }>> = {
        'building': Building2,
        'construction': Construction,
        'file': FileText,
        'check': CheckCircle,
        'baby': Baby,
        'heart': Heart,
        'hospital': Hospital,
        'money': DollarSign,
        'hammer': Hammer,
        'fence': Fence,
        'pickaxe': Pickaxe,
        'sprout': Sprout,
        'shield': LucideIcons.Shield,
        'users': LucideIcons.Users,
        'scale': LucideIcons.Scale,
        'home': LucideIcons.Home,
        'briefcase': LucideIcons.Briefcase,
        'car': LucideIcons.Car,
        'stethoscope': LucideIcons.Stethoscope
    };

    if (!name) return HelpCircle;
    return mapping[name.toLowerCase()] || HelpCircle;
};
