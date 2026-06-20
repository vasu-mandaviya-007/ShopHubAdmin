
import React, { useState, useEffect } from 'react';
import { Palette, Check, RefreshCw, Loader2, Undo, RotateCw, Moon, MoonStar, Info } from 'lucide-react';
import { applyAccent, applyTheme, applyCompact } from '../../config/useAccent';
import { getAppearance, updateAppearance } from '../../apis/adminApi';
import { IconButton } from '@mui/material';
import { IoSunnyOutline, IoMoon } from 'react-icons/io5';
import SectionCard from '../../components/ui/SectionCard';
import { showToast } from '../../components/showToast';
import { useThemeContext } from '../../context/ThemeContext';
import { useAuthContext } from '../../context/AuthContext';


const labelCls = 'text-[11px] font-bold uppercase tracking-widest text-base-400 mb-2 block';

const CloudIcon = ({ width = 100, height = 100 }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path style={{ fill: "#F4F4F5" }} d="M426.655,444.491c-85.064,74.278-206.9,83.839-299.319,29.581 c-22.308-13.074-42.982-29.907-60.958-50.499C56,411.723,46.93,399.058,39.085,385.82C15.143,345.045,3.539,298.958,3.784,252.953 c0.49-71.582,29.989-142.754,87.026-192.6C138.776,18.433,197.855-1.096,256.69,0.047c45.597,0.817,91.03,13.973,131.069,38.733 c22.063,13.564,42.41,30.724,60.305,51.153c9.724,11.114,18.386,22.799,25.822,34.974 C537.623,227.785,521.117,361.878,426.655,444.491z"></path> <path style={{ fill: "#EDEDEC" }} d="M107.7,89.244c99.915-87.35,248.817-74.175,333.815,23.051 c84.998,97.226,75.388,243.379-24.528,330.729c-99.915,87.35-251.727,82.317-336.725-14.908S7.784,176.594,107.7,89.244z"></path> <g> <path style={{ fill: "#D8D8D8" }} d="M244.029,141.49c-17.92,37.27-63.032,51.341-100.302,33.421 c-37.27-17.92-53.234-61.357-35.315-98.627c17.92-37.27,62.835-54.046,100.105-36.126 C245.787,58.078,261.948,104.22,244.029,141.49z"></path> <path style={{ opacity: "0.06", fill: "#040000" }} d="M128.086,97.65c17.92-37.27,62.835-54.046,100.105-36.126 c4.127,1.984,7.994,4.316,11.586,6.942c-7.335-11.909-17.95-21.909-31.26-28.308c-37.27-17.92-82.185-1.144-100.105,36.126 c-15.805,32.872-5.247,70.538,23.036,91.265C118.963,147.091,116.789,121.146,128.086,97.65z"></path> </g> <path style={{ fill: "#D8D8D8" }} d="M217.121,218.367c-1.17-5.733,2.71-11.178,8.442-12.348c5.733-1.17,11.248,2.359,12.418,8.091 c1.17,5.733-2.456,11.466-8.189,12.635C224.06,227.916,218.291,224.099,217.121,218.367z"></path> <path style={{ opacity: "0.5", fill: "#FFFFFF" }} d="M363.151,96.945c-1.17-5.733,2.71-11.178,8.442-12.348s11.248,2.359,12.418,8.091 c1.17,5.733-2.456,11.466-8.189,12.636C370.089,106.493,364.32,102.677,363.151,96.945z"></path> <path style={{ fill: "#D8D8D8" }} d="M282.752,398.389c8.691-7.598,21.813-6.256,29.411,2.435c7.598,8.691,6.926,21.591-1.765,29.189 c-8.691,7.598-22.059,6.972-29.657-1.719C273.143,419.603,274.061,405.987,282.752,398.389z"></path> <path style={{ opacity: "0.5", fill: "#FFFFFF" }} d="M58.327,220.961c-1.17-5.733,2.71-11.178,8.442-12.348 c5.733-1.17,11.248,2.359,12.418,8.091s-2.456,11.466-8.189,12.636C65.265,230.51,59.496,226.694,58.327,220.961z"></path> <path style={{ fill: "#D8D8D8" }} d="M468.947,281.701c-3.725,36.649-37.256,62.098-73.905,58.373 c-36.649-3.725-63.177-35.279-59.452-71.928c3.725-36.649,36.272-64.305,72.921-60.58 C445.16,211.292,472.673,245.052,468.947,281.701z"></path> <g> <path style={{ fill: "#D8D8D8" }} d="M173.239,331.136c14.631,25.328,4.867,57.294-20.461,71.925 c-25.328,14.631-57.07,6.642-71.701-18.686c-14.631-25.328-6.526-58.257,18.802-72.888 C125.206,296.855,158.608,305.808,173.239,331.136z"></path> <path style={{ opacity: "0.06", fill: "#040000" }} d="M112.818,324.329c18.464-10.666,41.21-8.787,57.855,2.82 c-15.693-22.238-46.847-29.497-70.794-15.663c-25.328,14.631-33.433,47.561-18.802,72.888c4.04,6.993,9.388,12.657,15.541,16.895 c-0.915-1.299-1.788-2.644-2.602-4.052C79.385,371.89,87.49,338.96,112.818,324.329z"></path> </g> <path style={{ opacity: "0.06", fill: "#040000" }} d="M349.701,282.093c3.725-36.649,36.272-64.305,72.921-60.579 c12.217,1.242,23.415,5.824,32.783,12.735c-11.007-14.534-27.694-24.73-46.893-26.682c-36.649-3.725-69.196,23.93-72.921,60.579 c-2.465,24.247,8.316,46.261,26.506,59.464C352.777,315.06,347.969,299.128,349.701,282.093z"></path> </g> <path style={{ opacity: "0.1", fill: "#040000" }} d="M254.81,381.707c-105.358,0-198.419-52.064-254.72-131.654 c-2.703,99.72,55.552,194.334,153.936,236.742c128.773,55.507,279.648,1.534,335.155-127.239 c15.267-35.419,21.657-72.747,20.288-109.416C453.162,329.68,360.13,381.707,254.81,381.707z"></path> </g> </g>
            {/* Yahan SVG ka pura content paste karo */}
        </svg>
    );
};

const THEMES = [
    { val: 'light', label: 'Light', icon: <IoSunnyOutline className='text-orange-400' /> },
    // { val: 'dark', label: 'Dark', icon: <CloudIcon width={25} height={25} /> },
    { val: 'dark', label: 'Dark', icon: <IoMoon className='text-gray-500' /> },
    { val: 'system', label: 'System', icon: '💻' },
];


const ACCENTS = [
    { val: 'sky', label: 'Sky', color: 'color-sky-500' },
    { val: 'violet', label: 'Violet', color: 'color-violet-500' },
    { val: 'emerald', label: 'Emerald', color: 'color-emerald-500' },
    { val: 'rose', label: 'Rose', color: 'color-rose-500' },
    { val: 'amber', label: 'Amber', color: 'color-amber-500' },
    { val: 'indigo', label: 'Indigo', color: 'color-indigo-500' },
    { val: 'pink', label: 'Pink', color: 'color-pink-500' },
    { val: 'ocean', label: 'Ocean', color: 'color-cyan-500' },
    { val: 'sunset', label: 'Sunset', color: 'color-orange-500' },
];


const AppearanceSection = () => {

    // const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
    // const [accent, setAccent] = useState(() => localStorage.getItem('admin-accent') || 'sky');
    // const [compact, setCompact] = useState(() => localStorage.getItem('admin-compact') === 'true');

    const {
        theme, changeTheme,
        accent, changeAccent,
        compact, changeCompact
    } = useThemeContext();

    const { admin } = useAuthContext(); // 👈 Admin details nikal li

    const [saving, setSaving] = useState(false);
    const [reset, setReset] = useState(false);

    const isDemo = admin?.isDemo;

    /* ── On mount: fetch saved preferences from DB ── */
    // useEffect(() => {

    //     const fetchAppearance = async () => {

    //         try {
    //             // const res = await fetch(`${API}/admin/appearance-settings`, { headers: authHeaders() });
    //             // const data = await res.json();

    //             const data = await getAppearance();

    //             console.log(data)

    //             if (data.success && data.appearance) {
    //                 const { theme: t, accent: a, compact: c } = data.appearance;
    //                 setTheme(t); applyTheme(t);
    //                 setAccent(a); applyAccent(a);
    //                 setCompact(c); applyCompact(c);
    //             }
    //         } catch (err) {
    //             // Silently fall back to localStorage values — API might not be set up yet
    //             console.warn('Could not load appearance from DB, using localStorage.', err);
    //         }
    //     };

    //     fetchAppearance();

    // }, [reset]);

    /* Live preview — update DOM immediately on change (before save) */
    // const handleThemeChange = (t) => {
    //     setTheme(t);
    //     applyTheme(t);           // instant DOM update
    // };

    // const handleAccentChange = (a) => {
    //     setAccent(a);
    //     applyAccent(a);         // instant DOM update — user sees the new color immediately
    // };

    // const handleCompactChange = (val) => {
    //     setCompact(val);
    //     applyCompact(val);
    // };
    const handleThemeChange = (t) => {
        changeTheme(t);
    };

    const handleAccentChange = (a) => {
        changeAccent(a);
    };

    const handleCompactChange = (val) => {
        changeCompact(val);
    };

    /* ── Persist to DB ── */
    const handleSave = async () => {
        setSaving(true);
        try {

            const data = await saveToDatabase({ theme, accent, compact });

            if (data.success !== false && !data.error) {
                showToast?.('Appearance settings saved!', 'success');
            } else {
                showToast?.(data.error || 'Failed to save.', 'error');
            }
        } catch {
            // If API not ready yet, just save to localStorage (already done by apply* fns)
            showToast?.('Saved locally (API not connected).', 'success');
        } finally {
            setSaving(false);
        }
    };

    return (

        <SectionCard
            title="Appearance"
            subtitle="Customize the look and feel of your admin panel"
            icon={Palette}
            accent="from-rose-400 to-pink-500"
            action={
                <IconButton onClick={() => setReset(!reset)} className='transition-colors! bg-base-200! hover:bg-base-300!  dark:text-white! rounded-full! dark:bg-white/15! dark:hover:bg-white/20!'>
                    <RotateCw size={16} />
                </IconButton>
            }
        >

            <div className="flex flex-col gap-6">

                {/* ── Theme ── */}
                <div>
                    <label className={labelCls}>Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                        {THEMES.map(({ val, label, icon }) => (

                            // <button key={val} type="button" onClick={() => handleThemeChange(val)}
                            //     className={`relative flex flex-col items-center gap-2.5 py-5 rounded-xl border-2 text-[13px] font-bold transition-all duration-200
                            //     ${theme === val
                            //             ? 'border-accent-500 bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400 shadow-md shadow-accent'
                            //             : 'border-base-200 dark:border-base-700 text-base-500 dark:text-base-400 hover:border-base-300 dark:hover:border-base-600 bg-white dark:bg-base-800'}`}>
                            //     {/* <span className="text-2xl leading-none">{icon}</span> */}
                            //     <button
                            //         key={val}
                            //         type="button"
                            //         onClick={() => handleThemeChange(val)}
                            //         className={`${theme === val && "active"} switch`}
                            //     >
                            //         {icon}
                            //     </button>
                            //     {label}
                            //     {/* {theme === val && <Check size={12} className="text-accent-500" />} */}
                            //     {/* {theme === val &&
                            //         <div className='absolute top-4 left-4 rounded-full outline-4 outline-accent-500  h-2.5 w-2.5 bg-white'>
                            //         </div>
                            //     } */}
                            // </button>

                            <button
                                key={val}
                                type="button"
                                onClick={() => handleThemeChange(val)}
                                className={`relative overflow-hidden flex flex-col items-center gap-2.5 py-5 rounded-xl border text-[13px] font-bold transition-all duration-300
                                    ${theme === val
                                        ? "border-accent-500 bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400 shadow-accent"
                                        : "border-base-200 dark:border-base-700 text-base-500 dark:text-base-400 hover:border-base-300 dark:hover:border-base-600 bg-white dark:bg-base-800"
                                    }
                                `}
                            >
                                {/* Active indicator */}
                                {theme === val && (
                                    <>
                                        <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-accent-500" />

                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-16 w-8 bg-accent-500/30 blur-xl" />
                                    </>
                                )}

                                <span className="text-2xl leading-none">{icon}</span>
                                {label}
                            </button>


                        ))}
                    </div>
                </div>

                {/* ── Accent colour ── */}
                <div>

                    <label className={labelCls}>Accent Color</label>

                    <p className="text-[11px] text-base-400 -mt-1 mb-3">
                        Changes button colors, active states, and highlights everywhere in the admin panel.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">

                        {ACCENTS.map(({ val, label, color }) => (

                            <button key={val} type="button" onClick={() => handleAccentChange(val)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-[13px] font-semibold transition-all duration-200 text-left
                                ${accent === val
                                        ? 'border-accent-400 bg-accent-50 dark:bg-accent-500/10 shadow-sm shadow-accent'
                                        : 'border-base-200 dark:border-base-700 text-base-600 dark:text-base-300 hover:border-base-300 dark:hover:border-base-600 bg-white dark:bg-base-800'}`}
                            >

                                {/* Colour */}
                                <span
                                    className="w-8 h-8 rounded-xl shrink-0 shadow-sm"
                                    style={{ background: `linear-gradient(135deg,color-mix(in srgb,var(--${color}) 80%, transparent),var(--${color}))` }}
                                />

                                <span className="flex-1">{label}</span>

                                {/* Live mini preview */}
                                <span
                                    className="px-3 py-1 rounded-lg text-white text-[11px] font-bold"
                                    style={{ background: `linear-gradient( 135deg, color-mix(in srgb, var(--${color}) 80%, transparent), var(--${color}))` }}
                                >
                                    Preview
                                </span>

                                {accent === val && (
                                    <Check size={15} className="text-accent-500 shrink-0" />
                                )}

                            </button>

                        ))}

                    </div>

                </div>

                {/* ── Compact mode ── */}
                <div className="flex items-center justify-between px-4 py-4 rounded-2xl bg-base-50 dark:bg-base-800 border border-base-100 dark:border-base-700">
                    <div>
                        <p className="text-[13px] font-semibold text-base-800 dark:text-base-100">Compact Mode</p>
                        <p className="text-[11px] text-base-400 mt-0.5">Reduce spacing for denser information display</p>
                    </div>
                    <button type="button" onClick={() => handleCompactChange(!compact)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200
                        ${compact ? 'bg-accent-gradient shadow-md shadow-accent' : 'bg-base-200 dark:bg-base-700'}`}>
                        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${compact ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>

                {/* ── Save button ── */}
                <div className="flex justify-end">
                    {isDemo ? (
                        // DEMO MODE UI: Ek soft info badge dikhayenge
                        <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[13px] font-bold border border-sky-100 dark:border-sky-500/20">
                            <Info size={16} />
                            Auto-saved locally in Demo Mode
                        </div>
                    ) : (
                        <button onClick={handleSave} disabled={saving}
                            className="flex items-center gap-2 px-7 py-3 rounded-xl bg-accent-gradient text-white text-[13px] font-bold shadow-md shadow-accent hover:shadow-accent-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0">
                            {saving
                                ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                                : <><Palette size={14} /> Apply Changes</>}
                        </button>
                    )}
                </div>

            </div>

        </SectionCard>

    );
};


export default AppearanceSection;