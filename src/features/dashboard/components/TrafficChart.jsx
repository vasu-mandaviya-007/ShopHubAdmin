

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs shadow-lg">
            <div style={{ color: d.payload.color }} className="font-bold">{d.name}</div>
            <div className="text-slate-600 dark:text-slate-300 font-medium">{d.value}%</div>
        </div>
    );
};

const TrafficChart = ({ sourcesData }) => (
    <div className="bg-white dark:bg-box border border-slate-200 dark:border-white/5 rounded-2xl p-5 animate-fade-up-5 h-full flex flex-col transition-colors duration-300">
        <div className="mb-6">
            <h2 className="text-[15px] font-bold text-slate-900 dark:text-slate-50 tracking-wide">Traffic Sources</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Visitor acquisition</p>
        </div>

        <div className="flex items-center gap-6 flex-1">
            <div className="w-35 h-35 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={sourcesData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value" strokeWidth={0}>
                            {sourcesData.map((s, i) => <Cell key={i} fill={s.color} />)}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="flex-1 flex flex-col gap-3.5 w-full">
                {sourcesData.map((s) => (
                    <div key={s.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                        <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400 w-23.75 shrink-0 truncate">
                            {s.name}
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex-1">
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.value}%`, background: s.color }} />
                        </div>
                        <div className="text-[11px] font-bold text-slate-900 dark:text-slate-200 w-7 text-right shrink-0">
                            {s.value}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default TrafficChart;