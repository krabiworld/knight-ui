<script>
	import {_} from 'svelte-i18n';
	import {link} from 'svelte-spa-router';
	import {config} from '../../config.js';
</script>

<div class='has-background-white block box p-4 footer'>
	<div>
		<h4 class='title ch4 is-5'>{$_('references')}</h4>
	</div>
	<div class='columns is-desktop'>
		<div class='column'>
			<a class='has-text-black p-2' href='/about_us' use:link>
				{$_('aboutUs')}
			</a>
			<a class='has-text-black p-2' href='/contact' use:link>
				{$_('contact')}
			</a>
			<a class='has-text-black p-2' href='/faq' use:link>
				{$_('faq')}
			</a>
			<a class='has-text-black p-2' href='/donate' use:link>
				{$_('donate')}
			</a>
		</div>
	</div>
	<div class='columns is-desktop media-references'>
		<div class='column'>
			<a class='has-text-black p-2' href={config.links.discord} target='_blank'>
				{$_('discord')}
			</a>
			<a class='has-text-black p-2' href={config.links.twitter} target='_blank'>
				{$_('twitter')}
			</a>
			<a class='has-text-black p-2' href={config.links.docs} target='_blank'>
				{$_('docs')}
			</a>
		</div>
	</div>
</div>

<style>
	.media-references {
		opacity: 0.7;
	}

	.footer a:hover {
		text-decoration: underline !important;
	}
</style>
