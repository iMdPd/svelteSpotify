<script lang="ts">
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';

	export let paginatedList: SpotifyApi.PagingObject<any>;
	export let isLoading: boolean;

	$: currentPage = $page.url.searchParams.get('page') || 1;

	const dispatch = createEventDispatcher<{
		loadmore: {};
	}>();
</script>

{#if paginatedList.next}
	<div class="load-more">
		<Button
			element="button"
			variant="outline"
			disabled={isLoading}
			on:click={() => dispatch('loadmore')}
		>
			Load More
			<span class="visually-hidden">Items</span>
		</Button>
	</div>
{/if}

<div class="pagination">
	<div class="previous">
		{#if paginatedList.previous}
			<Button
				variant="outline"
				element="a"
				href="{$page.url.pathname}?{new URLSearchParams({
					page: `${Number(currentPage) - 1}`
				}).toString()}"
				>← Previous Page
			</Button>
		{/if}
	</div>
	<div class="next">
		{#if paginatedList.next}
			<Button
				variant="outline"
				element="a"
				href="{$page.url.pathname}?{new URLSearchParams({
					page: `${Number(currentPage) + 1}`
				}).toString()}">Next Page →</Button
			>
		{/if}
	</div>
</div>

<style lang="scss">
	.pagination {
		display: none;
		justify-content: space-between;

		:global(html.no-js) & {
			display: flex;
		}
	}

	.load-more {
		padding: 15px;
		text-align: center;

		:global(html.no-js) & {
			display: none;
		}
	}
</style>
