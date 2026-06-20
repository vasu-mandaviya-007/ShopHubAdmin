import React from 'react';
import Button from '@mui/material/Button';

export default function PrimaryButton({ children,color="", ...props }) {
    return (
        <Button
            className={`${color == "" && "bg-accent-gradient shadow-accent! hover:shadow-accent-lg!" }`}
            color={color}
            variant='contained'
            {...props}
            sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '13px',
                fontFamily: 'inherit',
                px: 3,
                py : 1.1, 
                color: '#ffffff',

                transition: 'all 0.3s ease',

                // Disabled State
                '&.Mui-disabled': {
                    // background: '#e0e0e0',
                    opacity : 0.8,
                    cursor : "not-allowed !important",
                    color: '#dcdcdc',
                },

                // Agar aap koi extra sx pass karein toh override ho jaye
                ...props.sx,
            }}
        >
            {children}
        </Button>
    );
}