<script lang="ts">
	import { downloadStore } from '$stores/download'
	import { Rabbit, Turtle, X } from 'lucide-svelte'

	let rememberSpeed = $state(false)

	function handleDownload(speed: 'fast' | 'slow') {
		downloadStore.addDownload(downloadStore.getDialogItem(), speed)
		downloadStore.closeDialog()

		if (rememberSpeed) {
			downloadStore.update((state) => ({ ...state, defaultSpeed: speed }))
		}
	}
</script>

{#if downloadStore.getDialogItem() && !downloadStore.getDefaultSpeed()}
	<div class="fixed z-50 flex h-screen w-full items-center justify-center px-7">
		<button class="absolute right-3 top-3" onclick={downloadStore.closeDialog}>
			<X />
		</button>
		<p
			class="max-w-[230px] overflow-hidden truncate whitespace-nowrap text-xl font-semibold md:max-w-[300px]"
		>
			{downloadStore.getDialogItem().name}
		</p>
		<div class="mt-3 grid grid-cols-2 gap-4">
			<button
				onclick={() => handleDownload('slow')}
				class="group flex flex-col items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/10 p-4 text-white/70 transition-colors hover:text-white"
			>
				<Turtle />
				<div>
					<p class="text-sm">Slow download</p>
					<p class="text-xs text-white/50">Metadata, .mp3</p>
				</div>
			</button>
			<button
				onclick={() => handleDownload('fast')}
				class="flex flex-col items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/10 p-4 text-xs text-white/70 transition-colors hover:text-white"
			>
				<Rabbit />
				<div>
					<p class="text-sm">Fast download</p>
					<p class="text-xs text-white/50">No metadata, .m4a</p>
				</div>
			</button>
		</div>
		<div class="mt-4 flex items-center gap-2 text-sm">
			<label id="rememberChoice">
				<input
					type="checkbox"
					bind:checked={rememberSpeed}
					value={rememberSpeed}
					class="peer relative h-4 w-4 appearance-none rounded bg-white/50 checked:bg-white/80"
					name="rememberChoice"
					id="rememberChoice"
				/> Remember my choice
			</label>
			<div
				class="pointer-events-none absolute hidden h-4 w-4 items-center justify-center peer-checked:flex"
			>
				<div class="h-2 w-2 rounded-sm bg-black/80"></div>
			</div>
		</div>
	</div>
{/if}
