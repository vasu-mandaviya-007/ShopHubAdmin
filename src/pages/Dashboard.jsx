
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Users, TrendingUp, Eye, Loader2 } from 'lucide-react';
import StatCard from '../features/dashboard/components/StatCard';
import RevenueChart from '../features/dashboard/components/RevenueChart';
import OrdersChart from '../features/dashboard/components/OrdersChart';
import TrafficChart from '../features/dashboard/components/TrafficChart';
import RecentOrders from '../features/dashboard/components/RecentOrders';
import { getDashboardData } from '../features/dashboard/api/dashboardApi';

// Helper to map string icon names from backend to actual Lucide components
const iconMap = { TrendingUp, ShoppingBag, Users, Eye }; 

const Dashboard = () => {
    const [dashData, setDashData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const fetchDashboard = async () => {
            try {

                const data = await getDashboardData();

                if (data.success) {
                    setDashData(data.data);
                }
            } catch (err) {
                console.error("Dashboard error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return <div className="flex justify-center py-32"><Loader2 className="animate-spin text-accent-500 w-10 h-10" /></div>;
    }

    if (!dashData) return null;

    return (
        <div className="flex flex-col gap-6 w-full max-w-350 mx-auto">
            <style>{`
                @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-up-1 { animation: fadeUp 0.4s ease both 0.05s; }
                .animate-fade-up-2 { animation: fadeUp 0.4s ease both 0.1s; }
                .animate-fade-up-3 { animation: fadeUp 0.4s ease both 0.15s; }
                .animate-fade-up-4 { animation: fadeUp 0.4s ease both 0.2s; }
                .animate-fade-up-5 { animation: fadeUp 0.4s ease both 0.25s; }
                .animate-fade-up-6 { animation: fadeUp 0.4s ease both 0.3s; }
            `}</style>

            <div className="animate-fade-up-1">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight mb-1">
                    Dashboard
                </h1>
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                    Welcome back, Admin — here's what's happening today.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dashData.stats.map((s) => (
                    <StatCard
                        key={s.label}
                        {...s}
                        icon={iconMap[s.icon]}
                    />
                ))}
            </div>

            <RevenueChart dataObj={dashData.revenueData} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <OrdersChart chartData={dashData.categoryData} />
                <TrafficChart sourcesData={dashData.trafficData} />
            </div>

            <RecentOrders ordersData={dashData.recentOrders} />
        </div>
    );
};

export default Dashboard;





