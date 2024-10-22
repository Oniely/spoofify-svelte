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
		const currentState = get(store)

		if (!currentState.audio && currentState.trackId !== audioUrl) {
			await loadAudio(audioUrl)
			return
		}

		if (currentState.playing) {
			currentState.audio!.pause()
			store.update((state) => ({
				...state,
				playing: false
			}))
		} else {
			currentState.audio!.play()
			store.update((state) => ({
				...state,
				playing: true
			}))
		}
	}

	const isTrackPlaying = (otherTrackId: string): boolean => {
		const currentState = get(store)
		return currentState.trackId === otherTrackId && currentState.playing
	}

	return {
		subscribe: store.subscribe,
		loadAudio,
		togglePlay,
		isTrackPlaying
	}
}

export const playerStore = createPlayerStore()
