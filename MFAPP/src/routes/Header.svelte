<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';
	import {goto} from "$app/navigation";
	import { getAccessToken, getCSRFToken, setAccessToken, setCSRFToken } from '$lib/util/TokenController.svelte';

	async function postLogout() {
		const jwt = getAccessToken();
		const csrf = getCSRFToken();
		const refreshToken = localStorage.getItem('refreshToken');
		const res = await fetch('http://localhost:4000/api/auth/logout', {
			method: 'POST',
			credentials: "include",
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${jwt}`,
				'X-CSRF-Token': csrf
			},
			body: JSON.stringify({
				'refreshToken': refreshToken
			})
		});
		if (res.status === 200) {
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('id');
			setAccessToken('');
			setCSRFToken('');
			await goto('/auth/login');
		}
		else console.error("Logout failed!");
	}
</script>

<header>
	<div class="corner">
		<a href="https://kit.svelte.dev">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={$page.url.pathname === '/social' ? 'page' : undefined}>
				<a href="/social">Social</a>
			</li>
			<li aria-current={$page.url.pathname === '/track' ? 'page' : undefined}>
				<a href="/track">Track</a>
			</li>
			<li aria-current={$page.url.pathname.startsWith('/food') ? 'page' : undefined}>
				<a href="/food">Food</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		<a on:click={() => postLogout()}>
			<img src={github} alt="Logout" />
		</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		cursor: pointer;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
