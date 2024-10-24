<script lang="ts">
	import { goto } from '$app/navigation'
	import { detectSpotifyLink } from '$lib/utils/utils'
	import Spinner from './Spinner.svelte'

	let url = $state('')
	let loading = $state(false)
	let error = $state(null)

	function handleSearch(e: Event) {
		e.preventDefault()

		loading = true
		try {
			const { type, id } = detectSpotifyLink(url)
			if (!type || !id) {
				throw Error("Couldn't identify the URL! Please try again with a valid one.")
			}

			if (type === 'playlist' || type === 'track' || type === 'album') {
				goto(`/${type}/${id}`)
			} else {
				throw Error(`Spotify ${type}s are not supported at this moment :(`)
			}
		} catch (error: any) {
			error = error.message
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
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="2.5"
			stroke="currentColor"
			class="size-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
			/>
		</svg>
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
