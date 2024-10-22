<script lang="ts">
	import TrackInfo from '$components/TrackInfo.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<TrackInfo track={data.track} />
