/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#e91e63',
                'primary-dark': '#c2185b',
                secondary: '#f48fb1',
                bg: '#fce4ec',
                'card-bg': 'rgba(255, 255, 255, 0.8)',
                text: '#4a4a4a',
                heading: '#880e4f',
            },
            fontFamily: {
                heading: ['Dancing Script', 'cursive'],
                body: ['Outfit', 'sans-serif'],
            },
            animation: {
                float: 'float 6s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
