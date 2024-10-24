<script lang="ts">
	import Spinner from '$components/Spinner.svelte'
	import type { Track } from '$lib/utils/types'
	import { downloadStore } from '$stores/download'

	let { track }: { track: Track } = $props()

	let itemState = $state()
	downloadStore.subscribe((state) => (itemState = downloadStore.itemState(track)))

	function handleDownload() {
		downloadStore.addDownload(track, 'fast')
	}
</script>

{#if itemState === 'downloaded'}
	<div class="rounded bg-accent/50 p-1.5 text-lg md:p-2.5">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-5"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
		</svg>
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
		class="rounded bg-accent p-1.5 text-lg text-white transition-colors hover:bg-accent/90 md:p-2.5"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
			/>
		</svg>
	</button>
{/if}
