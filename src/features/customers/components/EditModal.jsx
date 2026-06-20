import React, { useState } from "react";
import { showToast } from "../../../components/showToast";
import ModalShell from "../../../components/ui/ModalShell";
import { CheckCircle2, Edit2, Loader2, Save } from "lucide-react";
import ModalClose from "../../../components/ui/ModalClose";
import { Button } from "@mui/material";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { IoSaveSharp } from "react-icons/io5";
import { updateCustomer } from "../api/customerApi";


const EditModal = ({ customer, onClose, onSave, inputCls, labelCls }) => {

    const [form, setForm] = useState({ ...customer });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handle = (e) => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(''); };

    const handleCloseModel = () => {

        if (saving) return;
        onClose()

    }


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.name?.trim()) { setError('Name is required.'); return; }

        if (!form.email?.trim()) { setError('Email is required.'); return; }

        setSaving(true);

        setError(''); // Puraana error clear karne ke liye

        try {

            const data = await updateCustomer(customer.id, {
                name: form.name,
                email: form.email,
                phone: form.phone,
                status: form.status
            });

            if (data.success !== false && !data.error) {
                onSave({ ...customer, ...form });
                showToast('Customer updated successfully!', 'success');
                onClose();
            } else {
                setError(data.error || 'Update failed.');
                showToast(data.error || 'Update failed.', 'error');
            }

        } catch (err) {

            console.error("Update Customer Error:", err);

            // ── AXIOS ERROR HANDLING FOR DEMO MODE ──
            if (err.response && err.response.data && err.response.data.error) {
                const backendError = err.response.data.error;
                setError(backendError);

                // Lock wala UI show karega demo mode active hone par
                showToast(backendError, 'error');
            } else {
                setError('Network error. Please try again.');
                showToast('Network error. Please try again.', 'error');
            }
        } finally {

            setSaving(false);

        }

    };


    if (!customer) return null;

    return (

        <ModalShell onClose={handleCloseModel}>

            <div className="h-1 bg-linear-to-r from-accent-400 to-accent-500" />

            <div className="flex items-center justify-between px-6 py-5 border-b border-base-100 dark:border-base-800">

                <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-accent-400 to-accent-500 flex items-center justify-center shadow-md shadow-accent">
                        <Edit2 size={15} className="text-white" />
                    </div>

                    <div>
                        <p className="font-extrabold text-base-900 dark:text-base-50 text-[15px] leading-none">Edit Customer</p>
                        <p className="text-[11px] text-base-400 mt-0.5 truncate max-w-50">{customer.email}</p>
                    </div>

                </div>

                <ModalClose onClose={handleCloseModel} disabled={saving} />

            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

                {error && (
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-[13px] font-medium">
                        <i className="fa-solid fa-triangle-exclamation text-[12px] shrink-0" /> {error}
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Full Name</label>
                    <input disabled={saving} className={inputCls} name="name" type="text" value={form.name ?? ''} onChange={handle} placeholder="Customer full name" autoFocus />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Email Address</label>
                    <input disabled={saving} className={inputCls} name="email" type="email" value={form.email ?? ''} onChange={handle} placeholder="email@example.com" />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Phone Number</label>
                    <input disabled={saving} className={inputCls} name="phone" type="tel" value={form.phone ?? ''} onChange={handle} placeholder="+91 98765 43210" />
                </div>

                {/* Status selector */}
                <div className="flex flex-col gap-1.5">

                    <label className={labelCls}>Account Status</label>

                    <div className="grid grid-cols-3 gap-2">
                        {['Active', 'Inactive', 'Blocked'].map(s => (
                            <button key={s} type="button"
                                disabled={saving}
                                onClick={() => setForm(f => ({ ...f, status: s }))}
                                className={`py-2.5 rounded-xl disabled:pointer-events-none! text-[12px] font-bold border transition-all duration-200
                                    ${form.status === s
                                        ? s === 'Active' ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/25'
                                            : s === 'Blocked' ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25'
                                                : 'bg-base-800 text-white border-base-800'
                                        : 'bg-white dark:bg-base-800 text-base-500 border-base-200 dark:border-base-700 hover:border-base-400'
                                    }`}>
                                {s}
                            </button>
                        ))}
                    </div>

                </div>

                <div className="flex gap-3 pt-1">

                    {/* <button type="button" onClick={onClose}
                        className="flex-1 py-3 rounded-2xl border border-base-200 dark:border-base-700 text-[13px] font-bold text-base-500 dark:text-base-400 hover:bg-base-50 dark:hover:bg-base-800 transition-all">
                        Cancel
                    </button>

                    <button type="submit" disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-linear-to-r from-accent-400 to-accent-500 text-white text-[13px] font-bold shadow-md shadow-sky-400/25 hover:shadow-lg hover:shadow-sky-400/35 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0">
                        {saving
                            ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                            : <><i className="fa-solid fa-floppy-disk text-[11px]" /> Save Changes</>}
                    </button> */}

                    <Button
                        variant="dark"
                        fullWidth
                        sx={{ py: 1.1 }}
                        disabled={saving}
                        onClick={handleCloseModel}
                    >
                        Cancel
                    </Button>

                    <PrimaryButton
                        type="submit"
                        fullWidth
                        disabled={saving}
                        startIcon={<IoSaveSharp size={14} />}
                        loading={saving}
                        loadingPosition='start'
                        loadingIndicator={<Loader2 size={14} className="animate-spin" />}
                        sx={{ py: 1.1 }}
                    >
                        {saving
                            ? "Saving…"
                            : "Save Changes"
                        }
                    </PrimaryButton>

                </div>

            </form>

        </ModalShell>

    );

};


export default EditModal;