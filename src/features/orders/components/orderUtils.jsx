// src/features/orders/components/orderUtils.js


export const dialogSx = {
    '& .MuiDialog-paper': {
        borderRadius: '15px',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.06), rgba(255,255,255,0.06))',
    },
    '& .MuiBackdrop-root': {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 50% dark overlay
        backdropFilter: 'blur(6px)',           // Background ko halka sa blur kar dega
    }
};

export const labelCls = 'text-[10px] font-bold uppercase tracking-widest text-base-400 dark:text-base-300/80 mb-1 block';

export const fmt = (n) => Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

export const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric', 
    hour: '2-digit',
    minute: '2-digit'
}) : '—';