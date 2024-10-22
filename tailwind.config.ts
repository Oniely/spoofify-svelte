import type { Config } from 'tailwindcss'

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				accent: '#1DB954',
				primary: '#191414',
				secondary: '#212121',
				text: '#FFF'
			},
			animation: {
				progress: 'progress 1s infinite linear'
			},
			keyframes: {
				progress: {
					'0%': { transform: ' translateX(0) scaleX(0)' },
					'40%': { transform: 'translateX(0) scaleX(0.4)' },
					'100%': { transform: 'translateX(100%) scaleX(0.5)' }
				}
			},
			transformOrigin: {
				'left-right': '0% 50%'
			}
		}
	},

	plugins: []
} as Config
