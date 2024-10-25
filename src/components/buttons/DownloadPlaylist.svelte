<script lang="ts">
	import Spinner from '$components/Spinner.svelte'
	import type { Playlist } from '$lib/utils/types'
	import { downloadStore } from '$stores/download'

	let { playlist }: { playlist: Playlist } = $props()

	function handleClick() {
		if (downloadStore.getDefaultSpeed()) {
			downloadStore.addDownload(playlist, 'slow')
		} else {
			downloadStore.openDialog(playlist)
		}
	}
</script>

{#if downloadStore.itemState(playlist) === 'downloaded'}
	<div class="flex w-[150px] items-center justify-center gap-3 rounded bg-accent/50 px-5 py-2">
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
		Downloaded
	</div>
{:else if downloadStore.itemState(playlist) === 'queued'}
	<div class="flex items-center gap-3 rounded bg-accent/10 px-5 py-2">
		<Spinner />
		Queued
	</div>
{:else if downloadStore.itemState(playlist) === 'downloading'}
	<div class="relative w-[150px] overflow-hidden rounded bg-accent/50 px-5 py-2 text-center">
		<div>Downloading...</div>
	</div>
{:else}
	<button
		onclick={handleClick}
		aria-label="Download Playlist"
		class="flex w-[150px] items-center justify-center gap-3 rounded bg-accent px-5 py-2 text-white transition-colors hover:bg-accent/90"
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
		Download
	</button>
{/if}
