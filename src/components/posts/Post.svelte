<script>
	import {_} from 'svelte-i18n';
	import {format, formatRelative, subHours} from 'date-fns';
	import {getObjectLocales} from '../../js/i18n.js';
	import {stringity} from 'stringity';
	import {tippy} from 'svelte-tippy';
	import {config} from '../../config.js';
	import {link} from 'svelte-spa-router';
	import linkity from 'linkity';
	import {api} from '../../js/api.js';
	import {notifications} from '../../js/notifications.js';
	import {postEdited, postsEdited, userStore} from '../../stores/writable.js';
	import {get} from 'svelte/store';
	import capitalize from 'lodash/capitalize';
	import {createEventDispatcher, onDestroy} from 'svelte';

	export let id = undefined;
	export let name = undefined;
	export let userId = undefined;
	export let content = undefined;
	export let time = undefined;
	export let timeEdited = undefined;
	export let avatar = undefined;
	export let index = undefined;
	export let title = undefined;
	export let role = undefined;
	export let full = false;
	export let next = false;

	const TOOL_TIP_DELAY = 800;
	const NOTIFICATION_TIME = 2000;
	const POST_CONTENT_MAX_WORDS = 50;
	const POST_CONTENT_MAX_LENGTH = 1000;
	const POST_URL = linkity.url.getOrigin() + '/#/post/';
	let dispatch = createEventDispatcher();

	let sliced = false;
	let contentSliced = undefined;
	let contentBackup = undefined;
	let contentEdit = '';

	let deleted = false;
	let editing = false;

	$: editListener = $postEdited && checkIndexEdit();
	$: loadListener = post && set();

	let post = undefined;

	function set() {
		if (next) {
			const Visible = function (target) {
				const targetPosition = {
						top: window.pageYOffset + target.getBoundingClientRect().top,
						left: window.pageXOffset + target.getBoundingClientRect().left,
						right: window.pageXOffset + target.getBoundingClientRect().right,
						bottom: window.pageYOffset + target.getBoundingClientRect().bottom
					},
					windowPosition = {
						top: window.pageYOffset,
						left: window.pageXOffset,
						right: window.pageXOffset + document.documentElement.clientWidth,
						bottom: window.pageYOffset + document.documentElement.clientHeight
					};

				if (targetPosition.bottom > windowPosition.top &&
					targetPosition.top < windowPosition.bottom &&
					targetPosition.right > windowPosition.left &&
					targetPosition.left < windowPosition.right) {

					if (dispatch) {
						dispatch('next', true);
						dispatch = null;
					}
				}
			};

			window.addEventListener('scroll', function () {
				Visible(post);
			});

			Visible(post);
		}

		return post;
	}

	onDestroy(() => {
		dispatch = null;
	});

	function checkIndexEdit() {
		if ($postEdited !== index.toString()) editing = false;
	}

	let showedFullContent = false;

	function getHoursFromData(date) {
		if (date <= 0 || typeof date !== 'number') return 0;

		const date1 = new Date(date), date2 = new Date();

		const differenceTime = date2.getTime() - date1.getTime();
		return differenceTime / (1000 * 3600);
	}

	let contentThis = content;

	async function initMarkup() {
		if (!contentThis) return '';

		const HASHTAGS_REGEX = config.markup.regex.hashtag;
		const BOLDS_REGEX = config.markup.regex.bold;
		const ITALICS_REGEX = config.markup.regex.italic;
		const CODES_REGEX = config.markup.regex.code;
		const STRIKES_REGEX = config.markup.regex.strike;
		const UNDERLINES_REGEX = config.markup.regex.underline;
		const QUOTES_REGEX = config.markup.regex.quote;
		const LINKS_REGEX = config.markup.regex.link;
		const MENTION_REGEX = config.markup.regex.mention;

		const LINKS_TEXT_MATCH = config.markup.match.link.text;
		const LINKS_HREF_MATCH = config.markup.match.link.href;
		const MENTION_MATCH = config.markup.match.mention;

		const BOLDS_TRASH = config.markup.bold;
		const ITALICS_TRASH = config.markup.italic;
		const CODES_TRASH = config.markup.code;
		const STRIKES_TRASH = config.markup.strike;
		const UNDERLINES_TRASH = config.markup.underline;
		const QUOTES_TRASH = config.markup.quote;
		const LINKS_TEXT_TRASH = config.markup.link.text;
		const LINKS_HREF_TRASH = config.markup.link.href;

		const MAX = config.markup.rule.maxTrys;

		await setQuotes();
		await setLinks();
		await setBolds();
		await setHashtags();
		await setItalics();
		await setUnderlines();
		await setStrikes();
		await setCodes();
		await setMentions();

		async function setHashtags() {
			const hashtags = contentThis.match(HASHTAGS_REGEX);
			if (!hashtags) return;

			for (let i = 0; i < hashtags.length && i < MAX; i++) {
				const tag = hashtags[i];
				contentThis = contentThis.replace(tag, (await import('./markup/hashtags.js')).default(tag));
			}

		}

		async function setBolds() {
			const bolds = contentThis.match(BOLDS_REGEX);
			if (!bolds) return;

			for (let i = 0; i < bolds.length && i < MAX; i++) {
				const bold = bolds[i];
				const text = bold.replaceAll(BOLDS_TRASH, '');
				contentThis = contentThis.replace(bold, (await import('./markup/bolds.js')).default(text));
			}
		}

		async function setItalics() {
			const italics = contentThis.match(ITALICS_REGEX);
			if (!italics) return;

			for (let i = 0; i < italics.length && i < MAX; i++) {
				const italic = italics[i];
				const text = italic.replaceAll(ITALICS_TRASH, '');
				contentThis = contentThis.replace(italic, (await import('./markup/italics.js')).default(text));
			}
		}

		async function setCodes() {
			const codes = contentThis.match(CODES_REGEX);
			if (!codes) return;

			for (let i = 0; i < codes.length && i < MAX; i++) {
				const code = codes[i];
				const text = code.replaceAll(CODES_TRASH, '');
				contentThis = contentThis.replace(code, (await import('./markup/codes.js')).default(text));
			}
		}

		async function setStrikes() {
			const strikes = contentThis.match(STRIKES_REGEX);
			if (!strikes) return;

			for (let i = 0; i < strikes.length && i < MAX; i++) {
				const strike = strikes[i];
				const text = strike.replaceAll(STRIKES_TRASH, '');
				contentThis = contentThis.replace(strike, (await import('./markup/strikes.js')).default(text));
			}
		}

		async function setUnderlines() {
			const underlines = contentThis.match(UNDERLINES_REGEX);
			if (!underlines) return;

			for (let i = 0; i < underlines.length && i < MAX; i++) {
				const underline = underlines[i];
				const text = underline.replaceAll(UNDERLINES_TRASH, '');
				contentThis = contentThis.replace(underline, (await import('./markup/underlines.js')).default(text));
			}
		}

		async function setQuotes() {
			const quotes = contentThis.match(QUOTES_REGEX);
			if (!quotes) return;

			for (let i = 0; i < quotes.length && i < MAX; i++) {
				const quote = quotes[i];
				const text = quote.replaceAll(QUOTES_TRASH, '');
				contentThis = contentThis.replace(quote, (await import('./markup/quotes.js')).default(text));
			}
		}

		async function setLinks() {
			const links = contentThis.match(LINKS_REGEX);
			if (!links) return;

			for (let i = 0; i < links.length && i < MAX; i++) {
				const link = links[i];

				let text = link.match(LINKS_TEXT_MATCH);
				if (!text) continue;
				text = text[0].replace(LINKS_TEXT_TRASH, '').replace(/.$/, '');

				let href = link.match(LINKS_HREF_MATCH);
				if (!href) continue;
				href = href[0].replace(LINKS_HREF_TRASH, '').replace(/.$/, '');

				contentThis = contentThis.replace(link, (await import('./markup/links.js')).default(text, href));
			}
		}

		async function setMentions() {
			const mentions = contentThis.match(MENTION_REGEX);
			if (!mentions) return;

			for (let i = 0; i < mentions.length && i < MAX; i++) {
				const mention = mentions[i];

				let id = mention.match(MENTION_MATCH)[0];
				if (!id) continue;

				api.users.getByID(id).then(async () => {
					contentThis = contentThis.replace(mention, (await import('./markup/mentions.js')).default(id));
				});
			}
		}
	}

	initMarkup();

	function sliceContent() {
		let visibleContent = stringity.toUnicode(contentThis);

		contentEdit = contentThis;
		contentBackup = contentThis;

		if (contentThis.length > POST_CONTENT_MAX_LENGTH) {
			if (stringity.is(contentThis) === 'words') {
				visibleContent = stringity.slice(contentThis, 'words', 0, POST_CONTENT_MAX_WORDS);
			} else {
				visibleContent = stringity.slice(contentThis, 'symbols', 0, POST_CONTENT_MAX_LENGTH);
			}

			contentSliced = visibleContent;

			sliced = true;
			contentThis = visibleContent;
		}
	}

	sliceContent();

	function showFullContent() {
		contentThis = contentBackup;
		showedFullContent = true;
	}

	if (full) showFullContent();

	function hideFullContent() {
		contentThis = contentSliced;
		showedFullContent = false;
	}

	function goEdit() {
		let savedEdit = get(postsEdited)?.[`id-${index}`];
		if (get(postsEdited)?.[`id-${index}`]) {
			contentEdit = savedEdit;
		}

		postEdited.set(index.toString());
		editing = true;
	}

	function saveContent() {
		postsEdited.update((obj) => {
			obj[`id-${index}`] = contentEdit;
			return obj;
		});
	}

	function saveEdit() {
		api.posts.edit(id, contentEdit).then((res) => {
			if (res.ok) {
				notifications.success($_('postSavedSuccessfully'), NOTIFICATION_TIME);
				contentThis = contentEdit;

				postsEdited.update((obj) => {
					obj[`id-${index}`] = contentEdit;
					return obj;
				});

				postEdited.set('-1');
				editing = false;
			} else {
				notifications.danger(`${$_('postSavedError')} (${res.status})`, NOTIFICATION_TIME);
			}
		});
	}

	function stopEdit() {
		let confirm;

		if (contentEdit !== contentThis) {
			confirm = window.confirm($_('eraseWrittenText'));
		} else {
			confirm = true;
		}

		if (confirm) {
			postsEdited.update((obj) => {
				obj[`id-${index}`] = contentThis;
				return obj;
			});

			postEdited.set('-1');
			editing = false;
		}
	}

	function deletePost() {
		const confirm = window.confirm($_('eraseWrittenText'));

		if (confirm) {
			api.posts.delete(id).then((res) => {
				if (res.ok) {
					notifications.success($_('postDeletedSuccessfully'), NOTIFICATION_TIME);
					deleted = true;
				} else {
					notifications.danger(`${$_('postDeletedError')} (${res.status})`, NOTIFICATION_TIME);
				}
			});
		}
	}

	function goAnchor() {
		const element = document.getElementById(`post-${index}`);
		if (element) {
			element.scrollIntoView(true);
		}
	}
</script>

<div bind:this={post} class='card block' class:invisible={deleted} id='post-{index}'>
	<div class='card-content'>
		<div class='media mb-3'>
			<!-- Avatar -->
			{#if (avatar)}
				<div class='media-left'>
					<figure class='image is-48x48'>
						<img loading='lazy' style='width: 100%; height: 100%' class='cround-5' src={avatar} alt='Avatar'>
					</figure>
				</div>
			{/if}

			<!--	Name, role, title, id-->
			<div class='media-content'>
				{#if (name)}
					<!-- Name -->
					<a href='/profile/{userId}' use:link class='title is-4 name'>{name}</a>

					<!-- Role -->
					{#if (role)}
						{#if (role === 'ADMIN')}
							<span use:tippy={{content: $_('userAdmin'), arrow: true, delay: TOOL_TIP_DELAY}}
										class='icon is-small  px-3'>
								<i class='fa-solid fa-screwdriver-wrench'></i>
							</span>
						{/if}
						{#if (role === 'MOD')}
							<span use:tippy={{content: $_('userMod'), arrow: true, delay: TOOL_TIP_DELAY}} class='icon is-small px-3'>
								<i class='fa-solid fa-user-shield'></i>
							</span>
						{/if}
					{/if}

					<!-- Title -->
					{#if (title)}
						<a use:tippy={{content: $_(title), arrow: true, delay: TOOL_TIP_DELAY}} href={config.links.docsTitle}
							 class='has-background-info ctag'>{title}</a>
					{/if}

				{:else}
					<strong class='title is-4'>{$_('undefinedAuthorPost').toUpperCase()}</strong>
					<span use:tippy={{content: $_('userUndefined'), arrow: true, delay: TOOL_TIP_DELAY}}
								class='title is-5 icon has-text-danger pl-1'>
						<i class='fas fa-exclamation-triangle'></i>
					</span>
				{/if}

				{#if (name)}
					<br>

					<!-- Id -->
					{#if (userId)}
						<p data-clipboard-text={userId}
							 use:tippy={{content: $_('linkUserIdCopied'),  trigger: 'click', arrow: true, placement: 'left'}}
							 class='is-clickable copy subtitle is-6'>@{userId}</p>
					{/if}
				{/if}
			</div>
		</div>

		<div class='content'>
			<!-- Content -->
			{#if (contentThis && !editing)}
				<span class='desc'>
					{@html contentThis}
				</span>
				<span class='desc'>
					{#if (sliced && !showedFullContent)}
						<span on:click={showFullContent} class='more has-text-info is-clickable'>
							{$_('readMore')}
						</span>
					{:else if (sliced && showedFullContent)}
						<span on:click={goAnchor} on:click={hideFullContent} class='more has-text-info is-clickable'>
							{$_('hide')}
						</span>
					{/if}
				</span>
			{/if}

			{#if (editing)}
				<textarea on:keyup={saveContent} bind:value={contentEdit} class='textarea' placeholder='10 lines of textarea'
									rows='10'></textarea>
			{/if}

			<!-- Time -->
			{#if (time)}
				<p class='mt-1'>
					<time
						use:tippy={{content: format(new Date(time * 1000), 'eeee, LLLL dd, yyyy p', { locale: getObjectLocales().dateFns }), arrow: true, delay: TOOL_TIP_DELAY}}
						class='time'>{capitalize(formatRelative(subHours(new Date(), getHoursFromData(time * 1000)), new Date(), {
						locale: getObjectLocales().dateFns
					}))}</time>

					<!-- Time Edited -->
					{#if (timeEdited)}
						<span class='time'> &#8226; </span>
						<span class='time'> ({$_('edited')}) </span>
						<time
							use:tippy={{content: format(new Date(timeEdited * 1000), 'eeee, LLLL dd, yyyy p', { locale: getObjectLocales().dateFns }), arrow: true, delay: TOOL_TIP_DELAY}}
							class='time'>{capitalize(formatRelative(subHours(new Date(), getHoursFromData(timeEdited * 1000)), new Date(), {
							locale: getObjectLocales().dateFns
						}))}</time>
					{/if}
				</p>
			{/if}

			<div class='buttons'>
				<!-- Share -->
				<button class='copy button' data-clipboard-text={POST_URL + id}
								use:tippy={{content: $_('linkPostCopied'),  trigger: 'click', arrow: true}}>
					<span class='icon is-small'>
						<i class='fa-solid fa-share-from-square'></i>
					</span>
					<span>{$_('Share')}</span>
				</button>

				{#if ($userStore?.['id'] === userId)}
					{#if (!editing && parseInt($postEdited) < 0)}
						<span on:click={goAnchor} on:click={goEdit} class='button'>
							<span class='icon is-small'>
								<i class='fa-solid fa-pen-to-square'></i>
							</span>
							<span>{$_('edit')}</span>
						</span>
					{:else if (editing)}
						<span on:click={goAnchor} on:click={saveEdit} class='button is-info is-outlined'>
							<span class='icon is-small'>
								<i class='fa-solid fa-floppy-disk'></i>
							</span>
							<span>{$_('save')}</span>
						</span>
					{/if}

					{#if (editing && parseInt($postEdited) > -1)}
						<span on:click={goAnchor} on:click={stopEdit} class='button is-danger is-outlined'>
							<span class='icon is-small'>
								<i class='fa-solid fa-ban'></i>
							</span>
							<span>{$_('cancel')}</span>
						</span>
					{:else if (!editing && parseInt($postEdited) < 0)}
						<span on:click={deletePost} on:click={goAnchor} class='button is-danger is-outlined'>
							<span class='icon is-small'>
								<i class='fa-solid fa-trash-can'></i>
							</span>
							<span>{$_('delete')}</span>
						</span>
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.media-content {
		overflow: hidden !important;
	}

	time {
		cursor: default;
	}

	button {
		opacity: 0.9;
	}

	.time {
		opacity: 0.8;
	}

	.ctag {
		word-wrap: normal;
		word-break: keep-all;
		white-space: pre;
	}

	.ctag:hover {
		text-decoration: underline !important;
	}

	.name:hover {
		text-decoration: underline !important;
	}

	.desc {
		word-wrap: break-word;
		word-break: break-word;
		white-space: break-spaces;
	}

	.invisible {
		display: none;
	}
</style>
