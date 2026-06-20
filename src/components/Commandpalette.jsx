import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, X, Package, ShoppingBag, Users, ArrowRight,
    Clock, CornerDownLeft, ArrowUp, ArrowDown, Loader2,
    Settings, LayoutDashboard, Tag, TrendingUp
} from 'lucide-react';

import api from "../apis/axiosClient";


// const API = 'http://localhost:3001';

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'admin-token': localStorage.getItem('admin-token') || '',
});

/* ─────────────────────────────────────────────────
   Static "quick action" commands — always searchable,
   even with an empty query (like Unfold's nav commands)
───────────────────────────────────────────────── */
const QUICK_ACTIONS = [
    { id: 'nav-dashboard', group: 'Navigate', icon: LayoutDashboard, title: 'Dashboard', desc: 'Go to overview', to: '/admin/dashboard' },
    { id: 'nav-products', group: 'Navigate', icon: Package, title: 'Products', desc: 'Manage inventory', to: '/admin/products' },
    { id: 'nav-orders', group: 'Navigate', icon: ShoppingBag, title: 'Orders', desc: 'View all orders', to: '/admin/orders' },
    { id: 'nav-customers', group: 'Navigate', icon: Users, title: 'Customers', desc: 'Manage customers', to: '/admin/customers' },
    { id: 'nav-settings', group: 'Navigate', icon: Settings, title: 'Settings', desc: 'Store & account', to: '/admin/settings' },
];

/* ─── Highlight matched substring ─── */
const Highlight = ({ text, query }) => {
    if (!query) return <>{text}</>;
    const i = text?.toLowerCase().indexOf(query.toLowerCase());
    if (i === -1 || !text) return <>{text}</>;
    return (
        <>
            {text.slice(0, i)}
            <mark className="bg-accent-200/60 dark:bg-accent-500/30 text-accent-800 dark:text-accent-300 rounded-[3px] px-0.5">
                {text.slice(i, i + query.length)}
            </mark>
            {text.slice(i + query.length)}
        </>
    );
};

/* ─── Single result row ─── */
const ResultRow = ({ item, query, active, onClick, refEl }) => (
    <button ref={refEl} onClick={onClick}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors duration-100
            ${active ? 'bg-accent-50 dark:bg-accent-500/10' : 'hover:bg-base-50 dark:hover:bg-base-800/60'}`}>

        {/* Icon / thumbnail */}
        {item.image ? (
            <div className="w-9 h-9 rounded-lg bg-base-50 dark:bg-base-800 border border-base-100 dark:border-base-700 flex items-center justify-center overflow-hidden shrink-0">
                <img src={item.image} alt="" className="w-7 h-7 object-contain" />
            </div>
        ) : (
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-accent-500 text-white' : 'bg-base-100 dark:bg-base-800 text-base-400'}`}>
                <item.icon size={15} />
            </div>
        )}

        {/* Text */}
        <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-base-800 dark:text-base-100 truncate">
                <Highlight text={item.title} query={query} />
            </p>
            {item.desc && (
                <p className="text-[11px] text-base-400 truncate mt-0.5">
                    <Highlight text={item.desc} query={query} />
                </p>
            )}
        </div>

        {/* Right-side meta (price/status/etc) */}
        {item.meta && (
            <span className="text-[11px] font-bold text-base-400 shrink-0">{item.meta}</span>
        )}

        {active && <ArrowRight size={13} className="text-accent-500 shrink-0" />}
    </button>
);

/* ═══════════════════════════════════════════════════
   MAIN COMMAND PALETTE
═══════════════════════════════════════════════════ */
const CommandPalette = ({ open, onClose }) => {

    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [debounced, setDebounced] = useState('');
    const [results, setResults] = useState({ products: [], orders: [], customers: [] });
    const [loading, setLoading] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const [history, setHistory] = useState(() => {
        try { return JSON.parse(localStorage.getItem('admin-search-history') || '[]'); } catch { return []; }
    });

    const inputRef = useRef(null);
    const listRef = useRef(null);
    const itemRefs = useRef([]); 

    /* ── Debounce query input (300ms) ── */
    useEffect(() => {
        const t = setTimeout(() => setDebounced(query.trim()), 300);
        return () => clearTimeout(t);
    }, [query]);

    /* ── Reset state every time palette opens ── */
    useEffect(() => {
        if (open) {
            setQuery(''); setDebounced(''); setActiveIdx(0);
            setResults({ products: [], orders: [], customers: [] });
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    /* ── Fetch across all 3 "models" in parallel ── */
    useEffect(() => {

        if (!debounced) {
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);

        const run = async () => {

            try {

                // const [prodRes, orderRes, custRes] = await Promise.allSettled([
                //     fetch(`${API}/products/allproducts`).then(r => r.json()),
                //     fetch(`${API}/orders/allorders?search=${encodeURIComponent(debounced)}`, { headers: authHeaders() }).then(r => r.json()),
                //     fetch(`${API}/account/allusers`, { headers: authHeaders() }).then(r => r.json()),
                // ]);

                const response = await api.get(`/admin/auth/global-search?q=${debounced}`);

                console.log(response.data)

                const prodRes = response.data.products;
                const orderRes = response.data.orders;
                const custRes = response.data.customers;

                if (cancelled) return;

                // setResults({ prodRes, orderRes, custRes });


                const products = prodRes.slice(0, 5).map(p => ({ id: `prod-${p.id}`, group: 'Products', title: p.name, desc: p.category, image: p.image, meta: `₹${p.price}`, to: `/admin/products?highlight=${p.id}` }));

                const orders = orderRes.slice(0, 5).map(o => ({ id: `order-${o.id}`, group: 'Orders', icon: ShoppingBag, title: o.orderId, desc: o.customer, meta: `₹${o?.total || 0}`, to: `/admin/orders?highlight=${o.id}` }));

                const customers = custRes.slice(0, 5).map(u => ({ id: `cust-${u.id || u.id}`, group: 'Customers', icon: Users, title: u.name, desc: u.email, image : u.image, to: `/admin/customers?highlight=${u._id || u.id}` }));

                console.log(Array.isArray(products))
                console.log(Array.isArray(prodRes))
                console.log(orders)
                console.log(customers)

                setResults({ products, orders, customers });


                // const q = debounced.toLowerCase();

                // Products — client-side filter (assuming endpoint returns all)
                // const allProducts = prodRes.status === 'fulfilled' ? (Array.isArray(prodRes.value) ? prodRes.value : prodRes.value.products || []) : [];
                // const products = allProducts
                //     .filter(p => p.name?.toLowerCase().includes(q) || `sku-${p.id}`.includes(q))
                //     .slice(0, 5)
                //     .map(p => ({ id: `prod-${p.id}`, group: 'Products', title: p.name, desc: p.category, image: p.image, meta: `₹${p.new_price}`, to: `/admin/products?highlight=${p.id}` }));

                // // Orders
                // const allOrders = orderRes.status === 'fulfilled' ? (orderRes.value.orders || []) : [];
                // const orders = allOrders
                //     .filter(o => o.orderId?.toLowerCase().includes(q) || `${o.shipping?.firstName} ${o.shipping?.lastName}`.toLowerCase().includes(q))
                //     .slice(0, 5)
                //     .map(o => ({ id: `order-${o._id}`, group: 'Orders', icon: ShoppingBag, title: o.orderId, desc: `${o.shipping?.firstName || ''} ${o.shipping?.lastName || ''}`.trim(), meta: `₹${o.pricing?.total || 0}`, to: `/admin/orders?highlight=${o._id}` }));

                // // Customers
                // const allUsers = custRes.status === 'fulfilled' ? (custRes.value.customers || custRes.value.users || []) : [];
                // const customers = allUsers
                //     .filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
                //     .slice(0, 5)
                //     .map(u => ({ id: `cust-${u._id || u.id}`, group: 'Customers', icon: Users, title: u.name, desc: u.email, to: `/admin/customers?highlight=${u._id || u.id}` }));



                // const allProducts = prodRes || [];
                // const products = allProducts
                //     .filter(p => p.name?.toLowerCase().includes(q) || `sku-${p.id}`.includes(q))
                //     .slice(0, 5)
                //     .map(p => ({ id: `prod-${p.id}`, group: 'Products', title: p.name, desc: p.category, image: p.image, meta: `₹${p.new_price}`, to: `/admin/products?highlight=${p.id}` }));

                // // Orders
                // const allOrders = orderRes ||[];
                // const orders = allOrders
                //     .filter(o => o.orderId?.toLowerCase().includes(q) || `${o.shipping?.firstName} ${o.shipping?.lastName}`.toLowerCase().includes(q))
                //     .slice(0, 5)
                //     .map(o => ({ id: `order-${o._id}`, group: 'Orders', icon: ShoppingBag, title: o.orderId, desc: `${o.shipping?.firstName || ''} ${o.shipping?.lastName || ''}`.trim(), meta: `₹${o.pricing?.total || 0}`, to: `/admin/orders?highlight=${o._id}` }));

                // // Customers
                // const allUsers = custRes || [];
                // const customers = allUsers
                //     .filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
                //     .slice(0, 5)
                //     .map(u => ({ id: `cust-${u._id || u.id}`, group: 'Customers', icon: Users, title: u.name, desc: u.email, to: `/admin/customers?highlight=${u._id || u.id}` }));


            } catch (err) {
                console.error('CommandPalette search error:', err);
            } finally {
                if (!cancelled) setTimeout(() => { setLoading(false) }, 5000); 
            }
        };
        run();
        return () => { cancelled = true; };
    }, [debounced]);

    /* ── Flatten all results into one navigable list ── */
    const flatList = useMemo(() => {
        if (!debounced) {
            // Empty query → show history + quick actions
            const historyItems = history.slice(0, 4).map((h, i) => ({ ...h, group: 'Recent', icon: Clock }));
            return [...historyItems, ...QUICK_ACTIONS];
        }
        return [...results.products, ...results.orders, ...results.customers];
    }, [debounced, results, history]);

    /* ── Group flat list back into sections for rendering ── */
    const grouped = useMemo(() => {
        const g = {};
        flatList.forEach(item => {
            if (!g[item.group]) g[item.group] = [];
            g[item.group].push(item);
        });
        return g;
    }, [flatList]);

    /* ── Keyboard navigation ── */
    const handleSelect = useCallback((item) => {
        if (!item) return;
        // Save to history (de-duped, max 8)

        const newHistory = [
            { id: item.id, group: item.group, title: item.title, desc: item.desc, to: item.to, image: item.image, meta: item.meta },
            ...history.filter(h => h.id !== item.id),
        ].slice(0, 8);
        console.log(item.id)
        setHistory(newHistory);
        localStorage.setItem('admin-search-history', JSON.stringify(newHistory));

        navigate(item.to);
        onClose();
    }, [history, navigate, onClose]);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') { onClose(); return; }
            if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, flatList.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
            if (e.key === 'Enter') { e.preventDefault(); handleSelect(flatList[activeIdx]); }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, flatList, activeIdx, onClose, handleSelect]);

    /* ── Reset active index when results change ── */
    useEffect(() => { setActiveIdx(0); }, [flatList.length]);

    /* ── Scroll active item into view ── */
    useEffect(() => {
        itemRefs.current[activeIdx]?.scrollIntoView({ block: 'nearest' });
    }, [activeIdx]);

    /* ── Global ⌘K / Ctrl+K listener — register once ── */
    // (Wire this up in your AdminHeader, see usage notes below)

    if (!open) return null;

    let runningIdx = 0;
    const GROUP_ICONS = { Recent: Clock, Navigate: LayoutDashboard, Products: Package, Orders: ShoppingBag, Customers: Users };

    return (
        <div className="fixed inset-0 z-9999 flex items-start justify-center pt-[12vh] px-4"
            onClick={onClose}
            style={{ animation: 'cmdBgIn .15s ease' }}>

            <div className="absolute inset-0 bg-base-950/60 backdrop-blur-sm" />

            <div
                onClick={e => e.stopPropagation()}
                className="relative w-full max-w-xl bg-white dark:bg-base-900 rounded-2xl shadow-2xl shadow-black/30 border border-base-100 dark:border-base-800 overflow-hidden flex flex-col max-h-[70vh]"
                style={{ animation: 'cmdIn .18s cubic-bezier(.2,1,.3,1)' }}>

                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-base-100 dark:border-base-800 shrink-0">
                    {loading
                        ? <Loader2 size={17} className="text-accent-500 animate-spin shrink-0" />
                        : <Search size={17} className="text-base-400 shrink-0" />}
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search orders, products, customers…"
                        className="flex-1 bg-transparent text-[14px] text-base-900 dark:text-base-50 placeholder-base-400 outline-none"
                    />
                    {query && (
                        <button onClick={() => setQuery('')} className="text-base-300 hover:text-base-500 transition-colors shrink-0">
                            <X size={15} />
                        </button>
                    )}
                    <kbd className="hidden sm:flex items-center px-1.5 py-0.5 rounded-md bg-base-50 dark:bg-base-800 border border-base-200 dark:border-base-700 text-[10px] font-bold text-base-400 shrink-0">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div ref={listRef} className="flex-1 overflow-y-auto px-2.5 py-2">
                    {debounced && !loading && flatList.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-base-50 dark:bg-base-800 flex items-center justify-center">
                                <Search size={20} className="text-base-300" />
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-base-600 dark:text-base-300">No results for "{debounced}"</p>
                                <p className="text-[11px] text-base-400 mt-0.5">Try a different search term</p>
                            </div>
                        </div>
                    )}

                    {Object.entries(grouped).map(([groupName, items]) => (
                        <div key={groupName} className="mb-2 last:mb-0">
                            <p className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-base-400 flex items-center gap-1.5">
                                {groupName === 'Recent' && <Clock size={10} />}
                                {groupName}
                            </p>
                            <div className="flex flex-col gap-0.5">
                                {items.map((item) => {
                                    const idx = runningIdx++;
                                    const Icon = item.icon || GROUP_ICONS[groupName] || Tag;
                                    return (
                                        <ResultRow
                                            key={item.id}
                                            item={{ ...item, icon: Icon }}
                                            query={debounced}
                                            active={idx === activeIdx}
                                            onClick={() => handleSelect(item)}
                                            refEl={el => itemRefs.current[idx] = el}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Empty state with no history */}
                    {!debounced && history.length === 0 && (
                        <p className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-base-400 mb-1">
                            Quick Actions
                        </p>
                    )}
                </div>

                {/* Footer hints */}
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-base-100 dark:border-base-800 bg-base-25 dark:bg-base-950/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-base-400">
                            <ArrowUp size={10} /><ArrowDown size={10} /> Navigate
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-base-400">
                            <CornerDownLeft size={10} /> Select
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-base-300">
                        {flatList.length} result{flatList.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            <style>{`
                @keyframes cmdBgIn { from{opacity:0} to{opacity:1} }
                @keyframes cmdIn   { from{opacity:0;transform:scale(.96) translateY(-8px)} to{opacity:1;transform:scale(1) translateY(0)} }
            `}</style>
        </div>
    );
};

export default CommandPalette;