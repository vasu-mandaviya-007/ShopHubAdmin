// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';

// const ProtectedRoute = () => {
//     // Check karo ki admin token exist karta hai ya nahi
//     const token = localStorage.getItem('admin-token');

//     // Agar token hai, toh Outlet (ander ke routes) render karo
//     // Agar nahi hai, toh direct /admin/login par bhej do
//     return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
// };

// export default ProtectedRoute;



import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext'; // 👈 Context import kiya

const ProtectedRoute = () => {
    // 👈 Global auth state
    const { isAuthenticated } = useAuthContext();

    // Agar token valid aur verified hai, toh Outlet (ander ke routes) render karo
    // Agar nahi hai, toh direct /admin/login par bhej do
    return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;