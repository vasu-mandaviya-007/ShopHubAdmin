
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecentOrders = ({ ordersData }) => {

    const getBadgeStyle = (status) => {

        const lowerStatus = status.toLowerCase();

        switch (lowerStatus) {
            case 'delivered': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400';
            case 'pending': return 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400';
            case 'shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
            case 'cancelled': return 'bg-slate-200 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400';
            case 'returned': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400';
            default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
        }

    };

    return (

        <div className="bg-white dark:bg-box border border-slate-200 dark:border-white/5 rounded-2xl p-5 animate-fade-up-6 transition-colors duration-300">
            
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-[15px] font-bold text-slate-900 dark:text-slate-50 tracking-wide">Recent Orders</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Latest transactions</p>
                </div>
                <Link to="/admin/orders" className="text-xs font-bold text-accent-600 bg-accent-50 hover:bg-accent-100 dark:text-accent-400 dark:bg-accent-500/10 dark:hover:bg-accent-500/20 transition-colors px-3 py-2 rounded-lg flex items-center gap-1.5">
                    View All <ExternalLink size={12} />
                </Link>
            </div>

            <div className="overflow-x-auto">

                <table className="w-full text-left border-collapse min-w-150">

                    <thead>
                        <tr>
                            <th className="pb-3 px-3 text-[10px] font-bold tracking-widest uppercase text-slate-500 border-b border-slate-200 dark:border-white/5">Order ID</th>
                            <th className="pb-3 px-3 text-[10px] font-bold tracking-widest uppercase text-slate-500 border-b border-slate-200 dark:border-white/5">Customer</th>
                            <th className="pb-3 px-3 text-[10px] font-bold tracking-widest uppercase text-slate-500 border-b border-slate-200 dark:border-white/5">Product</th>
                            <th className="pb-3 px-3 text-[10px] font-bold tracking-widest uppercase text-slate-500 border-b border-slate-200 dark:border-white/5">Amount</th>
                            <th className="pb-3 px-3 text-[10px] font-bold tracking-widest uppercase text-slate-500 border-b border-slate-200 dark:border-white/5">Status</th>
                            <th className="pb-3 px-3 text-[10px] font-bold tracking-widest uppercase text-slate-500 border-b border-slate-200 dark:border-white/5">Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        {ordersData.map((o) => (

                            <tr key={o.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="py-3.5 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-white/5 group-last:border-0">
                                    {o.id}
                                </td>
                                <td className="py-3.5 px-3 text-[13px] font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-white/5 group-last:border-0">
                                    {o.customer}
                                </td>
                                <td className="py-3.5 px-3 text-[13px] font-medium text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-white/5 group-last:border-0">
                                    {o.product}
                                </td>
                                <td className="py-3.5 px-3 text-[13px] font-bold text-slate-900 dark:text-slate-50 border-b border-slate-100 dark:border-white/5 group-last:border-0">
                                    {o.amount}
                                </td>
                                <td className="py-3.5 px-3 border-b border-slate-100 dark:border-white/5 group-last:border-0">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getBadgeStyle(o.status)}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                        {o.status}
                                    </span>
                                </td>
                                <td className="py-3.5 px-3 text-xs font-medium text-slate-500 border-b border-slate-100 dark:border-white/5 group-last:border-0">
                                    {o.date}
                                </td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );
    
};

export default RecentOrders;


