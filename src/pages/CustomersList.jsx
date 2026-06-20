import React, { useState, useMemo, useEffect } from 'react';

import { Box } from "@mui/material";

import {
    DataGrid, GridToolbarContainer, GridToolbarExport,
    GridToolbarColumnsButton, GridToolbarFilterButton,
    GridToolbarDensitySelector, GridToolbarQuickFilter
} from "@mui/x-data-grid";

import { Calendar, Edit2, Eye, Loader2, Search, SlidersHorizontal, Trash2, TrendingUp, Users } from 'lucide-react';

import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import { deleteCustomer, getAllCustomers, updateCustomer } from '../features/customers/api/customerApi';
import { showToast } from '../components/showToast';
import CustomerBadge from '../features/customers/components/CustomerBadge';
import ViewModal from '../features/customers/components/ViewModel';
import EditModal from '../features/customers/components/EditModal';
import DeleteModal from '../features/customers/components/DeleteModal';
import FilterSidebar from '../features/customers/components/FilterSidebar';
import StatCard from '../components/ui/StatCard';


const fmt = (n) => Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';


const inputCls = `
    w-full 
    px-4 py-2.5 rounded-lg transition-all 
    border border-base-200 dark:border-base-700 
    bg-white dark:bg-base-800 
    text-[13px] text-base-900 dark:text-base-50 
    outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/10 
    placeholder-base-300 dark:placeholder-base-600
    disabled:bg-base-50 dark:disabled:bg-base-800/60
    disabled:text-base-400 dark:disabled:text-base-500
    disabled:cursor-not-allowed
`;

const labelCls = 'text-[11px] font-bold uppercase tracking-widest text-base-400 mb-1.5 block';


const CustomersList = () => {

    const [menuPosition, setMenuPosition] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [joinedFilter, setJoinedFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const [activeModal, setActiveModal] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');

    /* ── Fetch ── */
    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {

        setLoading(true);

        try {

            const data = await getAllCustomers();

            const arr = Array.isArray(data) ? data : data.users || data.data || [];

            const formatted = arr.map((u, i) => ({
                id: u._id || u.id || `u-${i}`,
                name: u.name || 'Unknown',
                email: u.email || '—',
                phone: u.phone || '—',
                location: u.location || u.city || '—',
                status: u.status || (u.active ? 'Active' : 'Inactive'),
                joinedAt: u.date || u.createdAt || u.joinedAt || null,
                totalOrders: u.totalOrders || 0,
                totalSpent: u.totalSpent || 0,
                avgOrder: u.totalOrders ? Math.round((u.totalSpent || 0) / u.totalOrders) : 0,
                sku: `CUST-${String(u.id || i + 1).padStart(4, '0')}`,
            }));

            setCustomers(formatted);
        } catch (err) {
            console.error('fetchAll customers:', err);
        } finally {
            setLoading(false);
        }
    };

    /* ── Modal helpers ── */
    const openModal = (type, c = null) => { setSelectedCustomer(c); setActiveModal(type); };
    const closeModal = () => { setActiveModal(null); setSelectedCustomer(null); };

    const handleSave = (updated) => setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
    const handleDelete = (id) => setCustomers(prev => prev.filter(c => c.id !== id));

    /* ── Date range helper ── */
    // const isInRange = (dateStr, range) => {
    //     if (range === 'all' || !dateStr) return true;
    //     const d = new Date(dateStr);
    //     const now = new Date();
    //     const days = { '7d': 7, '30d': 30, '3m': 90, 'year': 365 }[range];
    //     return (now - d) / 86400000 <= days;
    // };

    const isInRange = (dateStr, range) => {
        if (!dateStr) return range === 'all';
        const d = new Date(dateStr);

        if (range === 'all') return true;

        if (range === 'custom') {
            if (!customFrom && !customTo) return true; // no bounds set yet — show all
            const from = customFrom ? new Date(customFrom) : null;
            const to = customTo ? new Date(customTo + 'T23:59:59') : null; // include full end day
            if (from && d < from) return false;
            if (to && d > to) return false;
            return true;
        }

        const now = new Date();
        const days = { '7d': 7, '30d': 30, '3m': 90, 'year': 365 }[range];
        return (now - d) / 86400000 <= days;
    };

    /* ── Filtered list ── */
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return customers.filter(c =>
            (c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.sku.toLowerCase().includes(q)) &&
            (statusFilter === 'All' || c.status === statusFilter) &&
            isInRange(c.joinedAt, joinedFilter)
        );
    }, [search, statusFilter, joinedFilter, customers]);

    // const clearFilters = () => {
    //     setStatusFilter('All');
    //     setJoinedFilter('all');
    //     setSearch('');
    // };

    const clearFilters = () => {
        setStatusFilter('All');
        setJoinedFilter('all');
        setCustomFrom('');
        setCustomTo('');
        setSearch('');
    };

    // const activeFilterCount = [
    //     statusFilter !== 'All' ? 1 : 0,
    //     joinedFilter !== 'all' ? 1 : 0,
    // ].reduce((a, b) => a + b, 0);


    const activeFilterCount = [
        statusFilter !== 'All' ? 1 : 0,
        joinedFilter !== 'all' ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    /* ── Stats ── */
    const stats = useMemo(() => ({
        total: customers.length,
        active: customers.filter(c => c.status === 'Active').length,
        newThisMonth: customers.filter(c => isInRange(c.joinedAt, '30d')).length,
        totalRevenue: customers.reduce((s, c) => s + c.totalSpent, 0),
    }), [customers]);

    /* ── MUI Toolbar ── */
    const handleToolbarClick = (e) =>
        setMenuPosition({ mouseX: e.currentTarget.getBoundingClientRect().left, mouseY: e.currentTarget.getBoundingClientRect().bottom });

    const CustomToolbar = () => (
        <GridToolbarContainer className="flex flex-col sm:flex-row items-center justify-between px-4! py-3! w-full border-b border-slate-100 dark:border-slate-800 gap-4">
            <div className="w-full sm:w-auto flex-1">
                <GridToolbarQuickFilter placeholder="Quick filter orders…" className="w-full!" />
            </div>

            {/* ── FIX: :hover ko MuiButtonBase-root ke sath andar laga diya ── */}
            <div className="flex items-center gap-2 [&_.MuiButtonBase-root]:text-accent-500! [&_.MuiButtonBase-root:hover]:bg-accent-500/10!">
                <GridToolbarColumnsButton />
                {/* <GridToolbarFilterButton /> */}
                <GridToolbarDensitySelector />
                <GridToolbarExport />
            </div>
        </GridToolbarContainer>
    );

    /* ── Columns ── */
    const columns = [
        {
            field: 'avatar', headerName: '', width: 52, sortable: false, filterable: false, disableColumnMenu: true,
            headerClassName: 'bg-base-900! text-base-50! text-[12px]!',
            cellClassName: "flex items-center",
            renderCell: (p) => {
                const initials = p.row.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
                return (
                    <div className="w-8 h-8 rounded-full bg-accent-gradient flex items-center justify-center text-white text-[10px] font-black my-auto">
                        {initials}
                    </div>
                );
            },
        },
        { field: 'name', headerName: 'CUSTOMER', flex: 1, minWidth: 160, headerClassName: 'bg-base-900! text-base-50! text-[12px]!', cellClassName: 'font-semibold text-[13px]' },
        { field: 'email', headerName: 'EMAIL', flex: 1, minWidth: 200, headerClassName: 'bg-base-900! text-base-50! text-[12px]!', cellClassName: 'text-[13px] !text-slate-500 dark:!text-slate-400' },
        { field: 'phone', headerName: 'PHONE', width: 140, headerClassName: 'bg-base-900! text-base-50! text-[12px]!', cellClassName: 'text-[13px] !text-slate-500' },
        {
            field: 'status', headerName: 'STATUS', width: 120, headerClassName: 'bg-base-900! text-base-50! text-[12px]!',
            renderCell: (p) => <CustomerBadge status={p.value} />,
        },
        {
            field: 'totalOrders', headerName: 'ORDERS', width: 90, headerClassName: 'bg-base-900! text-base-50! text-[12px]!',
            renderCell: (p) => (
                <span className="font-bold text-[13px] text-base-700 dark:text-base-200 block ">{p.value}</span>
            ),
        },
        {
            field: 'totalSpent', headerName: 'TOTAL SPENT', width: 120, headerClassName: 'bg-base-900! text-base-50! text-[12px]!',
            renderCell: (p) => (
                <span className="font-extrabold text-[13px] text-emerald-600 dark:text-emerald-400 block">₹{fmt(p.value)}</span>
            ),
        },
        {
            field: 'joinedAt', headerName: 'JOINED', width: 120, headerClassName: 'bg-base-900! text-base-50! text-[12px]!',
            renderCell: (p) => (
                <span className="text-[12px] text-slate-400 font-mono block ">{fmtDate(p.value)}</span>
            ),
        },
        {
            field: 'actions', headerName: 'ACTIONS', width: 130, align: 'center', headerAlign: 'center',
            sortable: false, filterable: false, disableColumnMenu: true,
            headerClassName: 'bg-base-900! text-base-50! text-[12px]!',
            cellClassName: "flex items-center justify-center",
            renderCell: (p) => (
                <strong className='flex justify-center items-center gap-2'>
                    <button onClick={() => openModal('view', p.row)} className='p-2 bg-emerald-100 hover:bg-emerald-200 focus:ring-2 focus:ring-emerald-300 rounded-lg text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 transition-colors'>
                        <Eye size={16} />
                    </button>
                    <button onClick={() => openModal('edit', p.row)} className='p-2 bg-sky-100 hover:bg-sky-200 focus:ring-2 focus:ring-sky-300 rounded-lg text-sky-600 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 dark:text-sky-400 transition-colors'>
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => openModal('delete', p.row)} className='p-2 bg-red-100 hover:bg-red-200 focus:ring-2 focus:ring-red-300 rounded-lg text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 transition-colors'>
                        <Trash2 size={16} />
                    </button>
                </strong>
            ),
        },
    ];

    /* ════════════════════════ RENDER ════════════════════════ */
    return (

        <div className="flex flex-col gap-5 w-full max-w-350 mx-auto relative">

            <style>{` 
                @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
                .afu1{animation:fadeUp .35s ease both .05s}
                .afu2{animation:fadeUp .35s ease both .12s}
            `}</style>

            {/* Modals */}
            {activeModal === 'view' && <ViewModal fmtDate={fmtDate} fmt={fmt} customer={selectedCustomer} onClose={closeModal} />}
            {activeModal === 'edit' && <EditModal inputCls={inputCls} labelCls={labelCls} customer={selectedCustomer} onClose={closeModal} onSave={handleSave} />}
            {activeModal === 'delete' && <DeleteModal customer={selectedCustomer} onClose={closeModal} onDelete={handleDelete} />}

            {/* Sidebar */}
            {/* <FilterSidebar
                show={showFilters} onClose={() => setShowFilters(false)}
                status={statusFilter} setStatus={setStatusFilter}
                joinedFilter={joinedFilter} setJoinedFilter={setJoinedFilter}
                clearFilters={clearFilters} activeCount={activeFilterCount}
            /> */}

            <FilterSidebar
                show={showFilters} onClose={() => setShowFilters(false)}
                status={statusFilter} setStatus={setStatusFilter}
                joinedFilter={joinedFilter} setJoinedFilter={setJoinedFilter}
                customFrom={customFrom} setCustomFrom={setCustomFrom}
                customTo={customTo} setCustomTo={setCustomTo}
                clearFilters={clearFilters} activeCount={activeFilterCount}
            />


            {/* ── Page header ── */}
            <div className="flex flex-wrap items-start justify-between gap-3 afu1">

                <div>

                    <h1 className="text-2xl font-extrabold text-base-900 dark:text-base-50 tracking-tight mb-1">Customers</h1>
                    <p className="text-[13px] font-medium text-base-500 dark:text-base-400">
                        {filtered.length} of {customers.length} customers
                    </p>

                </div>
                {/* <button
                    onClick={() => window.location.href = 'mailto:'}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-gradient text-white font-bold text-[13px] shadow-[0_4px_16px_rgba(56,189,248,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(56,189,248,0.35)] transition-all duration-200">
                    <Mail size={15} strokeWidth={2.5} /> Email All
                </button> */}
            </div>

            {/* ── Stats row ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 afu1">
                <StatCard icon={<Users size={22} className="text-white" />} label="Total Customers" value={stats.total} color="bg-linear-to-br from-accent-400 to-accent-500" sub={`${stats.active} active`} />
                <StatCard icon={<i className="fa-solid fa-user-check text-white text-lg" />} label="Active" value={stats.active} color="bg-linear-to-br from-emerald-400 to-teal-500" sub={`${Math.round(stats.active / (stats.total || 1) * 100)}% of total`} />
                <StatCard icon={<Calendar size={22} className="text-white" />} label="New This Month" value={stats.newThisMonth} color="bg-linear-to-br from-violet-400 to-purple-600" sub="Last 30 days" />
                <StatCard icon={<TrendingUp size={22} className="text-white" />} label="Total Revenue" value={`₹${fmt(stats.totalRevenue)}`} color="bg-linear-to-br from-rose-400 to-orange-500" sub="All time" />
            </div>

            {/* ── Search + filter toggle ── */}
            <div className="bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-xl shadow-sm p-3.5 flex flex-wrap gap-3 items-center afu1">
                <div className="relative flex-1 min-w-52">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, email or ID…"
                        className="w-full bg-base-50 dark:bg-base-800 border border-base-200 dark:border-base-700 rounded-lg py-2 pl-10 pr-9 text-[13px] text-base-900 dark:text-base-50 placeholder-base-400 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 transition-all" />
                    {search && <X size={14} onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-400 cursor-pointer hover:text-base-600 transition-colors" />}
                </div>

                {/* Quick status pills */}
                <div className="flex gap-1.5 flex-wrap">
                    {['All', 'Active', 'Inactive', 'Blocked'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-xl text-[12px] font-bold border transition-all
                                ${statusFilter === s
                                    ? 'bg-base-900 dark:bg-base-50 text-white dark:text-base-900 border-base-900 dark:border-base-50'
                                    : 'bg-white dark:bg-base-800 text-base-500 border-base-200 dark:border-base-700 hover:border-base-400'}`}>
                            {s}
                        </button>
                    ))}
                </div>

                <button onClick={() => setShowFilters(true)}
                    className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-bold bg-base-900 dark:bg-base-800 border border-base-700 text-white hover:bg-base-800 transition-colors">
                    <SlidersHorizontal size={14} /> Filters
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-[10px] rounded-full bg-accent-500 text-white ring-2 ring-white dark:ring-base-900 font-bold">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {/* ── DataGrid ── */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 afu2">
                    <Loader2 className="w-10 h-10 text-accent-500 animate-spin mb-4" />
                    <p className="text-base-500 text-sm font-medium">Loading customers…</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-2xl overflow-hidden afu2">
                    <Box>
                        <DataGrid
                            rows={filtered}
                            columns={columns}
                            paginationMode="client"
                            className="custom-scrollbar"
                            showToolbar
                            disableRowSelectionOnClick
                            isCellEditable={() => false}
                            disableColumnResize
                            slots={{ toolbar: CustomToolbar }}
                            slotProps={{ toolbar: { showQuickFilter: true } }}
                            rowHeight={48}
                            pageSizeOptions={[10, 25, 50, 100]}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 10, page: 0 } },
                                sorting: { sortModel: [{ field: 'joinedAt', sort: 'desc' }] },
                            }}
                            sx={{
                                maxHeight: 650, border: 'none',
                                '& .MuiDataGrid-cell': { fontSize: '11px' },
                                '& .MuiDataGrid-columnHeaderCheckbox': { backgroundColor: '#1D1D1D' },
                                '& .MuiDataGrid-columnHeaderCheckbox svg': { color: '#fff !important' },
                                '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none !important' },
                                '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': { outline: 'none !important' },
                            }}
                        />
                    </Box>
                </div>
            )}
        </div>
    );
};

export default CustomersList;