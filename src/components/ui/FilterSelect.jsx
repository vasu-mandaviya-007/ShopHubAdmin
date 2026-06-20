import React from 'react';
import { Button } from '@mui/material';
import { FiPlus, FiMinus } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const FilterSelect = ({ title, isOpen, onToggle, children }) => {
    return (
        <div className="bg-white dark:bg-[#1a1a1a] rounded overflow-hidden border-b border-gray-200 dark:border-gray-800">
            <Button 
                onClick={onToggle} 
                endIcon={isOpen ? <FiMinus size={18} /> : <FiPlus size={18} />} 
                className={`${isOpen ? "bg-[#F5F7FC]! dark:bg-gray-800/50!" : ""} w-full! text-gray-800! dark:text-gray-200! normal-case! text-[14px]! font-semibold! text-left! justify-between! py-3.5! px-4!`}
            >
                {title}
            </Button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }} 
                        transition={{ duration: 0.3, ease: "easeInOut" }} 
                        className="overflow-hidden"
                    >
                        {/* Jo bhi andar ka content hoga (Checkbox, Slider) wo yahan render hoga */}
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FilterSelect;