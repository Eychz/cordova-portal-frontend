import React from 'react';

export const incomeData = [
    { year: '2024', amount: 306261621.56, type: 'Actual', color: '#15803d' },
    { year: '2025', amount: 387002359.90, type: 'Actual', color: '#15803d' },
    { year: '2026', amount: 368871306.00, type: 'Projected', color: '#1e3a8a' },
    { year: '2027', amount: 403588436.00, type: 'Proposed', color: '#b91c1c' },
];

export const growthData = [
    { name: 'Business Establishments', '2023': 895, '2025': 1468 },
];

export const salesData = [
    { name: 'Gross Sales (Billion ₱)', '2023': 2.29, '2024': 3.97 },
];

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 0,
    }).format(value);
};

export const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    return (
        <circle
            cx={cx}
            cy={cy}
            r={5}
            stroke={payload.color || "#b91c1c"}
            strokeWidth={3}
            fill="#fff"
        />
    );
};

export const CustomActiveDot = (props: any) => {
    const { cx, cy, payload } = props;
    return (
        <circle
            cx={cx}
            cy={cy}
            r={8}
            fill={payload.color || "#b91c1c"}
            stroke="#fff"
            strokeWidth={2}
        />
    );
};

export const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-3 shadow-lg rounded-lg text-xs">
                <p className="font-bold text-gray-500 uppercase tracking-wider mb-1">{data.year} ({data.type})</p>
                <p className="font-black text-red-700 dark:text-red-400 text-sm">
                    {formatCurrency(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

export const CompareTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-3 shadow-lg rounded-lg text-xs">
                <p className="font-bold text-gray-500 uppercase tracking-wider mb-2">{payload[0].payload.name}</p>
                <div className="space-y-1">
                    {payload.map((p: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4 justify-between">
                            <span className="text-gray-400 font-medium">{p.name}:</span>
                            <span className="font-black text-gray-900 dark:text-white">{p.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};
