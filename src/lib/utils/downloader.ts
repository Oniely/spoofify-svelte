import ytdl from '@distube/ytdl-core'
import filenamify from 'filenamify'
import { PassThrough } from 'stream'
import ytSearch from 'youtube-sr'
import type { Track } from './types'
import { serverTimestamp } from './utils'

// MAIN FUNCTIONS
export const downloadTrack = async (track: Track & { speed: 'slow' | 'fast' }, silent = true) => {
	try {
		if (!silent && track) {
			console.log(
				`[${serverTimestamp()}]: Downloading ${track.name} by ${track.artists[0].name}...`
			)
		}
		// Find and download YouTube video
		const id = await findYtId(track)
		if (!id) {
			throw new Error(`No matching YouTube video found for track: ${track.name}`)
		}

		const buffer = await downloadYT(id)
		if (!buffer) {
			throw new Error(`Failed to download audio for ${track.name} by ${track.artists[0].name}`)
		}

		const sanitizeString = (str: string) => str.replace(/[^\x00-\x7F]/g, '')
		const filename = sanitizeString(pathNamify(`${track.name}`) + '.m4a')

		return { buffer, filename }
	} catch (error: any) {
		console.error(`Error downloading track "${track.name}":`, error.message)
		throw error
	}
}

// SUB FUNCTIONS
const findYtId = async (track: Track) => {
	try {
		let query = `${track.name} ${track.artists[0].name ?? ''}`
		// if (track.explicit) {
		//   if (track.genres.includes('Hip Hop')) {
		//     query += ' explicit'
		//   }
		// }
		if (track.type === 'track') {
			query += ' official'
		}
		query += ' -instrumental'

		const videos = await ytSearch.default.search(query, {
			type: 'video',
			limit: track.type === 'track' ? 10 : 3
		})

		console.log(`${query}, found ${videos.length} results`)

		let closestVideo = null
		let closestDuration = Infinity

		for (const video of videos) {
			const durationDiff = Math.abs(video.duration - track.duration_ms)
			if (durationDiff < closestDuration) {
				closestDuration = durationDiff
				closestVideo = video
			}
		}
		return closestVideo ? closestVideo.id : null
	} catch (error) {
		console.error(`Error in findYtId for track ${track.name}:`, error)
		return null
	}
}

const downloadYT = async (id: string): Promise<Buffer | undefined> => {
	try {
		const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`)
		const audioFormat = ytdl.chooseFormat(info.formats, {
			quality: 'highestaudio'
		})

		if (!audioFormat) {
			throw new Error(`No suitable audio format found for video ID: ${id}`)
		}

		const audioStream = ytdl.downloadFromInfo(info, { format: audioFormat })
		const buffer = await streamToBuffer(audioStream)

		return buffer
	} catch (error) {
		console.error(`Error downloading YouTube video ${id}:`, error)
	}
}

async function streamToBuffer(stream: any): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const chunks: any[] = []
		stream
			.pipe(new PassThrough())
			.on('data', (chunk: Buffer) => chunks.push(chunk))
			.on('error', (err: any) => reject(err))
			.on('end', () => resolve(Buffer.concat(chunks)))
	})
}

const pathNamify = (path: string) => {
	return filenamify(path).replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')
}
