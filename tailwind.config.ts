import type { Config } from 'tailwindcss'


const config: Config = {
content: [
'./app/**/*.{js,ts,jsx,tsx}',
'./components/**/*.{js,ts,jsx,tsx}'
],
theme: {
extend: {
colors: {
lavender: {
50: '#f7f5ff',
100: '#efe9ff',
200: '#e0d3ff',
300: '#c5adff',
400: '#a787ff',
500: '#8b61f6',
600: '#6b43d3',
700: '#5432a4',
800: '#3e2579',
900: '#2a1951'
}
},
boxShadow: {
soft: '0 10px 25px rgba(0,0,0,0.06)'
},
borderRadius: {
xl2: '1.25rem'
}
}
},
plugins: []
}
export default config
