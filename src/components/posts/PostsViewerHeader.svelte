<script>
	import {_} from 'svelte-i18n';
	import {postsSort, postsStore} from '../../stores/writable.js';
	import {api} from '../../js/api.js';
	import {config} from '../../config.js';

	const CONFIG_POSTS_LIMIT_COUNT_DEFAULT = config.api.posts.limit.countDefault;

	function setSort({target}) {
		const newSort = target.getAttribute('data-sort');
		postsSort.set(newSort);
		postsStore.set(null);
		api.posts.get(CONFIG_POSTS_LIMIT_COUNT_DEFAULT, newSort, true);
	}
</script>

<section>
	<div class='block box p-4 line'>
		<div>
			<h4 class='title ch4 is-5'>{$_('posts')}</h4>
		</div>
		<div class="buttons line">
			<button class:is-info={$postsSort === config.api.posts.sort.created} data-sort={config.api.posts.sort.created} on:click={setSort} class="button is-light is-small">{$_('new').toUpperCase()}</button>
			<button class:is-info={$postsSort === config.api.posts.sort.likes} data-sort={config.api.posts.sort.likes} on:click={setSort} class="button is-light is-small">{$_('popular').toUpperCase()}</button>
		</div>
	</div>
</section>

<style>
	section {
		position: sticky;
		top: 7.5vh;
		z-index: 100;
	}
</style>
