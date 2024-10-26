<script lang="ts">
	import { downloadStore } from '$stores/download'
	import { ChevronDown, ChevronUp } from 'lucide-svelte'
	import { Motion } from 'svelte-motion'

	let closed = $state(true)

	const PREVIEW_MAX_IMAGES = 3

	function toggleClose() {
		closed = !closed
	}
</script>

{#if $downloadStore.currentDownload}
	{#if closed}
		<div class="mb-7 flex w-full justify-center">
			<Motion
				let:motion
				initial={{ y: 500, scale: 0 }}
				animate={{ y: 0, scale: 1 }}
				transition={{ duration: 0.4, type: 'spring' }}
			>
				<button
					use:motion
					class="relative flex items-center gap-2 rounded-full border border-white/10 bg-white/10 p-1.5 text-white shadow-2xl backdrop-blur-md"
					aria-label="Open queue info"
					onclick={toggleClose}
				>
					<ul class="flex items-center -space-x-2">
						{#each $downloadStore.queue.slice(0, PREVIEW_MAX_IMAGES - 1).reverse() as item}
							<li>
								<img
									src={item.type === 'playlist' || item.type === 'album'
										? item.images[0].url
										: item.album.images[0].url}
									class="rounded-full"
									width={20}
									height={20}
									alt={`${$downloadStore.currentDownload.type} cover`}
								/>
							</li>
						{/each}
						<li>
							<img
								src={$downloadStore.currentDownload.type === 'playlist' ||
								$downloadStore.currentDownload.type === 'album'
									? $downloadStore.currentDownload.images[0].url
									: $downloadStore.currentDownload.album?.images[0].url}
								class="rounded-full"
								width={20}
								height={20}
								alt={`${$downloadStore.currentDownload.type} cover`}
							/>
						</li>
					</ul>
					{#if $downloadStore.queue.length >= PREVIEW_MAX_IMAGES}
						<span class="text-sm">+{$downloadStore.queue.length - PREVIEW_MAX_IMAGES + 1} more</span
						>
					{/if}
					<ChevronUp size={14} />
					<div
						class="absolute right-0 top-0 h-2 w-2 animate-ping rounded-full bg-white blur-[1px]"
					></div>
				</button>
			</Motion>
		</div>
	{:else}
		<Motion
			let:motion
			initial={{ y: 500, scale: 0 }}
			animate={{ y: 0, scale: 1 }}
			transition={{ duration: 0.4, type: 'spring' }}
		>
			<div
				use:motion
				class="mb-4 w-full rounded-lg border border-white/20 bg-white/5 p-2.5 text-white shadow-lg backdrop-blur-md"
			>
				<div class="flex gap-3">
					<a href={$downloadStore.currentDownload.external_urls.spotify}>
						<img
							src={$downloadStore.currentDownload.type === 'playlist' ||
							$downloadStore.currentDownload.type === 'album'
								? $downloadStore.currentDownload.images[0].url
								: $downloadStore.currentDownload.album?.images[0].url}
							width={165}
							height={165}
							class="rounded"
							alt={`${$downloadStore.currentDownload.type} cover`}
						/>
					</a>
					<div class="flex w-full flex-col justify-between">
						<div>
							<div class="flex items-start justify-between">
								<p class="line-clamp-1 text-lg font-semibold md:text-xl">
									{$downloadStore.currentDownload.name}
								</p>
								<button aria-label="Close queue info" class="text-2xl" onclick={toggleClose}>
									<ChevronDown />
								</button>
							</div>
							{#if $downloadStore.currentDownload.type === 'playlist'}
								<span class="text-xs">
									<p>
										{$downloadStore.currentDownload.followers.total} likes · by{' '}
										{$downloadStore.currentDownload.owner.display_name}
									</p>
								</span>
							{:else}
								<nav
									class="flex max-w-[190px] items-center gap-2 overflow-hidden whitespace-nowrap text-xs"
								>
									{#each $downloadStore.currentDownload.artists as artist}
										<a href={artist.external_urls.spotify} class="hover:underline">
											{artist.name}
										</a>
									{/each}
								</nav>
							{/if}
						</div>
						<div class="space-y-1 text-xs">
							<span>
								{#if $downloadStore.queue.length !== 0}
									<p class="line-clamp-1 text-xs">Next in queue: {$downloadStore.queue[0].name}</p>
								{:else}
									Downloading...
								{/if}
							</span>
							<div class="h-1 w-full overflow-hidden rounded-full bg-white/50">
								<div class="progress left-right h-full w-full bg-white/90"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Motion>
	{/if}
{/if}
