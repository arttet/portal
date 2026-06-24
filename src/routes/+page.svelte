<script lang="ts">
	import { formatDate } from '$lib/format';

	const today = formatDate(new Date());
</script>

<svelte:head>
	<title>Portal</title>
</svelte:head>

<main>
	<h1>Portal</h1>
	<p>{today}</p>
</main>
