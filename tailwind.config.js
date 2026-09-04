import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,ts,jsx,tsx}',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                display: ['Outfit', ...defaultTheme.fontFamily.sans],
            },
            fontWeight: {
                500: '500',
                600: '600',
                700: '700',
                800: '800',
            },
            colors: {
                primary: {
                    DEFAULT: '#263F93',
                    dark: '#1B2F73',
                    light: '#3B54A8',
                    bg: '#EDF0F8',
                },
                accent: {
                    DEFAULT: '#D4A72C',
                    hover: '#C09526',
                    light: '#F5EDD4',
                }
            }
        },
    },

    plugins: [forms],
};
