import {writable} from 'svelte/store';
import {config} from '../config.js';

export const userStore = writable(null);
export const usersStore = writable(null);
export const usersByIdStore = writable({});
export const postStore = writable(null);
export const postsStore = writable(null);
export const postEdited = writable('-1');
export const postsEdited = writable({});
export const postsSort = writable(config.api.posts.sort.created);
export const loginErrorStore = writable(false);
