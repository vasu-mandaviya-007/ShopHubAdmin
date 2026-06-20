import React from 'react'

const ModalShell = ({ children, onClose, maxW = 'max-w-md' }) => {

    return (

        <div className="fixed inset-0 z-99 flex items-center justify-center p-4"
            onClick={onClose}
            style={{ animation: 'mBgIn .18s ease' }}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <div
                className={`relative w-full ${maxW} bg-white dark:bg-base-900 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden`}
                onClick={e => e.stopPropagation()}
                style={{ animation: 'mIn .22s cubic-bezier(.34,1.4,.64,1)' }}
            >
                {children}
            </div>

            <style>{`
                @keyframes mBgIn { from{opacity:0} to{opacity:1} }
                @keyframes mIn { from{opacity:0;transform:scale(.93) translateY(14px)} to{opacity:1;transform:scale(1) translateY(0)} }
            `}</style>

        </div>

    );

}

export default ModalShell;;