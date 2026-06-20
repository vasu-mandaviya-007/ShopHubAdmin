import { FaLongArrowAltDown } from "react-icons/fa";
import { FaLongArrowAltUp } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";




import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Search, SlidersHorizontal, LayoutGrid, List,
    Plus, Edit2, Trash2, Eye, X, ArrowUpDown,
    Loader2, Package, ChevronDown, Check, AlertTriangle,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import FilterSelect from "../components/FilterSelect";

const API = 'http://localhost:3001';
const authHeaders = () => ({
    'Content-Type': 'application/json',
    'auth-token': localStorage.getItem('auth-token') || '',
});

const PRICE_RANGES = [
    { label: 'All Prices', min: 0, max: Infinity },
    { label: 'Under ₹1K', min: 0, max: 1000 },
    { label: '₹1K–₹10K', min: 1000, max: 10000 },
    { label: '₹10K–₹50K', min: 10000, max: 50000 },
    { label: 'Above ₹50K', min: 50000, max: Infinity },
];
const STOCK_FILTERS = ['All', 'In Stock', 'Out of Stock'];

/* ── tiny helpers ── */
const fmt = (n) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

/* ─────────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const styles = status === 'In Stock'
        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
        : 'bg-rose-50 text-rose-500 border-rose-100';
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'In Stock' ? 'bg-emerald-500' : 'bg-rose-400'}`} />
            {status}
        </span>
    );
};

/* ─────────────────────────────────────────────────
   FILTER SELECT
───────────────────────────────────────────────── */
// const FilterSelect = ({ label, value, options, onChange }) => {
//     const [open, setOpen] = useState(false);
//     const ref = useRef(null);
//     useEffect(() => {
//         const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//         document.addEventListener('mousedown', fn);
//         return () => document.removeEventListener('mousedown', fn);
//     }, []);
//     const displayVal = typeof value === 'object' ? value.label : value;
//     return (
//         <div ref={ref} className="relative">
//             <button onClick={() => setOpen(o => !o)}
//                 className="flex items-center gap-2 px-3 py-2 rounded-lg border border-base-200 dark:border-base-700 bg-base-50 dark:bg-base-800 text-[13px] font-medium text-base-700 dark:text-base-200 hover:border-sky-400 transition-all">
//                 <span className="text-base-400 dark:text-base-500 text-[11px] font-bold uppercase tracking-wide">{label}:</span>
//                 {displayVal}
//                 <ChevronDown size={13} className={`text-base-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
//             </button>
//             {open && (
//                 <div className="absolute top-full left-0 mt-1.5 bg-white dark:bg-base-900 rounded-xl border border-base-100 dark:border-base-800 shadow-xl z-30 overflow-hidden min-w-37.5">
//                     {options.map((opt) => {
//                         const optVal = typeof opt === 'object' ? opt.label : opt;
//                         const isActive = displayVal === optVal;
//                         return (
//                             <button key={optVal} onClick={() => { onChange(opt); setOpen(false); }}
//                                 className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] transition-colors text-left
//                   ${isActive ? 'bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400 font-bold' : 'text-base-600 dark:text-base-300 hover:bg-base-50 dark:hover:bg-base-800'}`}>
//                                 {optVal}
//                                 {isActive && <Check size={12} />}
//                             </button>
//                         );
//                     })}
//                 </div>
//             )}
//         </div>
//     );
// };

/* ─────────────────────────────────────────────────
   VIEW PRODUCT MODAL
───────────────────────────────────────────────── */
const ViewModal = ({ product, onClose }) => {
    if (!product) return null;
    const discount = Math.floor(100 - (product.price * 100) / product.old_price);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-md bg-white dark:bg-base-900 rounded-2xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-base-100 dark:border-base-800">
                    <h3 className="font-extrabold text-base-900 dark:text-base-50 text-base">Product Details</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl bg-base-100 dark:bg-base-800 hover:bg-base-200 dark:hover:bg-base-700 flex items-center justify-center transition-colors">
                        <X size={15} className="text-base-500" />
                    </button>
                </div>
                <div className="p-5 flex gap-4">
                    <div className="w-28 h-28 rounded-xl bg-base-50 dark:bg-base-800 flex items-center justify-center overflow-hidden shrink-0">
                        <img src={product.image} alt={product.name} className="w-24 h-24 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                        <p className="font-extrabold text-base-900 dark:text-base-50 text-base leading-snug">{product.name}</p>
                        <p className="text-[12px] text-base-400 font-mono">{product.sku}</p>
                        <StatusBadge status={product.status} />
                    </div>
                </div>
                <div className="px-5 pb-5 grid grid-cols-2 gap-3">
                    {[
                        { label: 'Category', val: product.category },
                        { label: 'Current Price', val: `₹${fmt(product.price)}` },
                        { label: 'Old Price', val: `₹${fmt(product.old_price)}` },
                        { label: 'Discount', val: `${discount}%` },
                        { label: 'Stock', val: product.stock === 0 ? 'Out of Stock' : product.stock },
                    ].map(({ label, val }) => (
                        <div key={label} className="bg-base-50 dark:bg-base-800 rounded-xl p-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-base-400 mb-0.5">{label}</p>
                            <p className="text-sm font-bold text-base-900 dark:text-base-50">{val}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────
   EDIT PRODUCT MODAL
───────────────────────────────────────────────── */
const EditModal = ({ product, onClose, onSave }) => {
    const [form, setForm] = useState({ ...product });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) { setError('Name is required.'); return; }
        if (Number(form.price) <= 0) { setError('Price must be greater than 0.'); return; }
        setSaving(true);
        try {
            const res = await fetch(`${API}/products/update/${product.id}`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({
                    name: form.name, category: form.category,
                    new_price: Number(form.price), old_price: Number(form.old_price),
                }),
            });
            const data = await res.json();
            if (data.success !== false) { onSave({ ...form, price: Number(form.price), old_price: Number(form.old_price) }); onClose(); }
            else setError(data.error || 'Update failed.');
        } catch { setError('Network error.'); }
        setSaving(false);
    };

    const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-base-200 dark:border-base-700 bg-white dark:bg-base-800 text-[13px] text-base-900 dark:text-base-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10 transition-all placeholder-base-300';

    if (!product) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>

            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <div className="relative w-full h-full max-w-md bg-white dark:bg-base-900 rounded-2xl shadow-2xl "

                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-base-100 dark:border-base-800">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-accent-50 dark:bg-accent-500/10 flex items-center justify-center">
                            <Edit2 size={13} className="text-accent-500" />
                        </div>
                        <h3 className="font-extrabold text-base-900 dark:text-base-50 text-base">Edit Product</h3>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl bg-base-100 dark:bg-base-800 hover:bg-base-200 dark:hover:bg-base-700 flex items-center justify-center transition-colors">
                        <X size={15} className="text-base-500" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                    {error && (
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-[13px] font-medium">
                            <AlertTriangle size={14} /> {error}
                        </div>
                    )}
                    {[
                        { label: 'Product Name', name: 'name', type: 'text', ph: 'e.g. Blue Denim Jacket' },
                        { label: 'Category', name: 'category', type: 'text', ph: 'e.g. women, men, kid' },
                        { label: 'New Price (₹)', name: 'price', type: 'number', ph: '0' },
                        { label: 'Old Price (₹)', name: 'old_price', type: 'number', ph: '0' },
                    ].map(({ label, name, type, ph }) => (
                        <div key={name} className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-base-400">{label}</label>
                            <input className={inputCls} name={name} type={type} value={form[name] ?? ''} onChange={handle} placeholder={ph} min={type === 'number' ? 0 : undefined} />
                        </div>
                    ))}
                    <div className="flex gap-3 mt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-base-200 dark:border-base-700 text-[13px] font-bold text-base-500 hover:border-base-400 transition-all">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-accent-400 to-accent-500 text-white text-[13px] font-bold hover:opacity-90 transition-all disabled:opacity-60">
                            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Check size={14} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
            
        </div>
    );
};

/* ─────────────────────────────────────────────────
   DELETE CONFIRM MODAL
───────────────────────────────────────────────── */
const DeleteModal = ({ product, onClose, onDelete }) => {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`${API}/products/remove/${product.id}`, {
                method: 'POST', headers: authHeaders(),
            });
            const data = await res.json();
            if (data.success !== false) { onDelete(product.id); onClose(); }
            else setError(data.error || 'Delete failed.');
        } catch { setError('Network error.'); }
        setDeleting(false);
    };

    if (!product) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm bg-white dark:bg-base-900 rounded-2xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}>
                <div className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                        <Trash2 size={24} className="text-rose-500" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-base-900 dark:text-base-50 text-base mb-1">Delete Product?</h3>
                        <p className="text-[13px] text-base-500 dark:text-base-400 leading-relaxed">
                            Are you sure you want to delete <span className="font-bold text-base-700 dark:text-base-200">"{product.name}"</span>? This cannot be undone.
                        </p>
                    </div>
                    {error && (
                        <div className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-[13px] font-medium">
                            <AlertTriangle size={14} /> {error}
                        </div>
                    )}
                    <div className="flex gap-3 w-full">
                        <button onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-base-200 dark:border-base-700 text-[13px] font-bold text-base-500 hover:border-base-400 transition-all">
                            Cancel
                        </button>
                        <button onClick={handleDelete} disabled={deleting}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500 text-white text-[13px] font-bold hover:bg-rose-600 transition-all disabled:opacity-60">
                            {deleting ? <><Loader2 size={14} className="animate-spin" /> Deleting…</> : <><Trash2 size={14} /> Delete</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────
   ADD PRODUCT MODAL
───────────────────────────────────────────────── */
const AddModal = ({ onClose, onAdd }) => {
    const [form, setForm] = useState({ name: '', category: '', price: '', old_price: '', image: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.category.trim()) { setError('Name and category are required.'); return; }
        if (Number(form.price) <= 0 || Number(form.old_price) <= 0) { setError('Both prices must be greater than 0.'); return; }
        setSaving(true);
        try {
            const res = await fetch(`${API}/products/addproduct`, {
                method: 'POST', headers: authHeaders(),
                body: JSON.stringify({ name: form.name, category: form.category, new_price: Number(form.price), old_price: Number(form.old_price), image: form.image }),
            });
            const data = await res.json();
            if (data.success !== false) { onAdd(data.product ?? { ...form, id: data.id, price: Number(form.price), old_price: Number(form.old_price), status: 'In Stock', stock: 50, sku: `SKU-${data.id}` }); onClose(); }
            else setError(data.error || 'Add failed.');
        } catch { setError('Network error.'); }
        setSaving(false);
    };

    const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-base-200 dark:border-base-700 bg-white dark:bg-base-800 text-[13px] text-base-900 dark:text-base-50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10 transition-all placeholder-base-300';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-md bg-white dark:bg-base-900 rounded-2xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-base-100 dark:border-base-800">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                            <Plus size={13} className="text-emerald-500" />
                        </div>
                        <h3 className="font-extrabold text-base-900 dark:text-base-50 text-base">Add Product</h3>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl bg-base-100 dark:bg-base-800 hover:bg-base-200 dark:hover:bg-base-700 flex items-center justify-center transition-colors">
                        <X size={15} className="text-base-500" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                    {error && (
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-[13px] font-medium">
                            <AlertTriangle size={14} /> {error}
                        </div>
                    )}
                    {[
                        { label: 'Product Name', name: 'name', type: 'text', ph: 'e.g. Blue Denim Jacket' },
                        { label: 'Category', name: 'category', type: 'text', ph: 'e.g. women, men, kid' },
                        { label: 'New Price (₹)', name: 'price', type: 'number', ph: '0' },
                        { label: 'Old Price (₹)', name: 'old_price', type: 'number', ph: '0' },
                        { label: 'Image URL', name: 'image', type: 'text', ph: 'https://…' },
                    ].map(({ label, name, type, ph }) => (
                        <div key={name} className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-widest text-base-400">{label}</label>
                            <input className={inputCls} name={name} type={type} value={form[name]} onChange={handle} placeholder={ph} min={type === 'number' ? 0 : undefined} />
                        </div>
                    ))}
                    <div className="flex gap-3 mt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-base-200 dark:border-base-700 text-[13px] font-bold text-base-500 hover:border-base-400 transition-all">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-emerald-400 to-teal-500 text-white text-[13px] font-bold hover:opacity-90 transition-all disabled:opacity-60">
                            {saving ? <><Loader2 size={14} className="animate-spin" /> Adding…</> : <><Plus size={14} /> Add Product</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────
   ACTION MENU (3-dot per row)
───────────────────────────────────────────────── */
const ActionMenu = ({ product, onView, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, []);

    const actions = [
        { icon: Eye, label: 'View', color: 'text-accent-500', fn: onView },
        { icon: Edit2, label: 'Edit', color: 'text-amber-500', fn: onEdit },
        { icon: Trash2, label: 'Delete', color: 'text-rose-500', fn: onDelete },
    ];

    return (
        <div ref={ref} className="relative">
            <button onClick={() => setOpen(o => !o)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-base-100 dark:hover:bg-base-800 transition-colors text-base-400 hover:text-base-600 dark:hover:text-base-200">
                <svg width="16" height="4" fill="currentColor" viewBox="0 0 16 4">
                    <circle cx="2" cy="2" r="1.5" /><circle cx="8" cy="2" r="1.5" /><circle cx="14" cy="2" r="1.5" />
                </svg>
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-base-900 rounded-xl border border-base-100 dark:border-base-800 shadow-xl z-20 overflow-hidden"
                    style={{ animation: 'fadeDown .15s ease-out' }}>
                    {actions.map(({ icon: Icon, label, color, fn }) => (
                        <button key={label} onClick={() => { fn(); setOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-medium text-base-600 dark:text-base-300 hover:bg-base-50 dark:hover:bg-base-800 transition-colors text-left">
                            <Icon size={14} className={color} />
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────────
   GRID CARD
───────────────────────────────────────────────── */
const GridCard = ({ product, onView, onEdit, onDelete }) => {
    const discount = Math.floor(100 - (product.price * 100) / product.old_price);
    return (
        <div className="bg-base-100 dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-2xl overflow-hidden group hover:shadow-lg hover:border-sky-200 dark:hover:border-sky-500/30 transition-all duration-200">
            <div className="relative bg-base-50 dark:bg-base-800 flex items-center justify-center h-36 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-28 h-28 object-contain group-hover:scale-105 transition-transform duration-300" />
                {discount > 0 && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-rose-500 px-2 py-0.5 rounded-full">
                        -{discount}%
                    </span>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ActionMenu product={product} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                </div>
            </div>
            <div className="p-3.5">
                <p className="text-[13px] font-bold text-base-900 dark:text-base-50 truncate mb-1">{product.name}</p>
                <p className="text-[11px] text-base-400 capitalize mb-2">{product.category}</p>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-sm font-extrabold text-accent-600 dark:text-accent-400">₹{fmt(product.price)}</span>
                        <span className="text-[11px] text-base-400 line-through ml-1.5">₹{fmt(product.old_price)}</span>
                    </div>
                    <StatusBadge status={product.status} />
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────── */
const ProductsList2 = () => {
    const [products, setProducts] = useState([]);
    const [dynamicCategories, setDynamicCategories] = useState(['All']);
    const [loading, setLoading] = useState(true);

    const [view, setView] = useState('table');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
    const [stockFilter, setStockFilter] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const [sortDir, setSortDir] = useState('asc');
    const [showFilters, setShowFilters] = useState(true);

    /* modal state */
    const [viewProduct, setViewProduct] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const [deleteProduct, setDeleteProduct] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    /* ── Fetch ── */
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API}/products/allproducts`);
                const data = await res.json();
                const formatted = data.map(item => ({
                    id: item._id || item.id,
                    name: item.name,
                    category: item.category,
                    price: item.new_price,
                    old_price: item.old_price,
                    stock: item.available ? 50 : 0,
                    status: item.available ? 'In Stock' : 'Out of Stock',
                    image: item.image,
                    sku: `SKU-${item.id}`,
                }));
                setProducts(formatted);
                setDynamicCategories(['All', ...new Set(formatted.map(p => p.category))]);
            } catch (err) {
                console.error('fetchProducts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    /* ── CRUD handlers ── */
    const handleSaveEdit = (updated) => {
        setProducts(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p));
    };
    const handleDelete = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };
    const handleAdd = (newProduct) => {
        setProducts(prev => [newProduct, ...prev]);
        setDynamicCategories(prev =>
            prev.includes(newProduct.category) ? prev : [...prev, newProduct.category]
        );
    };

    /* ── Filtering + sorting ── */
    const activeFilterCount = [
        category !== 'All' ? 1 : 0,
        priceRange.label !== 'All Prices' ? 1 : 0,
        stockFilter !== 'All' ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    const clearFilters = () => {
        setCategory('All'); setPriceRange(PRICE_RANGES[0]); setStockFilter('All'); setSearch('');
    };

    const toggleSort = (col) => {
        sortBy === col ? setSortDir(d => d === 'asc' ? 'desc' : 'asc') : (setSortBy(col), setSortDir('asc'));
    };

    const filtered = useMemo(() => {
        let list = products.filter(p => {
            const q = search.toLowerCase();
            return (
                (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
                (category === 'All' || p.category === category) &&
                (p.price >= priceRange.min && p.price < priceRange.max) &&
                (stockFilter === 'All' || p.status === stockFilter)
            );
        });
        list.sort((a, b) => {
            let av = a[sortBy], bv = b[sortBy];
            if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
            if (av < bv) return sortDir === 'asc' ? -1 : 1;
            if (av > bv) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
        return list;
    }, [search, category, priceRange, stockFilter, sortBy, sortDir, products]);

    const SortTh = ({ col, children }) => (
        <th onClick={() => toggleSort(col)}
            className="py-5 px-4 text-[11px] font-bold tracking-widest uppercase border-b border-base-200 dark:border-base-800 cursor-pointer select-none whitespace-nowrap hover:text-base-300 transition-colors">
            <span className="inline-flex items-center gap-1.5">
                {children}
                <div className="flex">
                    <FaLongArrowAltUp size={11} className={` ${sortBy === col && sortDir === "asc" ? 'text-accent-500' : 'text-base-300 dark:text-base-600'}`} />
                    <FaLongArrowAltDown size={11} className={`-translate-x-1 ${sortBy === col && sortDir === "desc" ? 'text-accent-500' : 'text-base-300 dark:text-base-600'}`} />
                </div>
            </span>
        </th>
    );

    return (
        <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto">
            <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .afu1{animation:fadeUp .35s ease both .05s}
        .afu2{animation:fadeUp .35s ease both .12s}
      `}</style>

            {/* Modals */}
            {viewProduct && <ViewModal product={viewProduct} onClose={() => setViewProduct(null)} />}
            {editProduct && <EditModal product={editProduct} onClose={() => setEditProduct(null)} onSave={handleSaveEdit} />}
            {deleteProduct && <DeleteModal product={deleteProduct} onClose={() => setDeleteProduct(null)} onDelete={handleDelete} />}
            {showAddModal && <AddModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}

            {/* ── Header ── */}
            <div className="flex flex-wrap items-start justify-between gap-3 afu1">
                <div>
                    <h1 className="text-2xl font-extrabold text-base-900 dark:text-base-50 tracking-tight mb-1">Products</h1>
                    <p className="text-[13px] font-medium text-base-500 dark:text-base-400">
                        {filtered.length} of {products.length} products
                    </p>
                </div>
                <button onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-gradient text-white font-bold text-[13px] shadow-[0_4px_16px_rgba(56,189,248,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(56,189,248,0.35)] transition-all duration-200">
                    <Plus size={16} strokeWidth={2.5} /> Add Product
                </button>
            </div>

            {/* ── Toolbar ── */}
            <div className="bg-base-100 dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-xl p-3.5 flex flex-wrap gap-3 items-center afu1">
                <div className="relative flex-1 min-w-48">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or SKU…"
                        className="w-full bg-base-50 dark:bg-base-800 border border-base-200 dark:border-base-700 rounded-lg py-2 pl-9 pr-8 text-[13px] text-base-900 dark:text-base-50 placeholder-base-400 outline-none focus:border-sky-400/50 focus:ring-1 focus:ring-sky-400/20 transition-all" />
                    {search && <X size={14} onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-400 hover:text-base-600 cursor-pointer" />}
                </div>
                <button onClick={() => setShowFilters(p => !p)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-bold border transition-colors
            ${showFilters
                            ? 'bg-accent-50 text-accent-600 border-sky-200 dark:bg-accent-500/10 dark:text-accent-400 dark:border-sky-500/20'
                            : 'bg-base-50 text-base-600 border-base-200 dark:bg-base-800 dark:text-base-300 dark:border-base-700 hover:bg-base-100 dark:hover:bg-base-700'}`}>
                    <SlidersHorizontal size={14} /> Filters
                    {activeFilterCount > 0 && (
                        <span className="bg-accent-500 text-white text-[10px] px-1.5 py-px rounded-full">{activeFilterCount}</span>
                    )}
                </button>
                <div className="flex-1 hidden sm:block" />
                <div className="flex bg-base-50 dark:bg-base-800 border border-base-200 dark:border-base-700 rounded-lg p-1 gap-1">
                    {[['grid', LayoutGrid], ['table', List]].map(([v, Icon]) => (
                        <button key={v} onClick={() => setView(v)}
                            className={`w-8 h-8 rounded-md flex items-center justify-center transition-all
                ${view === v ? 'bg-white dark:bg-base-900 text-base-900 dark:text-base-50 shadow-sm' : 'text-base-400 hover:text-base-600 dark:hover:text-base-300'}`}>
                            <Icon size={15} />
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Filter bar ── */}
            {showFilters && (
                <div className="relative z-20 bg-base-100 dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-xl p-3.5 flex flex-wrap gap-3 items-center afu1">
                    <FilterSelect label="Category" value={category} options={dynamicCategories} onChange={setCategory} />
                    <FilterSelect label="Price" value={priceRange.label} options={PRICE_RANGES} onChange={setPriceRange} />
                    <FilterSelect label="Stock" value={stockFilter} options={STOCK_FILTERS} onChange={setStockFilter} />
                    {activeFilterCount > 0 && (
                        <button onClick={clearFilters}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-base-100 text-base-600 hover:bg-base-200 dark:bg-base-800 dark:text-base-400 dark:hover:bg-base-700 transition-colors text-[13px] font-bold">
                            <X size={13} strokeWidth={2.5} /> Clear
                        </button>
                    )}
                </div>
            )}


            {/* ── Content ── */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 afu2">
                    <Loader2 className="w-10 h-10 text-accent-500 animate-spin mb-4" />
                    <p className="text-base-500 font-bold text-sm">Loading products…</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-base-100 dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-2xl py-16 px-6 flex flex-col items-center text-center afu2">
                    <Package size={44} className="text-base-300 dark:text-base-700 mb-4" strokeWidth={1.5} />
                    <p className="text-base font-extrabold text-base-900 dark:text-base-50 mb-1">No products found</p>
                    <p className="text-[13px] text-base-500">Try adjusting your search or filters.</p>
                </div>
            ) : view === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 afu2">
                    {filtered.map(p => (
                        <GridCard key={p.id} product={p}
                            onView={() => setViewProduct(p)}
                            onEdit={() => setEditProduct(p)}
                            onDelete={() => setDeleteProduct(p)}
                        />
                    ))}
                </div>
            ) : (
                <div className=" dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-xl overflow-hidden afu2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#121212] dark:bg-[#101010] text-white">
                                    <th className="pb-3 px-4 pt-4 border-b border-base-200 dark:border-base-800 w-12" />
                                    <SortTh col="name">Product</SortTh>
                                    <SortTh col="category">Category</SortTh>
                                    <SortTh col="price">Price</SortTh>
                                    <SortTh col="stock">Stock</SortTh>
                                    <th className="py-5 px-4 text-[11px] font-bold tracking-widest uppercase border-b border-base-200 dark:border-base-800">Status</th>
                                    <th className="py-5 px-4 text-[11px] font-bold tracking-widest uppercase border-b border-base-200 dark:border-base-800">SKU</th>
                                    <th className="py-5 px-4 text-[11px] font-bold tracking-widest uppercase border-b border-base-200 dark:border-base-800 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(p => (
                                    <tr key={p.id} className="hover:bg-[#F7F7F7] dark:hover:bg-base-800/50 transition-colors group">
                                        <td className="py-3 px-4 border-b border-base-100 dark:border-base-800 group-last:border-0">
                                            <div className="w-10 h-10 rounded-xl bg-base-50 dark:bg-base-800 flex items-center justify-center overflow-hidden">
                                                <img src={p.image} alt={p.name} className="w-8 h-8 object-contain" />
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 border-b border-base-100 dark:border-base-800 group-last:border-0">
                                            <p className="font-semibold text-[13px] text-base-900 dark:text-base-100 max-w-45 truncate">{p.name}</p>
                                        </td>
                                        <td className="py-3 px-4 border-b border-base-100 dark:border-base-800 group-last:border-0 text-[13px] text-base-500 dark:text-base-400 capitalize">{p.category}</td>
                                        <td className="py-3 px-4 border-b border-base-100 dark:border-base-800 group-last:border-0">
                                            <span className="font-extrabold text-[13px] text-accent-600 dark:text-accent-400">₹{fmt(p.price)}</span>
                                            <span className="text-[11px] text-base-400 line-through ml-2!">₹{fmt(p.old_price)}</span>
                                        </td>
                                        <td className={`py-3 px-4 border-b border-base-100 dark:border-base-800 group-last:border-0 text-[13px] font-bold
                      ${p.stock === 0 ? 'text-base-400 dark:text-base-600' : p.stock <= 7 ? 'text-amber-500' : 'text-base-600 dark:text-base-300'}`}>
                                            {p.stock === 0 ? '—' : p.stock}
                                        </td>
                                        <td className="py-3 px-4 border-b border-base-100 dark:border-base-800 group-last:border-0">
                                            <StatusBadge status={p.status} />
                                        </td>
                                        <td className="py-3 px-4 border-b border-base-100 dark:border-base-800 group-last:border-0 text-[11px] font-mono text-base-400 dark:text-base-500">{p.sku}</td>
                                        <td className="py-3 px-4 flex items-center justify-center border-b border-base-100 dark:border-base-800 group-last:border-0 text-center">
                                            <ActionMenu
                                                product={p}
                                                onView={() => setViewProduct(p)}
                                                onEdit={() => setEditProduct(p)}
                                                onDelete={() => setDeleteProduct(p)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-5 py-3 border-t border-base-200 dark:border-base-800 flex items-center justify-between text-[12px] font-medium text-base-500 dark:text-base-400 bg-base-50/50 dark:bg-base-800/20">
                        <span>Showing {filtered.length} of {products.length} products</span>
                        <span>Sorted by <span className="font-bold text-accent-600 dark:text-accent-400">{sortBy}</span> ({sortDir})</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsList2;











