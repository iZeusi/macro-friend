<script>
	import Header from './Header.svelte';
	import './styles.css';
	import "@picocss/pico/css/pico.min.css";
	import { page } from '$app/stores';
	import { redirect } from '@sveltejs/kit';
	export function load() {
		if ($page.url.pathname === '/') throw redirect(302, '/track');
	}

	load();
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<p>Developed by Karl G</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
