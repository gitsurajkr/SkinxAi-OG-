
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				skinx: {
					teal: {
						DEFAULT: '#06C4CB',
						light: '#0AEFFF',
						dark: '#059BA0',
					},
					purple: {
						DEFAULT: '#9b87f5',
						light: '#D6BCFA',
						dark: '#7E69AB',
					},
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 0 0 rgba(10, 239, 255, 0.4)'
					},
					'50%': {
						boxShadow: '0 0 20px 5px rgba(10, 239, 255, 0.5)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0) rotate(0deg) scale(1)'
					},
					'25%': {
						transform: 'translateY(-10px) rotate(2deg) scale(1.02)'
					},
					'50%': {
						transform: 'translateY(0) rotate(5deg) scale(1)'
					},
					'75%': {
						transform: 'translateY(10px) rotate(3deg) scale(0.98)'
					}
				},
				'glow': {
					'0%, 100%': {
						opacity: '0.8'
					},
					'50%': {
						opacity: '1'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'slide-in-right': {
					'0%': {
						transform: 'translateX(100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1'
					}
				},
				'meteor': {
					'0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
					'70%': { opacity: '1' },
					'100%': { transform: 'rotate(215deg) translateX(-500px)', opacity: '0' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s infinite',
				'float': 'float 6s ease-in-out infinite',
				'float-slow': 'float 10s ease-in-out infinite',
				'float-slower': 'float 14s ease-in-out infinite',
				'glow': 'glow 3s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.5s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'slide-in-right': 'slide-in-right 0.6s ease-out',
				'meteor': 'meteor 5s linear infinite',
				'shimmer': 'shimmer 2s infinite'
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;