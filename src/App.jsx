

// import React from 'react';
// import './App.css';
// import { Routes, Route, Navigate } from 'react-router-dom';

// // Auth & Protected Route
// import AdminAuth from './pages/AdminAuth'; // Tumhara OTP wala login page
// import ProtectedRoute from './routes/ProtectedRoute'; // Jo abhi banaya
// import PublicRoute from './routes/PublicRoute'; // Jo abhi banaya

// // Layout & Pages
// import AdminLayout from './pages/AdminLayout';
// import Dashboard from './pages/Dashboard';
// import ProductsList from './pages/ProductList';
// import ProductsList2 from './pages/ProductList2';
// import ProductsList3 from './pages/ProductList3';
// import OrdersList from './pages/OrdersList';
// import OrdersList2 from './pages/OrdersList2';
// import CustomersList from './pages/CustomersList';
// import AdminProfile from './pages/AdminProfile';
// import AdminSettings from './pages/AdminSettings';

// const App = () => {
//      return (
//           <Routes>
//                {/* ── 1. PUBLIC ROUTE (Login) ── */}
//                {/* Is route par koi bhi ja sakta hai */} 
//                <Route element={<PublicRoute />}>
//                     <Route path="/admin/login" element={<AdminAuth />} />
//                </Route>

//                {/* ── 2. PROTECTED ROUTES (Admin Only) ── */}
//                {/* ProtectedRoute check karega token hai ya nahi */}
//                <Route path="/admin" element={<ProtectedRoute />}>

//                     {/* Agar token hai, toh AdminLayout render hoga */}
//                     <Route element={<AdminLayout />}>
//                          {/* Default route redirect to dashboard */}
//                          {/* <Route index element={<Dashboard />} /> */}
//                          <Route index element={<Navigate to="dashboard" replace />} />

//                          <Route path="dashboard" element={<Dashboard />} />

//                          <Route path="orders" element={<OrdersList />} />
//                          <Route path="orders2" element={<OrdersList2 />} />

//                          <Route path="products" element={<ProductsList />} />
//                          <Route path="products2" element={<ProductsList2 />} />
//                          <Route path="products3" element={<ProductsList3 />} />

//                          <Route path="customers" element={<CustomersList />} />
//                          {/* <Route path="profile" element={<AdminProfile />} /> */}
//                          <Route path="settings" element={<AdminSettings />} /> 
//                          {/* add more admin routes here later */}
//                     </Route>

//                </Route>

//                {/* Agar koi ajeeb URL daale toh usko login pe bhej do */}
//                <Route path="*" element={<Navigate to="/admin/login" replace />} />
//           </Routes>
//      );
// }

// export default App;







import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; // 👈 Loader import kiya
import { useAuthContext } from './context/AuthContext'; // 👈 AuthContext import kiya

// Auth & Protected Route
import AdminAuth from './pages/AdminAuth';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

// Layout & Pages
import AdminLayout from './pages/AdminLayout';
import Dashboard from './pages/Dashboard';
import ProductsList from './pages/ProductList';
import ProductsList2 from './pages/ProductList2';
import ProductsList3 from './pages/ProductList3';
import OrdersList from './pages/OrdersList';
import OrdersList2 from './pages/OrdersList2';
import CustomersList from './pages/CustomersList';
import AdminProfile from './pages/AdminProfile';
import AdminSettings from './pages/AdminSettings';

const App = () => {
     // 1. Context se loading state nikal lo
     const { loading } = useAuthContext();

     // 🌟 GLOBAL AUTH LOADER 🌟
     // Jab tak backend se /me API verify ho rahi hai, user ko ye screen dikhegi.
     // Isse routing glitch aur unwanted redirects nahi honge.
     if (loading) {
          return (
               <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-base-950 transition-colors duration-300">
                    <div className="relative flex flex-col items-center justify-center gap-4">
                         <Loader2 className="animate-spin text-accent-500" size={38} strokeWidth={2.5} />
                         <div className="flex flex-col items-center">
                              <p className="text-slate-800 dark:text-slate-100 text-[15px] font-extrabold tracking-tight">
                                   Shopix Admin
                              </p>
                              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mt-1 animate-pulse">
                                   Securing Session...
                              </p>
                         </div>
                    </div>
               </div>
          ); 
     }

     return (
          <Routes>
               {/* ── 1. PUBLIC ROUTE (Login) ── */}
               {/* Is route par koi bhi ja sakta hai */}
               <Route element={<PublicRoute />}>
                    <Route path="/admin/login" element={<AdminAuth />} />
               </Route>

               {/* ── 2. PROTECTED ROUTES (Admin Only) ── */}
               {/* ProtectedRoute check karega token hai ya nahi */}
               <Route path="/admin" element={<ProtectedRoute />}>

                    {/* Agar token hai, toh AdminLayout render hoga */}
                    <Route element={<AdminLayout />}>
                         {/* Default route redirect to dashboard */}
                         <Route index element={<Navigate to="dashboard" replace />} />

                         <Route path="dashboard" element={<Dashboard />} />

                         <Route path="orders" element={<OrdersList />} />
                         <Route path="orders2" element={<OrdersList2 />} />

                         <Route path="products" element={<ProductsList />} />
                         <Route path="products2" element={<ProductsList2 />} />
                         <Route path="products3" element={<ProductsList3 />} />

                         <Route path="customers" element={<CustomersList />} />
                         <Route path="settings" element={<AdminSettings />} />
                         {/* add more admin routes here later */}
                    </Route>

               </Route>

               {/* Agar koi ajeeb URL daale toh usko login pe bhej do */}
               <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
     );
}

export default App;


