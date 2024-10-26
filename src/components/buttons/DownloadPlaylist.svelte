<script lang="ts">
	import Spinner from '$components/Spinner.svelte'
	import type { Playlist } from '$lib/utils/types'
	import { downloadStore } from '$stores/download'
	import { Check, Download } from 'lucide-svelte'

	let { playlist }: { playlist: Playlist } = $props()

	function handleClick() {
		if ($downloadStore.defaultSpeed) {
			downloadStore.addDownload(playlist, 'slow')
		} else {
			downloadStore.openDialog(playlist)
		}
	}
</script>

{#if downloadStore.itemState(playlist) === 'downloaded'}
	<div class="flex w-[150px] items-center justify-center gap-3 rounded bg-accent/50 px-5 py-2">
		<Check size={18} />
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
		<Download size={18} />
		Download
	</button>
{/if}
