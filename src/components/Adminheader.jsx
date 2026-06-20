import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, Search, Sun, Moon, Bell, User, Settings,
    LogOut, ChevronDown, Store, HelpCircle, Command,
    Package, ShoppingBag, Users, X
} from 'lucide-react';
// import { AppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';
import { useAuthContext } from '../context/AuthContext';
import CommandPalette from './Commandpalette';

/* ─────────────────────────────────────────────────
   NOTIFICATION DROPDOWN
───────────────────────────────────────────────── */
const NotificationDropdown = ({ open, onClose }) => {
    const ref = useRef(null);
    useEffect(() => {
        const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, [onClose]);

    const notifications = [
        { icon: ShoppingBag, color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500', title: 'New order placed', desc: 'Order #ORD-8842 — ₹2,499', time: '2 min ago', unread: true },
        { icon: Package, color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-500', title: 'Low stock alert', desc: 'Blue Denim Jacket — 3 left', time: '1 hour ago', unread: true },
        { icon: Users, color: 'bg-accent-50 dark:bg-accent-500/10 text-accent-500', title: 'New customer signed up', desc: 'Riya Sharma joined', time: '3 hours ago', unread: false },
    ];
    const unreadCount = notifications.filter(n => n.unread).length;

    if (!open) return null;
    return (
        <div ref={ref}
            className="absolute right-0 top-[calc(100%+10px)] w-80 bg-white dark:bg-base-900 rounded-2xl shadow-2xl shadow-black/15 dark:shadow-black/40 border border-slate-100 dark:border-base-800 overflow-hidden z-50"
            style={{ animation: 'dropFade .18s ease-out' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-base-800">
                <div className="flex items-center gap-2">
                    <p className="font-extrabold text-slate-900 dark:text-base-50 text-[14px]">Notifications</p>
                    {unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center">{unreadCount}</span>
                    )}
                </div>
                <button className="text-[11px] font-bold text-accent-500 hover:underline">Mark all read</button>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
                {notifications.map((n, i) => (
                    <button key={i}
                        className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-base-800/60 transition-colors text-left border-b border-slate-50 dark:border-base-800/60 last:border-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                            <n.icon size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <p className="text-[13px] font-bold text-slate-800 dark:text-base-100 truncate">{n.title}</p>
                                {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />}
                            </div>
                            <p className="text-[12px] text-slate-400 truncate mt-0.5">{n.desc}</p>
                            <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-1">{n.time}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Footer */}
            <button className="w-full py-3 text-[12px] font-bold text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-500/10 transition-colors border-t border-slate-100 dark:border-base-800">
                View All Notifications
            </button>
        </div>
    );
};

/* ─────────────────────────────────────────────────
   PROFILE DROPDOWN
───────────────────────────────────────────────── */
const ProfileDropdown = ({ open, onClose, admin, onLogout }) => {
    const ref = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, [onClose]);

    const initials = admin?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'A';

    const items = [
        { icon: User, label: 'My Profile', sub: 'View and edit profile', action: () => navigate('/admin/settings?tab=profile') },
        { icon: Settings, label: 'Settings', sub: 'Preferences & account', action: () => navigate('/admin/settings') },
        { icon: Store, label: 'Store Settings', sub: 'Configure your store', action: () => navigate('/admin/settings?tab=store') },
        { icon: HelpCircle, label: 'Help & Support', sub: 'Docs and contact us', action: () => navigate('/admin/help') },
    ];

    if (!open) return null;
    return (
        <div ref={ref}
            className="absolute right-0 top-[calc(100%+10px)] w-72 bg-white dark:bg-base-900 rounded-2xl shadow-2xl shadow-black/15 dark:shadow-black/40 border border-slate-100 dark:border-base-800 overflow-hidden z-50"
            style={{ animation: 'dropFade .18s ease-out' }}>

            {/* User info header — accent gradient */}
            <div className="relative px-4 py-4 bg-accent-gradient overflow-hidden">
                <div className="absolute inset-0 opacity-[0.08]"
                    style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '16px 16px' }} />
                <div className="relative flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white text-[15px] font-black shrink-0 backdrop-blur-sm">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="text-white text-[13px] font-bold truncate">{admin?.name || 'Admin'}</p>
                        <p className="text-white/70 text-[11px] truncate">{admin?.email || 'admin@store.com'}</p>
                    </div>
                </div>
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-widest border border-white/20">
                    Admin
                </span>
            </div>

            {/* Menu items */}
            <div className="py-1.5">
                {items.map(({ icon: Icon, label, sub, action }) => (
                    <button key={label} onClick={() => { action(); onClose(); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-base-800 transition-colors text-left group">
                        <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-base-800 group-hover:bg-accent-50 dark:group-hover:bg-accent-500/10 flex items-center justify-center shrink-0 transition-colors">
                            <Icon size={14} className="text-slate-400 group-hover:text-accent-500 transition-colors" />
                        </span>
                        <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-slate-700 dark:text-base-200">{label}</p>
                            <p className="text-[10px] text-slate-400 truncate">{sub}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Logout */}
            <div className="px-3 pb-3 pt-1 border-t border-slate-100 dark:border-base-800">
                <button onClick={() => { onLogout(); onClose(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                    <span className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0">
                        <LogOut size={14} className="text-rose-400" />
                    </span>
                    Sign Out
                </button>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────
   MAIN HEADER
───────────────────────────────────────────────── */
const AdminHeader = ({ collapsed, setCollapsed }) => {

    const navigate = useNavigate();
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [search, setSearch] = useState('');

    // const {isDarkMode, toggleTheme} = useContext(AppContext);
    const { isDarkMode, toggleTheme, } = useThemeContext();

    const { admin, initials, logout } = useAuthContext();
    const [paletteOpen, setPaletteOpen] = useState(false);


    // const admin = (() => {
    //     try { return JSON.parse(localStorage.getItem('admin-user') || '{}'); } catch { return {}; }
    // })();

    // const initials = admin?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'A';

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Check for Ctrl+K (Windows) or Cmd+K (Mac)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault(); // Browser ka default search bar rukne ke liye
                setPaletteOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <header className="h-15 bg-white dark:bg-base-950 border-b border-slate-200 dark:border-base-800 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30 shrink-0 transition-colors duration-300">

            {/* Toggle Button */}
            <button onClick={() => setCollapsed(p => !p)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50 transition-colors shrink-0">
                <Menu size={18} />
            </button>

            {/* Search Bar */}
            {/* <div className="flex-1 max-w-90 relative hidden sm:block">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search orders, products, customers…"
                    className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-xl py-2 pr-16 pl-10 text-[13px] text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus-accent transition-all"
                />
                {search ? (
                    <button onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={14} />
                    </button>
                ) : (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white dark:bg-base-800 border border-slate-200 dark:border-base-700 text-[10px] font-bold text-slate-400">
                        <Command size={9} />K
                    </span>
                )}
            </div> */}


            <button
                onClick={() => setPaletteOpen(true)}
                className="flex-1 max-w-90 relative hidden sm:flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-xl py-2 pr-3 pl-3.5 text-left hover:border-accent-300 dark:hover:border-accent-500/30 transition-all group"
            >
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-accent-500 transition-colors shrink-0" />
                <span className="flex-1 text-[13px] text-slate-400 dark:text-slate-500">
                    Search orders, products, customers…
                </span>
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white dark:bg-base-800 border border-slate-200 dark:border-base-700 text-[10px] font-bold text-slate-400 shrink-0">
                    <Command size={9} />K
                </span>
            </button>

            {/* Mobile search trigger — icon only */}
            <button
                onClick={() => setPaletteOpen(true)}
                className="sm:hidden w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
                <Search size={16} />
            </button>

            {/* Topbar Actions */}
            <div className="ml-auto! flex items-center gap-2.5">

                {/* Theme Toggle Button */}
                <button onClick={toggleTheme}
                    className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50 transition-colors"
                    aria-label="Toggle Dark Mode">
                    {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors relative
                            ${notifOpen
                                ? 'bg-accent-50 dark:bg-accent-500/10 border-accent-200 dark:border-accent-500/20 text-accent-500'
                                : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-white/5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50'}`}>
                        <Bell size={16} />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-accent-500 border border-white dark:border-slate-900" />
                    </button>
                    <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-200 dark:bg-base-800 mx-0.5 hidden sm:block" />

                {/* User Avatar + dropdown */}
                <div className="relative">
                    <button onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
                        className={`flex items-center gap-2 pl-1 pr-1 sm:pr-2.5 py-1 rounded-xl border transition-all duration-200
                            ${profileOpen
                                ? 'border-accent-300 dark:border-accent-500/40 bg-accent-50/50 dark:bg-accent-500/5'
                                : 'border-transparent hover:bg-slate-50 dark:hover:bg-base-800/60'}`}>
                        <div className="w-9 h-9 rounded-xl bg-accent-gradient flex items-center justify-center font-bold text-[13px] text-white cursor-pointer shrink-0 shadow-accent">
                            {initials}
                        </div>
                        <div className="hidden sm:flex flex-col items-start leading-none">
                            <span className="text-[12px] font-bold text-slate-800 dark:text-base-100 max-w-25 truncate">
                                {admin?.name?.split(' ')[0] || 'Admin'}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5">Administrator</span>
                        </div>
                        <ChevronDown size={13} className={`text-slate-400 hidden sm:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <ProfileDropdown open={profileOpen} onClose={() => setProfileOpen(false)} admin={admin} onLogout={handleLogout} />
                </div>
            </div>

            <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

            <style>{`
                @keyframes dropFade {
                    from { opacity: 0; transform: translateY(-6px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }
            `}</style>
        </header>
    );
};

export default AdminHeader;