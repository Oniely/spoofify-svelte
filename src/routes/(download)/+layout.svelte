<script lang="ts">
	import DownloadDialog from '$components/DownloadDialog.svelte'
	import HomeButton from '$components/HomeButton.svelte'
	import Queue from '$components/Queue.svelte'
	import Search from '$components/Search.svelte'
</script>

<div class="flex w-full justify-center pb-14">
	<main class="w-full space-y-4 px-5 py-8 md:mt-[100px] md:w-[700px]">
		<div class="flex w-full items-center gap-4">
			<HomeButton />
			<Search />
		</div>
		<div class="fixed bottom-0 left-1/2 z-10 w-full -translate-x-1/2 md:w-[660px]">
			<Queue />
		</div>
		<DownloadDialog />
		<slot />
	</main>
</div>
