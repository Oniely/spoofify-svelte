<script lang="ts">
	import { playerStore } from '$stores/player'
	import { Pause, Play } from 'lucide-svelte'

	let { audioUrl }: { audioUrl: string } = $props()

	let isPlaying = $state(false)
	playerStore.subscribe((state) => {
		isPlaying = state.trackId === audioUrl && state.playing
	})

	function handleClick() {
		playerStore.togglePlay(audioUrl)
	}
</script>

<div class="relative">
	<button
		onclick={handleClick}
		disabled={!audioUrl}
		aria-label={isPlaying ? 'Pause' : 'Play'}
		class="relative rounded border border-white/5 bg-white/10 p-1.5 transition-colors hover:bg-white/15 disabled:brightness-50 disabled:hover:bg-white/10 md:p-2.5"
	>
		{#if isPlaying}
			<Pause size={18} />
		{:else}
			<Play size={18} />
		{/if}
	</button>
</div>
