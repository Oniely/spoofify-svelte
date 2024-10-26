<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte'

	let { size = 20 }: { size?: number } = $props()
</script>

<div role="status">
	<LoaderCircle {size} class="animate-spin text-white/90" />
	<span class="sr-only">Loading...</span>
</div>
