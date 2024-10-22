<div class="flex w-full justify-center">
	<main class="w-full space-y-4 px-5 py-8 md:mt-[100px] md:w-[700px]">
		<div class="text-text space-y-2 md:w-4/5">
			<h1 class="mb-4 text-4xl font-bold">About</h1>
			<h2 class="mb-3 text-2xl font-semibold">What does this website do?</h2>
			<p>
				This website allows users to download Spotify playlists, albums, and tracks easily. When
				downloading playlist the website returns a ZIP file with all the tracks. Individual tracks
				are served with metadata.
			</p>
			<h2 class="mb-3 text-2xl font-semibold">How do I use it?</h2>
			<p>
				Simply press on the three dots in a Spotify playlist, album, or track, share it, copy the
				link, then paste the link in the input dialog on the{' '}
				<a href="/" class="underline">home page</a>.
			</p>
			<h2 class="mb-3 text-2xl font-semibold">How does it work?</h2>
			<p>
				The website uses the Spotify API to get data from playlists, albums and tracks. When
				downloading them it uses <i>youtube-sr</i> to find the best match to the track, then it uses
				<i>ytdl-core</i> to download the match, and serves it to the user in the appropriate format.
			</p>
			<p>
				Tracks with metadata are converted to MP3 using <i>ffmpeg.wasm</i>{' '}
				and decorated with the data from the Spotify API (title, album, cover, artists).
			</p>
		</div>
	</main>
</div>
