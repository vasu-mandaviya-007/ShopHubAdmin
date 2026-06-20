import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogActions, Button, IconButton, DialogTitle, Zoom } from '@mui/material';
import { X, Check, Loader2, Trash2, Package, Truck, User, MapPin } from 'lucide-react';
import { IoWarning } from 'react-icons/io5';
import { FaPen } from 'react-icons/fa6';
import { updateOrder } from '../apis/orderApi';

const ZoomTransition = React.forwardRef((props, ref) => <Zoom ref={ref} {...props} />);
const fmt = (n) => Number(n || 0).toLocaleString('en-IN');

const dialogSx = { '& .MuiDialog-paper': { borderRadius: '15px', backgroundImage: "linear-gradient(rgba(255 255 255 / 0.06), rgba(255 255 255 / 0.06))" } };

const OrderModals2 = ({ activeModal, selectedOrder, closeModal, confirmDelete, actionLoading, onSave }) => {
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {

        if (selectedOrder) { setForm({ ...selectedOrder }); setError(''); }

    }, [selectedOrder]);

    if (!selectedOrder) return null;

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            // BACKEND API CALL HERE
            // const res = await fetch(`http://localhost:3001/orders/update/${selectedOrder.id}`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ status: form.status, payment_status: form.payment_status }),
            // });
            // const data = await res.json();

            const data = await updateOrder(selectedOrder.id, {
                status: form.status,
                payment_status: form.payment_status 
            });

            if (data.success !== false && !data.error) {
                onSave?.({ ...selectedOrder, status: form.status, payment_status: form.payment_status });
                closeModal();
            } else {
                setError(data.error || 'Update failed.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.log(err)
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            {/* ── 1. EDIT ORDER STATUS DIALOG ── */}
            <Dialog open={activeModal === 'edit'} fullWidth maxWidth="xs" onClose={closeModal} sx={dialogSx}>
                <DialogTitle className="flex items-center justify-between px-5 py-4 ">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-accent-gradient flex items-center justify-center shadow-md shadow-sky-500/25">
                            <FaPen className="text-white text-sm" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-base-900 dark:text-base-50">Update Order</h2>
                            <p className="text-[11px] font-mono text-base-400 ">#{selectedOrder?.order_id}</p>
                        </div>
                    </div>
                    <IconButton onClick={closeModal}><X size={20} /></IconButton>
                </DialogTitle>

                <form onSubmit={handleEditSubmit} id="edit-order-form">
                    <DialogContent sx={{ px: 2.5, py: 2.5 }} dividers>
                        <div className="mb-4">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-base-500 block mb-1.5">Order Status</label>
                            <select value={form.status || ''} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2.5 rounded-md border border-base-300 dark:border-base-700 bg-white dark:bg-base-800 text-[13px] text-base-900 dark:text-base-50 outline-none focus:border-sky-400">
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="mb-2">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-base-500 block mb-1.5">Payment Status</label>
                            <select value={form.payment_status || ''} onChange={(e) => setForm({ ...form, payment_status: e.target.value })} className="w-full px-3 py-2.5 rounded-md border border-base-300 dark:border-base-700 bg-white dark:bg-base-800 text-[13px] text-base-900 dark:text-base-50 outline-none focus:border-sky-400">
                                <option value="Paid">Paid</option>
                                <option value="Unpaid">Unpaid</option>
                                <option value="Refunded">Refunded</option>
                            </select>
                        </div>
                        {error && <div className="mt-3 flex items-center gap-2 text-[12px] font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg"><IoWarning size={16} /> {error}</div>}
                    </DialogContent>
                    <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1.5, gap: 1.5 }}>
                        <Button variant="contained" onClick={closeModal} className='bg-[#434343]! dark:bg-[#f8fafc]! text-white! dark:text-base-700!' sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '13px', px: 3, py: 1.1 }}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={saving || actionLoading} startIcon={<Check size={14} />} sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '13px', px: 3, py: 1.1, background: 'linear-gradient(135deg,#38bdf8,#2563eb)' }}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* ── 2. VIEW ORDER DIALOG ── */}
            <Dialog open={activeModal === 'view'} fullWidth maxWidth="sm" onClose={closeModal} sx={dialogSx}>

                <DialogTitle className='flex justify-between items-center' sx={{ fontWeight: 'bold' }}>

                    <p className='text-lg'>Order Details</p>
                    <IconButton onClick={closeModal}><X size={20} /></IconButton>

                </DialogTitle>

                <DialogContent sx={{ px: 0, py: 0 }} dividers>

                    <div className="p-5 flex justify-between items-center bg-base-50 dark:bg-base-900/50 border-b border-slate-100 dark:border-white/6">
                        <div>
                            <p className="font-bold text-slate-900 dark:text-slate-50 text-xl">#{selectedOrder?.order_id}</p>
                            <p className="text-[12px] text-slate-500">{selectedOrder?.date}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-extrabold text-accent-600 dark:text-accent-400 text-xl">₹{fmt(selectedOrder?.total_amount)}</p>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${selectedOrder?.payment_status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'}`}>{selectedOrder?.payment_status}</span>
                        </div>
                    </div>

                    <div className="p-5 grid grid-cols-2 gap-4">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"><User size={18} className="text-slate-500" /></div>
                            <div><p className="text-[10px] font-bold uppercase text-slate-400">Customer</p><p className="font-semibold text-[13px] text-slate-900 dark:text-slate-100">{selectedOrder?.customer_name}</p><p className="text-[12px] text-slate-500">{selectedOrder?.customer_email}</p></div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"><MapPin size={18} className="text-slate-500" /></div>
                            <div><p className="text-[10px] font-bold uppercase text-slate-400">Shipping</p><p className="font-medium text-[12px] text-slate-700 dark:text-slate-300 leading-tight">123 Street Name,<br />City, State 12345</p></div>
                        </div>
                    </div>

                </DialogContent>

            </Dialog>

            {/* ── 3. DELETE ORDER DIALOG ── */}
            <Dialog open={activeModal === 'delete'} slots={{ transition: ZoomTransition }} keepMounted fullWidth maxWidth="xs" onClose={closeModal} sx={dialogSx}>

                <DialogContent sx={{ textAlign: 'center', py: 4, px: 3 }}>
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><Trash2 size={28} /></div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 mb-2">Delete Order?</h3>
                    <p className="text-sm text-slate-500 mb-6">Are you sure you want to delete order <span className="font-bold text-slate-700 dark:text-slate-300">#{selectedOrder?.order_id}</span>?</p>
                    <div className="flex gap-3">
                        <Button fullWidth variant="outlined" onClick={closeModal} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}>Cancel</Button>
                        <Button fullWidth variant="contained" color="error" onClick={confirmDelete} disabled={actionLoading} startIcon={actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, bgcolor: '#ef4444' }}>{actionLoading ? 'Deleting...' : 'Delete'}</Button>
                    </div>
                </DialogContent>

            </Dialog> 

        </>

    );

};

export default OrderModals2;