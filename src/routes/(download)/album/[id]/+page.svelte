<script lang="ts">
	import PlaylistInfo from '$components/PlaylistInfo.svelte'
	import TrackList from '$components/TrackList.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<PlaylistInfo playlist={data.album} />
<TrackList tracks={data.album.tracks} isAlbum />
