import type { Playlist, Track } from '$lib/utils/types'
import { downloadBlob, getFilenameFromHeaders } from '$lib/utils/utils'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import axios from 'axios'
import { ID3Writer } from 'browser-id3-writer'
import JSZip from 'jszip'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'

interface Downloader {
	queue: any[]
	currentDownload: any | null
	downloadedItems: any[]
	downloading: boolean
	progress: number
	dialogItem: any | null
	defaultSpeed: 'slow' | 'fast' | null
}

let ffmpegInstance: FFmpeg | null = null

const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm'

const getFFmpeg = async (): Promise<FFmpeg> => {
	if (!ffmpegInstance || !ffmpegInstance.loaded) {
		console.log('Loading FFmpeg...')
		ffmpegInstance = new FFmpeg()

		ffmpegInstance.on('log', ({ message }) => {
			console.log(message)
		})

		await ffmpegInstance.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
			wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
			workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
		})
	}
	console.log('FFmpeg Loaded')
	return ffmpegInstance
}

async function readFile(file: File): Promise<Uint8Array> {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()

		fileReader.onload = () => {
			const { result } = fileReader

			if (result instanceof ArrayBuffer) {
				resolve(new Uint8Array(result))
			}
		}
		fileReader.readAsArrayBuffer(file)
	})
}

export const toBlobURL = async (url: string, mimeType: string): Promise<string> => {
	const response = await fetch(url)
	const arrayBuffer = await response.arrayBuffer()
	const blob = new Blob([arrayBuffer], { type: mimeType })
	return URL.createObjectURL(blob)
}

function createDownloadStore() {
	const store = writable<Downloader>({
		queue: [],
		currentDownload: null,
		downloadedItems: [],
		downloading: false,
		progress: 0,
		dialogItem: null,
		defaultSpeed: null
	})

	const download = async () => {
		const state = get(store)

		// If already downloading or queue is empty, return
		if (state.downloading || state.queue.length === 0) return

		// Update store to start downloading
		store.update((state) => ({
			...state,
			downloading: true,
			currentDownload: state.queue[0],
			queue: state.queue.slice(1),
			progress: 0
		}))

		// Get updated state after the update
		const updatedState = get(store)
		const currentDownload = updatedState.currentDownload

		try {
			const type = currentDownload.type
			if (type === 'playlist') {
				const { blob, filename } = await downloadPlaylist(currentDownload, 'Playlist')
				downloadBlob(blob, filename)
			} else if (type === 'track') {
				const { buffer, filename } = await downloadTrack(currentDownload)
				downloadBlob(buffer, filename)
			} else if (type === 'album') {
				const { blob, filename } = await downloadAlbum(currentDownload)
				downloadBlob(blob, filename)
			}

			// Update store after successful download
			store.update((state) => ({
				...state,
				downloadedItems: [...state.downloadedItems, currentDownload],
				progress: 0,
				downloading: false,
				currentDownload: null
			}))

			// Continue with next download if queue is not empty
			const nextState = get(store)
			if (nextState.queue.length > 0) {
				download() // Process next item in queue
			}
		} catch (error) {
			console.error('Download failed:', error)
			// Update store on error
			store.update((state) => ({
				...state,
				downloading: false,
				currentDownload: null,
				progress: 0
			}))
		}
	}

	store.subscribe((state) => {
		if (state.queue.length > 0 && !state.downloading) {
			download()
		}
	})

	const downloadPlaylist = async (playlist: Playlist, type: 'Playlist' | 'Album') => {
		const state = get(store)
		const items = playlist.tracks.items
		const zip = new JSZip()

		console.log('PLAYLIST DOWNLOAD LOADING FFMPEG...')

		ffmpegInstance = await getFFmpeg()

		const chunkSize = 15
		const totalChunks = Math.ceil(items.length / chunkSize)

		for (let i = 0; i < totalChunks; i++) {
			if (!ffmpegInstance.loaded && playlist.speed === 'slow') {
				ffmpegInstance = await getFFmpeg()
			}

			const chunkStart = i * chunkSize
			const chunkEnd = Math.min(chunkStart + chunkSize, items.length)
			const chunkItems = items.slice(chunkStart, chunkEnd)

			const tracks = chunkItems.map((item) => (type === 'Playlist' ? item.track.name : item.name))

			console.log('Chunk Size: ', chunkItems.length)
			console.log('Chunk Items: ', tracks)

			const downloadPromises = chunkItems.map((item) => {
				const track: Track | any = type === 'Playlist' ? { ...item.track } : { ...item }
				return downloadTrack({ ...track, speed: playlist.speed }).then((track) => {
					state.progress += (1 / playlist.tracks.total) * 100
					return track
				})
			})

			const downloads = await Promise.all(downloadPromises)
			downloads.forEach((download) => {
				if (download) {
					const { filename, buffer } = download
					zip.file(filename, buffer!)
				}
			})
		}
		const blob = await zip.generateAsync({ type: 'blob' })
		const filename = pathNamify(playlist.name) + '.zip'
		return { blob, filename }
	}

	const downloadAlbum = async (playlist: Playlist) => {
		return downloadPlaylist(playlist, 'Album')
	}

	const downloadTrack = async (
		track: Track & { speed: 'slow' | 'fast' }
	): Promise<{ buffer: Blob | null; filename: string }> => {
		try {
			const response = await axios.post('/api/download/track', track, {
				responseType: 'blob'
			})
			let buffer = response.data
			let filename = getFilenameFromHeaders(response.headers)

			if (track.speed === 'slow') {
				if (!ffmpegInstance) {
					ffmpegInstance = await getFFmpeg()
				}

				buffer = await convert(buffer)

				buffer = await addMetadata(buffer, track)
				filename = filename.slice(0, -4) + '.mp3'
			}
			return { buffer, filename }
		} catch (error) {
			console.error('Error in downloadTrack:', error)
			return { buffer: null, filename: '' }
		}
	}

	function pathNamify(path: string) {
		return path.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')
	}

	async function convert(trackBufferBlob: Blob): Promise<ArrayBuffer | null> {
		const id = uuidv4()
		const inputFileName = `/tmp/${id}.m4a`
		const outputFileName = `/tmp/${id}.mp3`
		try {
			if (!ffmpegInstance) {
				ffmpegInstance = await getFFmpeg()
			}

			await ffmpegInstance.writeFile(inputFileName, await readFile(trackBufferBlob as File))
			// prettier-ignore
			await ffmpegInstance.exec([
        '-i', inputFileName,
        '-b:a', '320k',
        '-ac', '2',
        '-ar', '32000',
        outputFileName,
      ])
			const data = await ffmpegInstance.readFile(outputFileName)

			// @ts-ignore
			return data.buffer
		} catch (error) {
			console.error('Error in audio conversion:', error)
			return null
		} finally {
			try {
				await Promise.all([
					ffmpegInstance!.deleteFile(inputFileName),
					ffmpegInstance!.deleteFile(outputFileName)
				])
			} catch (error) {
				console.warn('Error during cleanup:', error)
			}
		}
	}

	async function addMetadata(buffer: ArrayBuffer, track: Track) {
		try {
			const cover = await fetchCover(track.album.images[0].url)
			const writer = new ID3Writer(buffer)
			writer
				.setFrame('TIT2', track.name)
				.setFrame('TALB', track.album.name)
				.setFrame('TRCK', `${track.order || track.track_number}`)
				.setFrame(
					'TPE1',
					track.artists.map((artist) => artist.name)
				)
				.setFrame('APIC', {
					type: 3,
					data: cover,
					description: `${track.name} cover`
				})
			return writer.addTag()
		} catch (error) {
			console.error('Error adding metadata:', error)
			return null
		}
	}

	async function fetchCover(url: string) {
		try {
			const response = await axios.get(url, { responseType: 'arraybuffer' })
			return response.data
		} catch (error) {
			console.error('Error in fetchCover:', error)
			return null
		}
	}

	const addDownload = (spotifyItem: Track | Playlist, speed: 'slow' | 'fast') => {
		store.update((state) => ({
			...state,
			queue: [...state.queue, { ...spotifyItem, speed }]
		}))
	}

	const addToDownloaded = (item: any) => {
		store.update((state) => ({
			...state,
			downloadedItems: [...state.downloadedItems, item]
		}))
	}

	const itemState = (item: any) => {
		const state = get(store)

		const downloadedItem = state.downloadedItems.find(
			(downloadedItem) => item.id === downloadedItem.id
		)
		if (downloadedItem) return 'downloaded'

		if (item.id === state.currentDownload?.id) return 'downloading'

		const queuedItem = state.queue.find((queueItem) => item.id === queueItem.id)
		if (queuedItem) return 'queued'

		return null
	}

	const openDialog = (item: any) => {
		store.update((state) => ({
			...state,
			dialogItem: item
		}))
	}

	const closeDialog = () => {
		store.update((state) => ({
			...state,
			dialogItem: null
		}))
	}

	return {
		subscribe: store.subscribe,
		download,
		downloadPlaylist,
		downloadAlbum,
		downloadTrack,
		addDownload,
		addToDownloaded,
		itemState,
		openDialog,
		closeDialog
	}
}

export const downloadStore = createDownloadStore()
