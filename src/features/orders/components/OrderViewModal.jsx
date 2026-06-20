import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Step, StepLabel, Stepper } from '@mui/material';
import { CreditCard, MapPin, Package, ShoppingBag, X, XCircle } from 'lucide-react';
import React from 'react'
import PrimaryButton from '../../../components/ui/PrimaryButton';
import { dialogSx, labelCls, fmt, fmtDate } from './orderUtils.jsx';
import {OrderStatusBadge} from './OrderStatusBadge.jsx';
 


const OrderViewModal = ({ open, order, onClose, onStatusUpdate }) => {


    if (!order) return null; 

    const flowSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const activeStep = flowSteps.indexOf(order.status);
    const isCancelled = order.status === 'Cancelled' || order.status === 'Returned';


    return (

        <Dialog open={open} fullWidth maxWidth="md" onClose={onClose} sx={dialogSx}>

            <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent-gradient flex items-center justify-center shadow-accent">
                        <ShoppingBag size={15} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-[15px] text-base-900 dark:text-base-50">Order Details</h2>
                        <p className="text-[11px] font-mono text-base-400 -mt-0.5">{order.orderId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <OrderStatusBadge status={order.status} />
                    <IconButton onClick={onClose} size="small"><X size={18} /></IconButton>
                </div>
            </DialogTitle>

            <DialogContent dividers sx={{ px: 0, py: 0 }}>

                <div className="p-5 space-y-5">

                    {/* ── Progress stepper ── */}
                    {!isCancelled && (
                        <div className="rounded-xl border border-base-200/70 dark:border-white/6 bg-base-50 dark:bg-base-800/40 p-4">
                            <p className={`${labelCls} mb-5 `}>Order Progress</p>
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
                                <p className="font-bold text-[13px] text-red-600 dark:text-red-400">Order {order.status}</p>
                                <p className="text-[12px] text-red-500/80 dark:text-red-400/70">This order has been {order.status.toLowerCase()}.</p>
                            </div>
                        </div>
                    )}

                    {/* ── Two column grid ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Customer & Shipping */}
                        <div className="rounded-xl border border-base-100 dark:border-white/6 bg-base-50 dark:bg-base-800/40 p-4">
                            <p className={`${labelCls} flex items-center gap-1.5`}><MapPin size={10} /> Shipping Info</p>
                            <div className="space-y-2 mt-2">
                                <p className="font-bold text-[14px] text-base-800 dark:text-base-100">
                                    {order.shipping?.firstName} {order.shipping?.lastName}
                                </p>
                                <p className="text-[12px] text-base-500 dark:text-base-400">{order.shipping?.email}</p>
                                <p className="text-[12px] text-base-500 dark:text-base-400">{order.shipping?.phone}</p>
                                <div className="h-px bg-base-100 dark:bg-white/5 my-2" />
                                <p className="text-[12px] text-base-600 dark:text-base-300 leading-relaxed">
                                    {order.shipping?.address1}
                                    {order.shipping?.address2 && `, ${order.shipping.address2}`}
                                    <br />
                                    {order.shipping?.city}, {order.shipping?.state} — {order.shipping?.pin}
                                </p>
                            </div>
                        </div>

                        {/* Payment + Pricing */}
                        <div className="rounded-xl border border-base-100 dark:border-white/6 bg-base-50 dark:bg-base-800/40 p-4">
                            <p className={`${labelCls} flex items-center gap-1.5`}><CreditCard size={10} /> Payment & Pricing</p>
                            <div className="space-y-2 mt-2">
                                {/* Payment method badge */}
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-base-100 dark:bg-base-600 text-base-600 dark:text-base-300">
                                        <CreditCard size={10} />
                                        {order.payment?.method?.toUpperCase()}
                                        {order.payment?.last4 && ` •••• ${order.payment.last4}`}
                                        {order.payment?.upiId && ` — ${order.payment.upiId}`}
                                    </span>
                                </div>
                                <div className="h-px bg-base-100 dark:bg-white/5 my-2" />
                                {/* Pricing breakdown */}
                                {[
                                    { label: 'Subtotal', val: `₹${fmt(order.pricing?.subtotal)}` },
                                    { label: 'Discount', val: order.pricing?.discountAmt > 0 ? `-₹${fmt(order.pricing.discountAmt)}` : '—', red: true },
                                    { label: 'Shipping', val: order.pricing?.shippingFee === 0 ? 'Free' : `₹${fmt(order.pricing?.shippingFee)}` },
                                    { label: 'Promo Code', val: order.pricing?.promoCode || '—' },
                                ].map(({ label, val, red }) => (
                                    <div key={label} className="flex justify-between text-[12px]">
                                        <span className="text-base-400 dark:text-base-500">{label}</span>
                                        <span className={`font-semibold ${red ? 'text-emerald-500' : 'text-base-700 dark:text-base-300'}`}>{val}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between text-[13px] pt-1 border-t border-base-100 dark:border-white/5 mt-1">
                                    <span className="font-bold text-base-700 dark:text-base-200">Total</span>
                                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹{fmt(order.pricing?.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Items ── */}
                    <div className="rounded-xl border border-base-100 dark:border-white/6 overflow-hidden">
                        <div className="px-4 py-3 bg-base-50 dark:bg-base-800/40 border-b border-base-100 dark:border-white/6">
                            <p className={labelCls}>Order Items ({order.items?.length || 0})</p>
                        </div>
                        <div className="divide-y divide-base-50 dark:divide-white/4">
                            {order.items?.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-base-50/50 dark:hover:bg-white/2 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-base-50 dark:bg-base-800 border border-base-100 dark:border-white/6 flex items-center justify-center shrink-0 overflow-hidden">
                                        {item.image
                                            ? <img src={item.image} alt={item.name} className="w-8 h-8 object-contain" />
                                            : <Package size={14} className="text-base-300" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-[13px] text-base-800 dark:text-base-100 truncate">{item.name}</p>
                                        <p className="text-[11px] text-base-400 dark:text-base-500 capitalize">{item.category} · qty {item.quantity}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-extrabold text-[13px] text-emerald-600 dark:text-emerald-400">₹{fmt(item.price * item.quantity)}</p>
                                        <p className="text-[11px] text-base-400">₹{fmt(item.price)} × {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Meta ── */}
                    <div className="flex flex-wrap gap-2 text-[11px] text-base-400 dark:text-base-500">
                        <span>Placed: <span className="font-semibold text-base-600 dark:text-base-300">{fmtDate(order.placedAt)}</span></span>
                        <span className="text-base-200 dark:text-base-700">·</span>
                        <span>User ID: <span className="font-mono text-base-500">{order.userId}</span></span>
                    </div>
                </div>

            </DialogContent>

            <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1.5, gap: 1.5 }}>

                <Button variant='dark' sx={{ py: 1.1 }} onClick={onClose} >Close</Button>

                {/* <Button variant="contained" 
                        className='bg-accent-gradient hover:shadow-accent!'
                        onClick={() => { onClose(); setTimeout(() => onStatusUpdate?.('_open_status_' + order._id), 100); }}
                        startIcon={<Package size={14} />}
                        disabled={true}
                        sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit', px: 3 }}>
                        Update Status
                    </Button> */}

                <PrimaryButton
                    onClick={() => { onClose(); setTimeout(() => onStatusUpdate?.('_open_status_' + order._id), 100); }}
                    startIcon={<Package size={14} />}
                >
                    Update Status
                </PrimaryButton>

            </DialogActions>
        </Dialog>

    )

}

export default OrderViewModal