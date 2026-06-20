// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';

// const PublicRoute = () => {
//     const token = localStorage.getItem('admin-token');

//     // Agar token pehle se hai, toh direct dashboard par bhej do
//     // Agar nahi hai, toh hi login page (Outlet) dikhao
//     return token ? <Navigate to="/admin/dashboard" replace /> : <Outlet />;
// };

// export default PublicRoute;



import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext'; // 👈 Context import kiya

const PublicRoute = () => {
    // 👈 Ab localStorage ki jagah global state use kar rahe hain
    const { isAuthenticated } = useAuthContext();

    // Agar user pehle se login hai, toh usko dashboard par bhej do
    // Agar nahi hai, toh hi login page (Outlet) dikhao
    return isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;