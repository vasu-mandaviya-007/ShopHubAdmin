import React, { useEffect, useState } from "react";
import { getStoreSettings, updateStoreSettings } from "../../apis/adminApi";
import SectionCard from "../../components/ui/SectionCard";
import { Edit3, Globe, RefreshCw, Save, X } from "lucide-react";
import { showToast } from "../../components/showToast";


const StoreSection = ({ labelCls, inputCls }) => {

    const [originalData, setOriginalData] = useState(null);

    const [form, setForm] = useState({
        storeName: '',
        storeEmail: '', 
        storePhone: '',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        taxRate: '18',
        minOrderAmt: '0',
        freeShipAmt: '999',
    });

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    // ── NAYA CODE: Database se current settings fetch karna ──
    useEffect(() => {

        const fetchStoreSettings = async () => {

            try {
                // const res = await api.get('/admin/store-settings');

                const data = await getStoreSettings();

                if (data.success && data.store) {
                    setForm(prev => ({ ...prev, ...data.store }));
                    setOriginalData(data.store);
                }

            } catch (err) {

                console.error("Fetch Store Settings Error:", err);
                showToast('Failed to load store settings.', 'error');

            } finally {
                setLoading(false);
            }
        };

        fetchStoreSettings();

    }, []);

    const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);

        try {
            // ── FIX: Axios API use kiya taaki interceptor kaam kare ──
            // const res = await api.put('/admin/store-settings', form);

            const data = await updateStoreSettings(form);

            if (data.success) {
                setOriginalData(form);
                showToast('Store settings saved successfully!');
                setEditing(false);
            } else {
                showToast(data.error || 'Save failed.', 'error');
            }
        } catch (err) {
            // Axios error handling
            if (err.response && err.response.data && err.response.data.error) {
                showToast(err.response.data.error, 'error');
            } else {
                showToast('Network error.', 'error');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        // Form ko wapas old data par reset kar do
        if (originalData) {
            setForm(prev => ({ ...prev, ...originalData }));
        }
        setEditing(false);
    };

    // Agar data load ho raha hai toh ek chhota sa skeleton ya loader dikha sakte ho
    if (loading) {
        return (
            <SectionCard title="Store Settings" subtitle="Configure your store details and rules" icon={Globe} accent="from-emerald-400 to-teal-500">
                <div className="flex justify-center py-10">
                    <RefreshCw size={24} className="animate-spin text-emerald-500" />
                </div>
            </SectionCard>
        );
    }

    return (
        <SectionCard
            title="Store Settings"
            subtitle="Configure your store details and rules"
            icon={Globe} accent="from-emerald-400 to-teal-500"
            action={
                editing
                    ?
                    <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-bold border border-base-200 dark:border-base-700 text-base-600 dark:text-base-300 bg-white dark:bg-base-800 hover:bg-base-50 dark:hover:bg-base-700 transition-colors disabled:opacity-50"
                    >
                        <X size={14} /> Cancel
                    </button>
                    :
                    <button
                        onClick={() => { setEditing(true); }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-bold border border-base-200 dark:border-base-700 text-base-700 dark:text-base-200 bg-white dark:bg-base-800 hover:bg-base-50 dark:hover:bg-base-700 hover:border-base-300 dark:hover:border-base-500 transition-all"
                    >
                        <Edit3 size={14} /> Edit Profile
                    </button>
            }
        >

            <form onSubmit={handleSubmit} className="flex flex-col gap-5"> 

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Store Name</label>
                        <input disabled={!editing} className={`${inputCls} focus:border-emerald-400 focus:ring-emerald-400/20`} name="storeName" value={form.storeName} onChange={handle} placeholder="Your store name" required />
                    </div>
                    <div>
                        <label className={labelCls}>Support Email</label>
                        <input disabled={!editing} className={`${inputCls} focus:border-emerald-400 focus:ring-emerald-400/20`} name="storeEmail" type="email" value={form.storeEmail} onChange={handle} placeholder="support@store.com" required />
                    </div>
                    <div>
                        <label className={labelCls}>Support Phone</label>
                        <input disabled={!editing} className={`${inputCls} focus:border-emerald-400 focus:ring-emerald-400/20`} name="storePhone" type="tel" value={form.storePhone} onChange={handle} placeholder="+91 00000 00000" />
                    </div>
                    <div>
                        <label className={labelCls}>Currency</label>
                        <select disabled={!editing} className={`${inputCls} focus:border-emerald-400 focus:ring-emerald-400/20`} name="currency" value={form.currency} onChange={handle}>
                            <option value="INR">₹ Indian Rupee (INR)</option>
                            <option value="USD">$ US Dollar (USD)</option>
                            <option value="EUR">€ Euro (EUR)</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Timezone</label>
                        <select disabled={!editing} className={`${inputCls} focus:border-emerald-400 focus:ring-emerald-400/20`} name="timezone" value={form.timezone} onChange={handle}>
                            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">America/New_York (EST)</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>GST / Tax Rate (%)</label>
                        <input disabled={!editing} className={`${inputCls} focus:border-emerald-400 focus:ring-emerald-400/20`} name="taxRate" type="number" min={0} max={100} value={form.taxRate} onChange={handle} placeholder="18" />
                    </div>
                    <div>
                        <label className={labelCls}>Minimum Order Amount (₹)</label>
                        <input disabled={!editing} className={`${inputCls} focus:border-emerald-400 focus:ring-emerald-400/20`} name="minOrderAmt" type="number" min={0} value={form.minOrderAmt} onChange={handle} placeholder="0" />
                    </div>
                    <div>
                        <label className={labelCls}>Free Shipping Above (₹)</label>
                        <input disabled={!editing} className={`${inputCls} focus:border-emerald-400 focus:ring-emerald-400/20`} name="freeShipAmt" type="number" min={0} value={form.freeShipAmt} onChange={handle} placeholder="999" />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={saving || !editing}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-linear-to-r from-emerald-400 to-teal-500 text-white text-[13px] font-bold shadow-md shadow-emerald-400/25 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:cursor-not-allowed! disabled:opacity-60 disabled:translate-y-0">
                        {saving ? <><RefreshCw size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Settings</>}
                    </button>
                </div>

            </form>

        </SectionCard>

    );

};

export default StoreSection;