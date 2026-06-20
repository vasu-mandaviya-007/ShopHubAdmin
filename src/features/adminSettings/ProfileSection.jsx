import React, { useState, useRef, useEffect } from "react";
import { getProfile, updateProfile } from "../../apis/adminApi";
import { showToast } from "../../components/showToast";
import SectionCard from "../../components/ui/SectionCard";
import { Edit3, RefreshCw, Upload, User, X, Save } from "lucide-react";



const ProfileSection = ({ labelCls, inputCls }) => {


    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', location: '' });
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [editing, setEditing] = useState(false);
    const fileRef = useRef(null);


    const fetchProfile = async () => {

        try {

            const data = await getProfile();

            if (data.success !== false && !data.error) {
                const user = data.admin || data;

                setProfile(user);
                setForm({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    location: user.location || '',
                });
                setPreview(user?.avatar || null);
            } else {
                showToast(data.error || 'Failed to load profile.', 'error');
            }

        } catch (err) {
            console.error("Fetch Profile Error:", err);

            // ── AXIOS ERROR HANDLING ──
            if (err.response && err.response.data && err.response.data.error) {
                const backendError = err.response.data.error;

                showToast(backendError, 'error');
            } else {
                showToast('Network error. Failed to load profile.', 'error');
            }
        }

    }

    useEffect(() => {

        fetchProfile();

    }, [])

    const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleAvatar = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setForm(f => ({ ...f, _avatarFile: file }));
    };


    const handleSave = async (e) => {

        e.preventDefault();

        if (!form.name?.trim()) { showToast('Name cannot be empty.', 'error'); return; }

        setSaving(true);

        console.log(form);


        try {
            // ── FIX: File upload ke liye FormData banaya ──
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('email', profile.email);
            formData.append('phone', form.phone);
            formData.append('bio', form.bio);

            // Agar naya image select kiya hai tabhi append karo
            if (form._avatarFile) {
                formData.append('avatar', form._avatarFile);
            }

            // ── FIX: Fetch ki jagah Axios (api) use kiya ──
            // Note: FormData bhejte waqt Axios automatically 'multipart/form-data' header set kar deta hai
            const data = await updateProfile(formData);

            if (data.success) {

                const updated = data.admin || data;

                setProfile(prev => ({ ...prev, ...form, avatar: updated.image }));

                setPreview(updated?.avatar)

                console.log(data)

                showToast('Profile updated successfully!');

                setEditing(false);

            } else {
                showToast(data.error || 'Update failed.', 'error');
            }
        } catch (err) {
            // Interceptor Demo Mode wagera yahan perfectly catch honge
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
        setForm({
            name: profile?.name || '',
            email: profile?.email || '',
            phone: profile?.phone || '',
            location: profile?.location || '',
        });
        setPreview(profile?.avatar || null);
        setEditing(false);
        // setPreview(null);
        // setAvatarFile(null);

        // setError('');
    };

    const initials = form.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AD';

    return (

        <SectionCard title="Profile" subtitle="Your public admin identity" icon={User}> 

            <div className="flex flex-col sm:flex-row gap-6 items-start mb-6 pb-6 border-b border-base-100 dark:border-base-800">

                {/* Avatar */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                    {
                        editing
                            ?
                            <div className="relative group">
                                <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-[rgba(14,165,233,0.3)] overflow-hidden">
                                    {preview
                                        ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                                        : initials}
                                </div>
                                <button onClick={() => fileRef.current?.click()}
                                    className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Upload size={18} className="text-white" />
                                </button>
                            </div>
                            :
                            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-[rgba(14,165,233,0.3)] overflow-hidden">
                                {preview
                                    ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                                    : initials}
                            </div>
                    }


                    {
                        editing && (
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
                        )
                    }

                    <button onClick={() => editing && fileRef.current?.click()}
                        className={`${editing ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} text-[11px] font-bold text-sky-500 hover:underline`}>
                        Change Photo
                    </button>


                </div>

                {/* Name + email hero */}
                <div className="flex-1">
                    <p className="font-extrabold text-base-900 dark:text-base-50 text-lg leading-tight">{profile?.name || 'Admin'}</p>
                    <p className="text-[13px] text-base-400 mt-0.5">{profile?.email}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Administrator</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-1">

                    {editing ? (
                        <>
                            <button
                                onClick={handleCancel}
                                disabled={saving}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                                <X size={14} /> Cancel
                            </button>

                            <button onClick={handleSave} disabled={saving}
                                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-linear-to-r from-sky-400 to-blue-500 text-white text-[13px] font-bold shadow-md shadow-sky-400/25 hover:shadow-lg hover:shadow-sky-400/35 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0">
                                {saving ? <><RefreshCw size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Profile</>}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => { setEditing(true); }}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-sky-300 dark:hover:border-sky-600 transition-all"
                        >
                            <Edit3 size={14} /> Edit Profile
                        </button>
                    )}
                </div>

            </div>



            <div className="flex flex-col gap-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Full Name</label>
                        <input disabled={!editing} className={`${inputCls} focus:border-sky-400 focus:ring-sky-400/10 `} name="name" value={form.name} onChange={handle} placeholder="Your name" />
                    </div>
                    <div>
                        <label className={labelCls}>Phone Number</label>
                        <input disabled={!editing} className={`${inputCls} focus:border-sky-400 focus:ring-sky-400/10 `} name="phone" type="tel" value={form.phone || ''} onChange={handle} placeholder="+91 98765 43210" />
                    </div>
                </div>
                <div>
                    <label className={labelCls}>Email Address</label>
                    <input className={`${inputCls} focus:border-sky-400 focus:ring-sky-400/10 `}
                        value={form.email || ''} disabled />
                    <p className="text-[11px] text-base-400 mt-1">Email cannot be changed here.</p>
                </div>
                <div>
                    <label className={labelCls}>Bio</label>
                    <textarea disabled={!editing} className={`${inputCls} focus:border-sky-400 focus:ring-sky-400/10 resize-none h-20`} name="bio" value={form.bio || ''} onChange={handle}
                        placeholder="Short description about you…" />
                </div>

            </div>

        </SectionCard>
    );
};


export default ProfileSection;