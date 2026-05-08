<script lang="ts">
	let { command }: { command: string } = $props();
	let copied = $state(false);
	let failed = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	const reset = () => {
		copied = false;
		failed = false;
	};

	const copy = async () => {
		reset();
		clearTimeout(timer);

		try {
			await navigator.clipboard.writeText(command);
			copied = true;
		} catch {
			failed = true;
		}

		timer = setTimeout(reset, 1800);
	};
</script>

<div
	class="flex w-full flex-col gap-3 rounded-2 border border-border bg-terminal p-3 shadow-xl sm:flex-row sm:items-center sm:gap-4"
>
	<code
		class="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-sm text-terminal-foreground sm:text-base"
		>{command}</code
	>
	<button
		type="button"
		class="focus-ring inline-flex h-10 shrink-0 items-center justify-center rounded-2 bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-[oklch(0.56_0.14_39.04)]"
		aria-label="Copy install command"
		onclick={copy}
	>
		{#if copied}
			Copied
		{:else if failed}
			Select
		{:else}
			Copy
		{/if}
	</button>
</div>
