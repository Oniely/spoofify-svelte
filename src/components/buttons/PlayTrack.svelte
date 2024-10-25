<script lang="ts">
	import { playerStore } from '$stores/player'

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
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
			</svg>
		{:else}
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
					d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
				/>
			</svg>
		{/if}
	</button>
</div>
