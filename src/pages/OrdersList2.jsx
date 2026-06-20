import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Loader2, X, Eye, Edit2, Trash2 } from 'lucide-react';
import { Box } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarQuickFilter } from "@mui/x-data-grid";

// import OrderFilterSidebar from "../components/OrderFilterSidebar";
import OrderModals2 from "../components/OrderModals2";
import api_paths from '../config/apis';
import { deleteOrder, getOrders } from '../apis/orderApi';

// Inline Badge Component for specific Order Statuses
const OrderBadge = ({ status }) => {
    const styles = {
        'Delivered': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
        'Pending': 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
        'Processing': 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
        'Shipped': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
        'Cancelled': 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
    };

    // <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full w-max ${p.value === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : p.value === 'Refunded' ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'}`}>
    //     {p.value} 
    // </span>

    return <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide ${styles[status] || styles['Pending']}`}>{status}</span>;
};

const OrdersList2 = () => {
    // API & Data
    const [apiOrders, setApiOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState([]);
    const [paymentFilter, setPaymentFilter] = useState('All');
    const [amountRange, setAmountRange] = useState([0, 50000]);
    const [showFilters, setShowFilters] = useState(false);

    // Modals
    const [activeModal, setActiveModal] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    /* ── Fetch all orders ── */
    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        setLoading(true);
        try {

            const data = await getOrders();

            // Dummy Fallback Data (Agar backend ready nahi hai toh test karne ke liye)
            if (!Array.isArray(data?.orders) || data?.orders?.length === 0) {
                data = [
                    { id: 1, order_id: 'ORD-001', customer_name: 'Vasu Mandaviya', customer_email: 'vasu@example.com', total_amount: 14500, payment_status: 'Paid', status: 'Delivered', date: '14 Jun 2026' },
                    { id: 2, order_id: 'ORD-002', customer_name: 'Rahul Bhai', customer_email: 'rahul@example.com', total_amount: 2500, payment_status: 'Unpaid', status: 'Pending', date: '15 Jun 2026' },
                ];
            }

            hydrate(data?.orders);

        } catch (err) {
            console.error("Fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const hydrate = (arr) => {
        const formatted = arr.map((item, index) => ({
            id: item._id,
            order_id: item.orderId || `ORD-${1000 + index}`,
            customer_name: item?.shipping?.firstName + " " + item?.shipping?.firstName || 'Guest User',
            customer_email: item?.shipping?.email || 'No email',
            total_amount: item.pricing?.subtotal || 0,
            payment_status: item.payment_status || 'Unpaid',
            status: item.status || 'Pending',
            date: new Date(item.placedAt).toLocaleDateString() || new Date().toLocaleDateString('en-GB'),
        }));
        setApiOrders(formatted);
    };

    /* ── Modal helpers ── */
    const openModal = (type, order) => { setSelectedOrder(order); setActiveModal(type); };
    const closeModal = () => { setActiveModal(null); setSelectedOrder(null); };

    /* ── DELETE ── */
    const confirmDelete = async () => {
        setActionLoading(true);
        try {
            await deleteOrder(selectedOrder?.id);
            setApiOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
            closeModal();
        } catch (err) { console.error("Delete failed:", err); }
        finally { setActionLoading(false); } 
    };

    const handleSave = (updatedOrder) => {
        setApiOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    };

    /* ── Filters ── */
    const handleStatusFilter = (status) => {
        setStatusFilter(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
    };

    const clearFilters = () => { setStatusFilter([]); setAmountRange([0, 50000]); setPaymentFilter('All'); setSearch(''); };

    const activeFilterCount = [
        statusFilter.length > 0 ? 1 : 0,
        amountRange[0] > 0 || amountRange[1] < 50000 ? 1 : 0,
        paymentFilter !== 'All' ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    const orders = useMemo(() => {
        return [...apiOrders].filter(o => {
            const searchLower = search.toLowerCase();
            const matchSearch = o.order_id.toLowerCase().includes(searchLower) || o.customer_name.toLowerCase().includes(searchLower);
            const matchStatus = statusFilter.length === 0 || statusFilter.includes(o.status);
            const matchPayment = paymentFilter === 'All' || o.payment_status === paymentFilter;
            const matchAmount = o.total_amount >= amountRange[0] && o.total_amount <= amountRange[1];
            return matchSearch && matchStatus && matchPayment && matchAmount;
        }).sort((a, b) => b.id - a.id); // Sort Newest First
    }, [search, statusFilter, paymentFilter, amountRange, apiOrders]);

    /* ── MUI Custom Toolbar ── */
    const CustomToolbar = () => (
        <GridToolbarContainer className="flex flex-col sm:flex-row items-center justify-between px-4! py-3! w-full border-b border-slate-100 dark:border-slate-800 gap-4">
            <div className="w-full sm:w-auto flex-1"><GridToolbarQuickFilter placeholder="Search orders…" className="w-full!" /></div>
            <div className="flex items-center gap-2">
                <GridToolbarColumnsButton sx={{ color: '#64748b' }} />
                <GridToolbarFilterButton sx={{ color: '#64748b' }} />
                <GridToolbarDensitySelector sx={{ color: '#64748b' }} />
                <GridToolbarExport sx={{ color: '#64748b' }} />
            </div>
        </GridToolbarContainer>
    );

    /* ── Columns ── */
    const columns = [
        {
            field: "order_id", headerName: "ORDER ID", width: 120, headerClassName: "bg-base-900! text-base-50! text-[12px]!", cellClassName: "font-extrabold text-[13px] font-mono text-accent-600 dark:text-accent-400 cursor-pointer hover:underline",
            renderCell: (p) => <span onClick={() => openModal('view', p.row)}>{p.value}</span>
        },
        {
            field: "customer_name", headerName: "CUSTOMER", flex: 1, minWidth: 180, headerClassName: "bg-base-900! text-base-50! text-[12px]!",
            cellClassName: "flex items-center",
            renderCell: (p) => (
                <span className="font-bold flex flex-col gap-1 justify-center text-[13px] leading-tight text-slate-800 dark:text-slate-100">
                    {p.value}
                    <span className="text-[11px] text-slate-400">{p.row.customer_email}</span>
                </span>
            )
        },
        { field: "date", headerName: "DATE", width: 130, headerClassName: "bg-base-900! text-base-50! text-[12px]!", cellClassName: "font-medium text-[12px] text-slate-500" },
        {
            field: "total_amount", headerName: "AMOUNT", width: 120, headerClassName: "bg-base-900! text-base-50! text-[12px]!",
            renderCell: (p) => <span className="font-extrabold text-[13px] text-slate-800 dark:text-slate-100 block">₹{p.value?.toLocaleString('en-IN')}</span>
        },
        {
            field: "payment_status", headerName: "PAYMENT", width: 120,
            cellClassName: "",
            headerClassName: "bg-base-900! text-base-50! text-[12px]!",
            renderCell: (p) => (
                <div>
                    <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full w-max ${p.value === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : p.value === 'Refunded' ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                        {p.value}
                    </span>
                </div>
            )
        },
        {
            field: "status", headerName: "ORDER STATUS", width: 140, headerClassName: "bg-base-900! text-base-50! text-[12px]!",
            renderCell: (p) => (
                <div className="">
                    <OrderBadge status={p.value} />
                </div>
            )
        },
        {
            field: "actions", headerName: "ACTIONS", width: 140, align: "center", headerAlign: "center", sortable: false, filterable: false, disableColumnMenu: true, headerClassName: "bg-base-900! text-base-50! text-[12px]!",
            renderCell: (p) => (
                <strong className='flex justify-center items-center gap-2 mt-1.5!'>
                    <button onClick={() => openModal('view', p.row)} className='p-2 bg-emerald-100 hover:bg-emerald-200 focus:ring-2 focus:ring-emerald-300 rounded-lg text-emerald-600 dark:bg-emerald-500/10 transition-colors'><Eye size={16} /></button>
                    <button onClick={() => openModal('edit', p.row)} className='p-2 bg-accent-100 hover:bg-accent-200 focus:ring-2 focus:ring-sky-300 rounded-lg text-accent-600 dark:bg-accent-500/10 transition-colors'><Edit2 size={16} /></button>
                    <button onClick={() => openModal('delete', p.row)} className='p-2 bg-red-100 hover:bg-red-200 focus:ring-2 focus:ring-red-300 rounded-lg text-red-600 dark:bg-red-500/10 transition-colors'><Trash2 size={16} /></button>
                </strong>
            )
        },
    ];

    /* ════════════════ RENDER ════════════════ */
    return (
        <div className="flex flex-col gap-5 w-full max-w-350 mx-auto relative">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight mb-1">Orders Management</h1>
                    <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Total {orders.length} orders found</p>
                </div>
            </div>

            {/* Search + filter toggle */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xs p-3.5 flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-55">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by Order ID or Customer Name…"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-10 pr-9 text-[13px] text-slate-900 dark:text-slate-50 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 transition-all"
                    />
                    {search && <X size={14} onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />}
                </div>

                <button onClick={() => setShowFilters(p => !p)} className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-bold bg-slate-900 dark:bg-slate-800 border border-slate-700 text-white transition-colors hover:bg-slate-800">
                    <SlidersHorizontal size={14} /> Filters
                    {activeFilterCount > 0 && <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-[10px] rounded-full bg-accent-500 text-white ring-2 ring-white dark:ring-slate-900 font-bold">{activeFilterCount}</span>}
                </button>
            </div>

            {/* DataGrid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-accent-500 animate-spin mb-4" />
                    <p className="text-slate-500 text-sm font-medium">Loading orders…</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <Box>
                        <DataGrid
                            rows={orders} columns={columns} paginationMode="client" className="custom-scrollbar" showToolbar disableRowSelectionOnClick disableColumnResize
                            slots={{ toolbar: CustomToolbar }} slotProps={{ toolbar: { showQuickFilter: true } }} rowHeight={55} pageSizeOptions={[10, 25, 50, 100]}
                            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
                            sx={{
                                maxHeight: 650, border: 'none',
                                '& .MuiDataGrid-cell': { fontSize: '11px', outline: 'none !important' },
                                '& .MuiDataGrid-columnHeaderCheckbox': { backgroundColor: '#1D1D1D' },
                                '& .MuiDataGrid-columnHeaderCheckbox svg': { color: '#fff !important' },
                                '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none !important' },
                                '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': { outline: 'none !important' },
                            }}
                        />
                    </Box>
                </div>
            )}

            {/* <OrderFilterSidebar showFilters={showFilters} setShowFilters={setShowFilters} statusFilter={statusFilter} setStatusFilter={handleStatusFilter} paymentFilter={paymentFilter} setPaymentFilter={setPaymentFilter} amountRange={amountRange} handleAmountChange={(_, val) => setAmountRange(val)} clearFilters={clearFilters} /> */}
            <OrderModals2 activeModal={activeModal} selectedOrder={selectedOrder} closeModal={closeModal} confirmDelete={confirmDelete} actionLoading={actionLoading} onSave={handleSave} />
        </div>
    );
};

export default OrdersList2;