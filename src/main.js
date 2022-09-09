import App from './App.svelte';
import {initI18n} from './js/i18n.js';
import {config} from './config.js';

initI18n(true);
console.log(config.console.string.i18nInitialized);

const app = new App({
	target: document.getElementById('app')
});

export default app;
