<script>
	import {_} from 'svelte-i18n';
</script>

<footer class='footer'>
	<div class='content has-text-centered'>
		<p>
			{$_('allRightsReserved')} &#169; {new Date().getFullYear()} "<a
			href={window.location.origin}>{window.location.host}</a>"
		</p>
	</div>
</footer>
