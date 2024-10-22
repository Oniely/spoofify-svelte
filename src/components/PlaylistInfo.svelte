<script lang="ts">
	import type { Playlist } from '$lib/utils/types'

	export let playlist: Playlist
</script>

<header
	class="flex w-full flex-col gap-5 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:flex-row md:max-h-[305px]"
>
	<a
		href={playlist.external_urls.spotify}
		aria-label="Spotify Playlist"
		class="self-center md:self-start"
	>
		<div class="relative h-52 w-52 flex-shrink-0 overflow-hidden rounded-lg">
			<img
				src={playlist.images[0].url}
				width={208}
				height={208}
				alt="Playlist Cover"
				class="h-full w-full"
			/>
		</div>
	</a>
	<div class="flex flex-col justify-between gap-3 md:gap-0">
		<div class="text-white">
			<h1 class="line-clamp-1 text-2xl font-bold">{playlist.name}</h1>
			<p class="prose prose-a:text-gray-200 line-clamp-5 text-white">
				{playlist?.description || playlist.label || playlist.owner.display_name}
			</p>
		</div>
		<div class="flex items-center gap-2.5 text-sm text-white/80">
			<!-- <DownloadPlaylist {playlist} /> -->
			<div class="flex flex-col text-xs">
				<p>by {playlist.owner?.display_name || playlist.artists[0].name}</p>
				<p>{playlist.followers?.total || playlist.popularity || 0} likes</p>
			</div>
		</div>
	</div>
</header>
