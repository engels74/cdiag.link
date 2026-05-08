import { For, createMemo, createSignal, onCleanup, onMount } from 'solid-js';
import type { TerminalLine } from '../../lib/homepage/content';

interface Props {
	lines: TerminalLine[];
}

export default function MockTerminal(props: Props) {
	const initialVisibleCount = Math.min(5, props.lines.length);
	const [visibleCount, setVisibleCount] = createSignal(initialVisibleCount);
	const visibleLines = createMemo(() => props.lines.slice(0, visibleCount()));
	const hasPending = createMemo(() => visibleCount() < props.lines.length);
	const timers: ReturnType<typeof setTimeout>[] = [];

	onMount(() => {
		setVisibleCount(initialVisibleCount);
		for (const [index, line] of props.lines.slice(initialVisibleCount).entries()) {
			const nextIndex = index + initialVisibleCount;
			timers.push(
				setTimeout(
					() => setVisibleCount(nextIndex + 1),
					line.delayMs ?? nextIndex * 180,
				),
			);
		}
	});

	onCleanup(() => {
		for (const timer of timers) {
			clearTimeout(timer);
		}
	});

	return (
		<div class="overflow-hidden rounded-2 border border-[oklch(0.38_0.01_106.89)] bg-terminal shadow-xl">
			<div class="flex h-10 items-center justify-between border-b border-[oklch(0.36_0.01_106.89)] px-4">
				<div class="flex items-center gap-2" aria-hidden="true">
					<span class="h-2.5 w-2.5 rounded-full bg-[oklch(0.69_0.16_29)]" />
					<span class="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.16_82)]" />
					<span class="h-2.5 w-2.5 rounded-full bg-[oklch(0.65_0.12_150)]" />
				</div>
				<span class="font-mono text-[11px] text-[oklch(0.7_0.01_95)]">claude-diag</span>
			</div>
			<div class="min-h-[20rem] p-4 font-mono text-[13px] leading-6 sm:min-h-[28rem] sm:text-sm">
				<For each={visibleLines()}>
					{(line) => (
						<p class="m-0 flex min-w-0 gap-3">
							<span class="w-13 shrink-0 text-right text-[oklch(0.58_0.01_96)]">
								{line.label ?? ''}
							</span>
							<span
								class="min-w-0 flex-1 break-words"
								classList={{
									'text-terminal-foreground': line.kind === 'command',
									'text-[oklch(0.82_0.01_96)]': line.kind === 'info',
									'text-[oklch(0.77_0.02_99)]': line.kind === 'progress',
									'text-success': line.kind === 'success',
									'text-warning': line.kind === 'warning',
								}}
							>
								{line.text}
							</span>
						</p>
					)}
				</For>
				{hasPending() && (
					<p class="m-0 flex gap-3 text-[oklch(0.72_0.02_99)]">
						<span class="w-13 shrink-0 text-right">...</span>
						<span class="inline-block h-5 w-2 animate-pulse bg-primary" />
					</p>
				)}
			</div>
		</div>
	);
}
