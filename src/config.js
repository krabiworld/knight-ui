export const config = {};

config.links = {
	lichess: 'https://lichess.org',
	chess24: 'https://chess24.com',
	chesscom: 'https://www.chess.com/',
	discord: 'https://discord.gg/',
	twitter: '',
	docsTitle: 'https://docs.chesscord.wiki/title-verification',
	docs: ''
};

config.api = {
	address: 'https://api.chesscord.wiki/knight/'
};

config.api.auth = {
	path: 'auth/authorize',
	param: 'code',
	refresh: {
		path: 'auth/refresh',
		param: 'token'
	},
	revoke: {
		path: 'auth/revoke',
		param: 'token'
	}
};

config.api.tokens = {};

config.api.tokens.types = {
	bearer: 'Bearer'
};

config.api.users = {
	path: 'users',
	limit: {
		param: 'limit',
		countLeaders: 5
	},
	sort: {
		param: 'sort',
		rating: 'rating'
	}
};

config.api.users.current = {
	path: 'users/@me'
};

config.api.posts = {
	path: 'posts',
	limit: {
		param: 'limit',
		countDefault: 20,
		/* For example, 20 posts are loaded, in the next -
		 * 5, the trigger will be on the 15th post.
		 */
		next: 10
	},
	reverse: {
		param: 'reverse'
	},
	sort: {
		param: 'sort',
		created: 'created_at',
		likes: 'likes'
	},
	create: {
		path: 'posts/create'
	},
	edit: {
		pathStart: 'posts/',
		/* {id} */
		pathEnd: '/edit'
	},
	delete: {
		pathStart: 'posts/',
		/* {id} */
		pathEnd: '/delete'
	},
	getById: {
		pathStart: 'posts/'
	}
};

config.console = {};

config.console.string = {
	i18nInitialized: '[i18n] initialized.',
	invalidTokenType: '[auth] [token] Invalid token type!',
	invalidExpiryDate: '[auth] [token] Invalid expiry date!',
	failedToLogIn: '[auth] Failed to log in!'
};

config.markup = {
	hashtag: '#',
	bold: '**',
	italic: '>>',
	code: '``',
	strike: '~~',
	underline: '__',
	quote: '> ',
	link: {
		text: '[',
		href: '(',
		template: '[...](https://knight.chesscord.wiki/)'
	},
	mention: {
		start: '<@id',
		end: '>'
	},
	regex: {
		hashtag: /#([\wa-z-A-Z]|[\wа-я-А-Я])+/gm,
		bold: /\*\*.*?\*\*/gm,
		italic: />>.*?>>/gm,
		code: /``.*?``/gm,
		strike: /~~.*?~~/gm,
		underline: /__.*?__/gm,
		quote: /> [\s\S]*^> .*[\s\S]{1}/gm,
		link: /\[.*\]\(.*\)/gm,
		mention: /<@\d*>/gm
	},
	match: {
		link: {
			text: /\[.*\]/gm,
			href: /\(.*\)/gm
		},
		mention: /\d+/
	},
	rule: {
		maxTrys: 100
	}
};
