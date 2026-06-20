import React, { useEffect, useState } from "react";
import { getNotificationSettings, updateNotificationSettings } from "../../apis/adminApi";
import SectionCard from "../../components/ui/SectionCard";
import { Bell, RefreshCw, Save } from "lucide-react";
import { showToast } from "../../components/showToast";


const NotificationsSection = ({ labelCls, inputCls }) => {

    const [prefs, setPrefs] = useState({
        newOrder: true,
        refundRequest: true,
        lowStock: true,
        outOfStock: true,
        newCustomer: false,
        newReview: true,
        systemUpdates: true,
    });

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // ── GET SETTINGS FROM DB ──
    useEffect(() => {

        const fetchNotifications = async () => {

            try {
                // const res = await api.get('/admin/notification-settings');
                const data = await getNotificationSettings();

                if (data.success && data.notifications) {
                    setPrefs(data.notifications);
                }

            } catch (err) {

                console.error("Fetch Notifications Error:", err);
                showToast('Failed to load notification preferences.', 'error');

            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

    const GROUPS = [
        {
            label: 'Order Alerts',
            items: [
                { key: 'newOrder', label: 'New Order Placed', desc: 'Get instantly notified when a customer places an order.' },
                { key: 'refundRequest', label: 'Refund/Return Requests', desc: 'Alert when a customer requests a refund or return.' },
            ],
        },
        {
            label: 'Inventory Management',
            items: [
                { key: 'lowStock', label: 'Low Stock Warning', desc: 'Alert when a product stock drops below 10 units.' },
                { key: 'outOfStock', label: 'Out of Stock Alert', desc: 'Immediate notification when an item sells out completely.' },
            ],
        },
        {
            label: 'Customer Engagement',
            items: [
                { key: 'newCustomer', label: 'New Sign-ups', desc: 'Notify when a new user registers on the store.' },
                { key: 'newReview', label: 'Product Reviews', desc: 'Get alerted when a customer leaves a rating or review.' },
            ],
        },
        {
            label: 'System & Security',
            items: [
                { key: 'systemUpdates', label: 'Platform Updates', desc: 'Receive important alerts regarding platform maintenance.' },
            ],
        },
    ];

    const handleSave = async () => {

        setSaving(true);

        try {
            // const res = await api.put('/admin/notification-settings', prefs);

            const data = await updateNotificationSettings(prefs);

            if (data.success) {
                showToast('Notification preferences saved successfully!');
            } else {
                showToast(data.error || 'Save failed.', 'error');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                showToast(err.response.data.error, 'error');
            } else {
                showToast('Network error while saving.', 'error');
            }
        } finally {
            setSaving(false);
        }
    };

    // Toggle Component (Color updated to match Amber accent)
    const Toggle = ({ on, onToggle }) => (
        <button type="button" onClick={onToggle}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none
                ${on ? 'bg-linear-to-r from-amber-400 to-orange-500 shadow-md shadow-amber-500/30' : 'bg-base-200 dark:bg-base-700'}`}>
            <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    );

    if (loading) {
        return (
            <SectionCard title="Notifications" subtitle="Choose what you want to be notified about" icon={Bell} accent="from-amber-400 to-orange-500">
                <div className="flex justify-center py-10">
                    <RefreshCw size={24} className="animate-spin text-amber-500" />
                </div>
            </SectionCard>
        );
    }

    return (
        <SectionCard title="Notifications" subtitle="Choose what you want to be notified about"
            icon={Bell} accent="from-amber-400 to-orange-500">
            <div className="flex flex-col gap-6">
                {GROUPS.map(({ label, items }) => (
                    <div key={label}>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-base-400 mb-3">{label}</p>
                        <div className="flex flex-col gap-2">
                            {items.map(({ key, label: iLabel, desc }) => (
                                <div key={key} className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-base-50 dark:bg-base-800 border border-base-100 dark:border-base-700">
                                    <div>
                                        <p className="text-[13px] font-semibold text-base-800 dark:text-base-100">{iLabel}</p>
                                        <p className="text-[11px] text-base-400 mt-0.5 max-w-62.5 sm:max-w-none">{desc}</p>
                                    </div>
                                    <Toggle on={prefs[key]} onToggle={() => toggle(key)} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="flex justify-end pt-4 border-t border-base-100 dark:border-base-800">
                    <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-linear-to-r from-amber-400 to-orange-500 text-white text-[13px] font-bold shadow-md shadow-amber-400/25 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0">
                        {saving ? <><RefreshCw size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Preferences</>}
                    </button>
                </div>
            </div>
        </SectionCard>
    );
};


export default NotificationsSection;