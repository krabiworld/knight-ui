<script>
	import SubmitPost from '../posts/SubmitPost.svelte';
	import LeaderBoard from '../leaderboard/LeaderBoard.svelte';
	import Footer from '../footer/Footer.svelte';
	import PostsViewer from '../posts/PostsViewer.svelte';
	import References from '../references/References.svelte';
	import {_} from 'svelte-i18n';
	import {userStore} from '../../stores/writable.js';
	import PostsViewerHeader from '../posts/PostsViewerHeader.svelte';
</script>

<div class='columns rpx-7 is-desktop'>
	<!-- First (Start, Left) Column -->
	<div class='column is-one-fifth'>
		<LeaderBoard/>
		<Footer/>
	</div>

	<!-- Second (End, Right) Column -->
	<div class='column block'>
		<PostsViewerHeader/>
		<div class='block'></div>

		<!-- The ability to send a post if the user is registered. -->
		{#if ($userStore && !$userStore?.['error'])}
			<SubmitPost/>
		{:else}
			<div class='notification is-link is-light'>
				{$_('loginWarn')}
			</div>
		{/if}

		<PostsViewer/>
		<References/>
	</div>
</div>
