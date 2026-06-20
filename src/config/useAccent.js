
import { useEffect } from 'react';
import { getAppearance } from '../apis/adminApi';


const ACCENT_CLASSES = ['theme-sky', 'theme-violet', 'theme-emerald', 'theme-rose', 'theme-amber', 'theme-indigo', 'theme-pink', 'theme-ocean', 'theme-sunset'];

export const applyAccent = (accent) => {
    const root = document.documentElement;
    // Remove all existing accent classes
    root.classList.remove(...ACCENT_CLASSES);
    // Add the new one
    if (accent && accent !== 'sky') {
        root.classList.add(`theme-${accent}`);
    }
    // 'sky' is the default (:root), so no class needed
    localStorage.setItem('admin-accent', accent);
};

export const applyTheme = (theme) => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
};

export const applyCompact = (compact) => {
    document.body.classList.toggle('compact-mode', compact);
    localStorage.setItem('admin-compact', String(compact));
};

// ── On app boot, restore saved preferences ──
// const useAccent = () => {
//     useEffect(() => {
//         const accent = localStorage.getItem('admin-accent') || 'sky';
//         const theme = localStorage.getItem('theme') || 'system';
//         const compact = localStorage.getItem('admin-compact') === 'true';

//         applyAccent(accent);
//         applyTheme(theme);
//         applyCompact(compact);

//         // Watch for system theme changes if 'system' is selected
//         const mq = window.matchMedia('(prefers-color-scheme: dark)');
//         const handler = () => {
//             if (localStorage.getItem('theme') === 'system') applyTheme('system');
//         };
//         mq.addEventListener('change', handler);
//         return () => mq.removeEventListener('change', handler);
//     }, []);
// };

const useAccent = () => {

    useEffect(() => {
        // 1. Instant load from local storage (Bina jhatke ke UI load hone ke liye)
        const localAccent = localStorage.getItem('admin-accent') || 'sky';
        const localTheme = localStorage.getItem('theme') || 'system';
        const localCompact = localStorage.getItem('admin-compact') === 'true';

        applyAccent(localAccent);
        applyTheme(localTheme);
        applyCompact(localCompact);

        // 2. 🔥 Background me DB se fetch karo aur Local Storage ko sync kar do
        const syncFromDB = async () => {
            try {
                const data = await getAppearance();
                if (data.success && data.appearance) {
                    const { theme: t, accent: a, compact: c } = data.appearance;
                    applyTheme(t);
                    applyAccent(a);
                    applyCompact(c);
                }
            } catch (err) {
                console.warn('DB Appearance sync failed', err);
            }
        };

        syncFromDB();

        // System theme watcher (waisa hi rahega)
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
            if (localStorage.getItem('theme') === 'system') applyTheme('system');
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    
};

export default useAccent;