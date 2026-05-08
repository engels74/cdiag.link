import { defineConfig, presetWind4 } from 'unocss';

export default defineConfig({
	presets: [
		presetWind4({
			preflights: {
				reset: true,
			},
		}),
	],
	theme: {
		colors: {
			background: 'var(--background)',
			foreground: 'var(--foreground)',
			card: 'var(--card)',
			'card-foreground': 'var(--card-foreground)',
			primary: 'var(--primary)',
			'primary-foreground': 'var(--primary-foreground)',
			secondary: 'var(--secondary)',
			'secondary-foreground': 'var(--secondary-foreground)',
			muted: 'var(--muted)',
			'muted-foreground': 'var(--muted-foreground)',
			accent: 'var(--accent)',
			'accent-foreground': 'var(--accent-foreground)',
			border: 'var(--border)',
			input: 'var(--input)',
			ring: 'var(--ring)',
			terminal: 'var(--terminal)',
			'terminal-foreground': 'var(--terminal-foreground)',
			success: 'var(--success)',
			warning: 'var(--warning)',
		},
	},
	shortcuts: {
		'focus-ring':
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
		'panel-surface': 'rounded-2 border border-border bg-card shadow-sm',
		'eyebrow-text': 'text-xs font-semibold uppercase text-primary',
	},
});
