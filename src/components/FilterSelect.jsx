// import { ChevronDown } from 'lucide-react';
// import React, { useState } from 'react'

// const FilterSelect = ({ label, value, options, onChange }) => {

//     const [open, setOpen] = useState(false);

//     const isActive = value !== options[0] && value !== 'All Prices' && value !== 'All';

//     return (
//         <div className="relative">
//             <button
//                 onClick={() => setOpen(p => !p)}
//                 className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[13px] font-medium transition-colors whitespace-nowrap
//                 ${isActive
//                         ? 'bg-accent-50 border-sky-200 text-sky-700 dark:bg-accent-500/10 dark:border-sky-500/20 dark:text-accent-400'
//                         : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-white/10 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
//                     }`}
//             >
//                 {label}: <span className="font-bold">{value}</span>
//                 <ChevronDown size={14} className="text-slate-400 dark:text-slate-500 ml-0.5" />
//             </button>
//             {open && (
//                 <>
//                     <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
//                     <div className="absolute left-0 top-11 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-1.5 min-w-40 shadow-lg dark:shadow-black/50">
//                         {options.map(opt => {
//                             const optLabel = typeof opt === 'object' ? opt.label : opt;
//                             const isOptActive = optLabel === value;
//                             return (
//                                 <button key={optLabel} onClick={() => { onChange(opt); setOpen(false); }}
//                                     className={`block w-full text-left px-3 py-2 rounded-lg text-[13px] transition-colors
//                                     ${isOptActive
//                                             ? 'bg-accent-50 text-sky-700 font-bold dark:bg-accent-500/10 dark:text-accent-400'
//                                             : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 font-medium'
//                                         }`}
//                                 >
//                                     {optLabel}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };


// export default FilterSelect 


import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react'

const FilterSelect = ({ label, value, options, onChange }) => {

    const [open, setOpen] = useState(false);

    const isActive = value !== options[0] && value !== 'All Prices' && value !== 'All';

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(p => !p)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[13px] font-medium transition-colors whitespace-nowrap
                ${isActive
                        ? 'bg-accent-50 border-sky-200 text-sky-700 dark:bg-accent-500/10 dark:border-sky-500/20 dark:text-accent-400'
                        : 'bg-base-50 border-base-200 text-base-700 dark:bg-base-800 dark:border-base-800/50 dark:text-base-200 hover:bg-base-100 dark:hover:bg-base-800/70'
                    }`}
            >
                {label}: <span className="font-bold">{value}</span>
                <ChevronDown size={14} className="text-base-400 dark:text-base-500 ml-0.5" />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 top-11 z-50 bg-white dark:bg-base-800 border border-base-200 dark:border-base-800/50 rounded-lg p-1.5 min-w-40 shadow-lg dark:shadow-black/50">
                        {options.map(opt => {
                            const optLabel = typeof opt === 'object' ? opt.label : opt;
                            const isOptActive = optLabel === value;
                            return (
                                <button key={optLabel} onClick={() => { onChange(opt); setOpen(false); }}
                                    className={`block w-full text-left px-3 py-2 mb-1! rounded-md text-[13px] transition-colors
                                    ${isOptActive
                                            ? 'bg-accent-50 text-sky-700 font-bold dark:bg-accent-500/10 dark:text-accent-400'
                                            : 'text-base-700 dark:text-base-200 hover:bg-slate-100 dark:hover:bg-base-700/50 font-medium'
                                        }`}
                                >
                                    {optLabel}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default FilterSelect