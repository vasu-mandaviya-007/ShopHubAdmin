

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, delta, deltaLabel, color, delay = '' }) => {

    const isUp = delta >= 0;

    const theme = {
        sky: { bg: 'bg-accent-100 dark:bg-accent-500/10', text: 'text-accent-600 dark:text-accent-400', border: 'from-accent-400 to-accent-600' },
        blue: { bg: 'bg-blue-100 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'from-blue-400 to-blue-600' },
        indigo: { bg: 'bg-indigo-100 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'from-indigo-400 to-indigo-600' },
        teal: { bg: 'bg-teal-100 dark:bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400', border: 'from-teal-400 to-teal-600' },
    }[color] || { bg: 'bg-sky-100 dark:bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400', border: 'from-sky-400 to-blue-600' };

    const animationClass = delay ? delay : '';

    const [displayValue, setDisplayValue] = useState('0');

    useEffect(() => {
        const match = String(value).match(/^(\D*)(\d+(?:,\d+)*(?:\.\d+)?)(\D*)$/);

        if (!match) {
            setDisplayValue(value);
            return;
        }

        const prefix = match[1] || '';
        const numStr = match[2].replace(/,/g, ''); 
        const suffix = match[3] || '';
        const endValue = parseFloat(numStr);
        const isInteger = !numStr.includes('.');
        const decimalPlaces = isInteger ? 0 : (numStr.split('.')[1]?.length || 2);

        let startTimestamp = null;
        const duration = 1000; 

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = easeProgress * endValue;

            const formattedNumber = currentCount.toLocaleString('en-US', {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces
            });

            setDisplayValue(`${prefix}${formattedNumber}${suffix}`);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setDisplayValue(value);
            }
        };

        window.requestAnimationFrame(step);
    }, [value]);


    return (
        <div className={`bg-white dark:bg-box border border-slate-200 dark:border-white/5 rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-black/20 group ${animationClass}`}>
            <div className={`absolute top-0 left-0 w-full h-0.75 bg-linear-to-r ${theme.border} opacity-80 dark:opacity-70`}></div>
            <div className={`w-10 h-10 rounded-xl grid place-items-center mb-4 transition-colors ${theme.bg} ${theme.text}`}>
                {Icon && <Icon size={20} strokeWidth={2} />}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                {label}
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mb-3 tracking-tight">
                {displayValue}
            </div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${isUp
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400'
                }`}>
                {isUp ? <TrendingUp size={11} strokeWidth={2.5} /> : <TrendingDown size={11} strokeWidth={2.5} />}
                {Math.abs(delta)}% {deltaLabel}
            </div>
        </div>
    );
};

export default StatCard;