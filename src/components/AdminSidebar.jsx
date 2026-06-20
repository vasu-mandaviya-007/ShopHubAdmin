

import { LogOut } from 'lucide-react'
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'


const SidebarUserStrip = ({ collapsed, admin, onLogout, onClick }) => { 
    
    const name = admin?.name || 'Admin';
    const email = admin?.email || 'admin@shop.com';
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    const handleLogoutClick = (e) => {
        e.stopPropagation();      // don't trigger the strip's own onClick
        onLogout?.();
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } }}
            aria-label={`${name}, ${email}. Open account menu.`}
            className="group border-t border-slate-200 dark:border-base-800 p-3.5 flex items-center gap-2.5 overflow-hidden
                       hover:bg-slate-50 dark:hover:bg-slate-800/50 focus-visible:bg-slate-50 dark:focus-visible:bg-slate-800/50
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/40 focus-visible:ring-inset
                       transition-colors cursor-pointer"
        >
            {/* Avatar — accent gradient instead of flat grey, with online dot */}
            <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-accent-gradient text-white text-[12px] font-bold
                                 flex items-center justify-center shadow-accent ring-2 ring-white dark:ring-base-950">
                    {initials}
                </div>
                {/* Online status dot */}
                <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500
                               ring-2 ring-white dark:ring-base-950"
                />
            </div>

            {/* Name + email — collapses to width:0 when sidebar is collapsed */}
            <div
                className={`flex-1 min-w-0 overflow-hidden transition-all duration-300 ease-in-out
                    ${collapsed ? 'lg:opacity-0 lg:w-0 lg:ml-0' : 'opacity-100'}`}
            >
                <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-50 truncate">
                    {name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {email}
                </div>
            </div>

            {/* Logout — proper button, not a bare icon */}
            <button
                type="button"
                onClick={handleLogoutClick}
                aria-label="Sign out"
                title="Sign out"
                className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
                            text-slate-400 dark:text-slate-500
                            hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50
                            transition-colors duration-150
                            ${collapsed ? 'lg:hidden' : 'flex'}`}
            >
                <LogOut size={15} />
            </button>
        </div>
    );
};


const AdminSidebar = ({ NAV, collapsed }) => { 

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('admin-token');
        navigate('/admin/login');
    };

    return (

        <aside
            className={`fixed lg:sticky top-0 h-screen shrink-0 bg-white dark:bg-base-950 border-r border-slate-200 dark:border-base-800 flex flex-col transition-all duration-300 z-10
                ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-65'}`}
        >
            {/* Logo Section */}
            <div className="flex items-center gap-2.5 px-5 pt-6 pb-5 border-b border-slate-200 dark:border-base-800 whitespace-nowrap overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-accent-gradient shrink-0 grid place-items-center text-[13px] font-bold text-white shadow-[0_0_15px_rgba(56,189,248,0.25)]">
                    ⚡
                </div>
                <span className={`font-extrabold text-xl tracking-tight text-slate-900 dark:text-white transition-opacity duration-300 ${collapsed ? 'lg:opacity-0' : 'opacity-100'}`}>
                    ShopAdmin
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-0.5 p-2.5 overflow-y-auto">
                {NAV.map((section) => (
                    <div key={section.group}>
                        <div className={`text-[10px] font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 px-2.5 pt-4 pb-1.5 whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? 'lg:opacity-0 lg:h-0 lg:p-0' : 'opacity-100'}`}>
                            {section.group}
                        </div>

                        {section.items.map(({ icon: Icon, label, to, badge }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={to === '/admin'}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1! cursor-pointer transition-all text-[13.5px] font-medium whitespace-nowrap overflow-hidden relative group
                                        ${isActive
                                        ? 'bg-accent-50 text-accent-600 dark:bg-accent-500/15 dark:text-accent-400'
                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-base-800/90 dark:hover:text-slate-50'}`
                                }
                            >
                                <Icon className="w-4.5 h-4.5 shrink-0" strokeWidth={1.75} />
                                <span className={`transition-opacity duration-300 ${collapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}`}>
                                    {label}
                                </span>
                                {badge && !collapsed && (
                                    <span className="ml-auto bg-accent-500 text-white text-[10px] font-bold px-1.5 py-px rounded-full shrink-0">
                                        {badge}
                                    </span>
                                )}

                                {/* Desktop Tooltip for Mini Sidebar */}
                                {collapsed && (
                                    <div className="absolute left-14 bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-md hidden lg:group-hover:block z-50 whitespace-nowrap shadow-md border border-white/5">
                                        {label}
                                    </div>
                                )}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>


            <SidebarUserStrip
                collapsed={collapsed}
                // admin={{name,email}}              // { name, email } from localStorage
                onLogout={handleLogout}
                onClick={() => navigate('/admin/settings?tab=profile')}
            />

        </aside>
    )
}

export default AdminSidebar     