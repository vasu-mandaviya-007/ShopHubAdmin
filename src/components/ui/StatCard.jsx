const StatCard = ({ icon, label, value, sub, color }) => (
    <div className="bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-2xl p-4 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shrink-0 shadow-sm`}>
            {icon}
        </div>
        <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-base-400">{label}</p>
            <p className="text-xl font-extrabold text-base-900 dark:text-base-50 leading-tight">{value}</p>
            {sub && <p className="text-[11px] text-base-400 mt-0.5">{sub}</p>}
        </div>
    </div>
);

export default StatCard;