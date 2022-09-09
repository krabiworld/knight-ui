<script>
	import {_} from 'svelte-i18n';
	import Lichess from '../../assets/svg/Lichess.svelte';
	import Chess24 from '../../assets/svg/Chess24.svelte';
	import Chesscom from '../../assets/svg/Chesscom.svelte';
	import {config} from '../../config.js';
</script>

<div class='has-background-white is-half isc-custom box p-4'>
	<h4 class='title ch4 is-4'>{$_('playChessOnline')}</h4>
	<div class='play-chess-online'>
		<div class='columns is-desktop rpx-7'>
			<div class='column'>
				<a href={config.links.lichess} target='_blank'>
					<Lichess/>
				</a>
			</div>
			<div class='column'>
				<a href={config.links.chess24} target='_blank'>
					<Chess24/>
				</a>
			</div>
			<div class='column'>
				<a href={config.links.chesscom} target='_blank'>
					<Chesscom/>
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	.play-chess-online :global(svg) {
		width: auto;
		height: 4vw;
		min-height: 40px;
	}

	.play-chess-online a {
		transition: 0.2s ease;
	}
</style>
