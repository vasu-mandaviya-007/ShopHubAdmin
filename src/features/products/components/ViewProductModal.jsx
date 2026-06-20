import React from 'react'
import { dialogSx, fmt, GrowTransition } from './productUtils'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Box, X } from 'lucide-react';
import StatusBadge from '../../../components/StatusBadge';



const ViewProductModal = ({ open, closeModal, product }) => {

    if (!product) return null;

    const discount = product?.old_price > 0 && product?.price > 0
        ? Math.max(0, Math.floor(100 - (product.price * 100) / product.old_price))
        : 0;

    return (

        <Dialog open={open} slots={{ transition: GrowTransition }} fullWidth maxWidth="sm" onClose={closeModal} sx={dialogSx}>

            <DialogTitle className="flex items-center justify-between py-5!">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent-gradient flex items-center justify-center shadow-accent">
                        <Box size={15} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-[15px] text-base-900 dark:text-base-50">Product Details</h2>
                        <p className="text-[11px] font-mono text-base-400 -mt-0.5">{product?.sku}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* <OrderStatusBadge status={order.status} /> */}
                    <IconButton onClick={closeModal} ><X size={18} /></IconButton>
                </div>
            </DialogTitle>

            <DialogContent sx={{ px: 0, py: 0 }} dividers>

                <div className="p-5 flex gap-4">
                    <div className="w-28 h-28 rounded-xl bg-base-50 dark:bg-base-800 flex items-center justify-center overflow-hidden shrink-0">
                        <img src={product?.image} alt={product?.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col items-start gap-1.5">
                        <p className="font-bold text-base-900 dark:text-base-50 text-base leading-snug">{product?.name}</p>
                        <p className="text-[12px] text-base-400 font-mono">{product?.sku}</p>
                        <StatusBadge status={product?.status} />
                    </div>
                </div>

                <div className="px-5 pb-5 grid grid-cols-2 sm:grid-cols-3 gap-3">

                    {[
                        { label: 'Category', val: product?.category },
                        { label: 'Current Price', val: `₹${fmt(product?.price)}` },
                        { label: 'Old Price', val: `₹${fmt(product?.old_price)}` },
                        { label: 'Discount', val: discount > 0 ? `${discount}%` : '—' },
                        { label: 'Stock', val: product?.stock === 0 ? 'Out of Stock' : product?.stock },
                        { label: 'Status', val: <StatusBadge status={product?.status} /> },
                    ].map(({ label, val }) => (
                        <div key={label} className="bg-base-100/60 dark:bg-base-800 rounded-xl p-3 border border-base-100 dark:border-white/6">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-base-400 mb-1">{label}</p>
                            <div className="text-sm font-semibold text-base-900 dark:text-base-50">{val}</div>
                        </div>
                    ))}

                </div>

            </DialogContent>

        </Dialog>

    )

}

export default ViewProductModal