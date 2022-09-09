<script>
	import {api} from '../../js/api.js';
	import {config} from '../../config.js';
	import {postEdited, postsSort, postsStore, usersByIdStore} from '../../stores/writable.js';
	import ClipboardJS from 'clipboard';
	import Post from './Post.svelte';
	import {onDestroy} from 'svelte';

	const CONFIG_POSTS_LIMIT_COUNT_DEFAULT = config.api.posts.limit.countDefault;
	const CONFIG_POSTS_LIMIT_NEXT = config.api.posts.limit.next;
	const CONFIG_POSTS_SORT = $postsSort;

	new ClipboardJS('.copy');

	let loaded = true;

	api.posts.get(CONFIG_POSTS_LIMIT_COUNT_DEFAULT, CONFIG_POSTS_SORT, true).then((res) => {
		if (!res) loaded = false;
	});

	function setCacheUserById(id) {
		api.users.getByID(id);
		return '';
	}

	function next() {
		api.posts.get(CONFIG_POSTS_LIMIT_COUNT_DEFAULT, CONFIG_POSTS_SORT, true, $postsStore.length.toString(), true);
	}

	/* Resetting editing a post. */
	onDestroy(() => {
		postEdited.set('-1');
	});
</script>

<div class='block' class:invisible={!loaded}>
	{#if ($postsStore && !$postsStore?.['error'])}
		{#each $postsStore as post, i}
			{#if post.content && post?.['author'] && $usersByIdStore}
				{setCacheUserById(post?.['author'])}

				<Post on:next={next} name={$usersByIdStore[post?.['author']]?.name}
							id={post?.['id']}
							userId={post?.['author']}
							content={post?.['content']}
							time={post?.['created']}
							timeEdited={post?.['edited']}
							avatar={$usersByIdStore[post?.['author']]?.['avatar']}
							index={i}
							title={$usersByIdStore[post?.['author']]?.['title']}
							role={$usersByIdStore[post?.['author']]?.['role']}
							full={false}
							next={i === ($postsStore.length - CONFIG_POSTS_LIMIT_NEXT) && $postsStore.length >= CONFIG_POSTS_LIMIT_COUNT_DEFAULT}
				/>
			{/if}
		{/each}
	{:else}
		<div class='isc-custom'>
			<span class='icon is-medium'>
				<span class='fa-stack fa-sm'>
					<i class='fas fa-spinner fa-pulse'></i>
				</span>
			</span>
		</div>
	{/if}
</div>

<style>
	.invisible {
		display: none;
	}
</style>
