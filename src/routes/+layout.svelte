<script>
	import '../app.css'
</script>

<div class="relative z-0 h-full">
	<div class="fixed inset-0 -z-10">
		<div
			class="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-accent blur-[180px] md:bottom-1/4 md:left-1/3"
		></div>
		<div
			class="absolute bottom-2/3 left-[100px] hidden h-24 w-24 rounded-full bg-accent blur-[150px] md:block"
		></div>
		<div class="absolute right-24 top-10 h-32 w-32 rounded-full bg-accent blur-[150px]"></div>
	</div>
	<slot />
</div>
