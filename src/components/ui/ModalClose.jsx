import React from "react";
import { X } from "lucide-react";
import { IconButton } from "@mui/material";


const ModalClose = ({ onClose, disabled=false }) => (
    // <button onClick={onClose}
    //     className="w-8 h-8 rounded-xl bg-base-100 dark:bg-base-800 hover:bg-base-200 dark:hover:bg-base-700 flex items-center justify-center transition-colors shrink-0">
    //     <X size={15} className="text-base-400" />
    // </button> 

    <IconButton
        disabled={disabled}
        aria-label="close"
        sx={
            {
                backgroundColor: "var(--color-base-100)",
                "&:hover": { background: "var(--color-base-200)" },
                ".dark &": {
                    backgroundColor: "var(--color-base-800)",
                    "&:hover": { background: "var(--color-base-700)" },
                }
            }
        }
        onClick={onClose}
    >
        <X size={20} />
    </IconButton>
);


export default ModalClose;