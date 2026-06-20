import React, { useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import { AlertCircle, LogOut, Monitor, Shield, Smartphone } from "lucide-react";
import { showToast } from "../../components/showToast";


const SecuritySection = ({ labelCls, inputCls }) => {

    const [revoking, setRevoking] = useState(false);

    // Fake data abhi UI ke liye, baad me API se aayega
    const activeSessions = [
        { id: 1, device: 'MacBook Pro - Chrome', location: 'Gujarat, India', time: 'Active Now', isCurrent: true, icon: Monitor },
        { id: 2, device: 'iPhone 14 - Safari', location: 'Gujarat, India', time: 'Last active 2 hours ago', isCurrent: false, icon: Smartphone },
    ];

    const loginHistory = [
        { id: 1, date: '17 Jun 2026, 10:30 AM', device: 'MacBook Pro', status: 'Success', ip: '192.168.1.45' },
        { id: 2, date: '16 Jun 2026, 08:15 PM', device: 'iPhone 14', status: 'Success', ip: '110.22.45.12' },
        { id: 3, date: '15 Jun 2026, 02:00 AM', device: 'Unknown Device', status: 'Failed OTP', ip: '45.33.12.99' },
    ];

    const handleRevoke = async (sessionId) => {
        setRevoking(sessionId);
        // Fake API Call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        showToast('Session revoked successfully. Device logged out.');
        setRevoking(false);
    };

    return (

        <SectionCard title="Security & Access" subtitle="Manage your active sessions and login history"
            icon={Shield} accent="from-violet-400 to-purple-600"
        >

            <div className="flex flex-col gap-8">

                {/* ── ACTIVE SESSIONS ── */}
                <div>

                    <h3 className="text-[13px] font-black text-base-900 dark:text-base-50 mb-4 flex items-center gap-2">
                        <Monitor size={16} className="text-violet-500" />
                        Where You're Logged In
                    </h3>

                    <div className="flex flex-col gap-3">

                        {activeSessions.map((session) => (

                            <div key={session.id} className="flex items-center justify-between p-4 rounded-2xl bg-base-50 dark:bg-base-800/50 border border-base-100 dark:border-base-800 transition-all hover:border-violet-200 dark:hover:border-violet-500/30">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${session.isCurrent ? 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400' : 'bg-base-200 text-base-500 dark:bg-base-700 dark:text-base-400'}`}>
                                        <session.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-base-900 dark:text-base-100 flex items-center gap-2">
                                            {session.device}
                                            {session.isCurrent && <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] uppercase tracking-wider font-black">Current</span>}
                                        </p>
                                        <p className="text-[11px] text-base-500 dark:text-base-400 mt-0.5">{session.location} • {session.time}</p>
                                    </div>
                                </div>
                                {!session.isCurrent && (
                                    <button
                                        onClick={() => handleRevoke(session.id)}
                                        disabled={revoking === session.id}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <LogOut size={14} /> {revoking === session.id ? 'Revoking...' : 'Revoke'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── LOGIN HISTORY ── */}
                <div className="pt-6 border-t border-base-100 dark:border-base-800">

                    <h3 className="text-[13px] font-black text-base-900 dark:text-base-50 mb-4 flex items-center gap-2">
                        <AlertCircle size={16} className="text-violet-500" />
                        Recent Login Activity
                    </h3>

                    <div className="overflow-hidden rounded-2xl border border-base-100 dark:border-base-800">

                        <table className="w-full text-left border-collapse">

                            <thead>
                                <tr className="bg-base-50 dark:bg-base-800/50 border-b border-base-100 dark:border-base-800 text-[11px] uppercase tracking-widest text-base-400">
                                    <th className="px-4 py-3 font-bold">Date & Time</th>
                                    <th className="px-4 py-3 font-bold">Device / IP</th>
                                    <th className="px-4 py-3 font-bold text-right">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loginHistory.map((log) => (
                                    <tr key={log.id} className="border-b border-base-50 dark:border-base-800/50 last:border-0 text-[12px]">
                                        <td className="px-4 py-3 font-medium text-base-700 dark:text-base-300">{log.date}</td>
                                        <td className="px-4 py-3 text-base-500">{log.device} ({log.ip})</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`font-bold ${log.status === 'Success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </SectionCard>
    );
};

export default SecuritySection;
