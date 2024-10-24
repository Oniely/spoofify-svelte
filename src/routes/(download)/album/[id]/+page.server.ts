import { getAlbum } from '$lib/utils/spotify'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const albumId = params.id
	const album = await getAlbum(albumId)

	if (!album) {
		throw error(404, 'Album Not Found')
	}

	return { album }
}
