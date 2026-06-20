import React, { useState } from "react";
import ModalShell from "../../../components/ui/ModalShell";
import { Loader2, Trash2 } from "lucide-react";
import { showToast } from "../../../components/showToast";
import { deleteCustomer } from "../api/customerApi";



const DeleteModal = ({ customer, onClose, onDelete }) => {

    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const initials = customer?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

    // const handleDelete = async () => {
    //     setDeleting(true);
    //     try {
    //         // const res = await fetch(`${API}/account/admin/delete/${customer.id}`, { method: 'DELETE', headers: authHeaders() });
    //         // const data = await res.json();

    //         const data = await deleteCustomer(customer.id);

    //         if (data.success !== false && !data.error) { onDelete(customer.id); onClose(); }
    //         else setError(data.error || 'Delete failed.');
    //     } catch { setError('Network error. Please try again.'); }
    //     setDeleting(false);
    // };


    const handleDelete = async () => {

        setDeleting(true);

        setError(''); // Purana error clear karne ke liye

        try {

            const data = await deleteCustomer(customer.id);

            if (data.success !== false && !data.error) {
                onDelete(customer.id);
                showToast('Customer deleted successfully!', 'success');
                onClose();
            } else {
                setError(data.error || 'Delete failed.');
                showToast(data.error || 'Delete failed.', 'error');
            }

        } catch (err) {

            console.error("Delete Customer Error:", err);

            // ── AXIOS ERROR HANDLING FOR DEMO MODE ──
            if (err.response && err.response.data && err.response.data.error) {
                const backendError = err.response.data.error;
                setError(backendError);

                // Demo mode pe custom lock wala toast pop-up hoga
                showToast(backendError, 'error');
            } else {
                setError('Network error. Please try again.');
                showToast('Network error. Please try again.', 'error');
            }

        } finally {
            setDeleting(false);
        }

    };


    if (!customer) return null;

    return (

        <ModalShell onClose={onClose} maxW="max-w-sm">

            <div className="h-1.5 bg-linear-to-r from-rose-500 to-orange-400" />

            <div className="p-6 flex flex-col items-center text-center gap-5">
                {/* Icon with avatar overlay */}
                <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                        <Trash2 size={28} className="text-rose-500" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-accent-gradient border-2 border-white dark:border-base-900 shadow-md flex items-center justify-center text-white text-[11px] font-black">
                        {initials}
                    </div>
                </div>

                <div>
                    <h3 className="font-extrabold text-base-900 dark:text-base-50 text-lg mb-1.5">Delete Customer?</h3>
                    <p className="text-[13px] text-base-500 dark:text-base-400 leading-relaxed">
                        You're about to permanently delete{' '}
                        <span className="font-bold text-base-800 dark:text-base-200">"{customer.name}"</span> and all their data.
                        This action <span className="text-rose-500 font-bold">cannot be undone</span>.
                    </p>
                </div>

                {error && (
                    <div className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-[13px] font-medium">
                        <i className="fa-solid fa-triangle-exclamation text-[12px] shrink-0" /> {error}
                    </div>
                )}

                <div className="flex gap-3 w-full">

                    <button onClick={onClose}
                        className="flex-1 py-3 rounded-2xl border border-base-200 dark:border-base-700 text-[13px] font-bold text-base-500 dark:text-base-400 hover:bg-base-50 dark:hover:bg-base-800 transition-all">
                        Keep Account
                    </button>

                    <button onClick={handleDelete} disabled={deleting}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-linear-to-r from-rose-500 to-orange-500 text-white text-[13px] font-bold shadow-md shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/35 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0">
                        {deleting
                            ? <><Loader2 size={14} className="animate-spin" /> Deleting…</>
                            : <><Trash2 size={14} /> Yes, Delete</>}
                    </button>

                </div>

            </div>

        </ModalShell>

    );

};

export default DeleteModal;