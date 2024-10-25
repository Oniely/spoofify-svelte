<script lang="ts">
	import { page } from '$app/stores'
	import type { OrderOption, SortOption, Track } from '$lib/utils/types'
	import SortMenu from './SortMenu.svelte'
	import TrackInfo from './TrackInfo.svelte'

	interface Props {
		tracks: any
		isAlbum?: boolean
	}

	let { tracks, isAlbum = false }: Props = $props()
	let sortedTracks = $state(tracks)

	let option = $derived($page.url.searchParams.get('sort') || 'Date added') as SortOption
	let order = $derived($page.url.searchParams.get('order') || 'asc') as OrderOption

	function sortString(a: string, b: string) {
		return a.localeCompare(b, undefined, { sensitivity: 'base' })
	}

	$effect(() => {
		const sortTracks = () => {
			if (isAlbum) return tracks

			let trackItems = [...tracks.items].filter((item: { track: Track }) => item.track)
			const newOrder = order === 'asc'

			switch (option) {
				case 'Custom order':
					trackItems = newOrder ? trackItems.slice() : trackItems.slice().reverse()
					break
				case 'Title':
					trackItems = trackItems.sort(
						(a: { track: { name: string } }, b: { track: { name: string } }) =>
							newOrder
								? sortString(a.track.name, b.track.name)
								: sortString(b.track.name, a.track.name)
					)
					break
				case 'Album':
					trackItems = trackItems.sort((a: { track: Track }, b: { track: Track }) => {
						const albumComparison = newOrder
							? sortString(a.track.album.name, b.track.album.name)
							: sortString(b.track.album.name, a.track.album.name)
						if (albumComparison === 0) {
							return a.track.track_number - b.track.track_number
						}
						return albumComparison
					})
					break
				case 'Date added':
					const order = newOrder ? 1 : -1
					trackItems = trackItems.sort(
						(a: { added_at: string | number | Date }, b: { added_at: string | number | Date }) =>
							order * (new Date(a.added_at).getTime() - new Date(b.added_at).getTime())
					)
					break
			}

			return {
				...tracks,
				items: trackItems.map((item: { track: Track }, idx: number) => ({
					...item,
					track: {
						...item.track,
						order: idx + 1
					}
				}))
			}
		}

		sortedTracks = sortTracks()
	})
</script>

<div
	class="flex w-full flex-col gap-5 rounded-xl border border-white/10 bg-white/5 p-5 text-text backdrop-blur-md"
>
	<div class="mb-1 flex items-center justify-between">
		<p class="text-lg text-white/50">
			{tracks.items.length || tracks.total} tracks
		</p>

		{#if !isAlbum}
			<SortMenu />
		{/if}
	</div>
	<ol class="flex w-full flex-col gap-3">
		{#if !isAlbum}
			{#each sortedTracks.items as item}
				<li>
					<TrackInfo track={item.track} />
				</li>
			{/each}
		{:else}
			{#each tracks as item}
				<li>
					<TrackInfo track={item} isAlbum />
				</li>
			{/each}
		{/if}
	</ol>
</div>
