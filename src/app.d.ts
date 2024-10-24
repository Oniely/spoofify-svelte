// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module 'youtube-sr' {
	const ytSearch: {
		default: any
		search: (query: string, options: { type: string; limit: number }) => Promise<any>
	}
	export = ytSearch
}

export {}
