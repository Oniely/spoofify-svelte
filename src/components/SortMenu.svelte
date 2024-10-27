<script lang="ts">
	import { goto } from '$app/navigation'
	import { SORT_OPTIONS, type OrderOption, type SortOption } from '$lib/utils/types'
	import { ArrowDown, ArrowUp, List } from 'lucide-svelte'

	interface Props {
		sort: SortOption
		order: OrderOption
	}

	let { sort, order }: Props = $props()

	let isOpen = $state(false)

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
		<List size={18} />
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md border border-white/10 bg-[#0a0a0a] shadow-lg"
		>
			<div class="py-1">
				{#each SORT_OPTIONS as sortOption}
					<button
						class="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-accent hover:text-white {sort ===
						sortOption
							? 'bg-primary text-accent'
							: 'text-white/80'}"
						onclick={() => selectSortOption(sortOption)}
					>
						<span>{sortOption}</span>
						{#if sort === sortOption && sort !== 'Custom order'}
							{#if order === 'asc'}
								<ArrowUp size={18} />
							{:else}
								<ArrowDown size={18} />
							{/if}
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
