<script lang="ts">
	import Search from '$components/Search.svelte'
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="w-full space-y-5 px-5 md:w-[700px]">
		<div class="text-text">
			<h1 class="text-4xl font-bold">Spoofify - a spotify downloader</h1>
			<p class="mt-2">
				Easily download spotify <b>playlists or tracks</b> by simply pasting the URL in the input
				dialog. This page uses YouTube to find the best match download. Please refer to the{' '}
				<a class="underline" href="/about">about</a>{' '}
				page for more info and instructions.
			</p>
		</div>
		<Search />
	</div>
</div>
