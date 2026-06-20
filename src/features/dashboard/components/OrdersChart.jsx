
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Use CSS variables so Recharts updates dynamically when the theme changes
const COLORS = [
    'var(--color-accent-500)', 
    'var(--color-accent-400)', 
    'var(--color-accent-600)', 
    'var(--color-accent-300)', 
    'var(--color-accent-700)', 
    'var(--color-accent-200)'
];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs shadow-lg">
            <div className="text-slate-500 dark:text-slate-400 font-medium mb-1">{label}</div>
            <div style={{ color: payload[0]?.fill }} className="font-bold text-sm">
                {payload[0]?.value} orders
            </div>
        </div>
    );
};

const OrdersChart = ({ chartData }) => (
    <div className="bg-white dark:bg-box border border-slate-200 dark:border-white/5 rounded-2xl p-5 animate-fade-up-6 transition-colors duration-300">
        <div className="mb-6">
            <h2 className="text-[15px] font-bold text-slate-900 dark:text-slate-50 tracking-wide">Orders by Category</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Last 30 days breakdown</p>
        </div>

        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barSize={28}>
                <CartesianGrid stroke="#e2e8f0" strokeOpacity={0.5} vertical={false} className="dark:opacity-10" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.9} />)}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export default OrdersChart;