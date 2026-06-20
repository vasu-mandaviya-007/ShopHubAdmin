import React from "react";
import ModalShell from "../../../components/ui/ModalShell";
import ModalClose from "../../../components/ui/ModalClose";
import CustomerBadge from "./CustomerBadge";
import { Button } from "@mui/material";



const ViewModal = ({ fmtDate, fmt, customer, onClose }) => {

    if (!customer) return null;

    const initials = customer.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

    return (

        <ModalShell onClose={onClose} maxW="max-w-lg">

            {/* Hero */}
            <div className="relative flex items-center justify-start px-6 py-8 bg-linear-to-br from-base-900 to-base-700 overflow-hidden">

                <div className="absolute inset-0 opacity-[0.06]"
                    style={{ backgroundImage: 'radial-linear(circle,#fff 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
                <div className="absolute -bottom-5 -right-5 w-36 h-36 rounded-full bg-sky-400/10 blur-2xl" />

                <div className="absolute top-4 right-4">
                    <ModalClose onClose={onClose} />
                </div>

                <div className="flex items-end w-full gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-accent-gradient flex items-center justify-center text-white text-xl font-black shadow-lg shadow-accent shrink-0 border-4 border-white dark:border-base-900">
                        {initials}
                    </div>
                    <div className="mb-1 min-w-0">
                        <p className="font-extrabold text-base-100 dark:text-base-50 text-lg leading-tight truncate">{customer.name}</p>
                        <p className="text-[12px] text-base-400 font-mono">{customer.sku || `CUST-${customer.id?.toString().slice(-4).padStart(4, '0')}`}</p>
                    </div>
                    <div className="ml-auto mb-1 shrink-0">
                        <CustomerBadge status={customer.status} />
                    </div>
                </div>
            </div>

            {/* Avatar overlapping hero */}
            <div className="relative px-6 py-6 ">

                {/* Info rows */}
                <div className="rounded-xl border border-base-100 dark:border-base-800 overflow-hidden mb-4">
                    {[
                        { icon: 'fa-envelope', label: 'Email', val: customer.email || '—' },
                        { icon: 'fa-phone', label: 'Phone', val: customer.phone || '—' },
                        { icon: 'fa-location-dot', label: 'Location', val: customer.location || '—' },
                        { icon: 'fa-calendar', label: 'Joined', val: fmtDate(customer.joinedAt || customer.date) },
                    ].map(({ icon, label, val }, i, arr) => (
                        <div key={label} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-base-100 dark:border-base-800' : ''}`}>
                            <span className="w-7 h-7 rounded-lg bg-base-50 dark:bg-base-800 flex items-center justify-center shrink-0">
                                <i className={`fa-solid ${icon} text-base-400 text-[11px]`} />
                            </span>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-base-400 w-20 shrink-0">{label}</span>
                            <span className="text-[13px] font-semibold text-base-800 dark:text-base-100 truncate">{val}</span>
                        </div>
                    ))}
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2.5">
                    {[
                        { label: 'Total Orders', val: customer.totalOrders || 0, icon: 'fa-bag-shopping' },
                        { label: 'Total Spent', val: `₹${fmt(customer.totalSpent)}`, icon: 'fa-indian-rupee-sign' },
                        { label: 'Avg. Order', val: `₹${fmt(customer.avgOrder)}`, icon: 'fa-chart-line' },
                    ].map(({ label, val, icon }) => (
                        <div key={label} className="rounded-2xl bg-base-50 dark:bg-base-800 border border-base-100 dark:border-base-700 px-3 py-3 text-center">
                            <i className={`fa-solid ${icon} text-base-300 text-sm mb-1.5 block`} />
                            <p className="text-[13px] font-extrabold text-base-900 dark:text-base-50">{val}</p>
                            <p className="text-[10px] text-base-400 font-medium mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>

                {/* <button onClick={onClose}
                    className="w-full mt-4 py-3 rounded-2xl bg-base-900 dark:bg-base-700 text-white text-[13px] font-bold hover:bg-base-700 dark:hover:bg-base-600 transition-colors">
                    Close
                </button> */}

                <Button variant="dark" onClick={onClose} fullWidth sx={{ mt: 2 , py : 1.2 }} >
                    Close
                </Button>

            </div>

        </ModalShell>
    );
};

export default ViewModal;