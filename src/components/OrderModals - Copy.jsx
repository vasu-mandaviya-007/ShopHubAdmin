import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogContent, DialogActions,
    DialogTitle, Button, IconButton, Stepper,
    Step, StepLabel,
} from '@mui/material';
import {
    X, Trash2, Loader2, MapPin, CreditCard,
    Package, ChevronRight, CheckCircle2, Clock,
    Truck, XCircle, RotateCcw, ShoppingBag,
} from 'lucide-react';
import { IoClose, IoWarning } from 'react-icons/io5';
import { Zoom } from '@mui/material';
import { updateOrder } from '../apis/orderApi';
import { showToast } from './showToast';

/* ── Transition ── */
const ZoomTransition = React.forwardRef((props, ref) => <Zoom ref={ref} {...props} />);

/* ── Helpers ── */
const fmt = (n) => Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

/* ── Dialog paper style ── */
const dialogSx = {
    '& .MuiDialog-paper': {
        borderRadius: '15px',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.06), rgba(255,255,255,0.06))',
    }
};

/* ── Status config ── */
const STATUS_FLOW = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_CONFIG = {
    Pending: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', icon: Clock, dot: 'bg-amber-400' },
    Processing: { color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-500/10', border: 'border-sky-200 dark:border-sky-500/20', icon: Package, dot: 'bg-sky-400' },
    Shipped: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20', icon: Truck, dot: 'bg-blue-400' },
    Delivered: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', icon: CheckCircle2, dot: 'bg-emerald-400' },
    Cancelled: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/20', icon: XCircle, dot: 'bg-red-400' },
    Returned: { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-500/10', border: 'border-slate-200 dark:border-slate-500/20', icon: RotateCcw, dot: 'bg-slate-400' },
};

/* ── StatusBadge ── */
export const OrderStatusBadge = ({ status }) => {
    const c = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
    return (
        <span className={`relative px-2.5 pl-5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${c.color} ${c.bg} ${c.border}`}>
            <span className={`absolute top-1/2 left-2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {status}
        </span>
    );
};

const labelCls = 'text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1 block';

/* ════════════════════════════════════════════════════════════
   ORDER MODALS — view, update status, delete
════════════════════════════════════════════════════════════ */
const OrderModals = ({
    activeModal, selectedOrder, closeModal,
    confirmDelete, actionLoading, onStatusUpdate,
}) => {
    const [newStatus, setNewStatus] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (selectedOrder) {
            setNewStatus(selectedOrder.status || 'Pending');
            setError('');
        }
    }, [selectedOrder]);

    if (!selectedOrder) return null;

    const cfg = STATUS_CONFIG[selectedOrder.status] || STATUS_CONFIG.Pending;

    /* ── Update status ── */
    // const handleStatusUpdate = async () => {
    //     if (newStatus === selectedOrder.status) { closeModal(); return; }
    //     setSaving(true);
    //     setError('');
    //     try {
    //         // const res = await fetch(`http://localhost:3001/orders/update/${selectedOrder._id || selectedOrder.id}`, {
    //         //     method: 'PUT',
    //         //     headers: { 'Content-Type': 'application/json' },
    //         //     body: JSON.stringify({ status: newStatus }),
    //         // });
    //         // const data = await res.json();

    //         const data = await updateOrder(selectedOrder.id, {
    //             status: newStatus,
    //         });

    //         if (data.success !== false && !data.error) {
    //             onStatusUpdate?.({ ...selectedOrder, status: newStatus });
    //             closeModal();
    //         } else {
    //             setError(data.error || 'Update failed.');
    //         }
    //     } catch {
    //         setError('Network error. Please try again.');
    //     } finally {
    //         setSaving(false);
    //     }
    // };


    const handleStatusUpdate = async () => {
        if (newStatus === selectedOrder.status) {
            closeModal();
            return;
        }

        setSaving(true);
        setError('');

        try {
            const data = await updateOrder(selectedOrder.id, {
                status: newStatus,
            });

            if (data.success !== false && !data.error) {
                onStatusUpdate?.({ ...selectedOrder, status: newStatus });
                showToast('Order status updated successfully!', 'success');
                closeModal();
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


    /* step index for stepper (excluding Cancelled/Returned) */
    const flowSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const activeStep = flowSteps.indexOf(selectedOrder.status);
    const isCancelled = selectedOrder.status === 'Cancelled' || selectedOrder.status === 'Returned';

    return (
        <>
            {/* ══════════════════════════════════════════
                1. VIEW ORDER DIALOG
            ══════════════════════════════════════════ */}
            <Dialog open={activeModal === 'view'} fullWidth maxWidth="md" onClose={closeModal} sx={dialogSx}>

                <DialogTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-accent-gradient flex items-center justify-center shadow-md shadow-sky-500/25">
                            <ShoppingBag size={15} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-[15px] text-slate-900 dark:text-slate-50">Order Details</h2>
                            <p className="text-[11px] font-mono text-slate-400 -mt-0.5">{selectedOrder.orderId}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <OrderStatusBadge status={selectedOrder.status} />
                        <IconButton onClick={closeModal} size="small"><X size={18} /></IconButton>
                    </div>
                </DialogTitle>

                <DialogContent dividers sx={{ px: 0, py: 0 }}>
                    <div className="p-5 space-y-5">

                        {/* ── Progress stepper ── */}
                        {!isCancelled && (
                            <div className="rounded-xl border border-slate-100 dark:border-white/6 bg-slate-50 dark:bg-slate-800/40 p-4">
                                <p className={labelCls}>Order Progress</p>
                                <Stepper activeStep={activeStep} alternativeLabel
                                    sx={{
                                        '& .MuiStepLabel-label': { fontSize: '11px', fontWeight: 600, fontFamily: 'inherit' },
                                        '& .MuiStepIcon-root.Mui-completed': { color: '#0ea5e9' },
                                        '& .MuiStepIcon-root.Mui-active': { color: '#2563eb' },
                                        '& .MuiStepConnector-line': { borderColor: '#e2e8f0' },
                                    }}>
                                    {flowSteps.map(s => <Step key={s}><StepLabel>{s}</StepLabel></Step>)}
                                </Stepper>
                            </div>
                        )}
                        {isCancelled && (
                            <div className="rounded-xl border border-red-100 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-4 flex items-center gap-3">
                                <XCircle size={20} className="text-red-500 shrink-0" />
                                <div>
                                    <p className="font-bold text-[13px] text-red-600 dark:text-red-400">Order {selectedOrder.status}</p>
                                    <p className="text-[12px] text-red-500/80 dark:text-red-400/70">This order has been {selectedOrder.status.toLowerCase()}.</p>
                                </div>
                            </div>
                        )}

                        {/* ── Two column grid ── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Customer & Shipping */}
                            <div className="rounded-xl border border-slate-100 dark:border-white/6 bg-slate-50 dark:bg-slate-800/40 p-4">
                                <p className={`${labelCls} flex items-center gap-1.5`}><MapPin size={10} /> Shipping Info</p>
                                <div className="space-y-2 mt-2">
                                    <p className="font-bold text-[14px] text-slate-800 dark:text-slate-100">
                                        {selectedOrder.shipping?.firstName} {selectedOrder.shipping?.lastName}
                                    </p>
                                    <p className="text-[12px] text-slate-500 dark:text-slate-400">{selectedOrder.shipping?.email}</p>
                                    <p className="text-[12px] text-slate-500 dark:text-slate-400">{selectedOrder.shipping?.phone}</p>
                                    <div className="h-px bg-slate-100 dark:bg-white/5 my-2" />
                                    <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {selectedOrder.shipping?.address1}
                                        {selectedOrder.shipping?.address2 && `, ${selectedOrder.shipping.address2}`}
                                        <br />
                                        {selectedOrder.shipping?.city}, {selectedOrder.shipping?.state} — {selectedOrder.shipping?.pin}
                                    </p>
                                </div>
                            </div>

                            {/* Payment + Pricing */}
                            <div className="rounded-xl border border-slate-100 dark:border-white/6 bg-slate-50 dark:bg-slate-800/40 p-4">
                                <p className={`${labelCls} flex items-center gap-1.5`}><CreditCard size={10} /> Payment & Pricing</p>
                                <div className="space-y-2 mt-2">
                                    {/* Payment method badge */}
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                            <CreditCard size={10} />
                                            {selectedOrder.payment?.method?.toUpperCase()}
                                            {selectedOrder.payment?.last4 && ` •••• ${selectedOrder.payment.last4}`}
                                            {selectedOrder.payment?.upiId && ` — ${selectedOrder.payment.upiId}`}
                                        </span>
                                    </div>
                                    <div className="h-px bg-slate-100 dark:bg-white/5 my-2" />
                                    {/* Pricing breakdown */}
                                    {[
                                        { label: 'Subtotal', val: `₹${fmt(selectedOrder.pricing?.subtotal)}` },
                                        { label: 'Discount', val: selectedOrder.pricing?.discountAmt > 0 ? `-₹${fmt(selectedOrder.pricing.discountAmt)}` : '—', red: true },
                                        { label: 'Shipping', val: selectedOrder.pricing?.shippingFee === 0 ? 'Free' : `₹${fmt(selectedOrder.pricing?.shippingFee)}` },
                                        { label: 'Promo Code', val: selectedOrder.pricing?.promoCode || '—' },
                                    ].map(({ label, val, red }) => (
                                        <div key={label} className="flex justify-between text-[12px]">
                                            <span className="text-slate-400 dark:text-slate-500">{label}</span>
                                            <span className={`font-semibold ${red ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>{val}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between text-[13px] pt-1 border-t border-slate-100 dark:border-white/5 mt-1">
                                        <span className="font-bold text-slate-700 dark:text-slate-200">Total</span>
                                        <span className="font-extrabold text-accent-600 dark:text-accent-400">₹{fmt(selectedOrder.pricing?.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Items ── */}
                        <div className="rounded-xl border border-slate-100 dark:border-white/6 overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-white/6">
                                <p className={labelCls}>Order Items ({selectedOrder.items?.length || 0})</p>
                            </div>
                            <div className="divide-y divide-slate-50 dark:divide-white/4">
                                {selectedOrder.items?.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/6 flex items-center justify-center shrink-0 overflow-hidden">
                                            {item.image
                                                ? <img src={item.image} alt={item.name} className="w-8 h-8 object-contain" />
                                                : <Package size={14} className="text-slate-300" />
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-[13px] text-slate-800 dark:text-slate-100 truncate">{item.name}</p>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 capitalize">{item.category} · qty {item.quantity}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-extrabold text-[13px] text-accent-600 dark:text-accent-400">₹{fmt(item.price * item.quantity)}</p>
                                            <p className="text-[11px] text-slate-400">₹{fmt(item.price)} × {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Meta ── */}
                        <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                            <span>Placed: <span className="font-semibold text-slate-600 dark:text-slate-300">{fmtDate(selectedOrder.placedAt)}</span></span>
                            <span className="text-slate-200 dark:text-slate-700">·</span>
                            <span>User ID: <span className="font-mono text-slate-500">{selectedOrder.userId}</span></span>
                        </div>
                    </div>
                </DialogContent>

                <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1.5, gap: 1.5 }}>
                    <Button variant="outlined" onClick={closeModal}
                        sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit', borderColor: '#e2e8f0', color: '#64748b', px: 3 }}>
                        Close
                    </Button>
                    <Button variant="contained" onClick={() => { closeModal(); setTimeout(() => onStatusUpdate?.('_open_status_' + selectedOrder._id), 100); }}
                        startIcon={<Package size={14} />}
                        sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit', px: 3, background: 'linear-gradient(135deg,#38bdf8,#2563eb)', boxShadow: '0 4px 14px rgba(14,165,233,0.3)' }}>
                        Update Status
                    </Button>
                </DialogActions>
            </Dialog>


            {/* ══════════════════════════════════════════
                2. UPDATE STATUS DIALOG
            ══════════════════════════════════════════ */}
            <Dialog open={activeModal === 'status'} fullWidth maxWidth="xs" onClose={closeModal} sx={dialogSx}>

                <DialogTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-accent-gradient flex items-center justify-center">
                            <Package size={15} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-[15px] text-slate-900 dark:text-slate-50">Update Status</h2>
                            <p className="text-[11px] font-mono text-slate-400">{selectedOrder.orderId}</p>
                        </div>
                    </div>
                    <IconButton onClick={closeModal} size="small"><X size={18} /></IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ px: 2.5, py: 2.5 }}>

                    {/* Current status */}
                    <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/6">
                        <span className="text-[12px] font-bold text-slate-500 dark:text-slate-400">Current</span>
                        <OrderStatusBadge status={selectedOrder.status} />
                    </div>

                    {/* Status options */}
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Select New Status</p>
                    <div className="flex flex-col gap-2">
                        {STATUS_FLOW.map(s => {
                            const c = STATUS_CONFIG[s];
                            const Icon = c.icon;
                            const isCur = s === selectedOrder.status;
                            const isSel = s === newStatus;
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    disabled={isCur}
                                    onClick={() => setNewStatus(s)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-150 ${isSel && !isCur
                                        ? 'border-sky-400 bg-accent-50 dark:bg-accent-500/10'
                                        : isCur
                                            ? 'border-slate-100 dark:border-white/4 bg-slate-50/50 dark:bg-slate-800/20 opacity-50 cursor-not-allowed'
                                            : 'border-slate-100 dark:border-white/6 bg-white dark:bg-slate-800/40 hover:border-sky-200 hover:bg-accent-50/30 dark:hover:bg-accent-500/5'
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
                    <Button variant="contained" onClick={closeModal} disabled={saving}
                        className="bg-[#434343]! dark:bg-[#f8fafc]! text-white! dark:text-slate-700!"
                        sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit', px: 3, py: 1.1 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleStatusUpdate}
                        disabled={saving || newStatus === selectedOrder.status}
                        loading={saving}
                        loadingPosition="start"
                        startIcon={<CheckCircle2 size={14} />}
                        loadingIndicator={<Loader2 size={14} className="animate-spin" />}
                        sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit', px: 3, py: 1.1, background: 'linear-gradient(135deg,#38bdf8,#2563eb)', boxShadow: '0 4px 14px rgba(14,165,233,0.3)', '&:hover': { boxShadow: '0 6px 20px rgba(14,165,233,0.45)', transform: 'translateY(-1px)' }, '&.Mui-disabled': { background: 'linear-gradient(135deg,#93c5fd,#60a5fa)', color: '#fff', opacity: 1 } }}>
                        {saving ? 'Saving…' : 'Confirm Update'}
                    </Button>
                </DialogActions>
            </Dialog>


            {/* ══════════════════════════════════════════
                3. DELETE DIALOG
            ══════════════════════════════════════════ */}
            <Dialog open={activeModal === 'delete'} slots={{ transition: ZoomTransition }} keepMounted fullWidth maxWidth="xs" onClose={closeModal} sx={dialogSx}>
                <DialogContent sx={{ textAlign: 'center', py: 4, px: 3 }}>
                    <IoClose onClick={closeModal} className="absolute top-4 right-4 text-2xl text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />

                    <div className="relative mb-5 inline-block">
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
                            <Trash2 size={28} />
                        </div>
                        <span className="absolute inset-0 rounded-2xl border-2 border-red-300/50 dark:border-red-500/25 animate-ping" />
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 mb-2">Delete Order?</h3>

                    {/* Order pill */}
                    <div className="flex items-center gap-2.5 my-4 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/6 text-left">
                        <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 flex items-center justify-center shrink-0">
                            <ShoppingBag size={14} className="text-slate-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-extrabold text-[13px] text-slate-800 dark:text-slate-100 truncate">{selectedOrder.orderId}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                {selectedOrder.shipping?.firstName} {selectedOrder.shipping?.lastName}
                            </p>
                        </div>
                        <span className="font-extrabold text-[13px] text-accent-600 dark:text-accent-400 shrink-0">
                            ₹{fmt(selectedOrder.pricing?.total)}
                        </span>
                    </div>

                    <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border-l-4 border-amber-500 p-3 rounded-r-xl text-left mb-5">
                        <IoWarning className="text-amber-500 text-lg mt-0.5 shrink-0" />
                        <div>
                            <p className="text-amber-700 dark:text-amber-400 font-bold text-[13px]">Warning</p>
                            <p className="text-amber-600 dark:text-amber-500 font-medium text-[12px]">This will permanently delete the order record.</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button fullWidth variant="outlined" onClick={closeModal}
                            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit', borderColor: '#e2e8f0', color: '#64748b', py: 1.2 }}>
                            Cancel
                        </Button>
                        <Button fullWidth variant="contained" color="error" onClick={confirmDelete} disabled={actionLoading}
                            startIcon={actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit', py: 1.2, bgcolor: '#ef4444', boxShadow: '0 4px 14px rgba(239,68,68,0.28)', '&:hover': { bgcolor: '#dc2626', boxShadow: '0 6px 20px rgba(239,68,68,0.38)' } }}>
                            {actionLoading ? 'Deleting…' : 'Yes, Delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export { OrderStatusBadge as StatusBadge, STATUS_CONFIG };
export default OrderModals;