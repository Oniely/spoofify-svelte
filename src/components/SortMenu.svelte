<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { SORT_OPTIONS, type OrderOption, type SortOption } from '$lib/utils/types'

	let isOpen = $state(false)
	let sort: SortOption = $state('Date added')
	let order: OrderOption = $state('asc')

	$effect(() => {
		sort = ($page.url.searchParams.get('sort') || 'Date added') as SortOption
		order = ($page.url.searchParams.get('order') || 'asc') as OrderOption

		console.log(sort, order)
	})

	function toggleDropdown() {
		isOpen = !isOpen
	}

	function selectSortOption(selectedSort: SortOption) {
		let newOrder: string = order

		if (sort === selectedSort && selectedSort !== 'Custom order') {
			newOrder = order === 'asc' ? 'desc' : 'asc'
		} else {
			newOrder = selectedSort === 'Custom order' ? 'asc' : newOrder
		}

		const url = new URL(window.location.href)
		url.searchParams.set('sort', selectedSort)
		url.searchParams.set('order', String(newOrder))

		goto(url.toString(), { replaceState: true, noScroll: true })

		isOpen = false
	}
</script>

<div class="inline-text-left relative">
	<button
		class="flex items-center gap-1 text-white/50 transition-colors hover:text-white/80"
		onclick={toggleDropdown}
	>
		<span class="flex items-center gap-1 text-sm">{sort}</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
			/>
		</svg>
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md border border-white/10 bg-[#0a0a0a] shadow-lg"
		>
			<div class="py-1">
				{#each SORT_OPTIONS as selectedSort}
					<button
						class="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-accent hover:text-white {sort ===
						selectedSort
							? 'bg-primary text-accent'
							: 'text-white/80'}"
						onclick={() => selectSortOption(selectedSort)}
					>
						<span>{selectedSort}</span>
						{#if sort === selectedSort && sort !== 'Custom order'}
							{#if order === 'asc'}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-5"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
									/>
								</svg>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-5"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
									/>
								</svg>
							{/if}
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
