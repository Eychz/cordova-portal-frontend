export type AdminRole = 'PIO' | 'ADMIN' | 'SUPERADMIN';

export interface RoleConfig {
    label: string;
    description: string;
    allowedTabs: string[];
    defaultTab: string;
    badgeColor: string;
}

export const ROLE_DEFINITIONS: Record<AdminRole, RoleConfig> = {
    PIO: {
        label: 'Public Information Officer',
        description: 'Authorized for municipal content & announcements management only.',
        allowedTabs: ['posts'],
        defaultTab: 'posts',
        badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    },
    ADMIN: {
        label: 'ICT Administrator',
        description: 'Authorized for system overview, citizen registry, services, officials, and hotlines.',
        allowedTabs: ['overview', 'users', 'services', 'officials', 'emergencies'],
        defaultTab: 'overview',
        badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    },
    SUPERADMIN: {
        label: 'Super Administrator',
        description: 'Unrestricted master access across all administrative panels.',
        allowedTabs: ['overview', 'posts', 'users', 'services', 'officials', 'emergencies', 'changelog'],
        defaultTab: 'overview',
        badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30'
    }
};

export const normalizeRole = (role?: string | null): AdminRole => {
    if (!role) return 'PIO';
    const r = role.toUpperCase().trim();
    if (r === 'SUPERADMIN' || r === 'SUPER_ADMIN' || r === 'SUPER ADMINISTRATOR') return 'SUPERADMIN';
    if (r === 'ADMIN' || r === 'ADMINISTRATOR' || r === 'ICT') return 'ADMIN';
    if (r === 'PIO' || r === 'OFFICIAL' || r === 'PUBLIC INFORMATION') return 'PIO';
    return 'PIO';
};

export const hasTabAccess = (role: string | null | undefined, tab: string): boolean => {
    const norm = normalizeRole(role);
    return ROLE_DEFINITIONS[norm].allowedTabs.includes(tab);
};

export const getDefaultTabForRole = (role: string | null | undefined): string => {
    const norm = normalizeRole(role);
    return ROLE_DEFINITIONS[norm].defaultTab;
};

export const getAllowedTabs = (role: string | null | undefined): string[] => {
    const norm = normalizeRole(role);
    return ROLE_DEFINITIONS[norm].allowedTabs;
};
