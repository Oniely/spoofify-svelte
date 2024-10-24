<script lang="ts">
	import TrackInfo from '$components/TrackInfo.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<div
	class="flex w-full flex-col gap-5 rounded-xl border border-white/10 bg-white/5 p-5 text-text backdrop-blur-md"
>
	<TrackInfo track={data.track} />
</div>
