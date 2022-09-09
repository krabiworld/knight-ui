import {usersByIdStore} from '../../../stores/writable.js';
import {get} from 'svelte/store';

export default function (id) {
	return `<a class='cmention' href='#/profile/${id}'>${get(usersByIdStore)?.[id]?.['name']}</a>`;
};
