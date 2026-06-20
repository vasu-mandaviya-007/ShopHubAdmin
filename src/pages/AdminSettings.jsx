
import React, { useState, useEffect, useRef } from 'react';

import {
    User, Lock, Bell, Globe, Palette, Shield,
    Save, Eye, EyeOff, AlertTriangle, Check,
    ChevronRight, Upload, Trash2, RefreshCw, X,
    Edit3,
    Loader2, 
    Smartphone, Monitor, AlertCircle, LogOut

} from 'lucide-react';


import { showToast } from '../components/showToast'; 
import { useSearchParams } from "react-router-dom";
import { clearCache, deleteAccount, exportData, getAppearance, getNotificationSettings, getProfile, getStoreSettings, updateAppearance, updateNotificationSettings, updateProfile, updateStoreSettings } from '../apis/adminApi';
import AppearanceSection from '../features/adminSettings/AppearanceSection';
import ProfileSection from '../features/adminSettings/ProfileSection';
import SecuritySection from '../features/adminSettings/SecuritySection';
import StoreSection from '../features/adminSettings/StoreSection';
import NotificationsSection from '../features/adminSettings/NotificationSection';
import DangerSection from '../features/adminSettings/DangerSection';
import ProfileSection2 from '../features/adminSettings/ProfileSection2';

/* ─────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────── */
// const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-base-200 dark:border-base-700 bg-white dark:bg-base-800 text-[13px] text-base-900 dark:text-base-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10 transition-all placeholder-base-300 dark:placeholder-base-600';

const inputCls = `
        w-full px-3.5 py-2.5 rounded-lg
        border border-base-200 dark:border-base-700
        bg-white dark:bg-base-800
        text-[13px] text-base-900 dark:text-base-50
        outline-none
        focus:ring-2 
        disabled:bg-base-50 dark:disabled:bg-base-800/60
        disabled:text-base-400 dark:disabled:text-base-500
        disabled:cursor-not-allowed
        transition-all placeholder-base-300 dark:placeholder-base-600
    `;

const labelCls = 'text-[11px] font-bold uppercase tracking-widest text-base-400 mb-1.5 block';


/* ─────────────────────────────────────────────────
   SIDEBAR NAV
───────────────────────────────────────────────── */
const SECTIONS = [
    { id: 'profile', label: 'Profile', icon: User, accent: 'from-sky-400 to-blue-500' },
    // { id: 'profile2', label: 'Profile2', icon: User, accent: 'from-sky-400 to-blue-500' },
    { id: 'security', label: 'Security', icon: Lock, accent: 'from-violet-400 to-purple-600' },
    { id: 'store', label: 'Store Settings', icon: Globe, accent: 'from-emerald-400 to-teal-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, accent: 'from-amber-400 to-orange-500' },
    { id: 'appearance', label: 'Appearance', icon: Palette, accent: 'from-rose-400 to-pink-500' },
    { id: 'danger', label: 'Danger Zone', icon: Shield, accent: 'from-rose-500 to-red-600' },
];


/* ─────────────────────────────────────────────────
   MAIN SETTINGS PAGE
───────────────────────────────────────────────── */
const AdminSettings = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    // 1. URL se tab ki value nikalo
    const urlTab = searchParams.get('tab');

    // 2. Validation: Check karo ki kya URL wala tab hamare SECTIONS me exist karta hai?
    const isValidTab = SECTIONS.some(section => section.id === urlTab);

    // 3. Agar valid hai toh wahi dikhao, warna default 'profile' par bhej do
    const activeSection = isValidTab ? urlTab : 'profile';

    useEffect(() => {
        // Agar URL me tab parameter nahi hai, ya phir koi galat tab daal diya hai
        if (!isValidTab) {
            // URL ko automatically update kar do bina browser history kharab kiye
            setSearchParams({ tab: 'profile' }, { replace: true });
        }
    }, [urlTab, isValidTab, setSearchParams]);


    const [toastMsg, setToastMsg] = useState({ msg: '', type: '' });
    // const toast = (msg, type = 'success') => setToastMsg({ msg, type });
    const toast = (msg, type = 'success') => showToast(msg, type);
    const clearToast = () => setToastMsg({ msg: '', type: '' });

    const handleTabChange = (id) => {
        setSearchParams({ tab: id });
    };

    const SECTION_COMPONENTS = {
        profile: <ProfileSection2 toast={toast} labelCls={labelCls} inputCls={inputCls} />,
        profile2: <ProfileSection toast={toast} labelCls={labelCls} inputCls={inputCls} />,
        security: <SecuritySection toast={toast} labelCls={labelCls} inputCls={inputCls} />,
        store: <StoreSection toast={toast} labelCls={labelCls} inputCls={inputCls} />,
        notifications: <NotificationsSection toast={toast} labelCls={labelCls} inputCls={inputCls} />,
        appearance: <AppearanceSection toast={toast} labelCls={labelCls} inputCls={inputCls} />,
        danger: <DangerSection toast={toast} labelCls={labelCls} inputCls={inputCls} />,
    };

    return (
        <div className="flex gap-6 w-full h-full mx-auto"> 
            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                .afu{animation:fadeUp .3s ease both}
            `}</style>

            {/* Toast */}
            {/* <Toast msg={toastMsg.msg} type={toastMsg.type} onDismiss={clearToast} /> */}

            {/* ── Left sidebar nav ── */}
            <div className="hidden lg:flex flex-col gap-1 w-52 shrink-0 sticky top-1 self-start">
                <p className="text-[10px] font-bold uppercase tracking-widest text-base-400 px-3 mb-2">Settings</p>
                {SECTIONS.map(({ id, label, icon: Icon, accent }) => (
                    <button key={id} onClick={() => handleTabChange(id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-left transition-all duration-150
                            ${activeSection === id
                                ? 'bg-white dark:bg-box text-base-900 dark:text-base-50 shadow-sm border border-base-200 dark:border-base-800'
                                : 'text-base-500 dark:text-base-400 hover:bg-white/60 dark:hover:bg-base-900/60 hover:text-base-800 border border-transparent dark:hover:text-base-200'}`}>
                        <div className={`w-6 h-6 rounded-lg bg-linear-to-br ${accent} flex items-center justify-center shrink-0`}>
                            <Icon size={12} className="text-white" />
                        </div>
                        {label}
                        {activeSection === id && <ChevronRight size={13} className="ml-auto text-base-400" />}
                    </button>
                ))}
            </div>

            {/* ── Mobile tab bar ── */}
            <div className="flex lg:hidden gap-1 flex-wrap mb-2 w-full">
                {SECTIONS.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => handleTabChange(id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all
                            ${activeSection === id
                                ? 'bg-base-900 dark:bg-base-50 text-white dark:text-base-900'
                                : 'bg-white dark:bg-base-900 text-base-500 border border-base-200 dark:border-base-800'}`}>
                        <Icon size={12} />
                        {label}
                    </button>
                ))}
            </div>

            {/* ── Content ── */}
            <div className="flex-1 min-w-0">
                <div key={activeSection} className="afu">
                    {SECTION_COMPONENTS[activeSection]}
                </div>
            </div>
        </div>
    );
};



export default AdminSettings;