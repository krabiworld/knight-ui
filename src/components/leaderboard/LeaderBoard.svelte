<script>
	import {_} from 'svelte-i18n';
	import {usersStore} from '../../stores/writable.js';
	import {link} from 'svelte-spa-router';
	import {config} from '../../config.js';
	import {tippy} from 'svelte-tippy';
	import {api} from '../../js/api.js';

	const CONFIG_USERS_SORT = config.api.users.sort.rating;
	const CONFIG_USERS_LIMIT_COUNT_DEFAULT = config.api.users.limit.countLeaders;
	const NICK_MAX_LENGTH = 25;

	let loaded = true;

	api.users.get(CONFIG_USERS_LIMIT_COUNT_DEFAULT, CONFIG_USERS_SORT, true).then((res) => {
		// Todo add danger toast
		if (!res) loaded = false;
	});
</script>

<div class='has-background-white leader-board block box p-4' class:invisible={!loaded}>
	<div>
		<h4 class='title ch4 is-5'>{$_('leaders')}</h4>
	</div>
	{#if ($usersStore && !$usersStore?.['error'])}
		{#each $usersStore as user}
			<div class='user'>
				{#if (user.title)}
					<a use:tippy={{content: $_(user.title), arrow: true}} href={config.links.docsTitle}
						 class='has-background-info ctag'>{user.title}</a>
				{/if}
				<a href='/profile/{user.id}' use:link class='has-text-black'>
					{#if (user.name && user.name.length > NICK_MAX_LENGTH)}
						<span class='name'>{user.name.slice(0, NICK_MAX_LENGTH)}...</span>
					{:else}
						<span class='name'>{user.name}</span>
					{/if}
				</a>
			</div>
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

	.leader-board {
		overflow: hidden;
	}

	.leader-board a {
		width: 40%;
		overflow: hidden;
		word-wrap: normal;
		word-break: break-all;
		white-space: break-spaces;
	}

	.user {
		margin-bottom: 4px;
	}

	.user a {
		font-weight: 700;
	}

	.user a:hover {
		text-decoration: underline !important;
	}
</style>
