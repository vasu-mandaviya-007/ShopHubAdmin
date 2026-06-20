import toast from 'react-hot-toast';
import { CheckCircle2, AlertCircle, Lock, X } from 'lucide-react';

export const showToast = (message, type = 'success') => {
    // Agar message me "Demo Mode" hai toh automatic usko lock wala UI assign ho jayega
    const isDemo = message.includes("Demo Mode");
    const actualType = isDemo ? 'demo' : type;

    // Theme Configuration
    const config = {
        success: {
            icon: <CheckCircle2 size={18} className="text-emerald-500" />,
            bg: 'bg-emerald-50 dark:bg-emerald-500/10',
            accent: 'bg-emerald-500',
            title: 'text-emerald-800 dark:text-emerald-400',
            titleText: 'Success'
        },
        error: {
            icon: <AlertCircle size={18} className="text-rose-500" />,
            bg: 'bg-rose-50 dark:bg-rose-500/10',
            accent: 'bg-rose-500',
            title: 'text-rose-800 dark:text-rose-400',
            titleText: 'Error'
        },
        demo: {
            icon: <Lock size={18} className="text-amber-500" />,
            bg: 'bg-amber-50 dark:bg-amber-500/10',
            accent: 'bg-amber-500',
            title: 'text-amber-800 dark:text-amber-400',
            titleText: 'Access Restricted'
        }
    }[actualType];

    toast.custom((t) => (
        // <div
        //     className={`${t.visible ? 'animate-enter scale-100 opacity-100' : 'animate-leave scale-95 opacity-0'
        //         } max-w-sm w-full bg-white dark:bg-base-900 shadow-2xl shadow-black/10 dark:shadow-black/40 rounded-2xl pointer-events-auto flex border border-base-100 dark:border-base-800 overflow-hidden transform transition-all duration-300`}
        // >
        <div
            className={`${t.visible ? 'animate-bounce-in' : 'animate-fade-out'
                } max-w-sm w-full bg-white dark:bg-base-900 shadow-2xl shadow-black/10 dark:shadow-black/40 rounded-xl pointer-events-auto flex border border-base-100 dark:border-base-800 overflow-hidden`}
        >

            {/* Sleek Side Accent Line */}
            <div className={`w-1.5 ${config.accent} shrink-0`} />

            <div className="flex-1 w-0 p-4">
                <div className="flex items-start gap-3.5"> 
                    {/* Icon Container */}
                    <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${config.bg}`}>
                        {config.icon}
                    </div>
                    {/* Text Container */}
                    <div className="flex-1 pt-0.5">
                        <p className={`text-[13px] font-bold tracking-wide ${config.title}`}>
                            {config.titleText}
                        </p>
                        <p className="mt-1 text-[12px] font-medium text-base-500 dark:text-base-400 leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>
            </div>

            {/* Close Button Area */}
            <div className="flex border-l border-base-100 dark:border-base-800">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-2xl px-4 flex items-center justify-center text-base-400 hover:text-base-600 dark:hover:text-base-200 transition-colors focus:outline-none hover:bg-base-50 dark:hover:bg-base-800/50"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    ));
};