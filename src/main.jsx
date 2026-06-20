// import { StrictMode, useEffect, useMemo, useState } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter } from 'react-router-dom';


// // MUI Imports
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { Toaster } from 'react-hot-toast';

// /* ─────────────────────────────────────────────────
//    MUI THEME WRAPPER (Syncs with Tailwind)
// ───────────────────────────────────────────────── */
// const MuiThemeWrapper = ({ children }) => {
//   // Shuru me check karo ki kya dark mode pehle se on hai
//   const [isDark, setIsDark] = useState(
//     document.documentElement.classList.contains('dark')
//   );

//   useEffect(() => {
//     // Ye observer <html> tag ko dekhta rahega ki kab 'dark' class aati/jaati hai
//     const observer = new MutationObserver((mutations) => {
//       mutations.forEach((mutation) => {
//         if (mutation.attributeName === 'class') {
//           setIsDark(document.documentElement.classList.contains('dark'));
//         }
//       });
//     });

//     observer.observe(document.documentElement, { attributes: true });

//     // Cleanup
//     return () => observer.disconnect();
//   }, []);

//   // MUI Theme generate karo isDark state ke basis par
//   const muiTheme = useMemo(() => createTheme({
//     palette: {
//       mode: isDark ? 'dark' : 'light',
//       primary: {
//         main: '#3b82f6', // Tailwind blue-500 (Tum isko sky-500 #0ea5e9 bhi rakh sakte ho)
//       },
//     },
//     typography: {
//       fontFamily: 'inherit', // Taaki MUI tumhara default Tailwind font use kare
//     },
//     components: {
//       // Optional: Agar MUI ka default paper background hatana hai
//       MuiPaper: {
//         styleOverrides: {
//           root: {
//             backgroundImage: 'none',
//           }
//         }
//       }
//     }
//   }), [isDark]);

//   return (
//     <ThemeProvider theme={muiTheme}>
//       {children}
//     </ThemeProvider>
//   );
// };

// createRoot(document.getElementById('root')).render(
//   // <StrictMode>
//     <BrowserRouter>
//       <MuiThemeWrapper>
//         <Toaster/>
//         <App />
//       </MuiThemeWrapper>
//     </BrowserRouter>
//   // </StrictMode>,
// )





import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; // Loader icon import kar liya

// MUI Imports
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import AppContextProvider from './context/AppContext.jsx';
import { AppThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

/* ─────────────────────────────────────────────────
   MUI THEME WRAPPER & LOADING SCREEN
───────────────────────────────────────────────── */
const MuiThemeWrapper = ({ children }) => {
    const [isThemeReady, setIsThemeReady] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // 1. App start hote hi turant local storage aur system preference check karo
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

        setIsDark(initialDark);

        // 2. HTML tag par turant class lagao taaki Tailwind bhi ready ho jaye
        if (initialDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // 3. Thoda sa delay do taaki DOM update ho jaye aur FOUC na aaye
        // setTimeout(() => {
        // }, 1000);
        setIsThemeReady(true);

        // 4. Observer wahi rahega taaki AdminLayout se toggle hone par MUI update ho
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsDark(document.documentElement.classList.contains('dark'));
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });

        return () => observer.disconnect();
    }, []);

    const muiTheme = useMemo(() => createTheme({
        palette: {
            mode: isDark ? 'dark' : 'light',
            primary: { main: '#3b82f6' }, // Sky-500 color
        },
        typography: { fontFamily: 'inherit' },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: { backgroundImage: 'none' }
                }
            },
            MuiButton: {
                variants: [
                    {
                        // Yahan aap apne variant ka naam rakhein
                        props: { variant: 'dark' },
                        style: {
                            // Common Styles (Font, Border, Padding)
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '13px',
                            fontFamily: 'inherit',
                            padding: '6px 24px', // 'px: 3' ke equal

                            // Light Mode (Default) Styles: Black Button
                            backgroundColor: '#434343',
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#262626', // Light mode hover
                            },
                            boxShadow: "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",

                            '&:hover': {
                                boxShadow: "0px 2px 4px -1px rgba(0, 0, 0, 0.5), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
                            },

                            '&.Mui-disabled': {
                                backgroundColor: '#e5e7eb', // Light gray background
                                color: '#9ca3af', // Faded text color
                                boxShadow: 'none', // Disabled hone par shadow hata dein
                                cursor: 'not-allowed', // 🚫 Not allowed cursor
                            },

                            // Dark Mode Styles: White Button
                            // (Agar aap Tailwind ka 'dark' class use kar rahe hain)
                            '.dark &': {
                                backgroundColor: '#f8fafc',
                                color: '#374151',
                                '&:hover': {
                                    backgroundColor: '#e2e8f0', // Dark mode hover
                                    boxShadow: "0px 2px 4px -1px rgba(255, 255, 255, 0.2), 0px 4px 5px 0px rgba(255, 255, 255, 0.14), 0px 1px 10px 0px rgba(255, 255, 255, 0.12)",
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: '#374151', // Darker gray for dark mode background
                                    color: '#6b7280', // Faded text for dark mode
                                    boxShadow: 'none',
                                    cursor: 'not-allowed',
                                },
                            },


                        },
                    },
                    {
                        // Variant ka naam "primary" rakha gaya hai
                        props: { variant: 'primary' },
                        style: {
                            // Typography & Layout
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '13px',
                            fontFamily: 'inherit',
                            padding: '6px 24px', // px: 3 ke equivalent
                            color: '#ffffff', // Text color white

                            // Gradient Background
                            background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                            transition: 'all 0.3s ease',

                            // Hover effect (Shadow add/enhance karne ke liye)
                            '&:hover': {
                                boxShadow: '0 4px 14px rgba(14,165,233,0.4)', // Glowing shadow effect
                                // Note: Linear gradients par background color animate nahi hota, 
                                // isliye shadow se hover effect dena best hai.
                            },

                            // Disabled state style (Taki disabled hone par ajeeb na lage)
                            '&.Mui-disabled': {
                                background: '#e0e0e0',
                                color: '#9e9e9e',
                                boxShadow: 'none',
                            }
                        },
                    },
                ],
            },
        }
    }), [isDark]);

    // ── LOADING SCREEN ──
    // Jab tak theme apply nahi hoti, ye screen dikhegi aur baki App render hi nahi hoga
    if (!isThemeReady) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-white dark:bg-base-main transition-colors duration-300">
                <Loader2 className="animate-spin text-accent-500 mb-4" size={40} />
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse tracking-wide">
                    Loading Shopix Admin...
                </p>
            </div>
        );
    }

    return (
        <ThemeProvider theme={muiTheme}>
            {children}
        </ThemeProvider>
    );
};

createRoot(document.getElementById('root')).render(

    // <AppContextProvider>
    <AppThemeProvider>
        <AuthProvider>
            <BrowserRouter>
                <MuiThemeWrapper>
                    <Toaster />
                    <App />
                </MuiThemeWrapper>
            </BrowserRouter>
        </AuthProvider>
    </AppThemeProvider>
    // </AppContextProvider>

)