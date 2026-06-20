import { createContext, useState } from "react";
import useAccent from "../config/useAccent";
import { updateAppearance } from "../apis/adminApi";


export const AppContext = createContext(null);


const AppContextProvider = ({ children }) => {

    
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains('dark')
    );
    
    // useState(() => {
    //     useAccent();
    // }, [])


    const toggleTheme = () => {

        setIsDarkMode(prev => {

            const nextMode = !prev;
            const newTheme = nextMode ? 'dark' : 'light';

            if (nextMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }

            // 🔥 NAYA CODE: Backend me bhi turant update bhej do!
            const currentAccent = localStorage.getItem('admin-accent') || 'sky';
            const currentCompact = localStorage.getItem('admin-compact') === 'true';

            updateAppearance({
                theme: newTheme,
                accent: currentAccent,
                compact: currentCompact
            }).catch(err => console.error("Theme sync failed", err));

            return nextMode;
        });
    };




    const contextValue = {
        isDarkMode, setIsDarkMode,
        toggleTheme
    }


    return (

        <AppContext.Provider value={contextValue} >
            {children}
        </AppContext.Provider>

    )


}



export default AppContextProvider;