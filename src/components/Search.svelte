<script lang="ts">
	import { goto } from '$app/navigation'
	import { detectSpotifyLink } from '$lib/utils/utils'
	import { Search } from 'lucide-svelte'
	import Spinner from './Spinner.svelte'

	let url = $state('')
	let loading = $state(false)
	let error = $state(null)

	async function handleSearch(e: SubmitEvent) {
		e.preventDefault()

		loading = true

		try {
			const { type, id } = detectSpotifyLink(url)
			if (!type || !id) {
				throw Error("Couldn't identify the URL! Please try again with a valid one.")
			}

			if (type === 'playlist' || type === 'track' || type === 'album') {
				await goto(`/${type}/${id}`)
			} else {
				throw Error(`Spotify ${type}s are not supported at this moment :(`)
			}
		} catch (err: any) {
			error = err.message
		} finally {
			loading = false
			url = ''
		}
	}
</script>

<form
	onsubmit={handleSearch}
	class="relative z-10 flex w-full items-center justify-between gap-2 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2 text-white backdrop-blur-md"
>
	{#if loading}
		<div class="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black/50">
			<Spinner size={25} />
		</div>
	{/if}
	<button class="rounded p-2 text-white/50 transition-colors" type="submit" aria-label="Search">
		<Search size={20} strokeWidth={3} />
	</button>
	<div class="flex w-full items-center gap-3">
		<input
			type="text"
			placeholder="Enter a spotify link"
			class="w-full bg-transparent outline-none"
			bind:value={url}
			disabled={loading}
		/>
	</div>
</form>

{#if error}
	<p class="text-red-600">{error}</p>
{/if}
