// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../apis/adminApi';
import { showToast } from '../components/showToast';

// 1. Context Create Karo
const AuthContext = createContext();

// 2. Provider Component
export const AuthProvider = ({ children }) => {

    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (authToken) => {

        try {

            const data = await getProfile();

            if (data.success && data.admin) {
                setAdmin(data.admin);
                return true;
            }

            return false;

        } catch (error) {
            console.error("Profile fetch failed", error);
            // 🍞 TOAST: Backend down ho ya network issue ho
            showToast?.('Network error while syncing profile.', 'error');
            return false;
        }
    };

    // ─── INITIAL LOAD: Page Refresh hone par chalega ───
    useEffect(() => {
        const verifySession = async () => {
            const storedToken = localStorage.getItem('admin-token');

            if (!storedToken) {
                setLoading(false);
                return;
            }

            // Token state me daalo aur verify karo
            setToken(storedToken);
            const success = await fetchProfile(storedToken);

            if (!success) {
                // Token expire ho gaya ya galat hai
                localStorage.removeItem('admin-token');
                setToken(null);
                setAdmin(null);
                // 🍞 TOAST: Jab purana token expire ho jaye
                showToast?.('Session expired. Please log in again.', 'info');
            }
            setLoading(false);
        };

        verifySession();
    }, []);

    // ─── EXPORTED FUNCTIONS ───

    // Smart Login Function
    const login = async (tokenData, adminData) => {
        setToken(tokenData);
        localStorage.setItem('admin-token', tokenData);

        if (adminData) {
            setAdmin(adminData);
            // 🍞 TOAST: Direct login with data
            showToast?.(`Welcome back, ${adminData.name.split(' ')[0]}!`, 'success');
        } else {
            const success = await fetchProfile(tokenData);
            if (success) {
                // 🍞 TOAST: Login successful after fetching /me
                showToast?.('Login successful!', 'success');
            }
        }
    };

    const logout = () => {
        setToken(null);
        setAdmin(null);
        localStorage.removeItem('admin-token');
        // 🍞 TOAST: Manual logout
        showToast?.('Logged out successfully.', 'info');
    };



    // Profile Update Function (Jab admin profile details change kare)
    const updateAdminDetails = (updatedAdminData) => {
        setAdmin(prev => {
            const nextData = { ...prev, ...updatedAdminData };
            localStorage.setItem('admin-user', JSON.stringify(nextData));
            return nextData;
        });
    };

    // Derived State: Initials calculation logic ko yahan centralize kar diya
    const initials = admin?.name
        ? admin.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        : 'A';

    const value = {
        admin,
        token,
        loading,
        isAuthenticated: !!token,
        initials,
        login,
        logout,
        updateAdminDetails
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Custom Hook to use Auth Context
export const useAuthContext = () => {
    return useContext(AuthContext);
};