import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

import { getTrack } from '$lib/utils/spotify'
import type { Track } from '$lib/utils/types'

export const load: PageServerLoad = async ({ params }) => {
	const trackId = params.id
	const track: Track = await getTrack(trackId)

	if (!track) {
		throw error(404, 'Track Not Found')
	}

	return { track }
}
