<script>
	import {flip} from 'svelte/animate';
	import {fly} from 'svelte/transition';
	import {notifications} from '../../js/notifications.js';
	import {_} from 'svelte-i18n';
	import {config} from '../../config.js';

	export let themes = {
		danger: 'notification is-danger',
		success: 'notification is-success',
		warning: 'notification is-warning',
		info: 'notification is-info',
		default: 'notification'
	};
</script>

<div class='notifications'>
	{#each $notifications as notification (notification.id)}
		<div animate:flip class='toast' transition:fly={{ y: 30 }}>
			<div class='content p-3 box {themes[notification.type]}'>
				{notification.message}<br>

				{#if notification.type === 'danger'}
					<a target='_blank' href={config.links.discord}>{$_('supportServer')}</a>
				{/if}
			</div>
			{#if notification.icon}<i class={notification.icon}></i>{/if}
		</div>
	{/each}
</div>

<style>
	.notifications {
		position: fixed;
		top: 10px;
		left: 0;
		right: 0;
		margin: 0 auto;
		padding: 0;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

	.toast {
		flex: 0 0 auto;
		margin-bottom: 10px;
	}
</style>
