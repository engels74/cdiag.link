export const installCommand = 'curl -fsSL https://sh.cdiag.link | bash';

export type TerminalLineKind = 'command' | 'info' | 'progress' | 'success' | 'warning';

export interface TerminalLine {
	kind: TerminalLineKind;
	text: string;
	label?: string;
	delayMs?: number;
}

export interface FeatureCard {
	kicker: string;
	title: string;
	body: string;
}

export const terminalLines: TerminalLine[] = [
	{ kind: 'command', label: '$', text: installCommand, delayMs: 120 },
	{ kind: 'info', text: 'claude-diag', delayMs: 420 },
	{
		kind: 'info',
		text: 'Redacted Claude Code diagnostics for sharing and support.',
		delayMs: 720,
	},
	{
		kind: 'info',
		text: 'This will choose Python 3.12+, download the script, and redact before output.',
		delayMs: 1020,
	},
	{ kind: 'success', text: 'Using Python: /opt/homebrew/bin/python3.14 (3.14.0)', delayMs: 1320 },
	{ kind: 'progress', label: '01/17', text: 'header', delayMs: 1620 },
	{ kind: 'progress', label: '02/17', text: 'environment', delayMs: 1860 },
	{ kind: 'progress', label: '03/17', text: 'claude command', delayMs: 2100 },
	{ kind: 'progress', label: '04/17', text: '/context output', delayMs: 2340 },
	{ kind: 'progress', label: '08/17', text: 'plugins', delayMs: 2580 },
	{ kind: 'progress', label: '14/17', text: 'state footprint', delayMs: 2820 },
	{ kind: 'progress', label: '17/17', text: 'about', delayMs: 3060 },
	{ kind: 'success', text: 'wrote /tmp/claude-diag-20260508-114210.md (18,432 bytes)', delayMs: 3320 },
	{ kind: 'warning', text: 'Publish redacted report to PasteMyst? [y/N]', delayMs: 3600 },
];

export const featureCards: FeatureCard[] = [
	{
		kicker: 'Local first',
		title: 'Runs on your machine',
		body: 'The bootstrapper picks a compatible Python 3.12+ runtime, downloads the diagnostic script, and hands off locally through your terminal.',
	},
	{
		kicker: 'Redacted by default',
		title: 'Scrubs before output',
		body: 'Secrets, emails, hostnames, public IPs, and user paths are redacted before the Markdown report is saved, printed, or shared.',
	},
	{
		kicker: 'Open source',
		title: 'Auditable flow',
		body: 'The script and installer live in the public repository, so support teams and users can inspect exactly what the diagnostic collects.',
	},
	{
		kicker: 'Optional sharing',
		title: 'PasteMyst publishing',
		body: 'Generated reports can stay local, print to stdout, or publish as an anonymous expiring PasteMyst link when the user confirms it.',
	},
];

export const repoUrl = 'https://github.com/engels74/claude-diag';
