<script>
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { isLoggedOut } from "../../Auth.svelte";

	const strengthText = ["", "bad 💩", "ok 😐", "decent 🙂", "solid 💪"];
	let strength = 0;
	let showPassword = false;
	let validations = []
	let password = '';
	let email = '';
	let bio = '';

	onMount(async () => {
		isLoggedOut();
	});

	function validatePassword(e) {
		password = e.target.value;
		validations = [
			(password.length > 5),
			(password.search(/[A-Z]/) > -1),
			(password.search(/[0-9]/) > -1),
			(password.search(/[$&+,:;=?@#]/) > -1)
		]
		strength = validations.reduce((acc, cur) => acc + cur, 0)
	}

	async function postRegister(email, password) {
		const res = await fetch('http://localhost:4000/api/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			},
			body: new URLSearchParams({
				'email': email,
				'password': password,
				'bio': bio
			})
		});
		if (res.status === 200) await goto('/auth/login');
		else console.error("Registration failed: Email already in use!");
	}
</script>

<svelte:head>
	<title>MF | Register</title>
	<meta name="Friends System" content="Social" />
</svelte:head>

<style>
	form {
		--text-color: #afafaf;
	}
	.field {
		width: 100%;
		position: relative;
		border-bottom: 2px dashed var(--text-color);
		margin: 4rem auto 1rem;
		transition: 500ms;
	}
	#bio {
		width: 100%;
		position: relative;
		margin: 2rem auto 1rem;
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
	/* Strength Meter */
	.strength {
		display: flex;
		height: 20px;
		width: 100%;
	}
	.bar {
		margin-right: 5px;
		height: 100%;
		width: 25%;
		transition: box-shadow 500ms;
		box-shadow: inset 0 20px #1f1f1f;
	}
	.bar-show {
		box-shadow: none;
	}
	.bar-1 {
		background: linear-gradient(to right, red, orangered);
	}
	.bar-2 {
		background: linear-gradient(to right, orangered, yellow);
	}
	.bar-3 {
		background: linear-gradient(to right, yellow, yellowgreen);
	}
	.bar-4 {
		background: linear-gradient(to right, yellowgreen, green);
	}
	.bar:last-child {
		margin-right: 0;
	}
	.strength-text {
		margin-top: 20px;
	}
	ul {
		list-style: none;
		margin: 10px 0;
		padding: 0;
		font-size: 0.7rem;
		text-align: left;
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
	.login-button {
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
				on:input={validatePassword}
				class:valid={strength > 3}
		/>

		<label for="password" class="label">Password</label>
		<span class="toggle-password"
			  on:mouseenter={() => (showPassword = true)}
			  on:mouseleave={() => (showPassword = false)}>
            {showPassword ? '🙈' : '👁️'}
        </span>
	</div>

	<div class="strength">
		<span class="bar bar-1" class:bar-show={strength > 0}></span>
		<span class="bar bar-2" class:bar-show={strength > 1}></span>
		<span class="bar bar-3" class:bar-show={strength > 2}></span>
		<span class="bar bar-4" class:bar-show={strength > 3}></span>
	</div>

	{#if validations.length}
		<ul>
			<li> {validations[0] ? '✔️' : '❌'} must be at least 5 characters</li>
			<li> {validations[1] ? '✔️' : '❌'} must contain a capital letter</li>
			<li> {validations[2] ? '✔️' : '❌'} must contain a number</li>
			<li> {validations[3] ? '✔️' : '❌'} must contain one of $&+,:;=?@#</li>
		</ul>
	{/if}

	<div class="strength-text">{strengthText[strength]}</div>
	<textarea id="bio" name="bio" rows="4" cols="30" placeholder="Bio..." bind:value={bio}></textarea>
	<button disabled={strength < 4} on:click={() => postRegister(email, password)}>Sign Up</button>
	<button class="login-button" on:click={() => goto('/auth/login')}>Already registered?</button>
</main>
