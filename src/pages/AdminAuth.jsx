import React, { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { sendOtp, verifyOtp } from '../apis/adminApi';

const AdminAuth = () => {

    const { login } = useAuthContext();

    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!email.trim() || !email.includes('@')) return setError('Valid email required.');

        setLoading(true); setError(''); setMessage('');

        try {
            // const res = await fetch('http://localhost:3001/', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email }),
            // });
            // const data = await res.json();

            const data = await sendOtp(email);

            if (data.success) {
                setMessage(data.message);
                setStep(2);
            } else {
                setError(data.error || 'Failed to send OTP.');
            }
        } catch (err) {
            setError('Network error. Is backend running?');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp.trim() || otp.length < 6) return setError('Enter 6-digit OTP.');

        setLoading(true); setError('');

        try {
            // const res = await fetch('http://localhost:3001/', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, otp }),
            // });
            // const data = await res.json();

            const data = await verifyOtp({ email, otp });

            if (data.success) {
                login(data.token, data.admin);
                navigate('/admin/dashboard'); // Route theek kiya
            } else {
                setError(data.error || 'Invalid OTP.');
            }
        } catch (err) {
            setError('Network error.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setLoading(true);
        try {
            // Direct verify route ko demo credentials bhej rahe hain
            // const res = await fetch('http://localhost:3001/admin/auth/verify-otp', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email: 'demo@shopix.com', otp: '123456' }),
            // });
            // const data = await res.json();

            const data = await verifyOtp({ email: 'demo@shopix.com', otp: '123456' })

            if (data.success) {
                login(data.token, data.admin);
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError('Network error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 relative overflow-hidden">
            <div className="absolute top-10 left-10 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />

            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 relative z-10 border border-slate-100 dark:border-slate-700/50">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-linear-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-accent">
                        <ShieldCheck size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Shopix Admin</h1>
                </div>

                {error && <div className="mb-5 px-4 py-3 bg-rose-50 text-rose-600 rounded-xl text-[13px] font-semibold text-center">{error}</div>}
                {message && step === 2 && <div className="mb-5 px-4 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-[13px] font-semibold text-center">{message}</div>}

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@shopix.com"
                                name='email'
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-[14px] outline-none focus:border-sky-400 font-medium"
                                autoFocus
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-linear-to-r from-accent-400 to-accent-600 text-white text-[14px] font-bold shadow-lg disabled:opacity-60">
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Send OTP <ArrowRight size={16} /></>}
                        </button>

                        {/* ── DEMO BUTTON ── */}
                        <div className="relative flex items-center py-2 mt-2">
                            <div className="grow border-t border-slate-200 dark:border-slate-700"></div>
                            <span className="shrink-0 px-4 text-[11px] font-bold tracking-widest uppercase text-slate-400">For Recruiters</span>
                            <div className="grow border-t border-slate-200 dark:border-slate-700"></div>
                        </div>

                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[13px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Try Demo Admin
                        </button>

                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="• • • • • •"
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-xl tracking-[0.5em] outline-none focus:border-sky-400 font-bold text-center"
                                autoFocus
                            />
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-linear-to-r from-emerald-400 to-teal-500 text-white text-[14px] font-bold shadow-lg disabled:opacity-60">
                            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify & Login'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminAuth;