import { env } from '$env/dynamic/private'

import axios from 'axios'
import type { OrderOption, SortOption, Track } from './types'

export const getToken = async () => {
	const response = await axios.post(
		'https://accounts.spotify.com/api/token',
		'grant_type=client_credentials',
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			auth: {
				username: env.CLIENT_ID,
				password: env.CLIENT_SECRET
			}
		}
	)

	return response.data.access_token
}

export const getRequest = async (url: string) => {
	const token = await getToken()
	const response = await axios.get(url, {
		headers: { Authorization: `Bearer ${token}` }
	})

	return response.data
}

function sortString(a: string, b: string) {
	return a.localeCompare(b)
}

export async function getPlaylist(
	id: string,
	sort: SortOption | undefined,
	order: OrderOption | undefined | null
) {
	try {
		let playlist = await getRequest(`https://api.spotify.com/v1/playlists/${id}`)

		let { next } = playlist.tracks
		while (next) {
			const nextTracks = await getRequest(next)
			playlist.tracks.items.push(...nextTracks.items)

			next = nextTracks.next
		}

		if (sort) {
			let trackItems = playlist.tracks.items.filter((item: { track: Track }) => item.track)
			const newOrder = order === 'asc'

			switch (sort) {
				case 'Custom order':
					trackItems = newOrder ? trackItems.slice() : trackItems.slice().reverse()
					break
				case 'Title':
					trackItems = trackItems.sort(
						(a: { track: { name: string } }, b: { track: { name: string } }) =>
							newOrder
								? sortString(a.track.name, b.track.name)
								: sortString(b.track.name, a.track.name)
					)
					break
				case 'Album':
					trackItems = trackItems.sort((a: { track: Track }, b: { track: Track }) => {
						const albumComparison = newOrder
							? sortString(a.track.album.name, b.track.album.name)
							: sortString(b.track.album.name, a.track.album.name)

						if (albumComparison === 0) {
							return a.track.track_number - b.track.track_number
						}

						return albumComparison
					})
					break
				case 'Date added':
					const sortOrder = newOrder ? 1 : -1

					trackItems = trackItems.sort(
						(a: { added_at: string | number | Date }, b: { added_at: string | number | Date }) =>
							sortOrder * (new Date(a.added_at).getTime() - new Date(b.added_at).getTime())
					)
					break
			}
			playlist.tracks.items = trackItems
		}

		playlist.tracks.items = playlist.tracks.items
			.filter((item: { track: Track }) => item.track)
			.map((item: { track: Track }, idx: number) => ({
				...item,
				track: {
					...item.track,
					order: idx + 1
				}
			}))

		return playlist
	} catch (error) {
		console.error(`Error fetching playlist: ${error}`)
	}
}

export async function getTrack(id: string) {
	try {
		const track = await getRequest(`https://api.spotify.com/v1/tracks/${id}`)
		return track
	} catch (error) {
		console.error('Error fetching track: ', error)
	}
}

export async function getAlbum(id: string) {
	try {
		let album = await getRequest(`https://api.spotify.com/v1/albums/${id}`)

		const albumImage = album.images.length > 0 ? album.images[0].url : null

		let { next } = album.tracks
		while (next) {
			const nextTracks = await getRequest(next)
			album.tracks.items.push(...nextTracks.items)

			next = nextTracks.next
		}

		// add metadata
		album.tracks.items = album.tracks.items.map((track: any) => ({
			...track,
			images: [
				{
					url: albumImage
				}
			],
			album: {
				name: album.name,
				images: [
					{
						url: albumImage
					}
				]
			}
		}))

		return album
	} catch (error) {
		console.error('Error fetching album: ', error)
	}
}

export async function getArtist(id: string) {
	try {
		const artist = await getRequest(`https://api.spotify.com/v1/artists/${id}`)
		return artist
	} catch (error) {
		console.error('Error fetching artist: ', error)
	}
}
