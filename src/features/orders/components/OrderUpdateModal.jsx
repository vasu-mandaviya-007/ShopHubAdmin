import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { CheckCircle2, Clock, Loader2, Package, RotateCcw, Truck, X, XCircle } from 'lucide-react';
import React from 'react'
import { OrderStatusBadge } from './OrderStatusBadge';
import { IoWarning } from 'react-icons/io5';
import { useState } from 'react';
import { showToast } from '../../../components/showToast';
import { updateOrder } from '../../../apis/orderApi';
import PrimaryButton from '../../../components/ui/PrimaryButton';

import { dialogSx } from './orderUtils.jsx';

 
const STATUS_FLOW = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_CONFIG = {
    Pending: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', icon: Clock, dot: 'bg-amber-400' },
    Processing: { color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-500/10', border: 'border-sky-200 dark:border-sky-500/20', icon: Package, dot: 'bg-sky-400' },
    Shipped: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20', icon: Truck, dot: 'bg-blue-400' },
    Delivered: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', icon: CheckCircle2, dot: 'bg-emerald-400' },
    Cancelled: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/20', icon: XCircle, dot: 'bg-red-400' },
    Returned: { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-500/10', border: 'border-slate-200 dark:border-slate-500/20', icon: RotateCcw, dot: 'bg-slate-400' },
};


const OrderUpdateModal = ({ open, order, onClose, onStatusUpdate }) => {

    if (!order) return null;

    const [newStatus, setNewStatus] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleStatusUpdate = async () => {
        if (newStatus === order.status) {
            onClose();
            return;
        }

        setSaving(true);
        setError('');

        try {
            const data = await updateOrder(order.id, {
                status: newStatus,
            });

            if (data.success !== false && !data.error) {
                onStatusUpdate?.({ ...order, status: newStatus });
                showToast('Order status updated successfully!', 'success');
                onClose();
            } else {
                setError(data.error || 'Update failed.');
                showToast(data.error || 'Update failed.', 'error');
            }
        } catch (err) {
            console.error('Update failed:', err);

            // ── AXIOS ERROR HANDLING FOR DEMO MODE ──
            if (err.response && err.response.data && err.response.data.error) {
                const backendError = err.response.data.error;
                setError(backendError);

                // Ye automatically lock wala UI le lega
                showToast(backendError, 'error');
            } else {
                setError('Network error. Please try again.');
                showToast('Network error. Please try again.', 'error');
            }
        } finally {
            setSaving(false);
        }
    };

    return (

        <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose} sx={dialogSx}>

            <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent-gradient flex items-center justify-center">
                        <Package size={15} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-[15px] text-slate-900 dark:text-slate-50">Update Status</h2>
                        <p className="text-[11px] font-mono text-slate-400">{order?.orderId}</p>
                    </div>
                </div>
                <IconButton onClick={onClose} size="small"><X size={18} /></IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ px: 2.5, py: 2.5 }}>

                {/* Current status */}
                <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-base-50 dark:bg-base-800/50 border border-base-100 dark:border-white/6">
                    <span className="text-[12px] font-bold text-base-500 dark:text-base-400">Current</span>
                    <OrderStatusBadge status={order?.status} />
                </div>

                {/* Status options */}
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Select New Status</p>
                <div className="flex flex-col gap-2">
                    {/* {STATUS_FLOW.map(s => {
                            const c = STATUS_CONFIG[s];
                            const Icon = c.icon;
                            const isCur = s === order?.status;
                            const isSel = s === newStatus;
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    disabled={isCur}
                                    onClick={() => setNewStatus(s)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${isSel && !isCur
                                        ? 'border-accent-400 bg-accent-50 dark:bg-accent-500/10'
                                        : isCur
                                            ? 'border-base-100 dark:border-white/8 bg-base-50/50 dark:bg-base-800/20 opacity-50 cursor-not-allowed'
                                            : 'border-slate-100 dark:border-white/6 bg-white dark:bg-slate-800/40 hover:border-accent-200 dark:hover:border-accent-300 hover:bg-accent-50/30 dark:hover:bg-accent-500/5'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.bg} ${c.color}`}>
                                        <Icon size={14} />
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-bold text-[13px] ${isSel && !isCur ? 'text-accent-600 dark:text-accent-400' : 'text-slate-800 dark:text-slate-100'}`}>{s}</p>
                                        {isCur && <p className="text-[11px] text-slate-400">Current status</p>}
                                    </div>
                                    {isSel && !isCur && <CheckCircle2 size={16} className="text-accent-500 shrink-0" />}
                                </button>
                            );
                        })} */}

                    {STATUS_FLOW.map(s => {
                        const c = STATUS_CONFIG[s];
                        const Icon = c.icon;
                        const isCur = s === order?.status;
                        const isSel = s === newStatus;

                        return (
                            <button
                                key={s}
                                type="button"
                                disabled={isCur}
                                onClick={() => setNewStatus(s)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${isSel && !isCur
                                    ? 'border-accent-500 bg-accent-50 dark:bg-accent-500/10' // ── FIX: Hardcoded 'sky' hata kar 'accent' lagaya
                                    : isCur
                                        ? 'border-base-100 dark:border-white/8 bg-base-50/50 dark:bg-base-800/20 opacity-50 cursor-not-allowed!'
                                        : 'border-base-100 dark:border-white/6 bg-white dark:bg-base-800/40 hover:border-accent-300 dark:hover:border-accent-300 hover:bg-accent-50/30 dark:hover:bg-accent-500/5'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.bg} ${c.color}`}>
                                    <Icon size={14} />
                                </div>
                                <div className="flex-1">
                                    <p className={`font-bold text-[13px] ${isSel && !isCur ? 'text-accent-600 dark:text-accent-400' : 'text-slate-800 dark:text-slate-100'}`}>{s}</p>
                                    {isCur && <p className="text-[11px] text-slate-400">Current status</p>}
                                </div>
                                {isSel && !isCur && <CheckCircle2 size={16} className="text-accent-500 shrink-0" />}
                            </button>
                        );
                    })}

                </div>

                {error && (
                    <div className="mt-3 flex items-center gap-2 text-[12px] font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-3 py-2 rounded-lg">
                        <IoWarning className="shrink-0" /> {error}
                    </div>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1.5, gap: 1.5 }}>

                {/* <Button variant="contained" onClick={onClose} disabled={saving}
                        className="bg-[#434343]! dark:bg-[#f8fafc]! text-white! dark:text-base-700!"
                        sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit', px: 3, py: 1.1 }}>
                        Cancel
                    </Button> */}

                {/* <Button variant="contained" onClick={handleStatusUpdate}
                        // disabled={saving || newStatus === order?.status}
                        loading={saving}
                        loadingPosition="start"
                        startIcon={<CheckCircle2 size={14} />}
                        loadingIndicator={<Loader2 size={14} className="animate-spin" />}
                        sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit', px: 3, py: 1.1, background: 'linear-gradient(135deg,#38bdf8,#2563eb)', boxShadow: '0 4px 14px rgba(14,165,233,0.3)', '&:hover': { boxShadow: '0 6px 20px rgba(14,165,233,0.45)', transform: 'translateY(-1px)' }, '&.Mui-disabled': { background: 'linear-gradient(135deg,#93c5fd,#60a5fa)', color: '#fff', opacity: 1 } }}
                    >
                        {saving ? 'Saving…' : 'Confirm Update'}
                    </Button> */}

                <Button variant="dark" onClick={onClose} sx={{ py: 1.1 }} disabled={saving}>
                    Cancel
                </Button>

                <PrimaryButton
                    onClick={handleStatusUpdate}
                    disabled={saving || newStatus === order?.status}
                    loading={saving}
                    loadingPosition="start"
                    startIcon={<CheckCircle2 size={14} />}
                    loadingIndicator={<Loader2 size={14} className="animate-spin" />}
                    sx={{ py: 1.1 }}
                >
                    {saving ? 'Saving…' : 'Confirm Update'}

                </PrimaryButton>

            </DialogActions>

        </Dialog>

    )

}

export default OrderUpdateModal;