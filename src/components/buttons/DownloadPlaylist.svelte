<script lang="ts">
	import Spinner from '$components/Spinner.svelte'
	import type { Playlist } from '$lib/utils/types'
	import { downloadStore } from '$stores/download'
	import { Check, Download } from 'lucide-svelte'
	import { Motion } from 'svelte-motion'

	let { playlist }: { playlist: Playlist } = $props()

	let itemState = $state()
	downloadStore.subscribe((state) => (itemState = downloadStore.itemState(playlist)))

	function handleClick() {
		if ($downloadStore.defaultSpeed) {
			downloadStore.addDownload(playlist, 'slow')
		} else {
			downloadStore.openDialog(playlist)
		}
	}
</script>

{#if itemState === 'downloaded'}
	<div class="flex w-[150px] items-center justify-center gap-3 rounded bg-accent/50 px-5 py-2">
		<Check size={18} />
		Downloaded
	</div>
{:else if itemState === 'queued'}
	<div class="flex items-center gap-3 rounded bg-accent/10 px-5 py-2">
		<Spinner />
		Queued
	</div>
{:else if itemState === 'downloading'}
	<div class="relative w-[150px] overflow-hidden rounded bg-accent/50 px-5 py-2 text-center">
		<Motion
			let:motion
			initial={{ width: '0%' }}
			animate={{ width: `${$downloadStore.progress}%` }}
			transition={{ duration: 0.25 }}
		>
			<div use:motion class="absolute left-0 top-0 -z-10 h-full bg-accent/80"></div>
		</Motion>
		{Math.round($downloadStore.progress)}%
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
