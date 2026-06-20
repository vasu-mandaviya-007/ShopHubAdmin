import React, { useState, useMemo, useEffect } from 'react';
import {
    Search, SlidersHorizontal, Loader2, X,
    Eye, Trash2, Package, ChevronDown,
    TrendingUp, ShoppingBag, Clock, CheckCircle2,
} from 'lucide-react';
import { Box } from '@mui/material';
import {
    DataGrid, GridToolbarContainer, GridToolbarExport,
    GridToolbarColumnsButton, GridToolbarFilterButton,
    GridToolbarDensitySelector, GridToolbarQuickFilter,
    useGridApiRef,
} from '@mui/x-data-grid';

import { useSearchParams } from 'react-router-dom';



import { deleteOrder, getOrders } from '../apis/orderApi';
import { showToast } from '../components/showToast';
import OrderUpdateModal from '../features/orders/components/OrderUpdateModal';
import OrderDeleteModal from '../features/orders/components/OrderDeleteModal';
import OrderViewModal from '../features/orders/components/OrderViewModal';
import { OrderStatusBadge, STATUS_CONFIG } from '../features/orders/components/OrderStatusBadge';

/* ─── Constants ─── */
const ALL_STATUSES = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
const fmt = (n) => Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

/* ─── Small stat card ─── */
const MiniStat = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-xl p-4 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon size={18} strokeWidth={1.75} />
        </div>
        <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-base-400 dark:text-base-500">{label}</p>
            <p className="font-extrabold text-lg text-base-900 dark:text-base-50 leading-none mt-0.5">{value}</p>
        </div>
    </div>
);

/* ─── Status filter pill ─── */
const StatusPill = ({ status, active, count, onClick }) => {
    const c = STATUS_CONFIG[status];
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold border transition-all whitespace-nowrap ${active
                ? status === 'All'
                    ? 'bg-base-900 dark:bg-base-100 text-white dark:text-base-900 border-transparent'
                    : `${c.bg} ${c.color} ${c.border}`
                : 'bg-white dark:bg-base-950 text-base-500 dark:text-base-400 border-base-200 dark:border-base-800 hover:border-base-300'
                }`}
        >
            {status}
            {count !== undefined && (
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${active ? 'bg-black/10 dark:bg-white/10' : 'bg-base-100 dark:bg-base-800'}`}>
                    {count}
                </span>
            )}
        </button>
    );
};

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════ */
const OrdersList = () => {
    const [apiOrders, setApiOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [activeModal, setActiveModal] = useState(null); // 'view' | 'status' | 'delete'
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    /* ── Fetch ── */
    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {

        setLoading(true);

        try {

            const data = await getOrders();

            const arr = Array.isArray(data) ? data : data.orders || data.data || [];

            setApiOrders(arr.map((o, i) => ({ ...o, id: o._id || o.id || `order-${i}` })));

        } catch (err) {

            console.error('Fetch orders failed:', err);

        } finally {
            setLoading(false);
        }
    };

    /* ── Modal helpers ── */
    const openModal = (type, order) => { setSelectedOrder(order); setActiveModal(type); };
    const closeModal = () => { setActiveModal(null); setSelectedOrder(null); };


    const handleDeleteOrder = async () => {

        setActionLoading(true);

        try {
            await deleteOrder(selectedOrder?.id);

            // Agar successfully delete ho gaya (Real admin)
            setApiOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
            showToast('Order deleted successfully!', 'success');
            closeModal();

        } catch (err) {
            console.error('Delete failed:', err);

            // ── AXIOS ERROR HANDLING FOR DEMO MODE ──
            if (err.response && err.response.data && err.response.data.error) {
                const backendError = err.response.data.error;

                // Automatically lock wala UI le lega customToast ke andar
                showToast(backendError, 'error');
            } else {
                // Agar real me network fail hua
                showToast('Network error. Please try again.', 'error');
            }
        } finally {
            setActionLoading(false);
        }
    };

    /* ── Status update callback ── */
    const handleStatusUpdate = (updated) => {
        if (typeof updated === 'string' && updated.startsWith('_open_status_')) {
            // "Update Status" button from view modal triggers this
            const order = apiOrders.find(o => o._id === updated.replace('_open_status_', ''));
            if (order) { setSelectedOrder(order); setActiveModal('status'); }
            return;
        }
        setApiOrders(prev => prev.map(o => o.id === updated.id ? { ...o, status: updated.status } : o));
    };

    /* ── Stats ── */
    const stats = useMemo(() => ({
        total: apiOrders.length,
        pending: apiOrders.filter(o => o.status === 'Pending').length,
        delivered: apiOrders.filter(o => o.status === 'Delivered').length,
        revenue: apiOrders.filter(o => o.status === 'Delivered').reduce((s, o) => s + (o.pricing?.total || 0), 0),
    }), [apiOrders]);

    /* ── Status counts for pills ── */
    const statusCounts = useMemo(() => {
        const c = { All: apiOrders.length };
        apiOrders.forEach(o => { c[o.status] = (c[o.status] || 0) + 1; });
        return c;
    }, [apiOrders]);

    /* ── Filtered list ── */
    const orders = useMemo(() => {
        const q = search.toLowerCase();
        return [...apiOrders].filter(o => {
            const matchSearch = !q
                || o.orderId?.toLowerCase().includes(q)
                || `${o.shipping?.firstName} ${o.shipping?.lastName}`.toLowerCase().includes(q)
                || o.shipping?.email?.toLowerCase().includes(q)
                || o.shipping?.phone?.includes(q);
            const matchStatus = statusFilter === 'All' || o.status === statusFilter;
            return matchSearch && matchStatus;
        }).sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
    }, [search, statusFilter, apiOrders]);


    const CustomToolbar = () => (
        <GridToolbarContainer className="flex flex-col sm:flex-row items-center justify-between px-4! py-3! w-full border-b border-slate-100 dark:border-slate-800 gap-4">
            <div className="w-full sm:w-auto flex-1">
                <GridToolbarQuickFilter placeholder="Quick filter orders…" className="w-full!" />
            </div>

            {/* ── FIX: :hover ko MuiButtonBase-root ke sath andar laga diya ── */}
            <div className="flex items-center gap-2 [&_.MuiButtonBase-root]:text-accent-500! [&_.MuiButtonBase-root:hover]:bg-accent-500/10!">
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
            </div>
        </GridToolbarContainer>
    );


    const columns = [
        {
            field: 'orderId', headerName: 'ORDER ID', width: 160,
            headerClassName: 'bg-base-900! dark:bg-base-950! text-base-50! text-[12px]!',
            renderCell: (p) => (
                // Ise accent se hata kar 'text-slate-600 dark:text-slate-300' ya 'indigo' kar do
                <span className="font-mono text-[12px] font-bold text-slate-700 dark:text-slate-300">
                    {p.value}
                </span>
            ),
        },
        {
            field: 'customer', headerName: 'CUSTOMER', flex: 1, minWidth: 180,
            headerClassName: 'bg-base-900! dark:bg-base-950! text-base-50! text-[12px]!',
            valueGetter: (_, row) => `${row.shipping?.firstName || ''} ${row.shipping?.lastName || ''}`.trim(),
            cellClassName: "flex items-center",
            renderCell: (p) => (
                <span className="font-bold flex flex-col justify-center text-[13px] leading-tight text-base-800 dark:text-base-100">
                    {p.value}
                    <span className="text-[11px] text-base-400">{p.row.shipping?.email}</span>
                </span>
            )
        },
        {
            field: 'items', headerName: 'ITEMS', width: 80,
            headerClassName: 'bg-base-900! dark:bg-base-950! text-base-50! text-[12px]!',
            valueGetter: (_, row) => row.items?.length || 0,
            cellClassName: "flex items-center justify-center",
            renderCell: (p) => (
                <div className="flex items-center gap-1 mb-1">
                    {/* Ise accent se hata kar ek standard cool color (indigo/blue) de do */}
                    <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                        <Package size={12} className="text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <span className="font-bold text-[13px] text-base-700 dark:text-base-300">{p.value}</span>
                </div>
            ),
        },
        {
            field: 'total', headerName: 'TOTAL', width: 120,
            headerClassName: 'bg-base-900! dark:bg-base-950! text-base-50! text-[12px]!',
            valueGetter: (_, row) => row.pricing?.total || 0,
            renderCell: (p) => (
                // Ise hamesha Emerald rakho, chahe theme kuch bhi ho
                <span className="font-extrabold text-[13px] text-emerald-600 dark:text-emerald-400">₹{fmt(p.value)}</span>
            ),
        },
        {
            field: 'payment', headerName: 'PAYMENT', width: 100,
            headerClassName: 'bg-base-900! dark:bg-base-950! text-base-50! text-[12px]!',
            valueGetter: (_, row) => row.payment?.method?.toUpperCase() || '—',
            renderCell: (p) => (
                <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {p.value}
                </span>
            ),
        },
        {
            field: 'status', headerName: 'STATUS', width: 140,
            headerClassName: 'bg-base-900! dark:bg-base-950! text-base-50! text-[12px]!',
            renderCell: (p) => <OrderStatusBadge status={p.value} />,
        },
        {
            field: 'placedAt', headerName: 'DATE', width: 120,
            headerClassName: 'bg-base-900! dark:bg-base-950! text-base-50! text-[12px]!',
            valueGetter: (_, row) => row.placedAt,
            renderCell: (p) => (
                <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">{fmtDate(p.value)}</span>
            ),
        },
        {
            field: 'actions', headerName: 'ACTIONS', width: 130,
            align: 'center', headerAlign: 'center',
            sortable: false, filterable: false, disableColumnMenu: true,
            headerClassName: 'bg-base-900! dark:bg-base-950! text-base-50! text-[12px]!',
            cellClassName: "flex items-center justify-center",
            renderCell: (p) => (
                <strong className='flex justify-center items-center gap-2'>
                    <button onClick={() => openModal('view', p.row)} className='p-2 bg-emerald-100 hover:bg-emerald-200 focus:ring-2 focus:ring-emerald-300 rounded-lg text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 transition-colors'>
                        <Eye size={16} />
                    </button>
                    <button onClick={() => openModal('status', p.row)} className='p-2 bg-sky-100 hover:bg-sky-200 focus:ring-2 focus:ring-sky-300 rounded-lg text-sky-600 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 dark:text-sky-400 transition-colors'>
                        <Package size={16} />
                    </button>
                    <button onClick={() => openModal('delete', p.row)} className='p-2 bg-red-100 hover:bg-red-200 focus:ring-2 focus:ring-red-300 rounded-lg text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 transition-colors'>
                        <Trash2 size={16} />
                    </button>
                </strong>
            ),
        },
    ];



    const [searchParams, setSearchParams] = useSearchParams();
    const highlightId = searchParams.get('highlight');
    const [activeHighlight, setActiveHighlight] = useState(null);
    const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
    const gridApiRef = useGridApiRef(); // lets us call DataGrid's own scrollToIndexes()

    useEffect(() => {
        if (!highlightId || orders.length === 0) return;

        const rowIndex = orders.findIndex(p => String(p.id) === String(highlightId));
        if (rowIndex === -1) return;

        // Jump to whichever page contains this row BEFORE scrolling to it
        const targetPage = Math.floor(rowIndex / paginationModel.pageSize);
        if (targetPage !== paginationModel.page) {
            setPaginationModel(p => ({ ...p, page: targetPage }));
        }

        setActiveHighlight(highlightId);

        const scrollTimer = setTimeout(() => {
            const indexOnPage = rowIndex % paginationModel.pageSize;

            if (gridApiRef.current?.scrollToIndexes) {
                // 1. Pehle DataGrid ke andar us row tak pahuche
                gridApiRef.current.scrollToIndexes({ rowIndex: indexOnPage, colIndex: 0 });

                // 2. Ab poore browser page ko us row tak smooth scroll karo
                // (Thoda sa delay diya taaki DataGrid row ko DOM me render kar le)
                setTimeout(() => {
                    const rowElement = document.querySelector(`[data-id="${highlightId}"]`);
                    if (rowElement) {
                        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        // Fallback: Agar row kisi wajah se nahi mili, toh pure table ko center me le aao
                        document.querySelector('.MuiDataGrid-root')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 150);

            } else {
                document.querySelector(`[data-id="${highlightId}"]`)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 250);

        const cleanupTimer = setTimeout(() => {
            setActiveHighlight(null);
            const next = new URLSearchParams(searchParams);
            next.delete('highlight');
            setSearchParams(next, { replace: true });
        }, 2500);

        return () => { clearTimeout(scrollTimer); clearTimeout(cleanupTimer); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [highlightId, orders]);


    /* ════════════ RENDER ════════════ */
    return (
        <div className="flex flex-col gap-5 w-full max-w-350 mx-auto relative">

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight mb-1">Orders</h1>
                    <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                        {orders.length} of {apiOrders.length} orders
                    </p>
                </div>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <MiniStat icon={ShoppingBag} label="Total Orders" value={stats.total} color="bg-accent-50 dark:bg-accent-500/10 text-accent-500" />
                <MiniStat icon={Clock} label="Pending" value={stats.pending} color="bg-amber-50 dark:bg-amber-500/10 text-amber-500" />
                <MiniStat icon={CheckCircle2} label="Delivered" value={stats.delivered} color="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500" />
                <MiniStat icon={TrendingUp} label="Revenue" value={`₹${fmt(stats.revenue)}`} color="bg-blue-50 dark:bg-blue-500/10 text-blue-500" />
            </div>

            {/* Search bar */}
            <div className="bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-lg p-3.5 flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-55">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by Order ID, customer name, email, phone…"
                        className="w-full bg-base-50 dark:bg-base-800/70 border border-base-200 dark:border-base-700 rounded-lg py-2 pl-10 pr-9 text-[13px] text-slate-900 dark:text-slate-50 placeholder-slate-400 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 transition-all"
                    />
                    {search && (
                        <X size={14} onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
                    )}
                </div>
            </div>

            {/* Status filter pills */}
            <div className="flex items-center gap-2 flex-wrap">
                {ALL_STATUSES.map(s => (
                    <StatusPill
                        key={s}
                        status={s}
                        active={statusFilter === s}
                        count={statusCounts[s] || 0}
                        onClick={() => setStatusFilter(s)}
                    />
                ))}
            </div>

            {/* DataGrid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-accent-500 animate-spin mb-4" />
                    <p className="text-slate-500 text-sm font-medium">Loading orders…</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-16 flex flex-col items-center gap-3">
                    <Package size={40} className="text-slate-300 dark:text-slate-700" strokeWidth={1.5} />
                    <p className="font-extrabold text-slate-800 dark:text-slate-100">No orders found</p>
                    <p className="text-[13px] text-slate-500">Try adjusting your search or status filter.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <Box>
                        <DataGrid
                            rows={orders}
                            columns={columns}
                            className="custom-scrollbar"
                            showToolbar
                            disableRowSelectionOnClick
                            isCellEditable={() => false}
                            disableColumnResize
                            slots={{ toolbar: CustomToolbar }}
                            slotProps={{ toolbar: { showQuickFilter: true } }}

                            rowHeight={52}

                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}

                            paginationMode="client"
                            pageSizeOptions={[5, 10, 25, 50, 100]}

                            initialState={{
                                pagination: { paginationModel: { pageSize: 10, page: 0 } },
                                sorting: { sortModel: [{ field: 'placedAt', sort: 'desc' }] },
                            }}

                            getRowClassName={(params) =>
                                String(params.row.id) === String(activeHighlight) ? 'highlight-row' : ''
                            }

                            sx={{
                                maxHeight: 680,
                                border: 'none',
                                '& .MuiDataGrid-cell': { fontSize: '12px' },
                                '& .MuiDataGrid-columnHeaderCheckbox': { backgroundColor: '#1D1D1D' },
                                '& .MuiDataGrid-columnHeaderCheckbox svg': { color: '#fff !important' },
                                '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none !important' },
                                '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': { outline: 'none !important' },
                            }}
                            disableSelectionOnClick
                        />
                    </Box>
                </div>
            )}

            {/* Modals */}

            <OrderUpdateModal
                open={activeModal === 'status'}
                order={selectedOrder}
                onClose={closeModal}
                onStatusUpdate={handleStatusUpdate}
            />

            <OrderViewModal
                open={activeModal === 'view'}
                order={selectedOrder}
                onClose={closeModal}
                onStatusUpdate={handleStatusUpdate}
            />

            <OrderDeleteModal
                open={activeModal === 'delete'}
                order={selectedOrder}
                onClose={closeModal}
                onConfirm={handleDeleteOrder}
                actionLoading={actionLoading}
            />

        </div>

    );

};

export default OrdersList;