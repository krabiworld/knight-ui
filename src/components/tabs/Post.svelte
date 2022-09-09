<script>
	import {location} from 'svelte-spa-router';
	import {api} from '../../js/api.js';
	import {get} from 'svelte/store';
	import _ from 'lodash';
	import {postStore, usersByIdStore} from '../../stores/writable.js';
	import Post from '../posts/Post.svelte';

	postStore.set(null);

	const id = _.last(get(location).split('/'));

	let loaded = true;

	if (id) {
		api.posts.getByID(id).then((res) => {
			if (!res) {
				// Todo add danger toast
				loaded = false;
			}
		});
	}

	function setCacheUserById(id) {
		api.users.getByID(id);
		return '';
	}
</script>

<div class='columns rpx-7 is-desktop'>
	<div class='column' class:invisible={!loaded}>
		{#if ($postStore && !$postStore?.['error'])}
			{#if $postStore?.['content'] && $postStore?.['author']}
				{setCacheUserById($postStore?.['author'])}

				{#if ($usersByIdStore && !$usersByIdStore?.['error'])}
					<Post name={$usersByIdStore[$postStore?.['author']]?.name}
								id={$postStore?.['id']}
								userId={$postStore?.['author']}
								content={$postStore?.['content']}
								time={$postStore?.['created']}
								timeEdited={$postStore?.['edited']}
								avatar={$usersByIdStore[$postStore?.['author']]?.['avatar']}
								index={0}
								title={$usersByIdStore[$postStore?.['author']]?.['title']}
								role={$usersByIdStore[$postStore?.['author']]?.['role']}
								full={true}
					/>
				{/if}
			{/if}
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
</div>

<style>
	.invisible {
		display: none;
	}
</style>
