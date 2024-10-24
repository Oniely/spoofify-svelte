import { get, writable } from 'svelte/store'

interface Player {
	trackId: string | null
	audio: HTMLAudioElement | null
	playing: boolean
}

function createPlayerStore() {
	const store = writable<Player>({
		trackId: null,
		audio: null,
		playing: false
	})

	let currentAudio: HTMLAudioElement | null = null

	const loadAudio = async (audioUrl: string) => {
		if (currentAudio) currentAudio.pause()

		const audioSrc = new Audio(audioUrl)

		await new Promise((resolve) => {
			audioSrc.addEventListener('canplaythrough', resolve, { once: true })
		})

		audioSrc.onended = () => {
			store.update((state) => ({ ...state, playing: false }))
		}

		currentAudio = audioSrc

		store.update((state) => ({
			...state,
			trackId: audioUrl,
			audio: audioSrc,
			playing: true
		}))
		audioSrc.play()
	}

	const togglePlay = async (audioUrl: string) => {
		const state = get(store)

		if (!state.audio && state.trackId !== audioUrl) {
			await loadAudio(audioUrl)
			return
		}

		if (state.playing) {
			state.audio!.pause()
			store.update((state) => ({
				...state,
				playing: false
			}))
		} else {
			state.audio!.play()
			store.update((state) => ({
				...state,
				playing: true
			}))
		}
	}

	const isTrackPlaying = (otherTrackId: string): boolean => {
		const state = get(store)
		return state.trackId === otherTrackId && state.playing
	}

	return {
		subscribe: store.subscribe,
		loadAudio,
		togglePlay,
		isTrackPlaying
	}
}

export const playerStore = createPlayerStore()
