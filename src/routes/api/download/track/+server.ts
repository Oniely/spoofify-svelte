import { downloadTrack } from '$lib/utils/downloader'
import { json, type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request }) => {
	try {
		const track = await request.json()
		const { buffer, filename } = await downloadTrack(track, false)

		const headers = new Headers()
		headers.set('Content-Disposition', `attachment; filename="${filename}"`)
		headers.set(
			'User-Agent',
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
		)

		return new Response(buffer, {
			headers
		})
	} catch (error) {
		console.error(`Error downloading the track: ${error}`)
		return json({ message: 'There has been an error downloading the track.' }, { status: 500 })
	}
}
