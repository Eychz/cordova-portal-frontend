export interface Department {
    key: string;
    label: string;
}

export const DEPARTMENTS: Department[] = [
    { key: 'EXECUTIVE', label: 'Executive Departments' },
    { key: 'LEGISLATIVE', label: 'Legislative Department' },
    { key: 'ECONOMIC FINANCE', label: 'Economic Finance Department' },
    { key: 'SOCIAL SERVICES', label: 'Social Services Department' },
    { key: 'ECONOMIC SUPPORT', label: 'Economic Support Department' },
    { key: 'PUBLIC SAFETY', label: 'Public Safety Department' },
    { key: 'ECONOMIC ENTERPRISE', label: 'Economic Enterprise Department' },
    { key: 'HERITAGE CONSERVATION', label: 'Heritage Conservation Department' }
];

export const getDepartmentCategory = (position: string): string => {
    const parts = position.split(' | ');
    if (parts.length < 2) return 'EXECUTIVE';
    const office = parts[1].trim().toUpperCase();

    if (['MAYOR\'S OFFICE', 'MPDO', 'PIO', 'HRMO', 'ACTION TEAM', 'MOTORPOOL', 'ICT'].includes(office)) {
        return 'EXECUTIVE';
    }
    if (['SB'].includes(office)) {
        return 'LEGISLATIVE';
    }
    if (['ACCOUNTING', 'TREASURY', 'BUDGET', 'ASSESSOR', 'BPLO'].includes(office)) {
        return 'ECONOMIC FINANCE';
    }
    if (['CORDOVA PCHF', 'MSWDO', 'MCR'].includes(office)) {
        return 'SOCIAL SERVICES';
    }
    if (['OBO', 'MAO', 'FISHERIES', 'UMEC'].includes(office)) {
        return 'ECONOMIC SUPPORT';
    }
    if (['MDRRMO', 'CTM', 'MARINE WATCH'].includes(office)) {
        return 'PUBLIC SAFETY';
    }
    if (['CPC', 'CORDOVA TOWNSQUARE', 'RORO PORT', 'SOLID WASTE MANAGEMENT', 'SPORT & CULTURAL CENTER'].includes(office)) {
        return 'ECONOMIC ENTERPRISE';
    }
    if (['TOURISM'].includes(office)) {
        return 'HERITAGE CONSERVATION';
    }
    return 'EXECUTIVE';
};
