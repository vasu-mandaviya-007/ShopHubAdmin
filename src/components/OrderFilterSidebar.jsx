import React, { useState } from 'react';
import { Checkbox, Slider, Button, IconButton } from '@mui/material';
import { IoCloseSharp } from 'react-icons/io5';
import { FaFilterCircleXmark } from "react-icons/fa6";
import { SlidersHorizontal } from 'lucide-react';
import FilterSelect from './FilterSelect'; // Tumhara reusable component

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Paid', 'Unpaid', 'Refunded'];

const OrderFilterSidebar = ({
    showFilters, setShowFilters,
    statusFilter, setStatusFilter,
    paymentFilter, setPaymentFilter,
    amountRange, handleAmountChange,
    clearFilters
}) => {
    const [openFilterDropDown, setopenFilterDropDown] = useState(["status", "amount", "payment"]);

    const handleFilterToggle = (section) => {
        setopenFilterDropDown(prev => prev.includes(section) ? prev.filter(e => e !== section) : [...prev, section]);
    };

    return (
        <>
            <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowFilters(false)} />

            <div className={`filter-bar fixed top-0 right-0 w-full sm:w-80 h-full overflow-y-scroll bg-white dark:bg-[#1a1a1a] shadow-2xl dark:shadow-gray-900 z-50 transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : 'translate-x-[105%]'}`}>

                {/* Header */}
                <h1 className='sticky flex items-center justify-between top-0 z-10 text-xl px-4 text-white py-3 font-bold bg-base-800 shadow-md'>
                    <span className="flex items-center gap-2"><SlidersHorizontal size={20} /> Order Filters</span>
                    <IconButton onClick={() => setShowFilters(false)} className='text-white! rounded-full! bg-white/15! hover:bg-white/20!'>
                        <IoCloseSharp size={20} />
                    </IconButton>
                </h1>

                <div className="flex justify-end p-2 border-b border-gray-100 dark:border-gray-800">
                    <Button size='small' onClick={clearFilters} className='text-xs! py-1.5! px-3! bg-red-500! hover:bg-red-600! text-white!' variant='contained' startIcon={<FaFilterCircleXmark className='text-sm' />}>
                        Clear All
                    </Button>
                </div>

                <div className="flex flex-col gap-2 p-4">
                    {/* 1. ORDER STATUS */}
                    <FilterSelect title="Order Status" isOpen={openFilterDropDown.includes("status")} onToggle={() => handleFilterToggle("status")}>
                        <ul className='space-y-1 text-gray-600 dark:text-gray-400 px-4 pb-4 pt-2'>
                            {ORDER_STATUSES.map((status, index) => (
                                <li key={index} className='flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg pr-2 transition-colors'>
                                    <Checkbox checked={statusFilter.includes(status)} onChange={() => setStatusFilter(status)} size="small" sx={{ '&.Mui-checked': { color: '#0ea5e9' }, color: 'gray' }} />
                                    <label className='cursor-pointer text-[14px] flex-1 py-1' onClick={() => setStatusFilter(status)}>{status}</label>
                                </li>
                            ))}
                        </ul>
                    </FilterSelect>

                    {/* 2. PAYMENT STATUS */}
                    <FilterSelect title="Payment Status" isOpen={openFilterDropDown.includes("payment")} onToggle={() => handleFilterToggle("payment")}>
                        <ul className='space-y-1 text-gray-600 dark:text-gray-400 px-4 pb-4 pt-2'>
                            {PAYMENT_STATUSES.map((status, index) => (
                                <li key={index} className='flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-lg pr-2 transition-colors'>
                                    <Checkbox checked={paymentFilter === status} onChange={() => setPaymentFilter(paymentFilter === status ? 'All' : status)} size="small" sx={{ '&.Mui-checked': { color: '#0ea5e9' }, color: 'gray' }} />
                                    <label className='cursor-pointer text-[14px] flex-1 py-1' onClick={() => setPaymentFilter(paymentFilter === status ? 'All' : status)}>{status}</label>
                                </li>
                            ))}
                        </ul>
                    </FilterSelect>

                    {/* 3. AMOUNT RANGE */}
                    <FilterSelect title="Amount Range" isOpen={openFilterDropDown.includes("amount")} onToggle={() => handleFilterToggle("amount")}>
                        <div className='py-6 px-6'>
                            <Slider value={amountRange} onChange={handleAmountChange} disableSwap step={100} min={0} max={50000} sx={{ color: '#0ea5e9', '& .MuiSlider-thumb': { backgroundColor: '#fff', border: '2px solid currentColor' } }} />
                            <div className='text-[13px] font-bold flex justify-between items-center py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 mt-4 rounded-lg'>
                                <span>₹ {amountRange[0]}</span><span className="text-gray-400">to</span><span>₹ {amountRange[1]}</span>
                            </div>
                        </div>
                    </FilterSelect>
                </div>
            </div>
        </>
    );
};

export default OrderFilterSidebar;