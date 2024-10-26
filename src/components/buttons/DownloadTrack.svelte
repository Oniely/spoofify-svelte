<script lang="ts">
	import Spinner from '$components/Spinner.svelte'
	import type { Track } from '$lib/utils/types'
	import { downloadStore } from '$stores/download'
	import { Check, Download } from 'lucide-svelte'

	let { track }: { track: Track } = $props()

	let itemState = $state()
	downloadStore.subscribe((state) => (itemState = downloadStore.itemState(track)))

	function handleDownload() {
		downloadStore.addDownload(track, 'fast')
	}
</script>

{#if itemState === 'downloaded'}
	<div class="rounded border border-white/5 bg-accent/50 p-1.5 text-lg md:p-2.5">
		<Check size={18} />
	</div>
{:else if itemState === 'queued'}
	<div class="rounded bg-accent/80 p-1.5 text-lg md:p-2.5">
		<Spinner />
	</div>
{:else if itemState === 'downloading'}
	<div class="rounded bg-accent/80 p-1.5 text-lg md:p-2.5">
		<Spinner />
	</div>
{:else}
	<button
		onclick={() => handleDownload()}
		aria-label="Download Track"
		class="rounded border border-white/5 bg-accent p-1.5 text-white transition-colors hover:bg-accent/90 md:p-2.5"
	>
		<Download size={18} />
	</button>
{/if}
