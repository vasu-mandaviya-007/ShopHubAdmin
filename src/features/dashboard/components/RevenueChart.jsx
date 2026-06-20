
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs shadow-lg">
            <div className="text-slate-500 dark:text-slate-400 font-medium mb-1.5">{label}</div>
            <div className="text-accent-600 dark:text-accent-400 font-bold text-sm">
                ₹{payload[0]?.value?.toLocaleString()}
            </div>
            <div className="text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                {payload[1]?.value} orders
            </div>
        </div>
    );
};

const RevenueChart = ({ dataObj }) => {
    const [period, setPeriod] = useState('7D');
    const data = dataObj[period];

    return (
        <div className="bg-white dark:bg-box border border-slate-200 dark:border-white/5 rounded-2xl p-5 animate-fade-up-5 transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-[15px] font-bold text-slate-900 dark:text-slate-50 tracking-wide">Revenue Overview</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Total earnings over time</p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1 gap-1 border border-slate-200 dark:border-white/5">
                    {['TODAY', '7D', '1M', '3M'].map(p => (
                        <button
                            key={p}
                            className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${period === p
                                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                            onClick={() => setPeriod(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                            {/* Uses the dynamically resolved var(--color-accent-500) */}
                            <stop offset="5%" stopColor="var(--color-accent-500)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--color-accent-500)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#e2e8f0" strokeOpacity={0.5} vertical={false} className="dark:opacity-10" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v >= 1000 ? `${v / 1000}k` : v}`} />
                    <Tooltip content={<CustomTooltip />} />

                    <Area type="monotone" dataKey="revenue" stroke="var(--color-accent-500)" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: 'var(--color-accent-500)', strokeWidth: 0 }} />
                    {/* Kept Orders Area indigo for beautiful contrast against the primary accent */}
                    <Area type="monotone" dataKey="orders" stroke="var(--color-accent-400)" strokeWidth={2.5} fill="url(#ordGrad)" dot={false} activeDot={{ r: 4, fill: '#818cf8', strokeWidth: 0 }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueChart;