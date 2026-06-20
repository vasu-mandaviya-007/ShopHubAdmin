
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingBag, Users, Package,
    BarChart3, Settings, User, Bell, Search, Menu, LogOut,
    Percent, Tag, Sun, Moon
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import useAccent from '../config/useAccent';
import AdminHeader from '../components/Adminheader';
import { updateAppearance } from '../apis/adminApi';

const NAV = [
    {
        group: 'Main',
        items: [
            { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard', badge: null },
            { icon: ShoppingBag, label: 'Orders', to: '/admin/orders', badge: '12' },
            { icon: Package, label: 'Products', to: '/admin/products', badge: null },
            { icon: Users, label: 'Customers', to: '/admin/customers', badge: null },
        ],
    },
    {
        group: 'System',
        items: [
            { icon: Settings, label: 'Settings', to: '/admin/settings', badge: null },
            // { icon: User, label: 'Profile', to: '/admin/profile', badge: null },
        ],
    },
];

const AdminLayout = () => {

    // useAccent();

    const [collapsed, setCollapsed] = useState(window.innerWidth < 1024);

    // Initial state ab direct DOM se aayegi kyunki index.jsx ne already set kar di hai
    // const [isDarkMode, setIsDarkMode] = useState(
    //     document.documentElement.classList.contains('dark')
    // );

    // Theme Toggle Logic
    // const toggleTheme = () => {
    //     setIsDarkMode(prev => {
    //         const nextMode = !prev;
    //         if (nextMode) {
    //             document.documentElement.classList.add('dark');
    //             localStorage.setItem('theme', 'dark');
    //         } else {
    //             document.documentElement.classList.remove('dark');
    //             localStorage.setItem('theme', 'light');
    //         }
    //         return nextMode;
    //     });
    // };

    // const toggleTheme = () => { 
    //     setIsDarkMode(prev => {
    //         const nextMode = !prev;
    //         const newTheme = nextMode ? 'dark' : 'light';

    //         if (nextMode) {
    //             document.documentElement.classList.add('dark');
    //             localStorage.setItem('theme', 'dark');
    //         } else {
    //             document.documentElement.classList.remove('dark');
    //             localStorage.setItem('theme', 'light');
    //         }

    //         // 🔥 NAYA CODE: Backend me bhi turant update bhej do!
    //         const currentAccent = localStorage.getItem('admin-accent') || 'sky';
    //         const currentCompact = localStorage.getItem('admin-compact') === 'true';

    //         updateAppearance({
    //             theme: newTheme,
    //             accent: currentAccent,
    //             compact: currentCompact
    //         }).catch(err => console.error("Theme sync failed", err));

    //         return nextMode;
    //     });
    // };

    return (
        <div className="flex min-h-screen bg-white text-main dark:bg-base-main dark:text-slate-50 font-sans overflow-hidden transition-colors duration-300">

            {/* Custom Scrollbar adapt to Light/Dark */}
            <style>{`
                ::-webkit-scrollbar { width: 5px; height: 5px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                .dark ::-webkit-scrollbar-thumb { background: #334155; }
                .dark ::-webkit-scrollbar-thumb:hover { background: #475569; }
            `}</style>

            <AdminSidebar NAV={NAV} collapsed={collapsed} />

            {/* Mobile Overlay */}
            {!collapsed && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setCollapsed(true)}
                />
            )}

            {/* ── Main Content Area ── */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">

                <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />

                {/* Page Content Outlet */}
                <main className="flex-1 p-4 lg:p-6 overflow-y-scroll">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default AdminLayout;





