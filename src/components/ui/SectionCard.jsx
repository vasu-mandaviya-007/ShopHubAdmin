import React from "react";


const SectionCard = ({ title, subtitle, icon: Icon, showEditBtn = true, accent = 'from-sky-400 to-blue-500', children, action }) => (
    <div className="bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-100 dark:border-base-800">
            <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-linear-to-br ${accent} flex items-center justify-center shadow-sm`}>
                    <Icon size={16} className="text-white" />
                </div>
                <div>
                    <p className="font-extrabold text-base-900 dark:text-base-50 text-[15px] leading-none">{title}</p>
                    {subtitle && <p className="text-[11px] text-base-400 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {action}
        </div>
        <div className="p-6">{children}</div>
    </div>
);


export default SectionCard;