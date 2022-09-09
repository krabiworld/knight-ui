<script>
	import Login from './Login.svelte';
	import Burger from './Burger.svelte';
	import {_} from 'svelte-i18n';
	import {link} from 'svelte-spa-router';
</script>

<nav aria-label='main navigation' class='navbar rpx-4 block box'>
	<div class='navbar-brand'>
		<a class='navbar-item' href='/' use:link>
			<img alt='favicon' src='/favicon.png' style='width: 100%; height: 100%'>
		</a>

		<Burger/>
	</div>

	<div class='navbar-menu' id='navbarBasicExample'>
		<div class='navbar-start'>
			<a class='navbar-item' href='/news' use:link>{$_('news')}</a>
			<a class='navbar-item' href='/learn' use:link>{$_('learn')}</a>
			<a class='navbar-item' href='/blogs' use:link>{$_('blogs')}</a>
		</div>

		<div class='navbar-end'>
			<Login/>
		</div>
	</div>
</nav>

<style>
	nav {
		height: 7vh;
		position: sticky;
		top: 0;
		z-index: 101;
	}
</style>
