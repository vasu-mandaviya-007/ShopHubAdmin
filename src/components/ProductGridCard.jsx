import React from 'react'
import ActionMenu from './ActionMenu';
import StatusBadge from './StatusBadge';

const ProductGridCard = ({ product }) => {

    return (

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-black/20 group">
            <div className="relative bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center h-40 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 right-3">
                    <StatusBadge status={product.status} />
                </div>
            </div>
            <div className="p-4">
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">
                    {product.category}
                </div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-slate-50 mb-0.5 truncate">
                    {product.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                    SKU: {product.sku}
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div>
                        <div className="font-extrabold text-base text-accent-600 dark:text-accent-400">
                            ₹{product.price.toLocaleString()}
                        </div>
                        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-500 mt-0.5">
                            {product.stock} units left
                        </div>
                    </div>
                    <ActionMenu />
                </div>
            </div>
        </div>
    )
};

export default ProductGridCard