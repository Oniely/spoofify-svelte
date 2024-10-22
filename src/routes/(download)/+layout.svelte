<script lang="ts">
	import HomeButton from '$components/HomeButton.svelte'
	import PlaylistInfo from '$components/PlaylistInfo.svelte'
	import Search from '$components/Search.svelte'
</script>

<div class="flex w-full justify-center pb-14">
	<main class="w-full space-y-4 px-5 py-8 md:mt-[100px] md:w-[700px]">
		<div class="flex w-full items-center gap-4">
			<HomeButton />
			<Search />
		</div>
		<div>
			<slot />
		</div>
	</main>
</div>
