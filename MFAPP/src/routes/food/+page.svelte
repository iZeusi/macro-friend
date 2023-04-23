<script>
	import AddFood from './AddFood.svelte';
	import { isLoggedIn } from '../Auth.svelte';
	import Search from './Search.svelte';
	import { onMount } from "svelte";

	onMount(async () => {
		isLoggedIn();
	});
</script>

<svelte:head>
	<title>MF | Food</title>
	<meta name="Food and Meals" content="Food" />
</svelte:head>

<div class="text-column">
	<AddFood />

	<h1>Search for Food</h1>
	<Search />
</div>
