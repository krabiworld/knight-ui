<script>
	import {_} from 'svelte-i18n';
	import Cookies from 'js-cookie';

	let hidden = false, removed = false;

	function handleClick() {
		hidden = true;
		Cookies.set('cookie_notification_hidden', true, {
			secure: true
		});

		setTimeout(remove, 200);

		function remove() {
			removed = true;
		}
	}
</script>

<div class='notification m-6 is-warning box' class:hidden={hidden} class:removed={removed}>
	<button class='delete' on:click={handleClick}></button>
	{$_('cookieWarn')}
</div>

<style>
	.notification {
		position: fixed;
		z-index: 100;
		bottom: 0;
		left: 0;
		transition: 0.2s ease;
	}

	.hidden {
		opacity: 0;
	}

	.removed {
		display: none;
	}
</style>
