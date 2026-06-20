import React, { useEffect, useState } from 'react'
import { showToast } from '../../../components/showToast';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { CheckCircle2, ImageIcon, Loader2, Plus, X } from 'lucide-react';
import PrimaryButton from '../../../components/ui/PrimaryButton';
import { dialogSx, labelCls, inputCls } from './productUtils';
import { addProduct } from '../../../apis/productApi';


const FIELDS = [
    { label: 'Product Name', name: 'name', type: 'text', ph: 'e.g. Blue Denim Jacket', full: true },
    { label: 'Category', name: 'category', type: 'text', ph: 'e.g. women, men, kid', full: true },
    { label: 'New Price (₹)', name: 'price', type: 'number', ph: '0', full: false },
    { label: 'Old Price (₹)', name: 'old_price', type: 'number', ph: '0', full: false },
    { label: 'Stock', name: 'stock', type: 'number', ph: '0', full: false },
];

const AddProductModal = ({ open, onClose, onAdded }) => {

    const EMPTY = { name: '', category: '', price: '', old_price: '', stock: '', image: '', available: true };
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(null);

    useEffect(() => { if (!open) { setForm(EMPTY); setError(''); setPreview(null); } }, [open]);

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        if (error) setError('');
    };

    /* Image file → base64 preview + store URL string */
    const handleImageFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreview(url);
        /* In production: upload to S3/Cloudinary and store the returned URL.
           For now we store the object URL as a placeholder. */
        setForm(f => ({ ...f, image: url, _imageFile: file }));
    };

    const validate = () => {
        if (!form.name.trim()) return 'Product name is required.';
        if (!form.category.trim()) return 'Category is required.';
        if (Number(form.price) <= 0) return 'New price must be greater than 0.';
        return '';
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        const err = validate();
        if (err) {
            setError(err);
            return;
        }

        setSaving(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append("name", form.name.trim());
            formData.append("category", form.category.trim().toLowerCase());
            formData.append("new_price", Number(form.price));
            formData.append("old_price", Number(form.old_price) || 0);
            formData.append("available", form.available);
            formData.append("stock", Number(form.stock));

            // if (form._imageFile) {
            //     formData.append("image", form._imageFile);
            // }

            if (form._imageFile) {
                // Agar user ne file upload ki hai
                formData.append("image", form._imageFile);
            } else if (form.image) {
                // Agar file nahi hai aur user ne URL paste ki hai
                // Note: form.pasted_url ko apne actual state variable ke naam se replace kar lena
                formData.append("pasted_url", form.image.trim());
            }

            // Axios instance ke through call
            const data = await addProduct(formData);

            if (data.success !== false && !data.error) {
                onAdded?.(data.product || data); // update parent list
                showToast('Product added successfully!', 'success');
                onClose();
            } else {
                setError(data.error || 'Failed to add product.');
                showToast(data.error || 'Failed to add product.', 'error');
            }
        } catch (err) {
            console.error("Add Product Error:", err);

            // ── AXIOS ERROR HANDLING FOR DEMO MODE ──
            if (err.response && err.response.data && err.response.data.error) {
                const backendError = err.response.data.error;
                setError(backendError);

                // Ye automatically lock 🔒 wala UI le lega
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

        <Dialog open={open} fullWidth maxWidth="sm" onClose={onClose} sx={dialogSx}>

            {/* <DialogTitle className="relative flex items-center justify-between px-5 py-4 ">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent-gradient flex items-center justify-center shadow-md shadow-sky-500/25">
                        <Plus size={17} className="text-white" />
                    </div>
                    <div> 
                        <h2 className="font-bold text-lg text-base-900 dark:text-base-50">Add Product</h2>
                        <p className="text-[11px] text-base-400 -mt-0.5">Fill in the details below</p>
                    </div>
                </div>
                <IconButton aria-label="close" onClick={onClose} >
                    <X size={20} />
                </IconButton>

                {error && (
                    <div className='absolute left-0 top-[calc(100%+20px)] z-5 w-full px-5'>
                        <div className="w-full flex items-center gap-2 text-[12px] font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-3 py-3 rounded-lg">
                            <IoWarninh className="text-base shrink-0" /> {error}
                        </div>
                    </div>
                )}

            </DialogTitle> */}

            <DialogTitle className="flex items-center justify-between py-5!">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent-gradient flex items-center justify-center">
                        <Plus size={15} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-base text-base-900 dark:text-base-50">Add Product</h2>
                        <p className="text-[11px] font-mono text-base-400">Fill in the details below</p>
                    </div>
                </div>
                <IconButton onClick={onClose} ><X size={20} /></IconButton>
            </DialogTitle>



            <DialogContent sx={{ px: 2.5, py: 2.5 }} className='relative' dividers >

                {/* Image upload */}
                <div className="mb-4">

                    <label className={labelCls}>Product Image</label>

                    <label className="flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed border-base-200 dark:border-base-700 bg-base-50 dark:bg-base-800/50 cursor-pointer hover:border-sky-400 hover:bg-accent-50/50 dark:hover:bg-sky-900/10 transition-all group overflow-hidden">

                        {preview ? (
                            <img src={preview} alt="preview" className="h-full w-full object-contain p-2" />
                        ) : (
                            <>
                                <ImageIcon size={26} className="text-base-300 group-hover:text-accent-400 transition-colors" />
                                <span className="text-[12px] font-semibold text-base-400 group-hover:text-accent-500 transition-colors">
                                    Click to upload image
                                </span>
                                <span className="text-[11px] text-base-300">PNG, JPG up to 5MB</span>
                            </>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
                    </label>

                    {/* OR — paste URL */}
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-px bg-base-100 dark:bg-base-700" />
                        <span className="text-[11px] font-bold text-base-300">OR</span>
                        <div className="flex-1 h-px bg-base-100 dark:bg-base-700" />
                    </div>
                    <input
                        name="image_url" type="url"
                        placeholder="Paste image URL…"
                        className={`${inputCls} mt-2`}
                        onChange={e => { setForm(f => ({ ...f, image: e.target.value })); !form._imageFile && setPreview(e.target.value || null); }}
                    />
                </div>

                {/* Full-width fields */}
                {FIELDS.filter(f => f.full).map(({ label, name, type, ph }) => (
                    <div key={name} className="mb-3.5">
                        <label className={labelCls}>{label}</label>
                        <input className={inputCls} name={name} type={type} value={form[name]} onChange={handleChange} placeholder={ph} />
                    </div>
                ))}

                {/* Half-width fields grid */}
                <div className="grid grid-cols-3 gap-3">
                    {FIELDS.filter(f => !f.full).map(({ label, name, type, ph }) => (
                        <div key={name}>
                            <label className={labelCls}>{label}</label>
                            <input className={inputCls} name={name} type={type} value={form[name]} onChange={handleChange} placeholder={ph} min={0} />
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-3 px-4 py-3 rounded-xl border border-base-100 dark:border-white/6 bg-base-50 dark:bg-base-800/50">
                    <div>
                        <p className="text-[12px] font-bold text-base-700 dark:text-base-200">Available for Sale</p>
                        <p className="text-[11px] text-base-400 dark:text-base-500 mt-0.5">
                            {form.available ? 'Product is visible and purchasable' : 'Product is hidden from store'}
                        </p>
                    </div>
                    {/* Custom toggle — no extra MUI import needed */}
                    <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, available: !f.available }))}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none 
                                        ${form.available
                                ? 'bg-linear-to-r from-accent-400 to-accent-500 shadow-md shadow-sky-500/30'
                                : 'bg-base-200 dark:bg-base-700'
                            }`}
                    >
                        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 
                                        ${form.available ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>



            </DialogContent>

            <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1.5, gap: 1.5 }}>

                {/* <Button
                        variant="contained"
                        onClick={onClose}
                        disabled={saving}
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
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        form="add-product-form"
                        disabled={saving}
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

                <Button variant="dark" onClick={onClose} sx={{ py: 1.1 }} disabled={saving}>
                    Cancel
                </Button>

                <PrimaryButton
                    // type="submit"
                    onClick={handleSubmit}
                    disabled={saving}
                    loading={saving}
                    form="add-product-form"
                    loadingPosition="start"
                    startIcon={<CheckCircle2 size={14} />}
                    loadingIndicator={<Loader2 size={14} className="animate-spin" />}
                    sx={{ py: 1.1 }}
                >
                    {saving ? 'Saving Changes...' : 'Save Changes'}

                </PrimaryButton>

            </DialogActions>

            {/* <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 0, gap: 1.5 }}>
                    <Button variant="outlined" onClick={onClose}
                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit', borderColor: '#e2e8f0', color: '#64748b', px: 3, py: 1.1, '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' } }}>
                        Cancel
                    </Button>
                    <Button type="submit" form="add-product-form" variant="contained" disabled={saving}
                        startIcon={saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, fontSize: '13px', fontFamily: 'inherit', px: 3, py: 1.1, background: 'linear-gradient(135deg,#38bdf8,#2563eb)', boxShadow: '0 4px 14px rgba(14,165,233,0.3)', '&:hover': { boxShadow: '0 6px 20px rgba(14,165,233,0.45)' }, '&:disabled': { opacity: 0.7 } }}>
                        {saving ? 'Adding…' : 'Add Product'}
                    </Button>
                </DialogActions> */}

            {/* </form> */}

        </Dialog>

    );

};
export default AddProductModal