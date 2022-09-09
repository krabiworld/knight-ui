import {addMessages, getLocaleFromNavigator, init} from 'svelte-i18n';
import {en} from '../locales/en.js';

/*
 * Adding localization:
 * 1. Create a file in '../locales/' for example '../locales/en.json';
 * 2. Add the translation to the variable and export it as import {en} from '.. /locales/en.js';
 * 3. Add localization to initI18n - addLocale('en', en);
 * 4. Add the case to the setDateFns function to localize the date;
 */

/**
 * @namespace i18n
 * @description - Stores different localization data.
 * @type {Object}
 */
const objectLocales = {};

/**
 * @function
 * @namespace i18n
 * @param {boolean} [dialects=false] - True = en-US, false = en.
 * @description - Custom i18n initialization method with ready localizations.
 * @return {boolean}
 */
export function initI18n(dialects) {
	let defaultLocale = 'en';

	addLocale(defaultLocale, en);

	try {
		let navLocale = getLocaleFromNavigator();

		if (navLocale) {
			if (!dialects) navLocale = navLocale.slice(0, 2);

			objectLocales.dialects = !!dialects;
			objectLocales.navigator = navLocale;
			objectLocales.default = defaultLocale;

			init({
				fallbackLocale: defaultLocale,
				initialLocale: navLocale
			});

			setDateFns(navLocale);

			return true;
		}
	} catch (e) {
		console.error(`[i18n] ${e}`);
	}

	/**
	 * @function
	 * @private
	 * @namespace i18n
	 * @description - The method adds localization to i18n and the object.
	 * @param locale
	 */
	function setDateFns(locale) {
		switch (locale) {
			default:
				import('date-fns/locale/en-US').then((module) => {
					objectLocales.dateFns = module.default;
				}).catch((e) => {
					console.error(e);
				});
				break;
		}
	}

	/**
	 * @function
	 * @private
	 * @namespace i18n
	 * @description - The method adds localization to i18n and the object.
	 * @returns {boolean}
	 * @param {string} name - For example "en".
	 * @param {ImportAssertions|Object} locale - For example { hello: "world" }.
	 */
	function addLocale(name, locale) {
		if (!name && typeof name !== 'string') return false;
		if (!locale && typeof locale !== 'object') return false;

		try {
			addMessages(name, locale);
			objectLocales[name] = locale;
			return true;
		} catch (e) {
			console.error(`[i18n] ${e}`);
			return false;
		}
	}

	return false;
}

/**
 * @function
 * @namespace i18n
 * @description - The method returns the object of imported localizations.
 * @returns {Object}
 */
export function getObjectLocales() {
	return objectLocales;
}
