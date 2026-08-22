<script lang="ts">
	import { onMount } from 'svelte';
	import type { TerminalLine } from '../../lib/homepage/content';

	let { lines }: { lines: TerminalLine[] } = $props();

	// `lines` arrives once across the island boundary and is never reassigned,
	// so reading its length here is a deliberate snapshot, not a missed
	// dependency -- the Solid original read `props.lines.length` just as
	// non-reactively. Making this reactive would put the timer schedule's
	// baseline under reactivity while the schedule itself sits in onMount and
	// never re-runs to match it.
	// svelte-ignore state_referenced_locally
	const initialVisibleCount = Math.min(5, lines.length);
	let visibleCount = $state(initialVisibleCount);
	const visibleLines = $derived(lines.slice(0, visibleCount));
	const hasPending = $derived(visibleCount < lines.length);

	// Every pending line gets its own timer, all armed once at hydration:
	// `delayMs` is measured from mount rather than from the preceding line, so
	// the timers must not be chained. onMount runs exactly once per island and
	// its returned teardown clears the whole batch; $effect would re-arm the
	// schedule on any reactive read it happened to pick up.
	onMount(() => {
		const timers = lines.slice(initialVisibleCount).map((line, index) => {
			const nextIndex = index + initialVisibleCount;
			return setTimeout(() => {
				visibleCount = nextIndex + 1;
			}, line.delayMs ?? nextIndex * 180);
		});

		return () => {
			for (const timer of timers) {
				clearTimeout(timer);
			}
		};
	});
</script>

<div
	class="overflow-hidden rounded-2 border border-[oklch(0.38_0.01_106.89)] bg-terminal shadow-xl"
>
	<div
		class="flex h-10 items-center justify-between border-b border-[oklch(0.36_0.01_106.89)] px-4"
	>
		<div class="flex items-center gap-2" aria-hidden="true">
			<span class="h-2.5 w-2.5 rounded-full bg-[oklch(0.69_0.16_29)]"></span>
			<span class="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.16_82)]"></span>
			<span class="h-2.5 w-2.5 rounded-full bg-[oklch(0.65_0.12_150)]"></span>
		</div>
		<span class="font-mono text-[11px] text-[oklch(0.7_0.01_95)]">claude-diag</span>
	</div>
	<div class="min-h-[20rem] p-4 font-mono text-[13px] leading-6 sm:min-h-[28rem] sm:text-sm">
		{#each visibleLines as line (line)}
			<p class="m-0 flex min-w-0 gap-3">
				<span class="w-13 shrink-0 text-right text-[oklch(0.58_0.01_96)]">
					{line.label ?? ''}
				</span>
				<span
					class={[
						'min-w-0 flex-1 break-words',
						{
							'text-terminal-foreground': line.kind === 'command',
							'text-[oklch(0.82_0.01_96)]': line.kind === 'info',
							'text-[oklch(0.77_0.02_99)]': line.kind === 'progress',
							'text-success': line.kind === 'success',
							'text-warning': line.kind === 'warning',
						},
					]}
				>
					{line.text}
				</span>
			</p>
		{/each}
		{#if hasPending}
			<p class="m-0 flex gap-3 text-[oklch(0.72_0.02_99)]">
				<span class="w-13 shrink-0 text-right">...</span>
				<span class="inline-block h-5 w-2 animate-pulse bg-primary"></span>
			</p>
		{/if}
	</div>
</div>
