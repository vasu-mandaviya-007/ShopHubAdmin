// import React, { useState, useEffect } from 'react';
// import { User, Mail, Shield, LogOut, Save, Loader2 } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// import api from '../apis/axiosClient';
// import { showToast } from '../components/showToast';

// const AdminProfile = () => {
//     const navigate = useNavigate();
//     const [admin, setAdmin] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);

//     // Form states
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');

//     useEffect(() => {
//         fetchAdminDetails();
//     }, []);

//     const fetchAdminDetails = async () => {
//         try {
//             const res = await api.get('/admin/auth/me');
//             if (res.data.success) {
//                 setAdmin(res.data.admin);
//                 setName(res.data.admin.name);
//                 setEmail(res.data.admin.email);
//             }
//         } catch (err) {
//             showToast('Failed to fetch profile', 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleUpdateProfile = async (e) => {
//         e.preventDefault();
//         setSaving(true);
//         try {
//             // Tumhare backend me update admin ka route hona chahiye, 
//             // agar nahi hai toh ye demo mode me test ho hi jayega.
//             const res = await api.put('/admin/auth/update', { name, email }); 
//             if (res.data.success) {
//                 showToast('Profile updated successfully!', 'success');
//             }
//         } catch (err) {
//             if (err.response && err.response.data && err.response.data.error) {
//                 showToast(err.response.data.error, 'error'); // Bouncy Demo Mode Toast 🔒
//             } else {
//                 showToast('Network error.', 'error');
//             }
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleLogout = () => {
//         // Token delete karo aur login page par phek do
//         localStorage.removeItem('admin-token');
//         showToast('Logged out successfully', 'success');
//         navigate('/admin/login');
//     };

//     if (loading) {
//         return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-accent-500" size={32} /></div>;
//     }

//     return (
//         <div className="max-w-3xl mx-auto p-6">
//             <div className="flex items-center justify-between mb-8">
//                 <div>
//                     <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Profile</h1>
//                     <p className="text-sm text-slate-500 mt-1">Manage your account settings and preferences</p>
//                 </div>
//                 <button
//                     onClick={handleLogout}
//                     className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-semibold transition-colors dark:bg-rose-500/10 dark:hover:bg-rose-500/20"
//                 >
//                     <LogOut size={18} />
//                     Logout
//                 </button>
//             </div>

//             <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
//                 <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex items-center gap-6">
//                     <div className="w-24 h-24 bg-accent-gradient rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-sky-500/30">
//                         {admin?.name?.charAt(0).toUpperCase() || 'A'}
//                     </div>
//                     <div>
//                         <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
//                             {admin?.name}
//                             {admin?.role === 'admin' && (
//                                 <span className="bg-accent-100 text-accent-600 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider font-bold">
//                                     <Shield size={10} /> Admin
//                                 </span>
//                             )}
//                         </h2>
//                         <p className="text-slate-500 flex items-center gap-1.5 mt-1 text-sm">
//                             <Mail size={14} /> {admin?.email}
//                         </p>
//                     </div>
//                 </div>

//                 <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
//                             <div className="relative">
//                                 <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                                 <input
//                                     type="text"
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 text-slate-900 dark:text-white"
//                                 />
//                             </div>
//                         </div>
//                         <div>
//                             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
//                             <div className="relative">
//                                 <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                                 <input
//                                     type="email"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 text-slate-900 dark:text-white"
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex justify-end pt-4">
//                         <button
//                             type="submit"
//                             disabled={saving}
//                             className="flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-all disabled:opacity-70"
//                         >
//                             {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
//                             Save Changes
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AdminProfile;



import React, { useState, useEffect, useRef } from 'react';
import {
    User, Mail, Phone, MapPin, Shield,
    Camera, Check, Loader2, AlertCircle,
    Edit3, Save, X, BadgeCheck,
    LogOut,
} from 'lucide-react';
import { IoSaveSharp, IoWarning } from 'react-icons/io5';
import api from '../apis/axiosClient';
import { getProfile, updateProfile } from '../apis/adminApi';
import { showToast } from '../components/showToast';
import PrimaryButton from '../components/ui/PrimaryButton';
import { Button } from '@mui/material';


/* ── helpers ── */
const API_BASE = 'http://localhost:3001';

const inputCls = `
    w-full px-3.5 py-2.5 rounded-lg
    border border-base-200 dark:border-base-700
    bg-white dark:bg-base-800
    text-[13px] text-base-900 dark:text-base-50
    outline-none
    focus:border-accent-400 focus:ring-2 focus:ring-accent-400/10
    disabled:bg-base-50 dark:disabled:bg-base-800/60
    disabled:text-base-400 dark:disabled:text-base-500
    disabled:cursor-not-allowed
    transition-all placeholder-base-300 dark:placeholder-base-600
`;

const labelCls = 'text-[11px] font-bold uppercase tracking-widest text-base-600 dark:text-base-300 mb-1.5 block';

/* ── field row component ── */
const Field = ({ icon: Icon, label, name, type = 'text', value, onChange, disabled, placeholder }) => (
    <div>
        <label className={labelCls}>{label}</label>
        <div className="relative">
            <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-400 pointer-events-none" />
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className={`${inputCls} pl-9`}
            />
        </div>
    </div>
);

/* ── avatar initials ── */
const getInitials = (name = '') =>
    name.trim().split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');

/* ════════════════════════════════════════════════════════════
   ADMIN PROFILE PAGE
════════════════════════════════════════════════════════════ */
const AdminProfile = () => {
    /* In production, get the logged-in admin's _id from your auth context / localStorage */

    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({});
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [avatar, setAvatar] = useState(null);   // preview URL
    const [avatarFile, setAvatarFile] = useState(null);
    const fileRef = useRef();

    /* ── Fetch admin profile ── */

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(''); // Naya fetch hone par purana error clear karo

            try {
                const data = await getProfile();

                // Backend se check karo ki success true hai ya nahi
                if (data.success !== false && !data.error) {
                    const user = data.admin || data;

                    setProfile(user);
                    setForm({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        location: user.location || '',
                    });
                    setAvatar(user.avatar || null);
                } else {
                    setError(data.error || 'Failed to load profile.');
                    showToast(data.error || 'Failed to load profile.', 'error');
                }

            } catch (err) {
                console.error("Fetch Profile Error:", err);

                // ── AXIOS ERROR HANDLING ──
                if (err.response && err.response.data && err.response.data.error) {
                    const backendError = err.response.data.error;
                    setError(backendError);
                    showToast(backendError, 'error');
                } else {
                    setError('Network error. Failed to load profile.');
                    showToast('Network error. Failed to load profile.', 'error');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        // Token delete karo aur login page par phek do
        localStorage.removeItem('admin-token');
        showToast('Logged out successfully', 'success');
        navigate('/admin/login');
    };

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        if (error) setError('');
        if (success) setSuccess('');
    };

    /* ── Avatar file pick ── */
    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatar(URL.createObjectURL(file));
    };

    /* ── Validate ── */
    const validate = () => {
        if (!form.name.trim()) return 'Name is required.';
        if (!form.email.trim()) return 'Email is required.';
        if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email.';
        return '';
    };


    const handleSave = async () => {
        const err = validate();
        if (err) {
            setError(err);
            return;
        }

        setSaving(true);
        setError(''); // Purana error clear karne ke liye

        try {

            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('email', profile.email);
            formData.append('phone', form.phone);
            formData.append('bio', form.bio);

            // Agar naya image select kiya hai tabhi append karo
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            const data = await updateProfile(formData);

            if (data.success !== false && !data.error) {

                const updated = data.admin || data;

                setProfile(prev => ({ ...prev, ...form }));

                setAvatar(updated?.avatar)

                showToast('Profile updated successfully!', 'success');

                setEditing(false);

                setAvatarFile(null);

            } else {
                setError(data.error || 'Update failed.');
                showToast(data.error || 'Update failed.', 'error');
            }
        } catch (err) {
            console.error('Update Profile Error:', err);

            // ── AXIOS ERROR HANDLING FOR DEMO MODE ──
            if (err.response && err.response.data && err.response.data.error) {
                const backendError = err.response.data.error;
                setError(backendError);

                // Demo mode me ye automatic bouncy Lock 🔒 wala toast dikhayega
                showToast(backendError, 'error');
            } else {
                setError('Network error. Please try again.');
                showToast('Network error. Please try again.', 'error');
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
        setAvatar(profile?.avatar || null);
        setAvatarFile(null);
        setEditing(false);
        setError('');
    }; 

    /* ── Loading skeleton ── */
    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-accent-500 animate-spin" />
        </div>
    );

    const initials = getInitials(profile?.name || form.name);

    /* ════════════════════ RENDER ════════════════════ */
    return (
        <div className="max-w-3xl mx-auto flex flex-col gap-5 pb-10">

            {/* ── Page heading ── */}
            <div className='flex justify-between items-center'>
                <div>
                    <h1 className="text-2xl font-extrabold text-base-900 dark:text-base-50 tracking-tight mb-1">
                        My Profile
                    </h1>
                    <p className="text-[13px] font-medium text-base-500 dark:text-base-400">
                        Manage your admin account information
                    </p>
                </div>
                <Button variant='contained' className='text-sm!' sx={{ py: 1.1, borderRadius : "8px", background : "linear-gradient(135deg, var(--color-rose-400), var(--color-rose-700))" }} startIcon={<LogOut size={16} />} color='error'>
                    Logout
                </Button>
                {/* <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-semibold transition-colors dark:bg-rose-500/10 dark:hover:bg-rose-500/20"
                >
                    <LogOut size={18} />
                    Logout
                </button> */}
            </div>

            {/* ── Profile card ── */}
            <div className="bg-white dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-2xl overflow-hidden">

                {/* Banner */}
                {/* <div className="h-28 bg-linear-to-br from-accent-400 via-accent-500 to-accent-600 relative overflow-hidden"> */}
                <div className="relative h-28 bg-linear-to-br from-base-900 to-base-700 overflow-hidden">

                    <div className="absolute inset-0 opacity-[0.06]"
                        style={{ backgroundImage: 'radial-linear(circle,#fff 1px,transparent 1px)', backgroundSize: '22px 22px' }} />
                    <div className="absolute -bottom-5 -right-5 w-36 h-36 rounded-full bg-sky-400/10 blur-2xl" />

                    {/* Decorative rings */}
                    <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full border border-white/10" />
                    <div className="absolute -top-4  -right-4  w-28 h-28 rounded-full border border-white/10" />

                    <div className="absolute top-2 left-4 flex items-center gap-2">
                        <Shield size={14} className="text-white/70" />
                        <span className="text-white/80 text-[12px] font-bold uppercase tracking-widest">Admin Account</span>
                    </div>

                </div>

                <div className="px-6 pb-6">
                    {/* Avatar row */}
                    <div className="flex items-end justify-between -mt-10 mb-5">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-base-900 overflow-hidden bg-linear-to-br from-base-700 via-base-800 to-base-600 flex items-center justify-center">
                                {avatar
                                    ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                                    : <span className="text-white font-extrabold text-2xl">{initials}</span>
                                }
                            </div>
                            {/* Camera button */}
                            {editing && (
                                <button
                                    onClick={() => fileRef.current?.click()}
                                    className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-accent-gradient border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                                >
                                    <Camera size={12} className="text-white" />
                                </button>
                            )}
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </div>

                        {/* Edit / Save buttons */}
                        <div className="flex items-center gap-2 translate-y-3 mb-1">

                            {editing ? (

                                <div className='fade-left flex gap-2'>

                                    <button
                                        onClick={handleCancel} disabled={saving}
                                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-bold border border-base-200 dark:border-base-700 text-base-600 dark:text-base-300 bg-white dark:bg-base-800 hover:bg-base-50 dark:hover:bg-base-900 transition-colors disabled:opacity-50"
                                    >
                                        <X size={14} /> Cancel
                                    </button>

                                    <PrimaryButton
                                        onClick={handleSave} disabled={saving}
                                        startIcon={<IoSaveSharp size={14} />}
                                        loading={saving} loadingPosition='start' loadingIndicator={<Loader2 size={14} className="animate-spin" />}
                                        sx={{ py: 0.9 }}
                                    >
                                        {saving ? "Saving…" : "Save Changes"}
                                    </PrimaryButton>

                                </div>

                            ) : (
                                <button
                                    onClick={() => { setEditing(true); setSuccess(''); }}
                                    className="flex fade-right items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-bold border border-base-200 dark:border-base-700 text-base-700 dark:text-base-200 bg-white dark:bg-base-800 hover:bg-base-50 dark:hover:bg-base-950 hover:border-base-300 dark:hover:border-base-600 transition-all"
                                >
                                    <Edit3 size={14} /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Name + role */}
                    <div className="mb-5">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-50">
                                {profile?.name || form.name}
                            </h2>
                            <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-accent-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-sky-100 dark:border-emerald-500/20">
                                <BadgeCheck size={11} /> Admin
                            </span>
                        </div>
                        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {profile?.email}
                        </p>
                    </div>

                    {/* Success / error banners */}
                    {success && (
                        <div className="flex items-center gap-2 text-[13px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-4 py-3 rounded-xl mb-5">
                            <Check size={15} className="shrink-0" /> {success}
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center gap-2 text-[13px] font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3 rounded-xl mb-5">
                            <IoWarning className="shrink-0 text-base" /> {error}
                        </div>
                    )}

                    {/* ── Form fields ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field
                            icon={User} label="Full Name" name="name"
                            value={form.name} onChange={handleChange}
                            disabled={!editing} placeholder="Your full name"
                        />
                        <Field
                            icon={Mail} label="Email Address" name="email" type="email"
                            value={form.email} onChange={handleChange}
                            disabled={!editing} placeholder="admin@shop.com"
                        />
                        <Field
                            icon={Phone} label="Phone Number" name="phone" type="tel"
                            value={form.phone} onChange={handleChange}
                            disabled={!editing} placeholder="+91 98765 43210"
                        />
                        <Field
                            icon={MapPin} label="Location" name="location"
                            value={form.location} onChange={handleChange}
                            disabled={!editing} placeholder="City, State"
                        />
                        {/* {
                            editing &&
                            
                        } */}

                    </div>
                </div>
            </div>

            {/* ── Account info tiles ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Role', value: profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1) || 'Admin', color: 'text-sky-600 dark:text-sky-400' },
                    { label: 'Status', value: profile?.status || 'Active', color: profile?.status === 'Active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500' },
                    { label: 'Member Since', value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—', color: 'text-slate-700 dark:text-slate-200' },
                    { label: 'Last Updated', value: profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—', color: 'text-slate-700 dark:text-slate-200' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white dark:bg-base-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-base-400 dark:text-base-500 mb-1.5">{label}</p>
                        <p className={`text-[14px] font-extrabold ${color}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* ── Security note ── */}
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl p-4">
                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                    <p className="text-[13px] font-bold text-amber-700 dark:text-amber-400 mb-0.5">Password changes</p>
                    <p className="text-[12px] text-amber-600/80 dark:text-amber-500/80">
                        To change your password, use the <span className="font-bold">Forgot Password</span> flow from the login page. This keeps your account secure.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;