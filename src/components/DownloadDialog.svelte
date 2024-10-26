<script lang="ts">
	import { downloadStore } from '$stores/download'
	import { Rabbit, Turtle, X } from 'lucide-svelte'
	import { AnimatePresence, Motion } from 'svelte-motion'

	let rememberSpeed = $state(false)

	function handleDownload(speed: 'fast' | 'slow') {
		downloadStore.addDownload($downloadStore.dialogItem, speed)
		downloadStore.closeDialog()

		if (rememberSpeed) {
			downloadStore.update((state) => ({ ...state, defaultSpeed: speed }))
		}
	}
</script>

<AnimatePresence show={$downloadStore.dialogItem && !$downloadStore.defaultSpeed}>
	<div class="fixed left-0 top-0 z-50 h-screen w-full px-7">
		<Motion
			let:motion
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.1 }}
		>
			<div
				use:motion
				class="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black/70"
			>
				<Motion
					let:motion
					initial={{ y: 60, scale: 0, opacity: 0 }}
					animate={{ y: 0, scale: 1, opacity: 1 }}
					exit={{ y: 400, scale: 0, opacity: 0 }}
				>
					<div
						use:motion
						class="relative w-full rounded-xl border border-white/10 bg-white/10 p-4 text-text backdrop-blur-xl md:w-[400px]"
					>
						<button class="absolute right-3 top-3" onclick={downloadStore.closeDialog}>
							<X />
						</button>
						<p
							class="max-w-[230px] overflow-hidden truncate whitespace-nowrap text-xl font-semibold md:max-w-[300px]"
						>
							{$downloadStore.dialogItem?.name || ''}
						</p>
						<div class="mt-3 grid grid-cols-2 gap-4">
							<button
								onclick={() => handleDownload('slow')}
								class="group flex flex-col items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/10 p-4 text-white/70 transition-colors hover:text-white"
							>
								<Turtle size={100} />
								<div>
									<p class="text-sm">Slow download</p>
									<p class="text-xs text-white/50">Metadata, .mp3</p>
								</div>
							</button>
							<button
								onclick={() => handleDownload('fast')}
								class="flex flex-col items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/10 p-4 text-xs text-white/70 transition-colors hover:text-white"
							>
								<Rabbit size={100} />
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
				</Motion>
			</div>
		</Motion>
	</div>
</AnimatePresence>
