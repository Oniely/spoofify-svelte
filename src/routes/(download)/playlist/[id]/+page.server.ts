import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

import { getPlaylist } from '$lib/utils/spotify'
import type { Playlist } from '$lib/utils/types'

export const load: PageServerLoad = async ({ params }) => {
	const playlistId = params.id
	const playlist: Playlist = await getPlaylist(playlistId)

	if (!playlist) {
		throw error(404, 'Playlist Not Found')
	}

	return { playlist }
}
