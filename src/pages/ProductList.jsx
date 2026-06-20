
// import React, { useState, useMemo, useEffect } from 'react';
// import { Search, SlidersHorizontal, Plus, Loader2, X, Eye, Edit2, Trash2, MoreVertical } from 'lucide-react';
// import { Box, FormControlLabel, styled, Switch } from "@mui/material";
// import {
//     DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton,
//     GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarQuickFilter,
//     useGridApiRef
// } from "@mui/x-data-grid";
// import Popover from "@mui/material/Popover";
// import MenuItem from "@mui/material/MenuItem";

// import { showToast } from "../components/showToast";
// import StatusBadge from "../components/StatusBadge";
// import { deleteProduct, getAllProducts } from "../apis/productApi";

// import ProductFilterSidebar from "../components/ProductFilterSidebar";
// import AddProductModal from "../features/products/components/AddProductModal";
// import EditProductModal from "../features/products/components/EditProductModal";
// import ViewProductModal from "../features/products/components/ViewProductModal";
// import DeleteProductModal from "../features/products/components/DeleteProductModal";
// import { useSearchParams } from 'react-router-dom';
// import { useRef } from 'react';

// const ProductsList = () => {

//     const [menuPosition, setMenuPosition] = useState(null);

//     // API & Data 
//     const [apiProducts, setApiProducts] = useState([]);
//     const [dynamicCategories, setDynamicCategories] = useState(['All']);
//     const [loading, setLoading] = useState(true);

//     // Filters
//     const [search, setSearch] = useState('');
//     const [category, setCategory] = useState('All');
//     const [sliderValue, setSliderValue] = useState([0, 100000]);
//     const [stockFilter, setStockFilter] = useState('All');
//     const [showFilters, setShowFilters] = useState(false);

//     // Modals
//     const [activeModal, setActiveModal] = useState(null); // 'view' | 'edit' | 'delete' | 'add'
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const [actionLoading, setActionLoading] = useState(false);



//     /* ── Fetch all products ── */
//     useEffect(() => {
//         fetchAll();
//     }, []);

//     const fetchAll = async () => {
//         setLoading(true);
//         try {

//             const data = await getAllProducts();

//             const arr = Array.isArray(data) ? data : data.products || data.data || [];

//             hydrate(arr);

//         } catch (err) {
//             console.error("Fetch failed:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const hydrate = (arr) => {
//         const formatted = arr.map((item, index) => ({
//             id: item.id || item._id || `fallback-${index}`,
//             _id: item._id || item.id,
//             name: item.name || 'Unnamed Product',
//             category: item.category || 'Uncategorized',
//             price: item.new_price || 0,
//             old_price: item.old_price || 0,
//             stock: item.stock,
//             status: item.stock == 0 ? 'Out of Stock' : item.stock <= 5 ? "Low Stock" : 'In Stock',
//             is_active: item.available,
//             image: item.image || '',
//             sku: `SKU-${item.id || item._id?.slice(-6) || '000'}`,
//         }));
//         setApiProducts(formatted);
//         setDynamicCategories(['All', ...new Set(formatted.map(p => p.category))]);
//     };

//     /* ── Modal helpers ── */
//     const openModal = (type, product = null) => { setSelectedProduct(product); setActiveModal(type); };
//     const closeModal = () => { setActiveModal(null); setSelectedProduct(null); };


//     const handleProductDelete = async () => {

//         setActionLoading(true);

//         try {
//             await deleteProduct(selectedProduct?.id);

//             // Agar yahan tak code aa gaya, matlab delete success ho gaya (Demo mode nahi tha)
//             setApiProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
//             showToast('Product deleted successfully!', 'success');
//             closeModal();

//         } catch (err) {
//             console.error("Delete failed:", err);

//             // ── AXIOS ERROR HANDLING FOR DEMO MODE ──
//             if (err.response && err.response.data && err.response.data.error) {
//                 const backendError = err.response.data.error;

//                 // Ye automatically lock wala UI le lega kyunki showToast me humne logic lagaya hai
//                 showToast(backendError, 'error');

//             } else {
//                 // Agar real me koi network issue ho
//                 showToast('Network error. Please try again.', 'error');
//             }
//         } finally {
//             setActionLoading(false);
//         }
//     };

//     /* ── EDIT save callback (called by ProductModals after successful PUT) ── */
//     const handleSave = (updatedProduct) => {
//         setApiProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
//     };

//     /* ── ADD product callback (called by AddProductModal after successful POST) ── */
//     const handleAdded = (newProduct) => {
//         const formatted = {
//             id: newProduct?.id || newProduct?._id,
//             _id: newProduct?._id || newProduct?.id,
//             name: newProduct?.name,
//             category: newProduct?.category,
//             price: newProduct?.new_price || newProduct?.price,
//             old_price: newProduct?.old_price || 0,
//             stock: newProduct?.stock,
//             is_active: newProduct?.available,
//             status: newProduct?.stock == 0 ? 'Out of Stock' : newProduct?.stock <= 5 ? "Low Stock" : 'In Stock',
//             image: newProduct?.image || '',
//             sku: `SKU-${newProduct?.id || newProduct?._id?.slice(-6) || '000'}`,
//         };
//         setApiProducts(prev => [formatted, ...prev]);
//         setDynamicCategories(prev =>
//             prev.includes(formatted.category) ? prev : [...prev, formatted.category]
//         );
//     };

//     /* ── Filters ── */
//     const clearFilters = () => { setCategory('All'); setSliderValue([0, 100000]); setStockFilter('All'); setSearch(''); };

//     const activeFilterCount = [
//         category !== 'All' ? 1 : 0,
//         sliderValue[0] > 0 || sliderValue[1] < 100000 ? 1 : 0,
//         stockFilter !== 'All' ? 1 : 0,
//     ].reduce((a, b) => a + b, 0);

//     const products = useMemo(() => {

//         return [...apiProducts].filter(p => {

//             const name = (p.name || '').toLowerCase();
//             const id = (String(p.id) || '');
//             const sku = (p.sku || '').toLowerCase();
//             const status = (p.status || '').toLowerCase();
//             const cat = (p.category || '').toLowerCase();
//             const q = search.toLowerCase();

//             return (name.includes(q) || sku.includes(q) || id?.includes(q) || cat.includes(q) || status.includes(q))
//                 && (category === 'All' || p.category === category)
//                 && (p.price >= sliderValue[0] && p.price <= sliderValue[1])
//                 && (stockFilter === 'All' || p.status === stockFilter);

//         }).sort((a, b) => a.name?.toLowerCase() < b.name?.toLowerCase() ? -1 : 1);

//     }, [search, category, sliderValue, stockFilter, apiProducts]);

//     /* ── MUI toolbar ── */
//     const handleToolbarClick = (e) =>
//         setMenuPosition({ mouseX: e.currentTarget.getBoundingClientRect().left, mouseY: e.currentTarget.getBoundingClientRect().bottom });

//     const CustomToolbar = () => (
//         <GridToolbarContainer className="flex flex-col sm:flex-row items-center justify-between px-4! py-3! w-full border-b border-slate-100 dark:border-slate-800 gap-4">
//             <div className="w-full sm:w-auto flex-1">
//                 <GridToolbarQuickFilter placeholder="Search products…" className="w-full!" />
//             </div>
//             <div className="flex items-center gap-2 [&_.MuiButtonBase-root]:text-accent-500! [&_.MuiButtonBase-root:hover]:bg-accent-500/10!">
//                 <GridToolbarColumnsButton />
//                 <GridToolbarFilterButton />
//                 <GridToolbarDensitySelector />
//                 <GridToolbarExport />
//             </div>
//         </GridToolbarContainer>
//     );

//     const IOSSwitch = styled((props) => (
//         <Switch size="small" focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
//     ))(({ theme }) => ({
//         width: 36,
//         height: 20,
//         padding: 0,
//         '& .MuiSwitch-switchBase': {
//             padding: 0,
//             margin: 2.5,
//             transitionDuration: '300ms',
//             '&.Mui-checked': {
//                 transform: 'translateX(16px)',
//                 color: '#fff',
//                 '& + .MuiSwitch-track': {
//                     backgroundColor: '#65C466',
//                     opacity: 1,
//                     border: 0,
//                     ...theme.applyStyles('dark', {
//                         backgroundColor: '#2ECA45',
//                     }),
//                 },
//                 '&.Mui-disabled + .MuiSwitch-track': {
//                     opacity: 0.5,
//                 },
//             },
//             '&.Mui-focusVisible .MuiSwitch-thumb': {
//                 color: '#33cf4d',
//                 border: '6px solid #fff',
//             },
//             '&.Mui-disabled .MuiSwitch-thumb': {
//                 color: theme.palette.grey[100],
//                 ...theme.applyStyles('dark', {
//                     color: theme.palette.grey[600],
//                 }),
//             },
//             '&.Mui-disabled + .MuiSwitch-track': {
//                 opacity: 0.7,
//                 ...theme.applyStyles('dark', {
//                     opacity: 0.3,
//                 }),
//             },
//         },
//         '& .MuiSwitch-thumb': {
//             boxSizing: 'border-box',
//             width: 14,
//             height: 14,
//         },
//         '& .MuiSwitch-track': {
//             borderRadius: 26 / 2,
//             backgroundColor: '#E9E9EA',
//             opacity: 1,
//             transition: theme.transitions.create(['background-color'], {
//                 duration: 500,
//             }),
//             ...theme.applyStyles('dark', {
//                 backgroundColor: '#39393D',
//             }),
//         },
//     }));

//     /* ── Columns ── */
//     const columns = [
//         {
//             field: "id", headerName: "ID", headerAlign: "center", width: 80,
//             sort: "desc",
//             sortable: true, filterable: false, disableColumnMenu: true,
//             headerClassName: "bg-base-900! text-base-50! text-[12px]!",
//             cellClassName: "font-bold text-[13px]",
//         },
//         {
//             field: "image", headerName: "IMAGE", width: 80,
//             sortable: false, filterable: false, disableColumnMenu: true,
//             headerClassName: "bg-base-900! text-base-50! text-[12px]!",
//             renderCell: (p) => (
//                 <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden my-auto">
//                     <img src={p.value} alt="product" className="w-7 h-7 object-contain" />
//                 </div>
//             ),
//         },
//         {
//             field: "name", headerName: "PRODUCT NAME", flex: 1, minWidth: 200,
//             headerClassName: "bg-base-900! text-base-50! text-[12px]!",
//             cellClassName: "font-semibold text-[13px]",
//         },
//         {
//             field: "category", headerName: "CATEGORY", width: 130,
//             headerClassName: "bg-base-900! text-base-50! text-[12px]!",
//             cellClassName: "font-medium text-[13px] !text-slate-500 dark:!text-slate-400",
//         },
//         {
//             field: "price", headerName: "PRICE", width: 120,
//             headerClassName: "bg-base-900! text-base-50! text-[12px]!",
//             renderCell: (p) => (
//                 <span className="font-bold text-[13px] text-emerald-600 dark:text-emerald-400 block">
//                     ₹{p.value?.toLocaleString()}
//                 </span>
//             ),
//         },
//         {
//             field: "is_active", headerName: "PUBLISH", width: 100,
//             headerClassName: "bg-base-900! text-base-50! text-[12px]!",
//             renderCell: (p) => (
//                 // <span className={`font-bold text-[13px] block ${p.value === 0 ? 'text-slate-400' : p.value <= 5 ? 'text-accent-500' : 'text-slate-600 dark:text-slate-300'}`}>
//                 //     {p.value === 0 ? '—' : p.value}
//                 //     {/* <FormControlLabel
//                 //         control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
//                 //     /> */}
//                 // </span>
//                 <button
//                     type="button"
//                     // onClick={() => setForm(f => ({ ...f, available: !f.available }))}
//                     className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none 
//                         ${p.value
//                             ? 'bg-linear-to-r from-accent-400 to-accent-500 shadow-md shadow-accent'
//                             : 'bg-slate-200 dark:bg-slate-700'
//                         }`
//                     }
//                 >
//                     {p.value}
//                     <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200 
//                         ${p.value ? 'translate-x-4' : 'translate-x-0'}
//                     `} />
//                 </button>
//             ),
//         },
//         {
//             field: "status", headerName: "STATUS", width: 140,
//             headerClassName: "bg-base-900! text-base-50! text-[12px]!",
//             renderCell: (p) => <div className="overflow-hidden"><StatusBadge className="h-6" value={p.row.stock} status={p.value} /></div>,
//         },
//         {
//             field: "actions", headerName: "ACTIONS", width: 150, align: "center", headerAlign: "center", sortable: false, filterable: false, disableColumnMenu: true, headerClassName: "bg-base-900! text-base-50! text-[12px]!",
//             renderCell: (params) => (
//                 <strong className='flex justify-center items-center gap-2 mt-1.5!'>
//                     <button onClick={() => openModal('view', params.row)} className='p-2 bg-emerald-100 hover:bg-emerald-200 focus:ring-2 focus:ring-emerald-300 rounded-lg text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 transition-colors'>
//                         <Eye size={16} />
//                     </button>
//                     <button onClick={() => openModal('edit', params.row)} className='p-2 bg-sky-100 hover:bg-sky-200 focus:ring-2 focus:ring-sky-300 rounded-lg text-sky-600 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 dark:text-sky-400 transition-colors'>
//                         <Edit2 size={16} />
//                     </button>
//                     <button onClick={() => openModal('delete', params.row)} className='p-2 bg-red-100 hover:bg-red-200 focus:ring-2 focus:ring-red-300 rounded-lg text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 transition-colors'>
//                         <Trash2 size={16} />
//                     </button>
//                 </strong>
//             )
//         },


//     ];


//     /* ═══════════════════════════════════════ RENDER ═══════════════════════════════════════ */
//     return (
//         <div className="flex flex-col gap-5 w-full max-w-350 mx-auto relative">

//             {/* Header */}
//             <div className="flex flex-wrap items-start justify-between gap-3">
//                 <div>
//                     <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight mb-1">Products</h1>
//                     <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
//                         {products.length} of {apiProducts.length} products
//                     </p>
//                 </div>
//                 {/* ── ADD PRODUCT button ── */}
//                 <button
//                     onClick={() => openModal('add')}
//                     className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-gradient text-white font-bold text-[13px] shadow-[0_4px_16px_rgba(56,189,248,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(56,189,248,0.4)] transition-all duration-200"
//                 >
//                     <Plus size={16} strokeWidth={2.5} /> Add Product
//                 </button>
//             </div>

//             {/* Search + filter toggle */}
//             <div className="bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-lg shadow-xs p-3.5 flex flex-wrap gap-3 items-center">
//                 <div className="relative flex-1 min-w-55">
//                     <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-400" />
//                     <input
//                         value={search} onChange={e => setSearch(e.target.value)}
//                         placeholder="Search by name or SKU…"
//                         className="w-full bg-base-50 dark:bg-base-800/70 border border-base-200 dark:border-base-700 rounded-lg py-2 pl-10 pr-9 text-[13px] text-slate-900 dark:text-slate-50 placeholder-slate-400 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 transition-all"
//                     />
//                     {search && (
//                         <X size={14} onClick={() => setSearch('')}
//                             className="absolute right-3 top-1/2 -translate-y-1/2 text-base-400 cursor-pointer hover:text-base-600 transition-colors" />
//                     )}
//                 </div>

//                 <button
//                     onClick={() => setShowFilters(p => !p)}
//                     className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-bold bg-slate-900 dark:bg-base-800 border border-slate-700 text-white transition-colors hover:bg-slate-800"
//                 >
//                     <SlidersHorizontal size={14} /> Filters
//                     {activeFilterCount > 0 && (
//                         <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-[10px] rounded-full bg-accent-500 text-white ring-2 ring-white dark:ring-slate-900 font-bold">
//                             {activeFilterCount}
//                         </span>
//                     )}
//                 </button>
//             </div>

//             {/* DataGrid */}
//             {loading ? (
//                 <div className="flex flex-col items-center justify-center py-20">
//                     <Loader2 className="w-10 h-10 text-accent-500 animate-spin mb-4" />
//                     <p className="text-slate-500 text-sm font-medium">Loading products…</p>
//                 </div>
//             ) : (
//                 <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
//                     <Box>
//                         <DataGrid
//                             rows={products}
//                             columns={columns}
//                             className="custom-scrollbar"
//                             showToolbar
//                             disableRowSelectionOnClick
//                             isCellEditable={() => false}
//                             disableColumnResize
//                             // slots={{ toolbar: CustomToolbar }}
//                             slotProps={{ toolbar: { showQuickFilter: false } }}

//                             rowHeight={45}

//                             paginationMode="client"
//                             pageSizeOptions={[5, 10, 25, 50, 100]}

//                             // initialState={{
//                             //     // pagination: { paginationModel: { pageSize: 10, page: 0 } },
//                             //     sorting: {
//                             //         sortModel: [
//                             //             {
//                             //                 field: 'id',
//                             //                 sort: 'asc',
//                             //             },
//                             //         ],
//                             //     },
//                             // }}

//                             sx={{
//                                 maxHeight: 650,
//                                 border: 'none',
//                                 // '& .MuiDataGrid-columnSeparator' : { display : "none !important" } ,
//                                 '& .MuiDataGrid-cell[data-field="id"]': { textAlign: 'center' },
//                                 '& .MuiDataGrid-columnHeader[data-field="id"]': { textAlign: 'center' },
//                                 '& .MuiDataGrid-cell': { fontSize: '11px' },
//                                 '& .MuiDataGrid-columnHeaderCheckbox': { backgroundColor: '#1D1D1D' },
//                                 '& .MuiDataGrid-columnHeaderCheckbox svg': { color: '#fff !important' },
//                                 '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none !important' },
//                                 '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': { outline: 'none !important' },
//                             }}
//                             disableSelectionOnClick
//                         />
//                     </Box>
//                 </div>
//             )}

//             {/* Filter Sidebar */}
//             <ProductFilterSidebar
//                 showFilters={showFilters} setShowFilters={setShowFilters}
//                 category={category} setCategory={setCategory}
//                 dynamicCategories={dynamicCategories}
//                 sliderValue={sliderValue} handleSliderChange={(_, val) => setSliderValue(val)}
//                 stockFilter={stockFilter} setStockFilter={setStockFilter}
//                 clearFilters={clearFilters}
//                 activeCount={activeFilterCount}
//             />


//             {/* Add Product Modal */}
//             <AddProductModal
//                 open={activeModal === 'add'}
//                 onClose={closeModal}
//                 onAdded={handleAdded}
//             />

//             <EditProductModal
//                 open={activeModal === "edit"}
//                 product={selectedProduct}
//                 closeModal={closeModal}
//                 onSave={handleSave}
//             />

//             <ViewProductModal
//                 open={activeModal === "view"}
//                 product={selectedProduct}
//                 closeModal={closeModal}
//             />

//             <DeleteProductModal
//                 open={activeModal === "delete"}
//                 product={selectedProduct}
//                 closeModal={closeModal}
//                 confirmDelete={handleProductDelete}
//                 actionLoading={actionLoading}
//             />

//         </div>

//     );

// };

// export default ProductsList;




import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Plus, Loader2, X, Eye, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { Box, FormControlLabel, styled, Switch } from "@mui/material";
import {
    DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton,
    GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarQuickFilter,
    useGridApiRef
} from "@mui/x-data-grid";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";

import { showToast } from "../components/showToast";
import StatusBadge from "../components/StatusBadge";
import { deleteProduct, getAllProducts } from "../apis/productApi";

import ProductFilterSidebar from "../components/ProductFilterSidebar";
import AddProductModal from "../features/products/components/AddProductModal";
import EditProductModal from "../features/products/components/EditProductModal";
import ViewProductModal from "../features/products/components/ViewProductModal";
import DeleteProductModal from "../features/products/components/DeleteProductModal";
import { useSearchParams } from 'react-router-dom';

const ProductsList = () => {

    const [menuPosition, setMenuPosition] = useState(null);

    // API & Data
    const [apiProducts, setApiProducts] = useState([]);
    const [dynamicCategories, setDynamicCategories] = useState(['All']);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [sliderValue, setSliderValue] = useState([0, 100000]);
    const [stockFilter, setStockFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    // Modals
    const [activeModal, setActiveModal] = useState(null); // 'view' | 'edit' | 'delete' | 'add'
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // ── HIGHLIGHT: read ?highlight=<id> from URL (set by CommandPalette search) ──
    const [searchParams, setSearchParams] = useSearchParams();
    const highlightId = searchParams.get('highlight');
    const [activeHighlight, setActiveHighlight] = useState(null);
    const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });
    const gridApiRef = useGridApiRef(); // lets us call DataGrid's own scrollToIndexes()

    /* ── Fetch all products ── */
    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {

            const data = await getAllProducts();

            const arr = Array.isArray(data) ? data : data.products || data.data || [];

            hydrate(arr);

        } catch (err) {
            console.error("Fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const hydrate = (arr) => {
        const formatted = arr.map((item, index) => ({
            id: item.id || item._id || `fallback-${index}`,
            _id: item._id || item.id,
            name: item.name || 'Unnamed Product',
            category: item.category || 'Uncategorized',
            price: item.new_price || 0,
            old_price: item.old_price || 0,
            stock: item.stock,
            status: item.stock == 0 ? 'Out of Stock' : item.stock <= 5 ? "Low Stock" : 'In Stock',
            is_active: item.available,
            image: item.image || '',
            sku: `SKU-${item.id || item._id?.slice(-6) || '000'}`,
        }));
        setApiProducts(formatted);
        setDynamicCategories(['All', ...new Set(formatted.map(p => p.category))]);
    };

    /* ── Modal helpers ── */
    const openModal = (type, product = null) => { setSelectedProduct(product); setActiveModal(type); };
    const closeModal = () => { setActiveModal(null); setSelectedProduct(null); };


    const handleProductDelete = async () => {

        setActionLoading(true);

        try {
            await deleteProduct(selectedProduct?.id);

            // Agar yahan tak code aa gaya, matlab delete success ho gaya (Demo mode nahi tha)
            setApiProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
            showToast('Product deleted successfully!', 'success');
            closeModal();

        } catch (err) {
            console.error("Delete failed:", err);

            // ── AXIOS ERROR HANDLING FOR DEMO MODE ──
            if (err.response && err.response.data && err.response.data.error) {
                const backendError = err.response.data.error;

                // Ye automatically lock wala UI le lega kyunki showToast me humne logic lagaya hai
                showToast(backendError, 'error');

            } else {
                // Agar real me koi network issue ho
                showToast('Network error. Please try again.', 'error');
            }
        } finally {
            setActionLoading(false);
        }
    };

    /* ── EDIT save callback (called by ProductModals after successful PUT) ── */
    const handleSave = (updatedProduct) => {
        setApiProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    /* ── ADD product callback (called by AddProductModal after successful POST) ── */
    const handleAdded = (newProduct) => {
        const formatted = {
            id: newProduct?.id || newProduct?._id,
            _id: newProduct?._id || newProduct?.id,
            name: newProduct?.name,
            category: newProduct?.category,
            price: newProduct?.new_price || newProduct?.price,
            old_price: newProduct?.old_price || 0,
            stock: newProduct?.stock,
            is_active: newProduct?.available,
            status: newProduct?.stock == 0 ? 'Out of Stock' : newProduct?.stock <= 5 ? "Low Stock" : 'In Stock',
            image: newProduct?.image || '',
            sku: `SKU-${newProduct?.id || newProduct?._id?.slice(-6) || '000'}`,
        };
        setApiProducts(prev => [formatted, ...prev]);
        setDynamicCategories(prev =>
            prev.includes(formatted.category) ? prev : [...prev, formatted.category]
        );
    };

    /* ── Filters ── */
    const clearFilters = () => { setCategory('All'); setSliderValue([0, 100000]); setStockFilter('All'); setSearch(''); };

    const activeFilterCount = [
        category !== 'All' ? 1 : 0,
        sliderValue[0] > 0 || sliderValue[1] < 100000 ? 1 : 0,
        stockFilter !== 'All' ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    const products = useMemo(() => {

        return [...apiProducts].filter(p => {

            const name = (p.name || '').toLowerCase();
            const id = (String(p.id) || '');
            const sku = (p.sku || '').toLowerCase();
            const status = (p.status || '').toLowerCase();
            const cat = (p.category || '').toLowerCase();
            const q = search.toLowerCase();

            return (name.includes(q) || sku.includes(q) || id?.includes(q) || cat.includes(q) || status.includes(q))
                && (category === 'All' || p.category === category)
                && (p.price >= sliderValue[0] && p.price <= sliderValue[1])
                && (stockFilter === 'All' || p.status === stockFilter);

        }).sort((a, b) => a.name?.toLowerCase() < b.name?.toLowerCase() ? -1 : 1);

    }, [search, category, sliderValue, stockFilter, apiProducts]);

    /* ─────────────────────────────────────────────────
       HIGHLIGHT ROW — runs once products are loaded
       and a ?highlight=<id> exists in the URL (set when
       you click a result in the global search / command
       palette). Scrolls to it, glows it for 2.5s, then
       cleans the URL so a refresh doesn't re-trigger it.
    ───────────────────────────────────────────────── */
    useEffect(() => {
        if (!highlightId || products.length === 0) return;

        const rowIndex = products.findIndex(p => String(p.id) === String(highlightId));
        if (rowIndex === -1) return;

        // Jump to whichever page contains this row BEFORE scrolling to it
        const targetPage = Math.floor(rowIndex / paginationModel.pageSize);
        if (targetPage !== paginationModel.page) {
            setPaginationModel(p => ({ ...p, page: targetPage }));
        }

        setActiveHighlight(highlightId);

        // const scrollTimer = setTimeout(() => {
        //     const indexOnPage = rowIndex % paginationModel.pageSize;
        //     if (gridApiRef.current?.scrollToIndexes) {
        //         gridApiRef.current.scrollToIndexes({ rowIndex: indexOnPage, colIndex: 0 });
        //     } else {
        //         document.querySelector(`[data-id="${highlightId}"]`)
        //             ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        //     }
        // }, 250); // slightly longer delay to let the page switch render first 

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
    }, [highlightId, products]);

    /* ── MUI toolbar ── */
    const handleToolbarClick = (e) =>
        setMenuPosition({ mouseX: e.currentTarget.getBoundingClientRect().left, mouseY: e.currentTarget.getBoundingClientRect().bottom });

    const CustomToolbar = () => (
        <GridToolbarContainer className="flex flex-col sm:flex-row items-center justify-between px-4! py-3! w-full border-b border-slate-100 dark:border-slate-800 gap-4">
            <div className="w-full sm:w-auto flex-1">
                <GridToolbarQuickFilter placeholder="Search products…" className="w-full!" />
            </div>
            <div className="flex items-center gap-2 [&_.MuiButtonBase-root]:text-accent-500! [&_.MuiButtonBase-root:hover]:bg-accent-500/10!">
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
            </div>
        </GridToolbarContainer>
    );

    const IOSSwitch = styled((props) => (
        <Switch size="small" focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
        width: 36,
        height: 20,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2.5,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: '#65C466',
                    opacity: 1,
                    border: 0,
                    ...theme.applyStyles('dark', {
                        backgroundColor: '#2ECA45',
                    }),
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color: theme.palette.grey[100],
                ...theme.applyStyles('dark', {
                    color: theme.palette.grey[600],
                }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.7,
                ...theme.applyStyles('dark', {
                    opacity: 0.3,
                }),
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 14,
            height: 14,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: '#E9E9EA',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
            ...theme.applyStyles('dark', {
                backgroundColor: '#39393D',
            }),
        },
    }));

    /* ── Columns ── */
    const columns = [
        {
            field: "id", headerName: "ID", headerAlign: "center", width: 80,
            sort: "desc",
            sortable: true, filterable: false, disableColumnMenu: true,
            headerClassName: "bg-base-900! text-base-50! text-[12px]!",
            cellClassName: "font-bold text-[13px]",
        },
        {
            field: "image", headerName: "IMAGE", width: 80,
            sortable: false, filterable: false, disableColumnMenu: true,
            headerClassName: "bg-base-900! text-base-50! text-[12px]!",
            renderCell: (p) => (
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden my-auto">
                    <img src={p.value} alt="product" className="w-7 h-7 object-contain" />
                </div>
            ),
        },
        {
            field: "name", headerName: "PRODUCT NAME", flex: 1, minWidth: 200,
            headerClassName: "bg-base-900! text-base-50! text-[12px]!",
            cellClassName: "font-semibold text-[13px]",
        },
        {
            field: "category", headerName: "CATEGORY", width: 130,
            headerClassName: "bg-base-900! text-base-50! text-[12px]!",
            cellClassName: "font-medium text-[13px] !text-slate-500 dark:!text-slate-400",
        },
        {
            field: "price", headerName: "PRICE", width: 120,
            headerClassName: "bg-base-900! text-base-50! text-[12px]!",
            renderCell: (p) => (
                <span className="font-bold text-[13px] text-emerald-600 dark:text-emerald-400 block">
                    ₹{p.value?.toLocaleString()}
                </span>
            ),
        },
        {
            field: "is_active", headerName: "PUBLISH", width: 100,
            headerClassName: "bg-base-900! text-base-50! text-[12px]!",
            renderCell: (p) => (
                <button
                    type="button"
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none 
                        ${p.value
                            ? 'bg-linear-to-r from-accent-400 to-accent-500 shadow-md shadow-accent'
                            : 'bg-slate-200 dark:bg-slate-700'
                        }`
                    }
                >
                    {p.value}
                    <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200 
                        ${p.value ? 'translate-x-4' : 'translate-x-0'}
                    `} />
                </button>
            ),
        },
        {
            field: "status", headerName: "STATUS", width: 140,
            headerClassName: "bg-base-900! text-base-50! text-[12px]!",
            renderCell: (p) => <div className="overflow-hidden"><StatusBadge className="h-6" value={p.row.stock} status={p.value} /></div>,
        },
        {
            field: "actions", headerName: "ACTIONS", width: 150, align: "center", headerAlign: "center", sortable: false, filterable: false, disableColumnMenu: true, headerClassName: "bg-base-900! text-base-50! text-[12px]!",
            renderCell: (params) => (
                <strong className='flex justify-center items-center gap-2 mt-1.5!'>
                    <button onClick={() => openModal('view', params.row)} className='p-2 bg-emerald-100 hover:bg-emerald-200 focus:ring-2 focus:ring-emerald-300 rounded-lg text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 transition-colors'>
                        <Eye size={16} />
                    </button>
                    <button onClick={() => openModal('edit', params.row)} className='p-2 bg-sky-100 hover:bg-sky-200 focus:ring-2 focus:ring-sky-300 rounded-lg text-sky-600 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 dark:text-sky-400 transition-colors'>
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => openModal('delete', params.row)} className='p-2 bg-red-100 hover:bg-red-200 focus:ring-2 focus:ring-red-300 rounded-lg text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 transition-colors'>
                        <Trash2 size={16} />
                    </button>
                </strong>
            )
        },


    ];


    /* ═══════════════════════════════════════ RENDER ═══════════════════════════════════════ */
    return (
        <div className="flex flex-col gap-5 w-full max-w-350 mx-auto relative">

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight mb-1">Products</h1>
                    <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                        {products.length} of {apiProducts.length} products
                    </p>
                </div>
                {/* ── ADD PRODUCT button ── */}
                <button
                    onClick={() => openModal('add')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-gradient text-white font-bold text-[13px] shadow-[0_4px_16px_rgba(56,189,248,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(56,189,248,0.4)] transition-all duration-200"
                >
                    <Plus size={16} strokeWidth={2.5} /> Add Product
                </button>
            </div>

            {/* Search + filter toggle */}
            <div className="bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-lg shadow-xs p-3.5 flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-55">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-400" />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or SKU…"
                        className="w-full bg-base-50 dark:bg-base-800/70 border border-base-200 dark:border-base-700 rounded-lg py-2 pl-10 pr-9 text-[13px] text-slate-900 dark:text-slate-50 placeholder-slate-400 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20 transition-all"
                    />
                    {search && (
                        <X size={14} onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-400 cursor-pointer hover:text-base-600 transition-colors" />
                    )}
                </div>

                <button
                    onClick={() => setShowFilters(p => !p)}
                    className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-bold bg-slate-900 dark:bg-base-800 border border-slate-700 text-white transition-colors hover:bg-slate-800"
                >
                    <SlidersHorizontal size={14} /> Filters
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 text-[10px] rounded-full bg-accent-500 text-white ring-2 ring-white dark:ring-slate-900 font-bold">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {/* DataGrid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-accent-500 animate-spin mb-4" />
                    <p className="text-slate-500 text-sm font-medium">Loading products…</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <Box>
                        <DataGrid
                            apiRef={gridApiRef}
                            rows={products}
                            columns={columns}
                            className="custom-scrollbar"
                            showToolbar
                            disableRowSelectionOnClick
                            isCellEditable={() => false}
                            disableColumnResize
                            slotProps={{ toolbar: { showQuickFilter: false } }}

                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}

                            rowHeight={45}

                            paginationMode="client"
                            pageSizeOptions={[5, 10, 25, 50, 100]}

                            // ── HIGHLIGHT: apply glow class to the matching row ──
                            getRowClassName={(params) =>
                                String(params.row.id) === String(activeHighlight) ? 'highlight-row' : ''
                            }

                            sx={{
                                maxHeight: 650,
                                border: 'none',
                                '& .MuiDataGrid-cell[data-field="id"]': { textAlign: 'center' },
                                '& .MuiDataGrid-columnHeader[data-field="id"]': { textAlign: 'center' },
                                '& .MuiDataGrid-cell': { fontSize: '11px' },
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

            {/* Filter Sidebar */}
            <ProductFilterSidebar
                showFilters={showFilters} setShowFilters={setShowFilters}
                category={category} setCategory={setCategory}
                dynamicCategories={dynamicCategories}
                sliderValue={sliderValue} handleSliderChange={(_, val) => setSliderValue(val)}
                stockFilter={stockFilter} setStockFilter={setStockFilter}
                clearFilters={clearFilters}
                activeCount={activeFilterCount}
            />


            {/* Add Product Modal */}
            <AddProductModal
                open={activeModal === 'add'}
                onClose={closeModal}
                onAdded={handleAdded}
            />

            <EditProductModal
                open={activeModal === "edit"}
                product={selectedProduct}
                closeModal={closeModal}
                onSave={handleSave}
            />

            <ViewProductModal
                open={activeModal === "view"}
                product={selectedProduct}
                closeModal={closeModal}
            />

            <DeleteProductModal
                open={activeModal === "delete"}
                product={selectedProduct}
                closeModal={closeModal}
                confirmDelete={handleProductDelete}
                actionLoading={actionLoading}
            />

        </div>

    );

};

export default ProductsList;
