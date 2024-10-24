<script lang="ts">
	import type { Track } from '$lib/utils/types'
	import DownloadTrack from './buttons/DownloadTrack.svelte'
	import PlayTrack from './buttons/PlayTrack.svelte'

	interface Props {
		track: Track
		isAlbum?: boolean
	}

	let { track, isAlbum = false }: Props = $props()

	const durationString = `${Math.floor(track.duration_ms / 60000)}:${(
		(track.duration_ms % 60000) /
		1000
	)
		.toFixed(0)
		.padStart(2, '0')}`
</script>

<div class="flex items-center justify-between text-text">
	<div class="flex w-full items-center justify-between text-text">
		<div class="flex items-center gap-3">
			<span class="text-white/50">{track.order || track.track_number}</span>
			<a href={`${track.external_urls?.spotify}`}>
				<img
					src={track.album?.images[0].url || ''}
					width={50}
					height={50}
					class="h-8 w-8 rounded sm:h-10 sm:w-10"
					alt="Track Cover"
				/>
			</a>

			<div class="flex max-w-[125px] flex-col overflow-hidden whitespace-nowrap md:max-w-[300px]">
				<a
					href={`${track.external_urls?.spotify}`}
					class="md:text-md truncate text-sm font-semibold"
					target="_blank"
				>
					{track.name}
				</a>
				<ol class="flex items-center gap-1 text-xs md:text-sm">
					{#if track.artists}
						{#each track.artists as artist}
							<a href={track.artists[0].external_urls.spotify} target="_blank">{artist.name}</a>
						{/each}
					{/if}
					{#if !isAlbum}
						{' - '}
						<a class="hover:underline" href={track.album.external_urls.spotify} target="_blank"
							>{track.album.name}</a
						>
					{/if}
				</ol>
			</div>
		</div>
		<div class="flex items-center gap-2">
			<span class="mr-1 text-xs text-white/50 md:mr-2 md:text-sm">{durationString}</span>
			<PlayTrack audioUrl={track.preview_url} />
			<DownloadTrack {track} />
		</div>
	</div>
</div>
