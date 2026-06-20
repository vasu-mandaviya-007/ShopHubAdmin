import React from "react";


const CustomerBadge = ({ status }) => {

    const styles = {
        active: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
        inactive: 'bg-slate-100  text-slate-500  border-slate-200  dark:bg-slate-700     dark:text-slate-400  dark:border-slate-600',
        blocked: 'bg-rose-50    text-rose-500   border-rose-100   dark:bg-rose-500/10   dark:text-rose-400   dark:border-rose-500/20',
    };

    const dots = {
        active: 'bg-emerald-500',
        inactive: 'bg-slate-400',
        blocked: 'bg-rose-500',
    };

    const s = status?.toLowerCase() || 'inactive';

    return (

        // <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${styles[s] || styles.inactive}`}>
        //     <span className={`w-1.5 h-1.5 rounded-full ${dots[s] || dots.inactive}`} />
        //     {status || 'Inactive'}
        // </span>
        <span className={`relative px-2.5 pl-5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${styles[s] || styles.inactive}`}>
            <span className={`absolute top-1/2 left-2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${dots[s] || dots.inactive}`} />
            {status || 'Inactive'}
        </span>

    );

};


export default CustomerBadge;