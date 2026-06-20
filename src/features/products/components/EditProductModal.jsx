import React, { useEffect, useState } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { FaPen } from 'react-icons/fa6';
import { CheckCircle2, ImageIcon, Loader2, X } from 'lucide-react';
import { IoWarning } from 'react-icons/io5';
import PrimaryButton from '../../../components/ui/PrimaryButton';
import { dialogSx, labelCls, inputCls, GrowTransition } from './productUtils';
import { showToast } from '../../../components/showToast';
import { updateProduct } from '../../../apis/productApi';


const FIELDS = [
    { label: 'Product Name', name: 'name', type: 'text', ph: 'e.g. Blue Denim Jacket', full: true },
    { label: 'Category', name: 'category', type: 'text', ph: 'e.g. women, men, kid', full: true },
    { label: 'New Price (₹)', name: 'price', type: 'number', ph: '0', full: false },
    { label: 'Old Price (₹)', name: 'old_price', type: 'number', ph: '0', full: false },
    { label: 'Stock', name: 'stock', type: 'number', ph: '0', full: false },
];

const EditProductModal = ({ open, product, closeModal, onSave }) => {

    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [editPreview, setEditPreview] = useState(null);

    useEffect(() => {

        if (product) {
            setForm({ ...product });
            setEditPreview(product.image || null);
            setError('');
        }

    }, [product]);

    if (!product) return null;

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        if (error) setError('');
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!form.name?.trim()) { setError('Name is required.'); return; }
        if (Number(form.price) <= 0) { setError('Price must be greater than 0.'); return; }

        setSaving(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append("name", form.name.trim());
            formData.append("category", form.category?.trim().toLowerCase());
            formData.append("new_price", Number(form.price));
            formData.append("old_price", Number(form.old_price) || Number(form.price));
            formData.append("stock", Number(form.stock));
            formData.append("available", form.is_active);
            formData.append("image", form._imageFile);

            const data = await updateProduct(product.id, formData);

            if (data.success !== false && !data.error) {
                /* Update parent list immediately */
                const product = data?.product;

                onSave?.({
                    ...product,
                    name: product?.name,
                    category: product?.category,
                    price: product?.new_price,
                    old_price: product?.old_price,
                    stock: Number(product?.stock),
                    status: product?.stock == 0 ? 'Out of Stock' : product?.stock <= 5 ? "Low Stock" : 'In Stock',
                    is_active: product?.available,
                    image: product?.image,
                });

                showToast('Product updated successfully!', 'success');
                closeModal();

            } else {
                setError(data.error || 'Update failed.');
                showToast(data.error || 'Update failed.', 'error');
            }

        } catch (err) {
            console.error(err);

            // ── AXIOS ERROR HANDLING ──
            if (err.response && err.response.data && err.response.data.error) {
                // Agar backend se humara custom error aaya hai (jaise Demo Mode error)
                const backendError = err.response.data.error;
                setError(backendError);

                // Demo mode error ko special toast me dikhao
                // if (backendError.includes("Demo Mode")) {
                //     toast.error(backendError, { duration: 4000, icon: '🔒' });
                // } else {
                //     toast.error(backendError);
                // }

                showToast(backendError, 'error');

            } else {
                // Agar sach me network ka issue ho
                setError('Network error. Please try again.');
                showToast('Network error. Please try again.', 'error');
            }

        } finally {
            setSaving(false);
        }
    };

    return (

        <Dialog open={open} slots={{ transition: GrowTransition }} fullWidth maxWidth="sm" onClose={closeModal} sx={dialogSx}>

            <DialogTitle className="flex items-center justify-between px-5 py-4 ">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent-gradient flex items-center justify-center shadow-accent">
                        <FaPen className="text-white text-sm" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-base-900 dark:text-base-50">Edit Product</h2>
                        <p className="text-[11px] font-mono text-base-400 ">{product?.name}</p>
                    </div>
                </div>
                <IconButton aria-label="close" onClick={closeModal} >
                    <X size={20} />
                </IconButton>

            </DialogTitle>


            <DialogContent sx={{ px: 2.5, py: 2.5 }} dividers>

                {/* ── Image Editor ── */}
                <div className="mb-4">
                    <label className={labelCls}>Product Image</label>
                    <div className="flex gap-3">
                        {/* Current / preview */}
                        <div className="w-24 h-24 rounded-xl bg-base-50 dark:bg-base-800 border-2 border-dashed border-base-200 dark:border-base-700 flex items-center justify-center overflow-hidden shrink-0">
                            {editPreview
                                ? <img src={editPreview} alt="preview" className="w-full h-full object-contain p-1" />
                                : <ImageIcon size={22} className="text-base-300" />
                            }
                        </div>

                        <div className="flex-1 flex flex-col gap-2">
                            {/* Upload file */}
                            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-base-200 dark:border-base-700 bg-base-50 dark:bg-base-800/50 cursor-pointer hover:border-accent-400 hover:bg-accent-50/40 dark:hover:bg-sky-900/10 transition-all group text-[12px] font-semibold text-base-500 dark:text-base-400 group-hover:text-accent-500">
                                <ImageIcon size={14} className="text-base-400 group-hover:text-accent-400 transition-colors shrink-0" />
                                <span>Upload new image</span>
                                <input type="file" accept="image/*" className="hidden"
                                    onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const url = URL.createObjectURL(file);
                                        setEditPreview(url);
                                        setForm(f => ({ ...f, image: url, _imageFile: file }));
                                    }}
                                />
                            </label>

                            {/* OR paste URL */}
                            <div className="flex items-center gap-1.5">
                                <div className="flex-1 h-px bg-base-100 dark:bg-base-700" />
                                <span className="text-[10px] font-bold text-base-300 dark:text-base-600">OR</span>
                                <div className="flex-1 h-px bg-base-100 dark:bg-base-700" />
                            </div>

                            <input
                                type="url"
                                placeholder="Paste image URL…"
                                value={form.image?.startsWith('blob:') ? '' : (form.image || '')}
                                className={inputCls}
                                onChange={e => {
                                    const url = e.target.value;
                                    setForm(f => ({ ...f, image: url }));
                                    setEditPreview(url || null);
                                }}
                            />

                        </div>

                    </div>

                </div>

                {/* Fields */}
                <div className="flex flex-col gap-3.5">

                    {/* Full-width */}

                    {FIELDS.filter(f => f.full).map(({ label, name, type, ph }) => (
                        <div key={name}>
                            <label className={labelCls}>{label}</label>
                            <input className={inputCls} name={name} type={type} value={form[name] ?? ''} onChange={handleChange} placeholder={ph} />
                        </div>
                    ))}

                    {/* Half-width */}
                    <div className="grid grid-cols-3 gap-3">
                        {FIELDS.filter(f => !f.full).map(({ label, name, type, ph }) => (
                            <div key={name}>
                                <label className={labelCls}>{label}</label>
                                <input className={inputCls} name={name} type={type} value={form[name] ?? ''} onChange={handleChange} placeholder={ph} min={0} />
                            </div>
                        ))}
                    </div>

                    {/* ── Available toggle ── */}
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-base-100 dark:border-white/6 bg-base-50 dark:bg-base-800/50">

                        <div>
                            <p className="text-[12px] font-bold text-base-700 dark:text-base-200">Available for Sale</p>
                            <p className="text-[11px] text-base-400 dark:text-base-500 mt-0.5">
                                {form.is_active ? 'Product is visible and purchasable' : 'Product is hidden from store'}
                            </p>
                        </div>

                        {/* Custom toggle — no extra MUI import needed */}
                        <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none 
                                        ${form.is_active
                                    ? 'bg-linear-to-r from-accent-400 to-accent-500 shadow-md shadow-sky-500/30'
                                    : 'bg-base-200 dark:bg-base-700'
                                }`}
                        >
                            <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 
                                        ${form.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>

                    </div>

                </div>

                {/* Error */}
                {error && (
                    <div className="mt-3 flex items-center gap-2 text-[12px] font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-3 py-2 rounded-lg">
                        <IoWarning className="text-base shrink-0" /> {error}
                    </div>
                )}

            </DialogContent>

            <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1.5, gap: 1.5 }}>
                {/* <Button variant="contained" onClick={closeModal}
                            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit', borderColor: '#cbd5e1', bgcolor: "#f8fafc", color: '#64748b', px: 3, py: 1.1, '&:hover': { boxShadow: '0 0 20px 5px rgba(255,255,255,0.2)', borderColor: '#cbd5e1', bgcolor: '#fff' } }}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={saving || actionLoading}
                            startIcon={saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit', px: 3, py: 1.1, background: 'linear-gradient(135deg,#38bdf8,#2563eb)', boxShadow: '0 4px 14px rgba(14,165,233,0.3)', '&:hover': { boxShadow: '0 6px 20px rgba(14,165,233,0.45)' }, '&:disabled': { opacity: 0.7 } }}>
                            {saving ? 'Saving…' : 'Save Changes'}
                        </Button> */}

                {/* <Button
                        variant="contained"
                        onClick={closeModal}
                        disabled={saving || actionLoading}
                        className='bg-[#434343]! dark:bg-[#f8fafc]! text-white! dark:text-base-700! disabled:bg-[#2d30321c]! dark:hover:shadow-[0_0_20px_5px_rgba(255,255,255,0.2)]! dark:disabled:bg-[#3e4142]! disabled:text-gray-400!'
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '13px',
                            fontFamily: 'inherit',
                            color: '#64748b',
                            px: 3,
                            py: 1.1,
                            transition: 'all 0.25s ease',
                            // borderColor: '#cbd5e1',
                            // bgcolor: '#f8fafc',
                            // '&:hover': {
                            //     boxShadow: '0 0 20px 5px rgba(255,255,255,0.2)',
                            //     borderColor: '#cbd5e1',
                            //     bgcolor: '#fff',
                            // },
                            // '&.Mui-disabled': {
                            // bgcolor: '#2D3032',
                            // color: '#94a3b8',
                            // borderColor: '#e2e8f0',
                            // },
                        }}
                    >
                        Cancel
                    </Button>


                    <Button
                        type="submit"
                        variant="contained"
                        disabled={saving || actionLoading}
                        startIcon={<Check size={14} />}
                        loading={saving}
                        loadingPosition='start'
                        loadingIndicator={<Loader2 size={14} className="animate-spin" />}
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '13px',
                            fontFamily: 'inherit',
                            px: 3,
                            py: 1.1,
                            background: saving
                                ? 'linear-gradient(135deg,#60a5fa,#3b82f6)'
                                : 'linear-gradient(135deg,#38bdf8,#2563eb)',
                            boxShadow: saving
                                ? '0 4px 16px rgba(59,130,246,0.35)'
                                : '0 4px 14px rgba(14,165,233,0.3)',
                            transition: 'all 0.25s ease',
                            '&:hover': {
                                boxShadow: '0 6px 20px rgba(14,165,233,0.45)',
                                transform: 'translateY(-1px)',
                            },
                            '&.Mui-disabled': {
                                background: 'linear-gradient(135deg,#93c5fd,#60a5fa)',
                                color: '#ffffff',
                                opacity: 1,
                                boxShadow: '0 2px 10px rgba(59,130,246,0.2)',
                            },
                        }}
                    >
                        {saving ? 'Saving Changes...' : 'Save Changes'}
                    </Button> */}

                <Button
                    variant="dark"
                    sx={{ py: 1.1 }}
                    disabled={saving}
                    onClick={closeModal}
                >
                    Cancel
                </Button>

                <PrimaryButton
                    onClick={handleEditSubmit}
                    disabled={saving}
                    startIcon={<CheckCircle2 size={14} />}
                    loading={saving}
                    loadingPosition='start'
                    loadingIndicator={<Loader2 size={14} className="animate-spin" />}
                    sx={{ py: 1.1 }}
                >
                    {saving ? 'Saving Changes...' : 'Save Changes'}
                </PrimaryButton>

            </DialogActions>

        </Dialog>
    )
}

export default EditProductModal 