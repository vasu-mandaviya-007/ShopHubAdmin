// import { SlidersHorizontal, X } from "lucide-react";
// import React, { useState } from "react";


// const FilterSection = ({ title, children, isOpen, onToggle }) => (

//     <div className="rounded-2xl border border-base-100 dark:border-base-800 overflow-hidden">

//         <button onClick={onToggle}
//             className={`w-full flex items-center justify-between px-4 py-3 text-[13px] font-bold transition-colors ${isOpen ? 'bg-base-50 dark:bg-base-800 text-base-900 dark:text-base-50' : 'text-base-600 dark:text-base-300 hover:bg-base-50 dark:hover:bg-base-800'}`}>
//             {title}
//             <i className={`fa-solid fa-angle-down text-base-400 text-[11px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
//         </button>

//         <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-72' : 'max-h-0'}`}>
//             <div className="px-4 pb-4 pt-2">{children}</div>
//         </div>

//     </div>

// );

// const FilterSidebar = ({ show, onClose, status, setStatus, joinedFilter, setJoinedFilter, clearFilters, activeCount }) => {

//     const [open, setOpen] = useState(['status', 'joined']);

//     const toggle = (s) => setOpen(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

//     return (

//         <>

//             <div onClick={onClose} className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

//             <div className={`fixed top-0 right-0 w-full sm:w-80 h-full overflow-y-auto bg-white dark:bg-base-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${show ? 'translate-x-0' : 'translate-x-[105%]'}`}>

//                 {/* Sidebar header */}
//                 <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-base-900 shadow-md">

//                     <div className="flex items-center gap-2 text-white font-bold text-base">
//                         <SlidersHorizontal size={18} /> Filters
//                         {activeCount > 0 && (
//                             <span className="w-5 h-5 rounded-full bg-accent-500 text-[10px] font-extrabold flex items-center justify-center">{activeCount}</span>
//                         )}
//                     </div>

//                     <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
//                         <X size={16} className="text-white" />
//                     </button>

//                 </div>

//                 {/* Clear */}
//                 <div className="flex justify-end px-5 py-2.5 border-b border-base-100 dark:border-base-800">
//                     <button onClick={clearFilters}
//                         className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 text-[12px] font-bold border border-rose-100 dark:border-rose-500/20 hover:bg-rose-100 transition-colors">
//                         <i className="fa-solid fa-filter-circle-xmark text-[11px]" /> Clear All
//                     </button>
//                 </div>

//                 <div className="flex flex-col gap-3 p-4">

//                     {/* Status filter */}
//                     <FilterSection title="Account Status" isOpen={open.includes('status')} onToggle={() => toggle('status')}>

//                         <div className="flex flex-col gap-1.5">
//                             {['All', 'Active', 'Inactive', 'Blocked'].map(s => (
//                                 <button key={s} onClick={() => setStatus(s)}
//                                     className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-left transition-all
//                                         ${status === s
//                                             ? 'bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-sky-200 dark:border-sky-500/20'
//                                             : 'text-base-600 dark:text-base-400 hover:bg-base-50 dark:hover:bg-base-800 border border-transparent'}`}>
//                                     <span className={`w-2 h-2 rounded-full shrink-0 ${s === 'Active' ? 'bg-emerald-500' : s === 'Blocked' ? 'bg-rose-500' : s === 'Inactive' ? 'bg-slate-400' : 'bg-sky-400'}`} />
//                                     {s}
//                                     {status === s && <i className="fa-solid fa-check ml-auto text-accent-500 text-[11px]" />}
//                                 </button>
//                             ))}
//                         </div>

//                     </FilterSection>

//                     {/* Joined filter */}
//                     <FilterSection title="Joined Date" isOpen={open.includes('joined')} onToggle={() => toggle('joined')}>

//                         <div className="flex flex-col gap-1.5">
//                             {[
//                                 { label: 'Any Time', val: 'all' },
//                                 { label: 'Last 7 days', val: '7d' },
//                                 { label: 'Last 30 days', val: '30d' },
//                                 { label: 'Last 3 months', val: '3m' },
//                                 { label: 'This Year', val: 'year' },
//                             ].map(({ label, val }) => (

//                                 <button key={val} onClick={() => setJoinedFilter(val)}
//                                     className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold text-left transition-all
//                                         ${joinedFilter === val
//                                             ? 'bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400 border border-sky-200 dark:border-sky-500/20'
//                                             : 'text-base-600 dark:text-base-400 hover:bg-base-50 dark:hover:bg-base-800 border border-transparent'}`}>
//                                     {label}
//                                     {joinedFilter === val && <i className="fa-solid fa-check text-accent-500 text-[11px]" />}
//                                 </button>

//                             ))}

//                         </div>

//                     </FilterSection>

//                 </div>

//             </div>

//         </>

//     );

// };


// export default FilterSidebar;




// import React, { useState, useEffect, useRef } from 'react';
// import { SlidersHorizontal, X, Check, Tag, IndianRupee, PackageCheck, RotateCcw } from 'lucide-react';

// const STOCK_FILTERS = [
//     { val: 'In Stock', icon: '🟢', desc: 'Available to purchase' },
//     { val: 'Out of Stock', icon: '🔴', desc: 'Currently unavailable' },
// ];

// const QUICK_RANGES = [
//     { label: 'Under ₹1K', min: 0, max: 1000 },
//     { label: '₹1K – ₹10K', min: 1000, max: 10000 },
//     { label: '₹10K – ₹50K', min: 10000, max: 50000 },
//     { label: 'Above ₹50K', min: 50000, max: 100000 },
// ];

// /* ─── Collapsible section ─── */
// const FilterSection = ({ title, icon: Icon, count, children, isOpen, onToggle }) => (

//     <div className={`rounded-lg shadow-2xs border ${isOpen ? "border-base-200 dark:border-base-800 " : " border-base-100 dark:border-base-800"} overflow-hidden bg-white dark:bg-base-900/40 `} >

//         <button onClick={onToggle}
//             className={`w-full flex items-center justify-between px-4 py-3.5 transition-colors duration-200
//                 ${isOpen ? 'bg-accent-50/60 border-b border-b-base-200 dark:border-b-base-800 dark:bg-accent-500/6' : 'hover:bg-base-50 border-b border-b-transparent dark:hover:bg-base-800/40'}`}
//         >

//             <div className="flex items-center gap-2.5">

//                 <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200
//                     ${isOpen ? 'bg-accent-500 text-white' : 'bg-base-100 dark:bg-base-800 text-base-400'}`}>
//                     <Icon size={13} />
//                 </span>

//                 <span className={`text-[13px] font-bold transition-colors ${isOpen ? 'text-accent-700 dark:text-accent-400' : 'text-base-700 dark:text-base-300'}`}>
//                     {title}
//                 </span>

//                 {count > 0 && (
//                     <span className="w-4.5 h-4.5 rounded-full bg-accent-500 text-white text-[9px] font-extrabold flex items-center justify-center">
//                         {count}
//                     </span>
//                 )}

//             </div>

//             <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
//                 className={`text-base-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
//                 <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>

//         </button>

//         {/* <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}> */}
//         <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-72' : 'max-h-0'}`}>

//             {/* <div className="overflow-hidden"> */}
//             <div className="px-4 pb-4 pt-4">{children}</div>
//             {/* </div> */}

//         </div>

//     </div>

// );

// /* ─── Custom dual-range slider (no MUI) ─── */
// const PriceRangeSlider = ({ value, onChange, min = 0, max = 100000, step = 500 }) => {
//     const [localMin, localMax] = value;
//     const trackRef = useRef(null);

//     const pct = (v) => ((v - min) / (max - min)) * 100;

//     const handleDrag = (which) => (e) => {
//         e.preventDefault();
//         const track = trackRef.current;
//         if (!track) return;
//         const rect = track.getBoundingClientRect();

//         const move = (ev) => {
//             const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
//             let ratio = (clientX - rect.left) / rect.width;
//             ratio = Math.max(0, Math.min(1, ratio));
//             let raw = Math.round((min + ratio * (max - min)) / step) * step;

//             if (which === 'min') raw = Math.min(raw, localMax - step);
//             else raw = Math.max(raw, localMin + step);

//             const next = which === 'min' ? [raw, localMax] : [localMin, raw];
//             onChange(null, next);
//         };
//         const up = () => {
//             document.removeEventListener('mousemove', move);
//             document.removeEventListener('mouseup', up);
//             document.removeEventListener('touchmove', move);
//             document.removeEventListener('touchend', up);
//         };
//         document.addEventListener('mousemove', move);
//         document.addEventListener('mouseup', up);
//         document.addEventListener('touchmove', move);
//         document.addEventListener('touchend', up);
//     };

//     return (
//         <div className="pt-3 pb-1">
//             {/* Track */}
//             <div ref={trackRef} className="relative h-1.5 rounded-full bg-base-100 dark:bg-base-800 mx-1">
//                 <div
//                     className="absolute h-full rounded-full bg-accent-gradient"
//                     style={{ left: `${pct(localMin)}%`, right: `${100 - pct(localMax)}%` }}
//                 />
//                 {/* Min handle */}
//                 <div
//                     onMouseDown={handleDrag('min')} onTouchStart={handleDrag('min')}
//                     className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-white border-2 border-accent-500 shadow-md cursor-grab active:cursor-grabbing active:scale-110 transition-transform"
//                     style={{ left: `${pct(localMin)}%` }}
//                 />
//                 {/* Max handle */}
//                 <div
//                     onMouseDown={handleDrag('max')} onTouchStart={handleDrag('max')}
//                     className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-white border-2 border-accent-500 shadow-md cursor-grab active:cursor-grabbing active:scale-110 transition-transform"
//                     style={{ left: `${pct(localMax)}%` }}
//                 />
//             </div>

//             {/* Value pill */}
//             <div className="flex items-center justify-between mt-4 px-3.5 py-2.5 rounded-xl bg-accent-50 dark:bg-accent-500/[0.08] border border-accent-100 dark:border-accent-500/15">
//                 <span className="text-[12px] font-extrabold text-accent-700 dark:text-accent-400">₹{localMin.toLocaleString('en-IN')}</span>
//                 <span className="text-[10px] text-base-400 font-medium">to</span>
//                 <span className="text-[12px] font-extrabold text-accent-700 dark:text-accent-400">₹{localMax.toLocaleString('en-IN')}</span>
//             </div>

//             {/* Quick presets */}
//             <div className="flex flex-wrap gap-1.5 mt-3">
//                 {QUICK_RANGES.map(({ label, min: qMin, max: qMax }) => {
//                     const active = localMin === qMin && localMax === qMax;
//                     return (
//                         <button key={label} onClick={() => onChange(null, [qMin, qMax])}
//                             className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all
//                                 ${active
//                                     ? 'bg-accent-500 text-white shadow-sm'
//                                     : 'bg-base-50 dark:bg-base-800 text-base-500 dark:text-base-400 hover:bg-base-100 dark:hover:bg-base-700'}`}>
//                             {label}
//                         </button>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// /* ─── Custom checkbox ─── */
// const FilterCheckbox = ({ checked, onChange, label, count }) => (

//     <label className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-150 group

//         ${checked ? 'bg-accent-50 dark:bg-accent-500/8' : 'hover:bg-base-50 dark:hover:bg-base-800/50'}`}>

//         <button type="button" onClick={onChange}
//             className={`w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-150
//                 ${checked ? 'bg-accent-500 border-accent-500' : 'border-base-300 dark:border-base-600 group-hover:border-accent-300'}`}>
//             {checked && <Check size={11} className="text-white" strokeWidth={3} />}
//         </button>

//         <span className={`text-[13px] font-medium flex-1 capitalize transition-colors ${checked ? 'text-accent-700 dark:text-accent-400 font-bold' : 'text-base-600 dark:text-base-300'}`}>
//             {label}
//         </span>

//         {count !== undefined && (
//             <span className="text-[10px] font-bold text-base-300 dark:text-base-600">{count}</span>
//         )}

//     </label>

// );

// /* ─── Custom toggle row ─── */
// const FilterToggleRow = ({ checked, onChange, label, desc, emoji }) => (
//     <button onClick={onChange}
//         className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all duration-200 text-left
//             ${checked
//                 ? 'bg-accent-50 dark:bg-accent-500/8 border-accent-200 dark:border-accent-500/25'
//                 : 'bg-white dark:bg-base-900 border-base-100 dark:border-base-800 hover:border-base-200 dark:hover:border-base-700'}`}>
//         <span className="text-base leading-none">{emoji}</span>
//         <div className="flex-1 min-w-0">
//             <p className={`text-[13px] font-bold ${checked ? 'text-accent-700 dark:text-accent-400' : 'text-base-700 dark:text-base-300'}`}>{label}</p>
//             <p className="text-[10px] text-base-400 mt-0.5">{desc}</p>
//         </div>
//         <div className={`relative w-9 h-5 rounded-full shrink-0 transition-colors duration-200 ${checked ? 'bg-accent-gradient' : 'bg-base-200 dark:bg-base-700'}`}>
//             <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
//         </div>
//     </button>
// );

// /* ═══════════════════════════════════════════════════
//    MAIN SIDEBAR
// ═══════════════════════════════════════════════════ */
// const FilterSidebar = ({
//     show, onClose, status, setStatus, joinedFilter, setJoinedFilter, clearFilters, activeCount
// }) => {

//     const [open, setOpen] = useState(['category', 'price', 'stock']);
//     const toggle = (s) => setOpen(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

//     // Lock body scroll while open
//     useEffect(() => {
//         document.body.style.overflow = show ? 'hidden' : '';
//         return () => { document.body.style.overflow = ''; };
//     }, [show]);

//     const categoryCount = status !== 'All' ? 1 : 0;
//     // const priceCount = (sliderValue[0] > 0 || sliderValue[1] < 100000) ? 1 : 0;
//     // const stockCount = stockFilter !== 'All' ? 1 : 0;

//     return (
//         <>
//             {/* Backdrop */}
//             <div onClick={() => onClose(false)}
//                 className={`fixed inset-0 bg-base-950/50 backdrop-blur-[3px] z-40 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

//             {/* Panel */}
//             <div className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-base-50 dark:bg-base-950 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out
//                 ${show ? 'translate-x-0' : 'translate-x-full'}`}>

//                 {/* Header — gradient, floating */}
//                 <div className="relative shrink-0 bg-accent-gradient px-5 pt-5 pb-6 overflow-hidden">
//                     <div className="absolute inset-0 opacity-[0.07]"
//                         style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '18px 18px' }} />
//                     <div className="relative flex items-center justify-between">
//                         <div className="flex items-center gap-2.5">
//                             <span className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
//                                 <SlidersHorizontal size={16} className="text-white" />
//                             </span>
//                             <div>
//                                 <p className="text-white font-extrabold text-[15px] leading-none">Filters</p>
//                                 <p className="text-white/70 text-[11px] mt-1">
//                                     {activeCount > 0 ? `${activeCount} active filter${activeCount > 1 ? 's' : ''}` : 'Refine your search'}
//                                 </p>
//                             </div>
//                         </div>
//                         <button onClick={() => onClose(false)}
//                             className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm">
//                             <X size={16} className="text-white" />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Scrollable body */}
//                 <div className="flex-1 overflow-y-scroll px-4 py-4 space-y-3 ">

//                     {/* Active filter chips */}
//                     {activeCount > 0 && (

//                         <div className="flex flex-wrap gap-1.5 mb-1">

//                             {/* {status !== 'All' && (
//                                 <span className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-accent-100 dark:bg-accent-500/15 text-accent-700 dark:text-accent-400 text-[11px] font-bold">
//                                     {status}
//                                     <button onClick={() => setCategory('All')} className="w-3.5 h-3.5 rounded-full bg-accent-200 dark:bg-accent-500/25 flex items-center justify-center hover:bg-accent-300">
//                                         <X size={8} />
//                                     </button>
//                                 </span>
//                             )}
//                             {priceCount > 0 && (
//                                 <span className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-accent-100 dark:bg-accent-500/15 text-accent-700 dark:text-accent-400 text-[11px] font-bold">
//                                     ₹{sliderValue[0].toLocaleString('en-IN')}–₹{sliderValue[1].toLocaleString('en-IN')}
//                                     <button onClick={() => handleSliderChange(null, [0, 100000])} className="w-3.5 h-3.5 rounded-full bg-accent-200 dark:bg-accent-500/25 flex items-center justify-center hover:bg-accent-300">
//                                         <X size={8} />
//                                     </button>
//                                 </span>
//                             )}
//                             {stockCount > 0 && (
//                                 <span className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-accent-100 dark:bg-accent-500/15 text-accent-700 dark:text-accent-400 text-[11px] font-bold">
//                                     {stockFilter}
//                                     <button onClick={() => setStockFilter('All')} className="w-3.5 h-3.5 rounded-full bg-accent-200 dark:bg-accent-500/25 flex items-center justify-center hover:bg-accent-300">
//                                         <X size={8} />
//                                     </button>
//                                 </span>
//                             )} */}
//                         </div>
//                     )}

//                     {/* Category */}
//                     <FilterSection title="Category" icon={Tag} count={categoryCount} isOpen={open.includes('category')} onToggle={() => toggle('category')}>
//                         <div className="flex flex-col gap-0.5">
//                             {/* {dynamicCategories.filter(c => c !== 'All').map((cat) => (
//                                 <FilterCheckbox key={cat} checked={category === cat}
//                                     onChange={() => setCategory(category === cat ? 'All' : cat)} label={cat} />
//                             ))} */}

//                             {['All', 'Active', 'Inactive', 'Blocked'].map(s => (
//                                 <FilterCheckbox key={s} checked={status === s}
//                                     onChange={() => setStatus(status === s ? 'All' : s)} label={s} />
//                             ))}

//                         </div>

//                     </FilterSection>

//                     {/* Price */}
//                     {/* <FilterSection title="Price Range" icon={IndianRupee} count={priceCount} isOpen={open.includes('price')} onToggle={() => toggle('price')}>
//                         <PriceRangeSlider value={sliderValue} onChange={handleSliderChange} />
//                     </FilterSection> */}

//                     {/* Availability */}
//                     {/* <FilterSection title="Availability" icon={PackageCheck} count={stockCount} isOpen={open.includes('stock')} onToggle={() => toggle('stock')}>
//                         <div className="flex flex-col gap-2">
//                             {STOCK_FILTERS.map(({ val, icon, desc }) => (
//                                 <FilterToggleRow key={val} emoji={icon} label={val} desc={desc}
//                                     checked={stockFilter === val}
//                                     onChange={() => setStockFilter(stockFilter === val ? 'All' : val)} />
//                             ))}
//                         </div>
//                     </FilterSection> */}

//                 </div>

//                 {/* Sticky footer actions */}
//                 <div className="shrink-0 border-t border-base-100 dark:border-base-800 p-4 flex gap-2.5 bg-white dark:bg-base-950">
//                     <button onClick={clearFilters} disabled={activeCount === 0}
//                         className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg border border-base-200 dark:border-base-700 text-base-500 dark:text-base-400 text-[13px] font-bold hover:bg-base-50 dark:hover:bg-base-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
//                         <RotateCcw size={13} /> Reset
//                     </button>
//                     <button onClick={() => onClose(false)}
//                         className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-accent-gradient text-white text-[13px] font-bold shadow-md shadow-accent hover:shadow-accent-lg hover:-translate-y-0.5 transition-all active:scale-95">
//                         Show Results
//                     </button>
//                 </div>


//             </div>
//         </>
//     );
// };

// export default FilterSidebar;





import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, X, Check, UserCheck, CalendarDays, RotateCcw, Calendar } from 'lucide-react';

const STATUS_FILTERS = [
    { val: 'Active', dot: 'bg-emerald-500', desc: 'Currently active customers' },
    { val: 'Inactive', dot: 'bg-slate-400', desc: 'No recent activity' },
    { val: 'Blocked', dot: 'bg-rose-500', desc: 'Restricted from the store' },
];

const JOINED_PRESETS = [
    { label: 'Last 7 days', val: '7d' },
    { label: 'Last 30 days', val: '30d' },
    { label: 'Last 3 months', val: '3m' },
    { label: 'This Year', val: 'year' },
];

/* ─── Collapsible section — identical to ProductFilterSidebar ─── */
const FilterSection = ({ title, icon: Icon, count, children, isOpen, onToggle }) => (
    // <div className="rounded-xl shadow-2xs border border-base-100 dark:border-base-800 overflow-hidden bg-white dark:bg-base-900/40">
    <div className={`rounded-xl shadow-2xs border ${isOpen ? "border-base-200 dark:border-base-800 " : " border-base-100 dark:border-base-800"} overflow-hidden bg-white dark:bg-base-900/40 `}>

        <button onClick={onToggle}
            className={`w-full flex items-center justify-between border-b px-4 py-3.5 transition-colors duration-200
                ${isOpen ? ' border-b-base-200 dark:border-b-base-800 bg-accent-50/60 dark:bg-accent-500/6' : 'border-b-transparent hover:bg-base-50 dark:hover:bg-base-800/40'}`}
        >
            <div className="flex items-center gap-2.5">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200
                    ${isOpen ? 'bg-accent-500 text-white' : 'bg-base-100 dark:bg-base-800 text-base-400'}`}>
                    <Icon size={13} />
                </span>
                <span className={`text-[13px] font-bold transition-colors ${isOpen ? 'text-accent-700 dark:text-accent-400' : 'text-base-700 dark:text-base-300'}`}>
                    {title}
                </span>
                {count > 0 && (
                    <span className="w-4.5 h-4.5 rounded-full bg-accent-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                        {count}
                    </span>
                )}
            </div>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                className={`text-base-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>

        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-72' : 'max-h-0'} `}>
            {/* <div className="overflow-hidden"> */}
            <div className="px-4 pb-4 pt-4">{children}</div>
            {/* </div> */}
        </div>
    </div>
);

/* ─── Status row — dot + label + radio-style selection ─── */
const StatusRow = ({ checked, onChange, label, dot, desc }) => (
    <button onClick={onChange}
        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all duration-200 text-left
            ${checked
                ? 'bg-accent-50 dark:bg-accent-500/8 border-accent-200 dark:border-accent-500/25'
                : 'bg-white dark:bg-base-900 border-base-100 dark:border-base-800 hover:border-base-200 dark:hover:border-base-700'}`}>
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
        <div className="flex-1 min-w-0">
            <p className={`text-[13px] font-bold ${checked ? 'text-accent-700 dark:text-accent-400' : 'text-base-700 dark:text-base-300'}`}>{label}</p>
            <p className="text-[10px] text-base-400 mt-0.5">{desc}</p>
        </div>
        {checked && (
            <span className="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center shrink-0">
                <Check size={11} className="text-white" strokeWidth={3} />
            </span>
        )}
    </button>
);

/* ─── Joined date preset pill ─── */
const DatePill = ({ active, label, onClick }) => (
    <button onClick={onClick}
        className={`px-3 py-2 rounded-xl text-[12px] font-bold transition-all text-left
            ${active
                ? 'bg-accent-500 text-white shadow-sm'
                : 'bg-base-50 dark:bg-base-800 text-base-500 dark:text-base-400 hover:bg-base-100 dark:hover:bg-base-700'}`}>
        {label}
    </button>
);

/* ═══════════════════════════════════════════════════
   MAIN SIDEBAR
═══════════════════════════════════════════════════ */
const FilterSidebar = ({
    show, onClose,
    status, setStatus,
    joinedFilter, setJoinedFilter,
    customFrom, setCustomFrom,
    customTo, setCustomTo,
    clearFilters, activeCount,
}) => {
    const [open, setOpen] = useState(['status', 'joined']);
    const toggle = (s) => setOpen(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

    // Lock body scroll while open
    useEffect(() => {
        document.body.style.overflow = show ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [show]);

    const statusCount = status !== 'All' ? 1 : 0;
    const joinedCount = joinedFilter !== 'all' ? 1 : 0;

    const isCustomActive = joinedFilter === 'custom';

    const handlePresetClick = (val) => {
        setJoinedFilter(val);
        setCustomFrom?.('');
        setCustomTo?.('');
    };

    const handleCustomChange = (which, value) => {
        setJoinedFilter('custom');
        if (which === 'from') setCustomFrom?.(value);
        else setCustomTo?.(value);
    };

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <>
            {/* Backdrop */}
            <div onClick={onClose}
                className={`fixed inset-0 bg-base-950/50 backdrop-blur-[3px] z-40 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

            {/* Panel */}
            <div className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-base-50 dark:bg-base-950 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out
                ${show ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Header — gradient hero */}
                <div className="relative shrink-0 bg-accent-gradient px-5 pt-5 pb-6 overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.07]"
                        style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '18px 18px' }} />
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                <SlidersHorizontal size={16} className="text-white" />
                            </span>
                            <div>
                                <p className="text-white font-extrabold text-[15px] leading-none">Filters</p>
                                <p className="text-white/70 text-[11px] mt-1">
                                    {activeCount > 0 ? `${activeCount} active filter${activeCount > 1 ? 's' : ''}` : 'Refine customer list'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose}
                            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm">
                            <X size={16} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-scroll px-4 py-4 space-y-3">

                    {/* Active filter chips */}
                    {activeCount > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {status !== 'All' && (
                                <span className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-accent-100 dark:bg-accent-500/15 text-accent-700 dark:text-accent-400 text-[11px] font-bold">
                                    {status}
                                    <button onClick={() => setStatus('All')} className="w-3.5 h-3.5 rounded-full bg-accent-200 dark:bg-accent-500/25 flex items-center justify-center hover:bg-accent-300">
                                        <X size={8} />
                                    </button>
                                </span>
                            )}
                            {joinedFilter !== 'all' && (
                                <span className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-accent-100 dark:bg-accent-500/15 text-accent-700 dark:text-accent-400 text-[11px] font-bold">
                                    {isCustomActive
                                        ? `${customFrom || '…'} → ${customTo || '…'}`
                                        : JOINED_PRESETS.find(p => p.val === joinedFilter)?.label}
                                    <button onClick={() => handlePresetClick('all')} className="w-3.5 h-3.5 rounded-full bg-accent-200 dark:bg-accent-500/25 flex items-center justify-center hover:bg-accent-300">
                                        <X size={8} />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Status */}
                    <FilterSection title="Account Status" icon={UserCheck} count={statusCount} isOpen={open.includes('status')} onToggle={() => toggle('status')}>
                        <div className="flex flex-col gap-2">
                            {STATUS_FILTERS.map(({ val, dot, desc }) => (
                                <StatusRow key={val} checked={status === val} dot={dot} label={val} desc={desc}
                                    onChange={() => setStatus(status === val ? 'All' : val)} />
                            ))}
                        </div>
                    </FilterSection>

                    {/* Joined date — presets + custom range */}
                    <FilterSection title="Joined Date" icon={CalendarDays} count={joinedCount} isOpen={open.includes('joined')} onToggle={() => toggle('joined')}>

                        <div className="flex flex-col gap-3">

                            {/* Preset pills */}
                            <div className="grid grid-cols-2 gap-1.5">
                                <button onClick={() => handlePresetClick('all')}
                                    className={`col-span-2 px-3 py-2 rounded-xl text-[12px] font-bold transition-all text-left
                                        ${joinedFilter === 'all'
                                            ? 'bg-accent-500 text-white shadow-sm'
                                            : 'bg-base-50 dark:bg-base-800 text-base-500 dark:text-base-400 hover:bg-base-100 dark:hover:bg-base-700'}`}>
                                    Any Time
                                </button>
                                {JOINED_PRESETS.map(({ label, val }) => (
                                    <DatePill key={val} label={label} active={joinedFilter === val} onClick={() => handlePresetClick(val)} />
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-2 my-0.5">
                                <div className="flex-1 h-px bg-base-100 dark:bg-base-800" />
                                <span className="text-[10px] font-bold text-base-300 dark:text-base-600 uppercase tracking-wider">or custom range</span>
                                <div className="flex-1 h-px bg-base-100 dark:bg-base-800" />
                            </div>

                            {/* Custom date range */}
                            <div className={`flex flex-col gap-2.5 p-3 rounded-xl border transition-colors duration-200
                                ${isCustomActive ? 'border-accent-200 dark:border-accent-500/25 bg-accent-50/40 dark:bg-accent-500/4' : 'border-base-100 dark:border-base-800'}`}>

                                <div className="flex items-center gap-2">
                                    <Calendar size={12} className={isCustomActive ? 'text-accent-500' : 'text-base-400'} />
                                    <span className={`text-[11px] font-bold ${isCustomActive ? 'text-accent-600 dark:text-accent-400' : 'text-base-500'}`}>
                                        Custom Date Range
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-base-400 uppercase tracking-wide">From</label>
                                        <input
                                            type="date"
                                            value={customFrom || ''}
                                            max={customTo || todayStr}
                                            onChange={(e) => handleCustomChange('from', e.target.value)}
                                            className="w-full px-2.5 py-2 rounded-lg border border-base-200 dark:border-base-700 bg-white dark:bg-base-900 text-[12px] text-base-800 dark:text-base-100 outline-none focus-accent transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-base-400 uppercase tracking-wide">To</label>
                                        <input
                                            type="date"
                                            value={customTo || ''}
                                            min={customFrom || ''}
                                            max={todayStr}
                                            onChange={(e) => handleCustomChange('to', e.target.value)}
                                            className="w-full px-2.5 py-2 rounded-lg border border-base-200 dark:border-base-700 bg-white dark:bg-base-900 text-[12px] text-base-800 dark:text-base-100 outline-none focus-accent transition-all"
                                        />
                                    </div>
                                </div>

                                {isCustomActive && customFrom && customTo && (
                                    <div className="flex items-center gap-1.5 text-[11px] text-accent-600 dark:text-accent-400 font-medium">
                                        <Check size={11} />
                                        Showing customers joined {customFrom} to {customTo}
                                    </div>
                                )}
                            </div>
                        </div>
                    </FilterSection>
                </div>

                {/* Sticky footer actions */}
                <div className="shrink-0 border-t border-base-100 dark:border-base-800 p-4 flex gap-2.5 bg-white dark:bg-base-950">
                    <button onClick={clearFilters} disabled={activeCount === 0}
                        className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-base-200 dark:border-base-700 text-base-500 dark:text-base-400 text-[13px] font-bold hover:bg-base-50 dark:hover:bg-base-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        <RotateCcw size={13} /> Reset
                    </button>
                    <button onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-gradient text-white text-[13px] font-bold shadow-md shadow-accent hover:shadow-accent-lg hover:-translate-y-0.5 transition-all active:scale-95">
                        Show Results
                    </button>
                </div>
            </div>
        </>
    );
};

export default FilterSidebar;

