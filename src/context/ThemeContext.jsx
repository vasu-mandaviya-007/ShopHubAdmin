// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { getAppearance, updateAppearance } from '../apis/adminApi';
// import { showToast } from '../components/showToast';

// // 1. Context Create Karo
// const ThemeContext = createContext();

// // 2. Constants & Helpers (Jo pehle useAccent.js me the)
// const ACCENT_CLASSES = [
//     'theme-sky', 'theme-violet', 'theme-emerald', 'theme-rose',
//     'theme-amber', 'theme-indigo', 'theme-pink', 'theme-ocean', 'theme-sunset'
// ];

// // 3. Provider Component
// export const AppThemeProvider = ({ children }) => {

//     // Initial states seedha localStorage se lo taaki page load par jhatka (flash) na aaye
//     const [theme, setThemeState] = useState(() => localStorage.getItem('theme') || 'system');
//     const [accent, setAccentState] = useState(() => localStorage.getItem('admin-accent') || 'sky');
//     const [compact, setCompactState] = useState(() => localStorage.getItem('admin-compact') === 'true');
//     const [isDarkMode, setIsDarkMode] = useState(false);

//     // DOM Update Helpers (Internal Use)
//     const applyThemeToDOM = (t) => {
//         const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//         const isDark = t === 'dark' || (t === 'system' && prefersDark);
//         document.documentElement.classList.toggle('dark', isDark);
//         setIsDarkMode(isDark);
//         localStorage.setItem('theme', t);
//     };

//     const applyAccentToDOM = (a) => {
//         const root = document.documentElement;
//         root.classList.remove(...ACCENT_CLASSES);
//         if (a && a !== 'sky') root.classList.add(`theme-${a}`);
//         localStorage.setItem('admin-accent', a);
//     };

//     const applyCompactToDOM = (c) => {
//         document.body.classList.toggle('compact-mode', c);
//         localStorage.setItem('admin-compact', String(c));
//     };

//     // ─── INITIAL LOAD & DB SYNC ───
//     useEffect(() => {
//         // Initial DOM setup
//         applyThemeToDOM(theme);
//         applyAccentToDOM(accent);
//         applyCompactToDOM(compact);

//         // Fetch from DB in background
//         const syncFromDB = async () => {
//             try {
//                 const data = await getAppearance();
//                 if (data.success && data.appearance) {
//                     const { theme: dbTheme, accent: dbAccent, compact: dbCompact } = data.appearance;
//                     setThemeState(dbTheme);
//                     setAccentState(dbAccent);
//                     setCompactState(dbCompact);
//                 }
//             } catch (err) {
//                 console.warn('DB Appearance sync failed', err);
//             }
//         };
//         syncFromDB();

//         // Listen for system theme changes
//         const mq = window.matchMedia('(prefers-color-scheme: dark)');
//         const systemThemeHandler = () => {
//             if (localStorage.getItem('theme') === 'system') {
//                 applyThemeToDOM('system');
//             }
//         };
//         mq.addEventListener('change', systemThemeHandler);
//         return () => mq.removeEventListener('change', systemThemeHandler);
//     }, []);

//     // Jab bhi state change ho, DOM update karo
//     useEffect(() => { applyThemeToDOM(theme); }, [theme]);
//     useEffect(() => { applyAccentToDOM(accent); }, [accent]);
//     useEffect(() => { applyCompactToDOM(compact); }, [compact]);


//     // ─── EXPORTED ACTION FUNCTIONS ───

//     // Background me API call karne wala function
//     const saveToDatabase = async (newSettings) => {
//         try {
//             await updateAppearance({ theme, accent, compact, ...newSettings });
//         } catch (err) {
//             console.error("Theme DB sync failed", err);
//         }
//     };

//     const changeTheme = (newTheme) => {
//         setThemeState(newTheme);
//         saveToDatabase({ theme: newTheme });
//     };

//     const toggleTheme = () => {
//         const nextTheme = isDarkMode ? 'light' : 'dark';
//         setThemeState(nextTheme);
//         saveToDatabase({ theme: nextTheme });
//     };

//     const changeAccent = (newAccent) => {
//         setAccentState(newAccent);
//         saveToDatabase({ accent: newAccent });
//     };

//     const changeCompact = (isCompact) => {
//         setCompactState(isCompact);
//         saveToDatabase({ compact: isCompact });
//     };

//     // Values to provide
//     const value = {
//         theme, isDarkMode, changeTheme, toggleTheme,
//         accent, changeAccent,
//         compact, changeCompact
//     };

//     return (
//         <ThemeContext.Provider value={value}>
//             {children}
//         </ThemeContext.Provider>
//     );
// };

// // 4. Custom Hook (Isko hum baaki files me use karenge)
// export const useThemeContext = () => {
//     return useContext(ThemeContext);
// };



import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAppearance, updateAppearance } from '../apis/adminApi';
import { showToast } from '../components/showToast';

// 1. Context Create Karo
const ThemeContext = createContext();

// 2. Constants & Helpers 
const ACCENT_CLASSES = [
    'theme-sky', 'theme-violet', 'theme-emerald', 'theme-rose',
    'theme-amber', 'theme-indigo', 'theme-pink', 'theme-ocean', 'theme-sunset'
];

// 3. Provider Component
export const AppThemeProvider = ({ children }) => {

    // Initial states seedha localStorage se lo taaki page load par jhatka (flash) na aaye
    const [theme, setThemeState] = useState(() => localStorage.getItem('theme') || 'system');
    const [accent, setAccentState] = useState(() => localStorage.getItem('admin-accent') || 'sky');
    const [compact, setCompactState] = useState(() => localStorage.getItem('admin-compact') === 'true');
    const [isDarkMode, setIsDarkMode] = useState(false);

    // DOM Update Helpers (Internal Use)
    const applyThemeToDOM = (t) => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = t === 'dark' || (t === 'system' && prefersDark);
        document.documentElement.classList.toggle('dark', isDark);
        setIsDarkMode(isDark);
        localStorage.setItem('theme', t);
    };

    const applyAccentToDOM = (a) => {
        const root = document.documentElement;
        root.classList.remove(...ACCENT_CLASSES);
        if (a && a !== 'sky') root.classList.add(`theme-${a}`);
        localStorage.setItem('admin-accent', a);
    };

    const applyCompactToDOM = (c) => {
        document.body.classList.toggle('compact-mode', c);
        localStorage.setItem('admin-compact', String(c));
    };

    // ─── INITIAL LOAD & DB SYNC ───
    useEffect(() => {
        // Initial DOM setup
        applyThemeToDOM(theme);
        applyAccentToDOM(accent);
        applyCompactToDOM(compact);

        // Fetch from DB in background
        const syncFromDB = async () => {

            const token = localStorage.getItem('admin-token');
            if (!token) {
                return; // Agar token nahi hai, toh yahin se wapas mud jao, API call mat karo!
            }

            try {
                const data = await getAppearance();
                if (data.success && data.appearance) {
                    const { theme: dbTheme, accent: dbAccent, compact: dbCompact } = data.appearance;
                    setThemeState(dbTheme);
                    setAccentState(dbAccent);
                    setCompactState(dbCompact); 
                }
            } catch (err) {
                console.warn('DB Appearance sync failed', err);
            }
        };
        syncFromDB();

        // Listen for system theme changes
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const systemThemeHandler = () => {
            if (localStorage.getItem('theme') === 'system') {
                applyThemeToDOM('system');
            }
        };
        mq.addEventListener('change', systemThemeHandler);
        return () => mq.removeEventListener('change', systemThemeHandler);
    }, []);

    // Jab bhi state change ho, DOM update karo (Ye Live Preview dega)
    useEffect(() => { applyThemeToDOM(theme); }, [theme]);
    useEffect(() => { applyAccentToDOM(accent); }, [accent]);
    useEffect(() => { applyCompactToDOM(compact); }, [compact]);


    // ─── EXPORTED ACTION FUNCTIONS ───

    // ✅ Background me API call karne wala function (Ab ye success/error return karega)
    const saveToDatabase = async (newSettings) => {
        try {
            await updateAppearance({ theme, accent, compact, ...newSettings });
            return { success: true };
        } catch (err) {
            console.error("Theme DB sync failed", err);
            return { success: false, error: err };
        }
    };

    // ✅ Inme se saveToDatabase hata diya taaki sirf DOM/State update ho (Live preview ke liye)
    const changeTheme = (newTheme) => {
        setThemeState(newTheme);
    };

    const changeAccent = (newAccent) => {
        setAccentState(newAccent);
    };

    const changeCompact = (isCompact) => {
        setCompactState(isCompact);
    };

    // ✅ Header toggle ko instant save chahiye, isliye isme saveToDatabase rehne diya
    const toggleTheme = () => {
        const nextTheme = isDarkMode ? 'light' : 'dark';
        setThemeState(nextTheme);
        saveToDatabase({ theme: nextTheme });
    };

    // Values to provide
    const value = {
        theme, isDarkMode, changeTheme, toggleTheme,
        accent, changeAccent,
        compact, changeCompact,
        saveToDatabase // ✅ Ise export kiya taaki AppearanceSection ka button isey bula sake
    };

    return (
        <ThemeContext.Provider value={value}>
            {children} 
        </ThemeContext.Provider>
    );
};

// 4. Custom Hook 
export const useThemeContext = () => {
    return useContext(ThemeContext);
};