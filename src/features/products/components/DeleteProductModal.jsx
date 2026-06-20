import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { IoClose, IoWarning } from 'react-icons/io5';
import { Loader2, Trash2, X } from 'lucide-react';
import { dialogSx, fmt, GrowTransition } from './productUtils';




const DeleteProductModal = ({ open, product, closeModal, confirmDelete, actionLoading }) => {

    if (!product) return null;

    return (

        // <Dialog open={open} slots={{ transition: ZoomTransition }} keepMounted fullWidth maxWidth="xs" onClose={closeModal} sx={dialogSx}>
        <Dialog open={open} slots={{ transition: GrowTransition }} keepMounted fullWidth maxWidth="xs" onClose={closeModal} sx={dialogSx}>

            <DialogContent sx={{ textAlign: 'center', py: 4, px: 3 }}>

                <IoClose onClick={closeModal} className="absolute top-4 right-4 text-2xl text-base-400 cursor-pointer hover:text-base-600 transition-colors" />

                {/* Icon */}
                <div className="relative mb-5 inline-block">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
                        <Trash2 size={28} />
                    </div>
                    <span className="absolute inset-0 rounded-2xl border-2 border-red-300/50 dark:border-red-500/25 animate-ping" />
                </div>

                <h3 className="text-xl font-extrabold text-base-900 dark:text-base-50 mb-2">Delete Product?</h3>

                {/* Product pill */}
                <div className="flex items-center gap-2.5 my-4 px-3.5 py-2.5 rounded-xl bg-base-50 dark:bg-base-800 border border-base-100 dark:border-white/6 text-left">
                    <div className="w-9 h-9 rounded-lg bg-white dark:bg-base-700 border border-base-100 dark:border-base-600 flex items-center justify-center shrink-0 overflow-hidden">
                        <img src={product?.image} alt="" className="w-7 h-7 object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-[13px] text-base-800 dark:text-base-100 truncate">{product?.name}</p>
                        <p className="text-[11px] font-mono text-base-400 mt-0.5">{product?.sku}</p>
                    </div>
                    <span className="font-extrabold text-[13px] text-accent-600 dark:text-accent-400 shrink-0">
                        ₹{fmt(product?.price)}
                    </span>
                </div>

                {/* Warning box */}
                <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border-l-4 border-amber-500 p-3 rounded-r-xl text-left mb-5">
                    <IoWarning className="text-amber-500 text-lg mt-0.5 shrink-0" />
                    <div>
                        <p className="text-amber-700 dark:text-amber-400 font-bold text-[13px]">Warning</p>
                        <p className="text-amber-600 dark:text-amber-500 font-medium text-[12px]">This action cannot be undone.</p>
                    </div>
                </div>

                <div className="flex gap-3">

                    {/* <Button fullWidth variant="outlined" onClick={closeModal}
                            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit', borderColor: '#e2e8f0', color: '#64748b', py: 1.2, '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' } }}>
                            Cancel
                        </Button>

                        <Button fullWidth variant="contained" color="error" onClick={confirmDelete} disabled={actionLoading}
                            startIcon={actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit', py: 1.2, bgcolor: '#ef4444', boxShadow: '0 4px 14px rgba(239,68,68,0.28)', '&:hover': { bgcolor: '#dc2626', boxShadow: '0 6px 20px rgba(239,68,68,0.38)' }, '&:disabled': { opacity: 0.7 } }}>
                            {actionLoading ? 'Deleting…' : 'Yes, Delete'}
                        </Button> */}

                    <Button fullWidth variant="dark" onClick={closeModal} sx={{ py: 1.1 }} disabled={actionLoading}>
                        Cancel
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        onClick={confirmDelete}
                        disabled={actionLoading}
                        loading={actionLoading}
                        loadingPosition="start"
                        startIcon={<Trash2 size={14} />}
                        loadingIndicator={<Loader2 size={14} className="animate-spin" />}
                        sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit', py: 1.2, bgcolor: '#ef4444', boxShadow: '0 4px 14px rgba(239,68,68,0.28)', '&:hover': { bgcolor: '#dc2626', boxShadow: '0 6px 20px rgba(239,68,68,0.38)' } }}
                    >
                        {actionLoading ? 'Deleting…' : 'Yes, Delete'}
                    </Button>

                </div>

            </DialogContent>

        </Dialog>
    )
}

export default DeleteProductModal