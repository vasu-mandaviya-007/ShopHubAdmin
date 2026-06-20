// import React, { useState } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, TextField, Slide, Grow, Zoom } from '@mui/material';
// import { X, Check, Loader2, Trash2, Edit2, AlertTriangle } from 'lucide-react';
// import { IoClose, IoWarning } from 'react-icons/io5';
// import StatusBadge from "./StatusBadge"
// import { FaPen } from 'react-icons/fa6';

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Zoom direction="down" ref={ref} {...props} />;

// });

// const fmt = (n) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

// const ProductModals = ({ activeModal, selectedProduct, closeModal, confirmEdit, confirmDelete, actionLoading }) => {

//     const inputCls = 'w-full px-3 py-2.5 rounded-lg border border-base-200 dark:border-base-700 bg-white dark:bg-base-800 text-[13px] text-base-900 dark:text-base-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10 transition-all placeholder-base-300';


//     if (!selectedProduct) return null;
//     const discount = Math.floor(100 - (selectedProduct.price * 100) / selectedProduct.old_price);

//     const [form, setForm] = useState({ ...selectedProduct });
//     const [saving, setSaving] = useState(false);
//     const [error, setError] = useState('');

//     const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!form.name.trim()) { setError('Name is required.'); return; }
//         if (Number(form.price) <= 0) { setError('Price must be greater than 0.'); return; }
//         setSaving(true);
//         try {
//             const res = await fetch(`${API}/products/update/${selectedProduct.id}`, {
//                 method: 'POST',
//                 headers: authHeaders(),
//                 body: JSON.stringify({
//                     name: form.name, category: form.category,
//                     new_price: Number(form.price), old_price: Number(form.old_price),
//                 }),
//             });
//             const data = await res.json();
//             if (data.success !== false) { onSave({ ...form, price: Number(form.price), old_price: Number(form.old_price) }); onClose(); }
//             else setError(data.error || 'Update failed.');
//         } catch { setError('Network error.'); }
//         setSaving(false);
//     };

//     return (
//         <>

//             {/* 1. EDIT PRODUCT DIALOG */}
//             <Dialog open={activeModal === 'edit'} fullWidth maxWidth="sm" onClose={closeModal}>

//                 <DialogTitle className='flex justify-between items-center' sx={{ fontWeight: 'bold', color: 'var(--color-base-900)', '.dark &': { color: 'white' } }}>
//                     <div className='inline-flex items-center gap-2'>
//                         <div className='bg-accent-100/70 p-2.5 rounded-md'>
//                             <FaPen className='text-blue-400 text-sm' />
//                         </div>
//                         Edit Product
//                     </div>
//                     <IconButton aria-label="close" onClick={closeModal} >
//                         <X size={20} />
//                     </IconButton>
//                 </DialogTitle>

//                 <DialogContent dividers={true}>

//                     <form className="p-4 flex flex-col gap-4">

//                         {[
//                             { label: 'Product Name', name: 'name', type: 'text', ph: 'e.g. Blue Denim Jacket' },
//                             { label: 'Category', name: 'category', type: 'text', ph: 'e.g. women, men, kid' },
//                             { label: 'New Price (₹)', name: 'price', type: 'number', ph: '0' },
//                             { label: 'Old Price (₹)', name: 'old_price', type: 'number', ph: '0' },
//                             { label: 'Stock', name: 'stock', type: 'number', ph: '0' },
//                         ].map(({ label, name, type, ph }) => (
//                             <div key={name} className="flex flex-col gap-1.5">
//                                 <label className="text-[11px] font-bold uppercase tracking-widest text-base-400">{label}</label>
//                                 <input className={inputCls} name={name} type={type} value={form[name] ?? ''} onChange={handle} placeholder={ph} min={type === 'number' ? 0 : undefined} />
//                             </div>
//                         ))}

//                     </form>

//                 </DialogContent>

//                 <DialogActions sx={{ px: 3, py: 2 }}>
//                     <Button fullWidth variant='contained' onClick={closeModal} className='bg-gray-500!' >
//                         Cancel
//                     </Button>
//                     <Button
//                         fullWidth
//                         type="submit" variant='contained' form="edit-product-form" disabled={actionLoading}
//                         startIcon={actionLoading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
//                         className='bg-linear-to-br! from-accent-400 to-accent-500'
//                     >
//                         {actionLoading ? 'Saving...' : 'Save Changes'}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* 2. VIEW PRODUCT DIALOG */}
//             <Dialog open={activeModal === 'view'} fullWidth maxWidth="sm" onClose={closeModal}>

//                 <DialogTitle className='flex justify-between items-center' sx={{ fontWeight: 'bold' }}>
//                     Product Details
//                     <IconButton aria-label="close" onClick={closeModal} >
//                         <X size={20} />
//                     </IconButton>
//                 </DialogTitle>

//                 <DialogContent dividers={true}>

//                     <div className="p-5 flex gap-4">
//                         <div className="w-28 h-28 rounded-xl  dark:bg-base-800 flex items-center justify-center overflow-hidden shrink-0">
//                             <img src={selectedProduct?.image} alt={selectedProduct?.name} className="w-full h-full object-contain" />
//                         </div>
//                         <div className="flex-1 min-w-0 flex items-start flex-col gap-1.5">
//                             <p className="font-bold text-base-900 dark:text-base-50 text-base leading-snug">{selectedProduct?.name}</p>
//                             <p className="text-[12px] text-base-400 font-mono">{selectedProduct?.sku}</p>
//                             <StatusBadge status={selectedProduct?.status} />
//                         </div>
//                     </div>

//                     <div className="px-5 pb-5 grid grid-cols-2 gap-3">
//                         {[
//                             { label: 'Category', val: selectedProduct?.category },
//                             { label: 'Current Price', val: `₹${fmt(selectedProduct?.price)}` },
//                             { label: 'Old Price', val: `₹${fmt(selectedProduct?.old_price)}` },
//                             { label: 'Discount', val: `${discount}%` },
//                             { label: 'Stock', val: selectedProduct?.stock === 0 ? 'Out of Stock' : selectedProduct?.stock },
//                         ].map(({ label, val }) => (
//                             <div key={label} className="bg-base-100/60 dark:bg-base-800 rounded-lg p-3">
//                                 <p className="text-[10px] font-bold uppercase tracking-widest text-base-400 mb-0.5">{label}</p>
//                                 <p className="text-sm font-semibold text-base-900 dark:text-base-50">{val}</p>
//                             </div>
//                         ))}
//                     </div>
//                     {/* </div> */}

//                 </DialogContent>
//             </Dialog>

//             {/* 3. DELETE PRODUCT DIALOG */}
//             <Dialog open={activeModal === 'delete'} slots={{ transition: Transition, }} keepMounted className='relative' fullWidth maxWidth="sm" onClose={closeModal} >

//                 <DialogContent sx={{ textAlign: 'center', py: 4, px: 6 }}>

//                     <IoClose onClick={closeModal} className='absolute top-5 right-5 text-3xl text-gray-500 cursor-pointer' />

//                     <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto! mb-4!">
//                         <Trash2 size={28} />
//                     </div>
//                     <h3 className="text-xl font-bold text-base-900 dark:text-base-50 mb-2!">Delete Product?</h3>
//                     <p className="text-sm text-base-500 dark:text-base-400 mb-6!">
//                         Are you sure you want to delete <span className="font-semibold text-base-700 dark:text-base-300">"{selectedProduct?.name}"</span>?
//                     </p>
//                     <div className='bg-[#FBE3D5] flex items-start gap-3 border-l-3 mb-6! border-orange-600 p-3'>
//                         <IoWarning className='text-orange-500 text-lg mt-0.5!' />
//                         <div className='flex flex-col items-start'>
//                             <h3 className='text-orange-800 font-bold text-sm' >Warning</h3>
//                             <p className='text-orange-600 font-medium text-sm'>This action cannot be undone.</p>
//                         </div>
//                     </div>
//                     <div className="flex gap-3">
//                         <Button variant='contained' onClick={closeModal} className='bg-[#587087]!' fullWidth>Cancel</Button>
//                         <Button
//                             variant='contained' color="error" fullWidth onClick={confirmDelete} disabled={actionLoading}
//                             startIcon={actionLoading ? <Loader2 className="animate-spin" size={16} /> : null}
//                         >
//                             {actionLoading ? 'Deleting...' : 'Delete'}
//                         </Button>
//                     </div>
//                 </DialogContent>
//             </Dialog>

//         </>
//     );
// };

// export default ProductModals;



import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogContent, DialogActions,
    Button, IconButton, Slide, Zoom,
    DialogTitle,
} from '@mui/material';
import { X, Check, Loader2, Trash2, Edit2, Plus, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { IoClose, IoWarning } from 'react-icons/io5';
import { FaPen } from 'react-icons/fa6';
import StatusBadge from './StatusBadge';
import { addProduct, updateProduct } from '../apis/productApi';

import toast from 'react-hot-toast';
import { showToast } from './showToast';
import PrimaryButton from './ui/PrimaryButton';

/* ── Transition ── */

/* ── Helpers ── */
const fmt = (n) => Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
 
const inputCls = 'w-full px-3 py-2.5 rounded-md border border-base-300 dark:border-base-700 bg-white dark:bg-base-800 text-[13px] text-base-900 dark:text-base-50 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/10 transition-all placeholder-base-400 dark:placeholder-base-400';

const labelCls = 'text-[11px] font-bold uppercase tracking-widest text-base-500 dark:text-base-500 mb-1.5 block';

const dialogSx = {
    '& .MuiDialog-paper': {
        borderRadius: '15px',
        backgroundImage: "linear-gradient(rgba(255 255 255 / 0.06), rgba(255 255 255 / 0.06))" 
        // boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
    }
};

/* ══════════════════════════════════════════════════════════
   FIELD LIST — shared by Add & Edit
══════════════════════════════════════════════════════════ */
const FIELDS = [
    { label: 'Product Name', name: 'name', type: 'text', ph: 'e.g. Blue Denim Jacket', full: true },
    { label: 'Category', name: 'category', type: 'text', ph: 'e.g. women, men, kid', full: true },
    { label: 'New Price (₹)', name: 'price', type: 'number', ph: '0', full: false },
    { label: 'Old Price (₹)', name: 'old_price', type: 'number', ph: '0', full: false },
    { label: 'Stock', name: 'stock', type: 'number', ph: '0', full: false },
];

/* ══════════════════════════════════════════════════════════
   ADD PRODUCT MODAL
══════════════════════════════════════════════════════════ */



/* ══════════════════════════════════════════════════════════
   PRODUCT MODALS (Edit + View + Delete)
   Props: activeModal, selectedProduct, closeModal,
          confirmDelete, actionLoading, onSave
══════════════════════════════════════════════════════════ */
const ProductModals = ({
    activeModal, selectedProduct, closeModal,
    confirmDelete, actionLoading, onSave,
}) => {
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [editPreview, setEditPreview] = useState(null);

    useEffect(() => {
        if (selectedProduct) {
            setForm({ ...selectedProduct });
            setEditPreview(selectedProduct.image || null);
            setError('');
        }
    }, [selectedProduct]);

    if (!selectedProduct && activeModal !== 'add') return null; 

    const discount = selectedProduct?.old_price > 0 && selectedProduct?.price > 0
        ? Math.max(0, Math.floor(100 - (selectedProduct.price * 100) / selectedProduct.old_price))
        : 0;

    const handle = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        if (error) setError('');
    };


    // const handleEditSubmit = async (e) => {
    //     e.preventDefault();
    //     if (!form.name?.trim()) { setError('Name is required.'); return; }
    //     if (Number(form.price) <= 0) { setError('Price must be greater than 0.'); return; }

    //     setSaving(true);
    //     setError('');

    //     try {

    //         const formData = new FormData();

    //         formData.append("name", form.name.trim());
    //         formData.append("category", form.category?.trim().toLowerCase());
    //         formData.append("new_price", Number(form.price));
    //         formData.append("old_price", Number(form.old_price) || Number(form.price));
    //         formData.append("stock", Number(form.stock));
    //         formData.append("available", form.is_active);

    //         formData.append("image", form._imageFile)

    //         // const res = await fetch(
    //         //     `http://localhost:3001/products/update/${selectedProduct.id}`,
    //         //     {
    //         //         method: "PUT",
    //         //         body: formData,
    //         //     }
    //         // );

    //         const data = await updateProduct(selectedProduct.id, formData);

    //         console.log(data)

    //         if (data.success !== false && !data.error) {
    //             /* Update parent list immediately */

    //             const product = data?.product;

    //             onSave?.({
    //                 ...selectedProduct,
    //                 name: product?.name,
    //                 category: product?.category,
    //                 price: product?.new_price,
    //                 old_price: product?.old_price,
    //                 stock: Number(product?.stock),
    //                 status: product?.stock == 0 ? 'Out of Stock' : product?.stock <= 5 ? "Low Stock" : 'In Stock',
    //                 is_active: product?.available,
    //                 image: product?.image, // FIX: Updating image in local state
    //             });

    //             closeModal();
    //         } else {
    //             setError(data.error || 'Update failed.');
    //             console.log(data.error)
    //         }

    //     } catch (err) {
    //         setError('Network error. Please try again.');
    //         console.log(err)

    //     } finally {
    //         setSaving(false);
    //     }
    // };


    


    return (

        <>

            {/* ══════════════════════════════════════════
                1. EDIT DIALOG
            ══════════════════════════════════════════ */}
            


            {/* ══════════════════════════════════════════
                2. VIEW DIALOG
            ══════════════════════════════════════════ */}
            


            {/* ══════════════════════════════════════════
                3. DELETE DIALOG
            ══════════════════════════════════════════ */}
            

        </>

    );

};

export default ProductModals;