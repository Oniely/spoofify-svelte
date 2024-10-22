import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

import { getTrack } from '$lib/utils/spotify'

export const load: PageServerLoad = async ({ params }) => {
	const trackId = params.id

	const track = await getTrack(trackId)

	if (!track) {
		throw error(404, 'Track Not Found')
	}

	return { track }
}
