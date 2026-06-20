import React, { useState } from "react";
import { clearCache, deleteAccount, exportData } from "../../apis/adminApi";
import SectionCard from "../../components/ui/SectionCard";
import { AlertTriangle, RefreshCw, Shield, Trash2, Upload } from "lucide-react";
import { showToast } from "../../components/showToast";


const DangerSection = ({  }) => {

    const [confirmText, setConfirmText] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [exportingData, setExportingData] = useState(false);
    const [clearingCache, setClearingCache] = useState(false);
    const CONFIRM_PHRASE = 'DELETE MY ACCOUNT';

    // ── 1. EXPORT DATA ──
    const handleExport = async () => {

        setExportingData(true);

        try {
            // Note: File download ke liye Axios me responseType: 'blob' zaroori hai
            const res = await exportData();

            // Blob ko download karne ka logic
            const blob = new Blob([res.data], { type: res.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `shopix-export-${Date.now()}.json`; // Ya .zip agar waisa setup hai
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            showToast('Data exported successfully!');
        } catch (err) {
            console.error("Export Error:", err);
            showToast('Failed to export data.', 'error');
        } finally {
            setExportingData(false);
        }
    };

    // ── 2. CLEAR CACHE ──
    const handleClearCache = async () => {

        setClearingCache(true);

        try {
            // const res = await api.post('/admin/clear-cache');
            const data = await clearCache();

            if (data.success) {
                showToast('Server cache cleared successfully!');
            } else {
                showToast(data.error || 'Failed to clear cache.', 'error');
            }
        } catch (err) {
            if (err.response?.data?.error) {
                showToast(err.response.data.error, 'error');
            } else {
                showToast('Network error.', 'error');
            }
        } finally {
            setClearingCache(false);
        }
    };

    // ── 3. DELETE ACCOUNT ──
    const handleDelete = async () => {

        if (confirmText !== CONFIRM_PHRASE) {
            showToast(`Type "${CONFIRM_PHRASE}" to confirm.`, 'error');
            return;
        }

        setDeleting(true);

        try {
            // const res = await api.delete('/admin/delete-account');
            const data = await deleteAccount();

            if (data.success) {
                showToast('Account deleted. Logging out…');

                // Thoda delay dekar localStorage clear aur redirect
                setTimeout(() => {
                    localStorage.removeItem('admin-token');
                    window.location.replace('/admin/login');
                }, 2000);
            } else {
                showToast(data.error || 'Delete failed.', 'error');
                setDeleting(false); // Sirf fail hone pe button wapas enable karna
            }
        } catch (err) {
            if (err.response?.data?.error) {
                showToast(err.response.data.error, 'error');
            } else {
                showToast('Delete failed due to network error.', 'error');
            }
            setDeleting(false);
        }
    };

    return (
        <SectionCard title="Danger Zone" subtitle="Irreversible actions — proceed with caution"
            icon={Shield} accent="from-rose-500 to-red-600">

            <div className="flex flex-col gap-4">

                {/* ── EXPORT DATA UI ── */}
                <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-base-50 dark:bg-base-800 border border-base-200 dark:border-base-700">
                    <div>
                        <p className="text-[13px] font-bold text-base-800 dark:text-base-100">Export All Data</p>
                        <p className="text-[11px] text-base-400 mt-0.5 max-w-50 sm:max-w-none">Download all store settings and configurations.</p>
                    </div>
                    <button onClick={handleExport} disabled={exportingData}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-base-200 dark:border-base-700 text-[12px] font-bold text-base-600 dark:text-base-300 hover:bg-base-100 dark:hover:bg-base-700 transition-all disabled:opacity-60 shrink-0">
                        {exportingData ? <RefreshCw size={13} className="animate-spin" /> : <Upload size={13} />}
                        Export
                    </button>
                </div>

                {/* ── CLEAR CACHE UI ── */}
                <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                    <div>
                        <p className="text-[13px] font-bold text-amber-800 dark:text-amber-300">Clear Cache</p>
                        <p className="text-[11px] text-amber-600 dark:text-amber-500 mt-0.5 max-w-50 sm:max-w-none">Reset server-side cache and temporary files.</p>
                    </div>
                    <button onClick={handleClearCache} disabled={clearingCache}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-300 dark:border-amber-500/30 text-[12px] font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all shrink-0">
                        <RefreshCw size={13} className={clearingCache ? "animate-spin" : ""} /> Clear
                    </button>
                </div>

                {/* ── DELETE ACCOUNT UI ── */}
                <div className="px-5 py-5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 mt-2">
                    <div className="flex items-start gap-3 mb-4">
                        <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[13px] font-bold text-rose-800 dark:text-rose-300">Delete Admin Account</p>
                            <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5 leading-relaxed">
                                This will permanently delete your admin account. The store data will remain intact but you will lose admin access. This cannot be undone.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                            Type <span className="font-black tracking-wider">{CONFIRM_PHRASE}</span> to confirm
                        </label>
                        <input
                            className="w-full px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-500/30 bg-white dark:bg-rose-500/5 text-[13px] text-rose-800 dark:text-rose-200 outline-none focus:ring-2 focus:ring-rose-400/20 placeholder-rose-300 dark:placeholder-rose-600 font-mono"
                            value={confirmText}
                            onChange={e => setConfirmText(e.target.value)}
                            placeholder={CONFIRM_PHRASE}
                            disabled={deleting}
                        />
                        <button onClick={handleDelete} disabled={deleting || confirmText !== CONFIRM_PHRASE}
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-linear-to-r from-rose-500 to-red-600 text-white text-[13px] font-bold shadow-md shadow-rose-500/25 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 mt-1">
                            {deleting ? <><RefreshCw size={14} className="animate-spin" /> Deleting…</> : <><Trash2 size={14} /> Permanently Delete Account</>}
                        </button>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
};



export default DangerSection;