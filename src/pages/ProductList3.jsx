

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Search, SlidersHorizontal, Plus, Edit2, Trash2, Eye, X, ArrowUpDown,
    Loader2, Package, Check, AlertTriangle,
} from 'lucide-react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from '@mui/material';

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

const fmt = (n) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

/* ─────────────────────────────────────────────────
   TOGGLE SWITCH (For "Published" Column)
───────────────────────────────────────────────── */
const ToggleSwitch = ({ isOn }) => {
    return (
        <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isOn ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${isOn ? 'left-5' : 'left-0.5'}`} />
        </div>
    );
};

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
const FilterSelect = ({ label, value, options, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, []);
    const displayVal = typeof value === 'object' ? value.label : value;
    return (
        <div ref={ref} className="relative">
            <button onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-base-200 dark:border-base-700 bg-base-50 dark:bg-base-800 text-[13px] font-medium text-base-700 dark:text-base-200 hover:border-sky-400 transition-all">
                <span className="text-base-400 dark:text-base-500 text-[11px] font-bold uppercase tracking-wide">{label}:</span>
                {displayVal}
                <ChevronDown size={13} className={`text-base-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1.5 bg-white dark:bg-base-900 rounded-xl border border-base-100 dark:border-base-800 shadow-xl z-30 overflow-hidden min-w-37.5">
                    {options.map((opt) => {
                        const optVal = typeof opt === 'object' ? opt.label : opt;
                        const isActive = displayVal === optVal;
                        return (
                            <button key={optVal} onClick={() => { onChange(opt); setOpen(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] transition-colors text-left
                  ${isActive ? 'bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400 font-bold' : 'text-base-600 dark:text-base-300 hover:bg-base-50 dark:hover:bg-base-800'}`}>
                                {optVal}
                                {isActive && <Check size={12} />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

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
const ProductsList3 = () => {
    const [products, setProducts] = useState([]);
    const [dynamicCategories, setDynamicCategories] = useState(['All']);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
    const [stockFilter, setStockFilter] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const [sortDir, setSortDir] = useState('asc');

    // Sidebar Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    /* modal state */
    const [viewProduct, setViewProduct] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const [deleteProduct, setDeleteProduct] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);


    /* ── Fetch ── */
    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         try {
    //             const res = await fetch(`${API}/products/allproducts`);
    //             const data = await res.json();
    //             const actualArray = Array.isArray(data) ? data : data.products || data.data || [];

    //             const formatted = actualArray.map((item, i) => ({
    //                 id: item._id || item.id || `temp-${i}`,
    //                 name: item.name || 'Unknown Product',
    //                 category: item.category || 'General',
    //                 brand: item.brand || (item.category === 'Fashion' ? 'Raymond' : 'Samsung'), // Dummy brand for visual
    //                 price: item.new_price || 0,
    //                 old_price: item.old_price || 0,
    //                 stock: item.available ? 50 : 0,
    //                 status: item.available ? 'In Stock' : 'Out of Stock',
    //                 image: item.image || '',
    //                 sku: `#${item.id?.slice(-6) || Math.random().toString(36).substring(2, 8)}`,
    //             }));
    //             setProducts(formatted);
    //             setDynamicCategories(['All', ...new Set(formatted.map(p => p.category))]);
    //         } catch (err) {
    //             console.error('fetchProducts:', err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchProducts();
    // }, []);


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

    /* ── Filtering + sorting ── */
    const activeFilterCount = [category !== 'All' ? 1 : 0, priceRange.label !== 'All Prices' ? 1 : 0, stockFilter !== 'All' ? 1 : 0].reduce((a, b) => a + b, 0);

    const clearFilters = () => { setCategory('All'); setPriceRange(PRICE_RANGES[0]); setStockFilter('All'); setSearch(''); };

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

    const SortTh = ({ col, children, align = "center" }) => (
        <th onClick={() => toggleSort(col)} className={`pb-4 text-${align} px-4 pt-4 text-sm font-semibold text-white dark:text-gray-300 cursor-pointer select-none bg-[#323232] whitespace-nowrap hover:text-blue-500 transition-colors`}>
            <span className="inline-flex items-center gap-1.5">
                {children}
                <ArrowUpDown size={12} className={sortBy === col ? 'text-blue-500' : 'text-gray-300'} />
            </span>
        </th>
    );

    // ── Pagination States ──
    const [page, setPage] = useState(0); // MUI pagination 0-index se shuru hoti hai
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Page change handle karne ke liye
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Rows per page change handle karne ke liye
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Jab bhi limit change ho, wapas first page par bhej do
    };

    // Sirf wahi rows nikalo jo current page par dikhni chahiye
    const paginatedRows = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return filtered.slice(startIndex, startIndex + rowsPerPage);
    }, [filtered, page, rowsPerPage]);

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 bg-white dark:bg-[#121212] min-h-screen">

            {/* Header: Title */}
            <h1 className="text-[22px] font-bold text-gray-800 dark:text-gray-100 mb-6">Product List</h1>

            {/* Toolbar: Search, Filters, Add Product */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">

                {/* Search & Filter Button */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-80">
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search Product..."
                            className="w-full bg-white dark:bg-[#1e1e1e] border border-transparent dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none focus:border-blue-500 transition-all shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1e1e1e] border border-transparent dark:border-gray-800 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 shadow-sm hover:text-blue-500 transition-colors relative"
                    >
                        <SlidersHorizontal size={16} /> Filters
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-blue-500 text-[9px] text-white ring-2 ring-white" />
                        )}
                    </button>
                </div>

                {/* Add Button */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-all shadow-md shadow-blue-500/20"
                >
                    <Plus size={18} strokeWidth={2.5} /> Add Product
                </button>
            </div>

            {/* ── Content Table ── */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">

                <div className="overflow-x-auto">

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <SortTh align='left' col="name">Product</SortTh>
                                    <SortTh col="category">Category</SortTh>
                                    <SortTh col="price">Price</SortTh>
                                    <SortTh col="stock">Stock</SortTh>
                                    <TableCell className='bg-[#323232] text-white! border-b border-b-[#323232]!' align="center">Status</TableCell>
                                    <TableCell className='bg-[#323232] text-white! border-b border-b-[#323232]!' align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedRows.map((row) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="center">{row.category}</TableCell>
                                        <TableCell align="center">{row.price}</TableCell>
                                        <TableCell align="center">{row.stock}</TableCell>
                                        <TableCell align="center">{row.status}</TableCell>
                                        <TableCell align='center' className='space-x-2! mt-1.5!' >

                                            <button onClick={() => openModal('view', params.row)} className='p-1.5 bg-emerald-100 hover:bg-emerald-200 focus:ring-2 focus:ring-emerald-300 rounded-md text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 transition-colors'>
                                                <Eye size={16} />
                                            </button>
                                            <button onClick={() => openModal('edit', params.row)} className='p-1.5 bg-accent-100 hover:bg-accent-200 focus:ring-2 focus:ring-sky-300 rounded-md text-accent-600 dark:bg-accent-500/10 dark:hover:bg-accent-500/20 dark:text-accent-400 transition-colors'>
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => openModal('delete', params.row)} className='p-1.5 bg-red-100 hover:bg-red-200 focus:ring-2 focus:ring-red-300 rounded-md text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 transition-colors'>
                                                <Trash2 size={16} />
                                            </button>

                                        </TableCell>


                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination

                                        className='w-full!'
                                        rowsPerPageOptions={[5, 10, 25, 50]}
                                        // component="div"
                                        align='center'
                                        count={filtered.length} // Total rows kitni hain filter hone ke baad
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        sx={{
                                            color: 'var(--color-base-500)',
                                            borderTop: '1px solid var(--color-base-200)',
                                            '.dark &': { borderTop: '1px solid var(--color-base-800)' },
                                            '.MuiTablePagination-selectIcon': { color: 'inherit' }
                                        }}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>

                </div>

            </div>

            {/* ═════════ RIGHT SIDE FILTER DRAWER ═════════ */}

            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsFilterOpen(false)}
            />

            {/* Sidebar / Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white dark:bg-[#1a1a1a] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Drawer Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <SlidersHorizontal size={18} /> Filters
                    </h2>
                    <button onClick={() => setIsFilterOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full dark:bg-gray-800 transition-colors">
                        <X size={16} strokeWidth={3} />
                    </button>
                </div>

                {/* Drawer Body (Filter Options) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Category Filter */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-200 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                        >
                            {dynamicCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Price Range</label>
                        <div className="flex flex-col gap-2">
                            {PRICE_RANGES.map((range) => (
                                <button
                                    key={range.label}
                                    onClick={() => setPriceRange(range)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${priceRange.label === range.label
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400'
                                        : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50 dark:bg-transparent dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stock Status Filter */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Availability</label>
                        <div className="grid grid-cols-2 gap-2">
                            {STOCK_FILTERS.map((stock) => (
                                <button
                                    key={stock}
                                    onClick={() => setStockFilter(stock)}
                                    className={`px-3 py-2.5 rounded-xl text-sm transition-all border text-center ${stockFilter === stock
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400'
                                        : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50 dark:bg-transparent dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {stock}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Drawer Footer (Clear / Apply) */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1a1a1a]">
                    <button
                        onClick={() => { clearFilters(); setIsFilterOpen(false); }}
                        className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 transition-colors shadow-sm"
                    >
                        Clear All Filters
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ProductsList3;











