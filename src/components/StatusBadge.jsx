// import React from 'react'

// const StatusBadge = ({ status }) => {

//     const styleMap = {
//         'In Stock': 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400',
//         'Low Stock': 'bg-accent-100 text-sky-700 dark:bg-accent-500/10 dark:text-accent-400',
//         'Out of Stock': 'bg-slate-200 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400',
//     };

//     const sClass = styleMap[status] || styleMap['In Stock'];

//     return (
//         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${sClass}`}>
//             <span className="w-1.5 h-1.5 rounded-full bg-current" />
//             {status}
//         </span>
//     );
    
// };

// export default StatusBadge



import React from 'react'

const StatusBadge = ({ status,className="",value=0 }) => {

    const styleMap = {
        'In Stock': 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400',
        'Low Stock': 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
        'Out of Stock': 'bg-slate-200 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400',
    };

    const sClass = styleMap[status] || styleMap['In Stock'];

    return (
        <span className={`${className} inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${sClass}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {status}
            {value !== 0 && ` (${value})` }
        </span>
    );
    
};

export default StatusBadge