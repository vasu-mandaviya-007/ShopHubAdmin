// import { Edit2, Eye, MoreVertical, Trash2 } from 'lucide-react';
// import React, { useState } from 'react'

// const ActionMenu = ({ onEdit, onView, onDelete }) => {

//     const [open, setOpen] = useState(false);

//     return (
//         <div className="relative">
//             <button
//                 onClick={() => setOpen(p => !p)}
//                 className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
//             >
//                 <MoreVertical size={14} />
//             </button>
//             {open && (
//                 <>
//                     <div className="fixed inset-0 z-9" onClick={() => setOpen(false)} />
//                     <div className="absolute right-0 top-10 z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl p-1.5 min-w-35 shadow-lg dark:shadow-black/50">
//                         <button onClick={() => { onView?.(); setOpen(false); }} className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
//                             <Eye size={14} /> View
//                         </button>
//                         <button onClick={() => { onEdit?.(); setOpen(false); }} className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] font-medium text-accent-600 dark:text-accent-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
//                             <Edit2 size={14} /> Edit
//                         </button>
//                         <button onClick={() => { onDelete?.(); setOpen(false); }} className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
//                             <Trash2 size={14} /> Delete
//                         </button>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default ActionMenu

import { Edit2, Eye, MoreVertical, Trash2 } from 'lucide-react';
import React, { useState } from 'react'

const ActionMenu = ({ onEdit, onView, onDelete }) => {

    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(p => !p)}
                className="w-8 h-8 rounded-lg bg-base-100 dark:bg-base-800 border border-base-200 dark:border-base-800/50 flex items-center justify-center text-base-500 dark:text-base-400 hover:bg-base-200 dark:hover:bg-base-700 transition-colors"
            >
                <MoreVertical size={14} />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-9" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-10 z-10 bg-white dark:bg-base-800 border border-base-200 dark:border-base-800/50 rounded-lg p-1.5 min-w-35 shadow-lg dark:shadow-black/50">
                        <button onClick={() => { onView?.(); setOpen(false); }} className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-[13px] font-medium text-base-700 dark:text-base-200 hover:bg-base-100 dark:hover:bg-base-700/50 transition-colors">
                            <Eye size={14} /> View
                        </button>
                        <button onClick={() => { onEdit?.(); setOpen(false); }} className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-[13px] font-medium text-accent-600 dark:text-accent-400 hover:bg-base-100 dark:hover:bg-base-700/50 transition-colors">
                            <Edit2 size={14} /> Edit
                        </button>
                        <button onClick={() => { onDelete?.(); setOpen(false); }} className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-[13px] font-medium text-base-500 dark:text-base-400 hover:bg-base-100 dark:hover:bg-base-700/50 transition-colors">
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ActionMenu