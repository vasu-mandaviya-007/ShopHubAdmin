import { CheckCircle2, Clock, Package, RotateCcw, Truck, XCircle } from "lucide-react";
import React from "react";


export const STATUS_CONFIG = {
    Pending: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', icon: Clock, dot: 'bg-amber-400' },
    Processing: { color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-500/10', border: 'border-sky-200 dark:border-sky-500/20', icon: Package, dot: 'bg-sky-400' },
    Shipped: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20', icon: Truck, dot: 'bg-blue-400' },
    Delivered: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', icon: CheckCircle2, dot: 'bg-emerald-400' },
    Cancelled: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/20', icon: XCircle, dot: 'bg-red-400' },
    Returned: { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-500/10', border: 'border-slate-200 dark:border-slate-500/20', icon: RotateCcw, dot: 'bg-slate-400' },
};



export const OrderStatusBadge = ({ status }) => {
    const c = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
    return (
        <span className={`relative px-2.5 pl-5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${c.color} ${c.bg} ${c.border}`}>
            <span className={`absolute top-1/2 left-2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {status}
        </span>
    );
};
