/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',       // ← required so dark: variants work
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                bg: 'rgb(var(--color-bg) / <alpha-value>)',
                surface: 'rgb(var(--color-surface) / <alpha-value>)',
                border: 'rgb(var(--color-border) / <alpha-value>)',
                text: 'rgb(var(--color-text) / <alpha-value>)',
                muted: 'rgb(var(--color-muted) / <alpha-value>)',
                primary: 'rgb(var(--color-primary) / <alpha-value>)',
            },
        },
    },
    plugins: [],
};