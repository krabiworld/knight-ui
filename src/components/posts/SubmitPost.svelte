<script>
	import {_} from 'svelte-i18n';
	import {api} from '../../js/api.js';
	import {notifications} from '../../js/notifications.js';
	import {stringity} from 'stringity';
	import {config} from '../../config.js';
	import {tippy} from 'svelte-tippy';

	const TOOL_TIP_DELAY = 800;
	const NOTIFICATION_TIME = 2000;
	const MIN_WORDS = 5;

	const HASHTAG = config.markup.hashtag;
	const BOLD = config.markup.bold;
	const ITALIC = config.markup.italic;
	const CODE = config.markup.code;
	const STRIKE = config.markup.strike;
	const UNDERLINE = config.markup.underline;
	const QUOTE = config.markup.quote;
	const LINKS = config.markup.link.template;
	const MENTION_START = config.markup.mention.start;
	const MENTION_END = config.markup.mention.end;

	let content = '';
	let textarea = '';

	let selectedStart = undefined;
	let selectedEnd = undefined;

	function submit() {
		if (!content) return false;

		if (stringity.getCount(content, 'words') < MIN_WORDS) {
			notifications.warning($_('fewWordsWarn'), NOTIFICATION_TIME);
			return false;
		}

		api.posts.create(content).then((res) => {
			if (res.ok) {
				notifications.success($_('postSubmittedSuccessfully'), NOTIFICATION_TIME);
				content = '';

				setTimeout(reload, NOTIFICATION_TIME);

				function reload() {
					location.reload();
				}
			} else {
				notifications.danger(`${$_('postSubmittedError')} (${res.status})`, NOTIFICATION_TIME);
			}
		});
	}

	let oldMarkup = '';

	function addMarkup({target}) {
		let symbolsStart = '';
		let symbolsEnd = '';

		if (target.classList.contains('sym-hashtag')) {
			symbolsStart = HASHTAG;
		} else if (target.classList.contains('sym-bold')) {
			symbolsStart = BOLD;
			symbolsEnd = BOLD;
		} else if (target.classList.contains('sym-italic')) {
			symbolsStart = ITALIC;
			symbolsEnd = ITALIC;
		} else if (target.classList.contains('sym-strike')) {
			symbolsStart = STRIKE;
			symbolsEnd = STRIKE;
		} else if (target.classList.contains('sym-underline')) {
			symbolsStart = UNDERLINE;
			symbolsEnd = UNDERLINE;
		} else if (target.classList.contains('sym-quote')) {
			symbolsStart = QUOTE;
		} else if (target.classList.contains('sym-code')) {
			symbolsStart = CODE;
			symbolsEnd = CODE;
		} else if (target.classList.contains('sym-link')) {
			symbolsStart = LINKS;
		} else if (target.classList.contains('sym-mention')) {
			symbolsStart = MENTION_START;
			symbolsEnd = MENTION_END;
		}

		if (selectedStart > -1 && selectedEnd > -1) {
			let word = content.slice(selectedStart, selectedEnd);
			if (!(word.trim())) {
				unknownSelect();
			} else {
				let contentStart = content.slice(0, selectedStart);
				let contentEnd = content.slice(selectedEnd, content.length);

				content = contentStart + symbolsStart + word + symbolsEnd + contentEnd;

				textarea.focus();

				setTimeout(setCaretPos, 0);

				function setCaretPos() {
					const start = contentStart.length + symbolsStart.length + word.length;
					textarea.setSelectionRange(start, start);
				}
			}
		} else {
			unknownSelect();
		}

		function unknownSelect() {
			let contentStart = content.slice(0, textarea.selectionStart);
			let contentEnd = content.slice(textarea.selectionStart, content.length);

			content = contentStart + symbolsStart + symbolsEnd + contentEnd;

			textarea.focus();

			setTimeout(setCaretPos, 0);

			function setCaretPos() {
				const start = contentStart.length + symbolsStart.length;
				textarea.setSelectionRange(start, start);
			}
		}

		oldMarkup = symbolsStart + symbolsEnd;
	}

	function goQuote({keyCode}) {
		if (keyCode === 13) {
			const lines = content.split('\n');
			const beforeLastLine = lines[lines.length - 2];
			if (beforeLastLine.startsWith(QUOTE)) content += QUOTE;
		}
	}

	function saveTextSelected({target}) {
		selectedStart = target.selectionStart;
		selectedEnd = target.selectionEnd;
	}
</script>

<div class='block box p-4'>
	<article class='media'>
		<div class='media-content'>
			<div>
				<h4 class='title ch4 is-5'>{$_('creatingPost')}</h4>
			</div>
			<div class='field'>
				<p class='control buttons'>

					<button class='sym-hashtag button' on:click={addMarkup}
									use:tippy={{content: $_('hashtag'), arrow: true, delay: TOOL_TIP_DELAY}}>
						<span class='sym-hashtag icon is-small'>
							<i class='sym-hashtag fa-solid fa-hashtag'></i>
						</span>
					</button>
					<button class='sym-bold button' on:click={addMarkup}
									use:tippy={{content: $_('bold'), arrow: true, delay: TOOL_TIP_DELAY}}>
						<span class='sym-bold icon is-small'>
							<i class='sym-bold fas fa-bold'></i>
						</span>
					</button>
					<button class='sym-italic button' on:click={addMarkup}
									use:tippy={{content: $_('italic'), arrow: true, delay: TOOL_TIP_DELAY}}>
						<span class='sym-italic icon is-small'>
							<i class='sym-italic fas fa-italic'></i>
						</span>
					</button>
					<button class='sym-strike button' on:click={addMarkup}
									use:tippy={{content: $_('strike'), arrow: true, delay: TOOL_TIP_DELAY}}>
						<span class='sym-strike icon is-small'>
							<i class='sym-strike fa-solid fa-strikethrough'></i>
						</span>
					</button>
					<button class='sym-underline button'
									on:click={addMarkup} use:tippy={{content: $_('underline'), arrow: true, delay: TOOL_TIP_DELAY}}>
						<span class='sym-underline icon is-small'>
							<i class='sym-underline fas fa-underline'></i>
						</span>
					</button>
					<button class='sym-quote button' on:click={addMarkup}
									use:tippy={{content: $_('quote'), arrow: true, delay: TOOL_TIP_DELAY}}>
						<span class='sym-quote icon is-small'>
						<i class='sym-quote fa-solid fa-quote-left'></i>
						</span>
					</button>
					<button class='sym-code button' on:click={addMarkup}
									use:tippy={{content: $_('code'), arrow: true, delay: TOOL_TIP_DELAY}}>
						<span class='sym-code icon is-small'>
							<i class='sym-code fa-solid fa-grip-lines'></i>
						</span>
					</button>
					<button class='sym-link button' on:click={addMarkup}
									use:tippy={{content: $_('link'), arrow: true, delay: TOOL_TIP_DELAY}}>
						<span class='sym-link icon is-small'>
							<i class='sym-link fa-solid fa-link'></i>
						</span>
					</button>
					<button class='sym-mention button'
									on:click={addMarkup} use:tippy={{content: $_('mentionUser'), arrow: true, delay: TOOL_TIP_DELAY}}>
						<span class='sym-mention icon is-small'>
							<i class='sym-mention fa-solid fa-at'></i>
						</span>
					</button>
					<textarea bind:this={textarea} bind:value={content} class='textarea' on:keyup={goQuote}
										on:select={saveTextSelected}
										placeholder={$_('writeYourSolutions')}></textarea>
				</p>
			</div>
			<nav class='level' class:locked={!content}>
				<div class='level-left'>
					<div class='level-item'>
						<span class='button is-info' on:click={submit}>{$_('submit')}</span>
					</div>
				</div>
			</nav>
		</div>
	</article>
</div>

<style>
	.level {
		transition: 0.1s ease;
	}

	.locked {
		opacity: 0.5;
		pointer-events: none;
	}
</style>
