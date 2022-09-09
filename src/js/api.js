import {config} from '../config.js';
import Cookies from 'js-cookie';
import {postsStore, postStore, usersByIdStore, usersStore, userStore} from '../stores/writable.js';
import linkity from 'linkity';

const CONFIG_API = config.api.address;
const CONFIG_AUTH_PATH = config.api.auth.path, CONFIG_AUTH_PARAM = config.api.auth.param;
const CONFIG_AUTH_REFRESH_PATH = config.api.auth.refresh.path,
	CONFIG_AUTH_REFRESH_PARAM = config.api.auth.refresh.param;
const CONFIG_AUTH_REVOKE_PATH = config.api.auth.revoke.path, CONFIG_AUTH_REVOKE_PARAM = config.api.auth.revoke.param;
const CONFIG_CURRENT_USER_PATH = config.api.users.current.path;
const CONFIG_USERS_PATH = config.api.users.path, CONFIG_USERS_LIMIT_PARAM = config.api.users.limit.param,
	CONFIG_USERS_SORT_PARAM = config.api.users.sort.param;
const CONFIG_POSTS_PATH = config.api.posts.path, CONFIG_POSTS_LIMIT_PARAM = config.api.posts.limit.param,
	CONFIG_POSTS_SORT_PARAM = config.api.posts.sort.param,
	CONFIG_POSTS_REVERSE_PARAM = config.api.posts.reverse.param;
const CONFIG_POST_CREATE_PATH = config.api.posts.create.path;
const CONFIG_POST_EDIT_PATH_START = config.api.posts.edit.pathStart,
	CONFIG_POST_EDIT_PATH_END = config.api.posts.edit.pathEnd;
const CONFIG_POST_DELETE_PATH_START = config.api.posts.delete.pathStart,
	CONFIG_POST_DELETE_PATH_END = config.api.posts.delete.pathEnd;
const CONFIG_GET_BY_ID_PATH_START = config.api.posts.getById.pathStart;

/**
 * @namespace api
 * @description - Contains methods for easy interaction with the Knight API.
 * @type {Object}
 */
export const api = {};

/**
 * @namespace api.auth
 * @description - Contains methods for interacting with the auth request.
 * @type {Object}
 */
api.auth = {};

/**
 * @namespace api.auth.object
 * @description - Contains authentication data.
 * @type {Object|null}
 */
api.auth.object = null;

/**
 * @function
 * @namespace api.auth.post
 * @description - The method authorizes the user in the system, the address of the site must have the parameter!
 * @param {string} code - Code from query in site address.
 * @returns {Promise<boolean|Object>} - Boolean = success.
 */
api.auth.post = async function (code) {
	if (!code && typeof code !== 'string') return false;

	const formData = new FormData();
	formData.append(CONFIG_AUTH_PARAM, code);

	try {
		const response = await fetch(`${CONFIG_API}${CONFIG_AUTH_PATH}`, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams(formData),
			method: 'POST'
		});

		return await response.json();
	} catch (e) {
		console.error(e);
	}

	return false;
};

/**
 * @function
 * @namespace api.auth.refresh
 * @description - The method updates the authentication.
 * @return {Promise<boolean|Object>} - Boolean = success.
 */
api.auth.refresh = async function () {
	const jsonString = Cookies.get('api_auth_object');

	if (!jsonString) return false;

	let token = null;
	try {
		token = JSON.parse(jsonString)?.['refresh_token'];
	} catch (e) {
		console.error(e);
		return false;
	}

	try {
		if (!token) return false;
		const formData = new FormData();
		formData.append(CONFIG_AUTH_REFRESH_PARAM, token);

		const response = await fetch(`${CONFIG_API}${CONFIG_AUTH_REFRESH_PATH}`, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams(formData),
			method: 'POST'
		});

		return await response.json();
	} catch (e) {
		console.error(e);
	}

	return false;
};

/**
 * @function
 * @namespace api.auth.implement
 * @description - The method implements the authentication object and completes the user authorization (figuratively).
 * @param {Object} objectResponse - Authentication object (api.auth.post result is recommended).
 * @return {Promise<boolean>} - Boolean = success.
 */
api.auth.implement = async function (objectResponse) {
	if (!objectResponse && typeof objectResponse !== 'object') return false;

	if (!api.auth.setCache(objectResponse) || !api.auth.object) return false;

	/* Checking the type for validity */
	if (api.auth.object?.['token_type'] !== config.api.tokens.types.bearer) {
		console.error(config.console.string.invalidTokenType);
		return false;
	}

	/* Checking the expiration date for validity */
	if (!api.auth.object.expires_in) {
		console.error(config.console.string.invalidExpiryDate);
		return false;
	}

	/* Prepares the expiration date in advance */
	const inWeek = new Date();
	inWeek.setSeconds(new Date().getSeconds() + api.auth.object.expires_in /* -> 604800 */);
	api.auth.object.expires_in = inWeek.getTime();

	try {
		Cookies.set('api_auth_object', JSON.stringify(api.auth.object), {
			secure: true
		});
		return true;
	} catch (e) {
		console.error(e);
	}

	return false;
};

/**
 * @function
 * @namespace api.auth.setCache
 * @description - The method caches the authentication object.
 * @param {Object} [object=Cookies.get('api_auth_object')] - Optional argument that accepts the authentication object.
 * @return {boolean} - Boolean = success.
 */
api.auth.setCache = function (object) {
	if (object) {
		return objectExists();
	} else {
		return objectNotExists();
	}

	/**
	 * @function
	 * @private
	 * @description - The method overwrites the object for the cache with the object passed to the method, if there is
	 *     one.
	 * @return {boolean} - Boolean = success.
	 */
	function objectExists() {
		if (typeof object === 'object') {
			api.auth.object = object;
			return true;
		}

		return false;
	}

	/**
	 * @function
	 * @private
	 * @description - The method overwrites the object for the cache with the object from the cookies.
	 * @return {boolean} - Boolean = success.
	 */
	function objectNotExists() {
		const jsonString = Cookies.get('api_auth_object');

		if (!jsonString) return false;

		try {
			api.auth.object = JSON.parse(jsonString);
			return true;
		} catch (e) {
			console.error(e);
		}

		return false;
	}
};

/**
 * @function
 * @namespace api.auth.revoke
 * @description - The method revokes the authorization.
 */
api.auth.revoke = async function () {
	const jsonString = Cookies.get('api_auth_object');

	if (!jsonString) return false;

	let token = null;
	try {
		token = JSON.parse(jsonString)?.['access_token'];
	} catch (e) {
		console.error(e);
		return false;
	}

	const formData = new FormData();
	formData.append(CONFIG_AUTH_REVOKE_PARAM, token);

	try {
		const response = await fetch(`${CONFIG_API}${CONFIG_AUTH_REVOKE_PATH}`, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams(formData),
			method: 'POST'
		});

		return await response.json();
	} catch (e) {
		console.error(e);
	}
};

/**
 * @function
 * @namespace api.auth.isExpired
 * @description - The method returns the status of the authorization period, whether it has expired.
 * @return {boolean} - Boolean = success.
 */
api.auth.isExpired = function () {
	const jsonString = Cookies.get('api_auth_object');

	if (!jsonString) return false;

	let json = null;
	try {
		json = JSON.parse(jsonString);
	} catch (e) {
		console.error(e);
	}

	if (!json?.expires_in) return false;

	return json?.expires_in < new Date().getTime();
};

/**
 * @namespace api.users
 * @description - Contains methods for interacting with users.
 * @type {Object}
 */
api.users = {};

/**
 * @namespace api.users.current
 * @description - Contains methods for interacting with the current user.
 * @type {Object}
 */
api.users.current = {};

/**
 * @namespace api.users.current.object
 * @description - Contains current user object.
 * @type {Object}
 */
api.users.current.object = {};

/**
 * @function
 * @namespace api.users.current.get
 * @description - The method caches current user in the object, returns the result of success!
 * @type {Object}
 */
api.users.current.get = async function () {
	if (!api.auth.object && api.auth.object?.['access_token']) return undefined;

	try {
		const response = await (await fetch(`${CONFIG_API}${CONFIG_CURRENT_USER_PATH}`, {
			headers: {
				Authorization: `Bearer ${api.auth.object?.['access_token']}`,
				Accept: 'application/json'
			}
		})).json();

		userStore.set(response);

		/* If you can't access the store */
		api.users.current.object = response;
		return response;
	} catch (e) {
		console.error(e);
		return undefined;
	}
};

/**
 * @namespace api.users.object
 * @description - The object stores users.
 * @type {Object}
 */
api.users.object = {};

/**
 * @function
 * @namespace api.users.get
 * @description - The method returns users.
 * @param limit
 * @param [sort]
 * @param [reverse]
 * @return {Promise<undefined|any>}
 */
api.users.get = async function (limit, sort, reverse) {
	if (!limit || typeof limit !== 'number') return undefined;
	if (sort && typeof sort !== 'string') return undefined;
	if (reverse && typeof reverse !== 'boolean') return undefined;

	try {
		const tempLimit = linkity.url.createParam(CONFIG_USERS_LIMIT_PARAM, limit.toString(), true, true);
		let tempSort = '';

		if (sort) tempSort = linkity.url.createParam(CONFIG_USERS_SORT_PARAM, sort, false);

		let response = await (await fetch(`${CONFIG_API}${CONFIG_USERS_PATH}${tempLimit}${tempSort}`, {
			headers: {
				Accept: 'application/json'
			}
		})).json();

		response = Object.values(response);

		if (reverse) response = response.reverse();

		usersStore.set(response);

		/* If you can't access the store */
		api.users.object = response;
		return response;
	} catch (e) {
		console.error(e);
		return undefined;
	}
};

/**
 * @function
 * @namespace api.users.getByID
 * @description - The method return user by id.
 * @param value - User id.
 * @return {Promise<any|undefined>}
 */
api.users.getByID = async function (value) {
	if (!value || typeof value !== 'string') return undefined;

	try {
		const response = await (await fetch(`${CONFIG_API}${CONFIG_USERS_PATH}${linkity.url.symbols.sep}${value}`, {
			headers: {
				Accept: 'application/json'
			}
		})).json();

		if (response === 'User not found') return undefined;

		usersByIdStore.update((store) => {
			store[value] = response;
			return store;
		});

		return response;
	} catch (e) {
		console.error(e);
		return undefined;
	}
};

/**
 * @namespace api.posts
 * @description - Contains methods for interacting with posts.
 * @type {Object}
 */
api.posts = {};

/**
 * @namespace api.posts.object
 * @description - The object stores posts.
 * @type {Object}
 */
api.posts.object = null;

/**
 * @function
 * @namespace api.users.get
 * @description - The method returns posts.
 * @param limit
 * @param [sort]
 * @param [reverse]
 * @param [before]
 * @return {Promise<undefined|any>}
 */
api.posts.get = async function (limit, sort, reverse, before) {
	if (!limit || typeof limit !== 'number') return undefined;
	if (sort && typeof sort !== 'string') return undefined;
	if (reverse && typeof reverse !== 'boolean') return undefined;
	if (before && typeof before !== 'string') return undefined;

	try {
		const tempLimit = linkity.url.createParam(CONFIG_POSTS_LIMIT_PARAM, limit.toString(), true, true);
		let tempSort = '';
		let tempReverse = '';
		let tempBefore = '';

		if (sort) tempSort = linkity.url.createParam(CONFIG_POSTS_SORT_PARAM, sort, false, true);
		if (reverse) tempReverse = linkity.url.createParam(CONFIG_POSTS_REVERSE_PARAM, reverse.toString(), false, true);
		if (before) tempBefore = linkity.url.createParam('before', before, false);

		let response = await (await fetch(`${CONFIG_API}${CONFIG_POSTS_PATH}${tempLimit}${tempSort}${tempReverse}${tempBefore}`, {
			headers: {
				Accept: 'application/json'
			}
		})).json();

		if (response?.statusCode === 500) return undefined;

		postsStore.update((value) => {
			if (value) {
				return value.concat(response);
			} else {
				return response;
			}
		});

		/* If you can't access the store */
		api.posts.object = response;
		return response;
	} catch (e) {
		console.error(e);
		return undefined;
	}
};

/**
 * @function
 * @namespace api.posts.create
 * @param content
 * @return {Promise<Response|boolean>}
 */
api.posts.create = async function (content) {
	if (!content && typeof content !== 'string') return false;

	const jsonString = Cookies.get('api_auth_object');

	if (!jsonString) return false;

	let token = null;
	try {
		token = JSON.parse(jsonString)?.['access_token'];
	} catch (e) {
		console.error(e);
		return false;
	}

	try {
		const response = await fetch(`${CONFIG_API}${CONFIG_POST_CREATE_PATH}`, {
			headers: {
				'Content-Type': 'text/plain',
				'Authorization': `Bearer ${token}`
			},
			body: content,
			method: 'PUT'
		});

		return await response;
	} catch (e) {
		console.error(e);
	}
};

/**
 * @function
 * @namespace api.posts.edit
 * @param id
 * @param content
 * @return {Promise<Response|boolean>}
 */
api.posts.edit = async function (id, content) {
	if (!id && typeof id !== 'string') return false;
	if (!content && typeof content !== 'string') return false;

	const jsonString = Cookies.get('api_auth_object');

	if (!jsonString) return false;

	let token = null;
	try {
		token = JSON.parse(jsonString)?.['access_token'];
	} catch (e) {
		console.error(e);
		return false;
	}

	try {
		const response = await fetch(`${CONFIG_API}${CONFIG_POST_EDIT_PATH_START}${id}${CONFIG_POST_EDIT_PATH_END}`, {
			headers: {
				'Content-Type': 'text/plain',
				'Authorization': `Bearer ${token}`
			},
			body: content,
			method: 'PUT'
		});

		return await response;
	} catch (e) {
		console.error(e);
	}
};

/**
 * @function
 * @namespace api.posts.delete
 * @param id
 * @return {Promise<Response|boolean>}
 */
api.posts.delete = async function (id) {
	if (!id && typeof id !== 'string') return false;

	const jsonString = Cookies.get('api_auth_object');

	if (!jsonString) return false;

	let token = null;
	try {
		token = JSON.parse(jsonString)?.['access_token'];
	} catch (e) {
		console.error(e);
		return false;
	}

	try {
		const response = await fetch(`${CONFIG_API}${CONFIG_POST_DELETE_PATH_START}${id}${CONFIG_POST_DELETE_PATH_END}`, {
			headers: {
				'Content-Type': 'text/plain',
				'Authorization': `Bearer ${token}`
			},
			method: 'DELETE'
		});

		return await response;
	} catch (e) {
		console.error(e);
	}
};

api.posts.getByID = async function (id) {
	if (!id || typeof id !== 'string') return undefined;

	try {
		let response = await (await fetch(`${CONFIG_API}${CONFIG_GET_BY_ID_PATH_START}${id}`, {
			headers: {
				Accept: 'application/json'
			}
		})).json();

		postStore.set(response);
		return response;
	} catch (e) {
		console.error(e);
		return undefined;
	}
};
