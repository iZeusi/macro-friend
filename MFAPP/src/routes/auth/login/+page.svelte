<script>
	import { goto } from "$app/navigation";
	import { isLoggedOut } from '../../Auth.svelte';
	import { onMount } from "svelte";

	let showPassword = false;
	let password = '';
	let email = '';

	onMount(async () => {
		isLoggedOut();
	});

	async function postLogin(email, password) {
		const res = await fetch('http://localhost:4000/api/auth/login', {
			method: 'POST',
			credentials: "include",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			},
			body: new URLSearchParams({
				'email': email,
				'password': password
			})
		});
		const { error, refreshToken, id } = await res.json();
		if (error) {
			return console.error(401, {
				error
			});
		}

		localStorage.setItem('refreshToken', refreshToken);
		localStorage.setItem('id', id);
		await goto('/track');
	}

	function savePassword(e) {
		password = e.target.value;
	}
</script>

<svelte:head>
	<title>MF | Login</title>
	<meta name="Login System" content="Login" />
</svelte:head>

<style>
	.field {
		width: 100%;
		position: relative;
		border-bottom: 2px dashed var(--text-color);
		margin: 4rem auto 1rem;
		transition: 500ms;
	}
	.label {
		color:var(--text-color);
		font-size: 1.2rem;
	}
	.input {
		outline: none;
		border: none;
		overflow: hidden;
		margin: 0;
		width: 100%;
		padding: 0.25rem 0;
		background: none;
		color: white;
		font-size: 1.2em;
		font-weight: bold;
		transition: border 500ms;
	}
	.input:valid {
		color: yellowgreen;
	}
	.input:invalid {
		color: orangered;
	}
	/* Border animation */
	.field::after {
		content: "";
		position: relative;
		display: block;
		height: 4px;
		width: 100%;
		background: #d16dff;
		transform: scaleX(0);
		transform-origin: 0;
		opacity: 0;
		transition: all 500ms ease;
		top: 2px;
	}
	.field:focus-within {
		border-color: transparent;
	}
	.field:focus-within::after {
		transform: scaleX(1);
		opacity: 1;
	}
	/* Label animation */
	.label {
		z-index: -1;
		position: absolute;
		transform: translateY(-2rem);
		transform-origin: 0;
		transition: transform 400ms;
	}
	.field:focus-within .label,
	.input:not(:placeholder-shown) + .label {
		transform: scale(0.8) translateY(-5rem);
		opacity: 1;
	}
	/* Buttons */
	button {
		margin-top: 2rem;
		padding: 10px 30px;
		font-weight: bold;
		border: 2px solid greenyellow;
		color: greenyellow;
		border-radius: 100px;
		background: transparent;
		transition: all 1000ms;
		cursor: pointer;
	}
	button:disabled {
		cursor: not-allowed;
		border-color: var(--text-color);
		color: var(--text-color);
	}
	.toggle-password {
		position: absolute;
		cursor: help;
		font-size: 0.8rem;
		right: 0.25rem;
		bottom: 0.5rem;
	}
	.register-button {
		border-color: var(--text-color);
		color: var(--text-color);
	}
</style>

<main>
	<div class="field">
		<input type="email" name="email" class="input" placeholder=" " bind:value={email} />
		<label for="email" class="label">Email</label>
	</div>

	<div class="field">
		<input
				type={showPassword ? 'text' : 'password'}
				name="password"
				class="input"
				placeholder=" "
				on:input={savePassword}
		/>

		<label for="password" class="label">Password</label>
		<span class="toggle-password"
			  on:mouseenter={() => (showPassword = true)}
			  on:mouseleave={() => (showPassword = false)}>
            {showPassword ? '🙈' : '👁️'}
        </span>
	</div>
	<button on:click={() => postLogin(email, password)}>Login</button>
	<button class="register-button" on:click={() => goto('/auth/register')}>Need an account?</button>
</main>
