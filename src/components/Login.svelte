<script>
	import {_} from 'svelte-i18n';
	import {getEnv} from '../js/vite.js';
	import {api} from '../js/api.js';
	import {loginErrorStore, userStore} from '../stores/writable.js';
	import {config} from '../config.js';
	import linkity from 'linkity';
	import Cookies from 'js-cookie';
	import {notifications} from '../js/notifications.js';
	import {link} from 'svelte-spa-router';

	const homePage = '#';
	const authVar = 'DISCORD_OAUTH_LINK';
	let loading = true;
	let logout = false;
	let notifTime = 16000;
	let notifDefaultTime = 2000;

	/* Checks the address for code, needed for svelte html */
	let queryValue = linkity.url.getParam('', config.api.auth.param);

	/* Redirect */
	let hrefLogin = (!queryValue) ? getEnv(authVar) : homePage;
	if (!hrefLogin) hrefLogin = homePage;

	const origin = linkity.url.getOrigin();

	/*
	 * The request occurs only after the discord is redirected to authorization.
	 * So, there is a request, authorize the user.
	 */
	if (queryValue) {
		/* Authorizes user */
		api.auth.post(queryValue).then((authObject) => {
			api.auth.implement(authObject).then((response) => {
				if (response) {
					api.users.current.get().then(() => {
						loading = false;
						if (origin) linkity.url.redirect(origin, true);
					});
				} else {
					loginErrorStore.set(true);
					notifications.danger(config.console.string.failedToLogIn, notifTime);
					console.error(config.console.string.failedToLogIn);
				}
			});
		});
	} else if (api.auth.isExpired()) {
		/* Updating the authentication object (Updating the discord access token) */
		api.auth.refresh().then((authObject) => {
			api.auth.implement(authObject).then((response) => {
				if (response) {
					api.users.current.get().then(() => loading = false);
				} else {
					loginErrorStore.set(true);
					notifications.danger(config.console.string.failedToLogIn, notifTime);
					console.error(config.console.string.failedToLogIn);
				}
			});
		});
	} else {
		/* Caching the authentication object if everything is ok */
		api.auth.setCache();
		api.users.current.get().then(() => loading = false);
	}

	function handleLogOut() {
		logout = true;

		api.auth.revoke().then(() => {
			Cookies.remove('api_auth_object');
			notifications.success($_('loggedoutSusses'), notifDefaultTime);

			function reload() {
				document.location.reload();
			}

			setTimeout(reload, notifDefaultTime);
		});
	}
</script>

{#if $userStore?.name}
	<div class='navbar-item has-dropdown is-hoverable'>
		<a use:link href='/profile' class='navbar-link'>
			<figure class='navbar-item image is-32x32 pl-0 pr-1'>
				<img loading='lazy' class='crounded' src={$userStore?.['avatar']} alt='Avatar'>
			</figure>
			{$userStore?.name}
		</a>

		<div class='navbar-dropdown'>
			<a use:link href='/profile' class='navbar-item'>
				{$_('profile')}
			</a>
			<hr class='navbar-divider'>

			<span class:invisible={!logout} class='navbar-item'>
                <span class='icon is-medium'>
                    <span class='fa-stack fa-sm'>
                        <i class='fas fa-spinner fa-pulse'></i>
                    </span>
                </span>
            </span>

			<a href='#log-out' class:invisible={logout} on:click={handleLogOut} class='navbar-item has-text-danger'>
				{$_('logOut')}
			</a>
		</div>
	</div>
{:else}
	{#if loading && !$loginErrorStore}
        <span class='navbar-item'>
            <span class='icon is-medium'>
                <span class='fa-stack fa-sm'>
                    <i class='fas fa-spinner fa-pulse'></i>
                </span>
            </span>
        </span>

	{:else if (!$loginErrorStore)}
		<a href={hrefLogin} class='navbar-item'>
			{$_('logIn')}
		</a>

	{:else}
        <span class='navbar-item'>
            <span class='icon is-medium'>
                <span class='fa-stack fa-sm'>
                <i class='fa-solid fa-exclamation has-text-danger'></i>
                </span>
            </span>
        </span>
	{/if}
{/if}

<style>
	.invisible {
		display: none;
	}
</style>
