<script>
	import Cookie from './components/Cookie.svelte';
	import Cookies from 'js-cookie';
	import Tabs from './components/Tabs.svelte';

	import Home from './components/tabs/Home.svelte';
	import News from './components/tabs/News.svelte';
	import Router from 'svelte-spa-router';
	import Learn from './components/tabs/Learn.svelte';
	import Profile from './components/tabs/Profile.svelte';
	import Blogs from './components/tabs/Blogs.svelte';
	import Toast from './components/toast/Toast.svelte';
	import StrangerProfile from './components/tabs/StrangerProfile.svelte';
	import AboutUs from './components/tabs/AboutUs.svelte';
	import Contact from './components/tabs/Contact.svelte';
	import FAQ from './components/tabs/FAQ.svelte';
	import Donate from './components/tabs/Donate.svelte';
	import Post from './components/tabs/Post.svelte';
	import Copyright from './components/footer/Copyright.svelte';

	let routes = {
		'/': Home,
		'/news': News,
		'/learn': Learn,
		'/blogs': Blogs,
		'/profile': Profile,
		'/profile/:id': StrangerProfile,
		'/post/:id': Post,
		'/about_us': AboutUs,
		'/contact': Contact,
		'/faq': FAQ,
		'/donate': Donate,
		'*': Home
	};
</script>

{#if !Cookies.get('cookie_notification_hidden')}
	<Cookie/>
{/if}

<Toast/>
<Tabs/>
<Router {routes}/>
<Copyright/>
