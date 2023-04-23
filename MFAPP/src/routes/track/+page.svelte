<script>
	import Auth from '../Auth.svelte';
	import { isLoggedIn } from '../Auth.svelte';
	import { onMount } from "svelte";

	let formattedDate = '';
	let showContent = '';
	let date = new Date();
	let meals = ["Breakfast", "Lunch", "Dinner", "Snacks"];
	let mealFoods = [];
	let foods = [];
	let selectedFood = '';
	let dailyMacros = [];
	let mealMacros = [];

	function totalMacros(meals) {
		dailyMacros = [];
		mealMacros = [];
		let calories = 0;
		let carbs = 0;
		let fats = 0;
		let protein = 0;

		for (const meal of meals) {
			let mealCalories = 0;
			let mealCarbs = 0;
			let mealFats = 0;
			let mealProtein = 0;

			for (const food of meal.foods) {
				mealCalories += food.calories;
				mealCarbs += food.carbs;
				mealFats += food.fats;
				mealProtein += food.protein;
			}

			mealMacros[meal.name] = {
				calories: mealCalories,
				carbs: mealCarbs,
				fats: mealFats,
				protein: mealProtein
			}

			calories += mealCalories;
			carbs += mealCarbs;
			fats += mealFats;
			protein += mealProtein;
		}

		dailyMacros = {
			calories: calories,
			carbs: carbs,
			fats: fats,
			protein: protein
		};
	}

	function formatDate() {
		if (isToday(date)) formattedDate = "Today";
		else formattedDate = date.toLocaleDateString('en-us',
				{ weekday: "long", year: "numeric", month: "short", day: "numeric"}
		);
	}

	const isToday = (date) => {
		const today = new Date();
		return date.getDate() == today.getDate() &&
				date.getMonth() == today.getMonth() &&
				date.getFullYear() == today.getFullYear();
	};

	async function changeDate(dir) {
		date.setDate(date.getDate() + dir);
		formatDate();
		await getMeals();
	}

	async function setDateToday() {
		date = new Date();
		formatDate();
		await getMeals();
	}

	async function getMeals() {
		const res = await fetch(`http://localhost:4000/api/meals/date`, {
			method: "POST",
			credentials: "include",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			},
			body: new URLSearchParams({
				id: localStorage.getItem("id"),
				date: date.toLocaleDateString()
			})
		});
		const {err, meals} = await res.json();
		if (res.status === 200) mealFoods = meals;
		else {
			console.log(err);
			mealFoods = [];
		}
		totalMacros(mealFoods);
 	}

	 async function getFood() {
		 const res = await fetch(`http://localhost:4000/api/foods`, {
			 method: "GET",
			 credentials: "include"
		 });
		 const {err, foodDocs} = await res.json();
		 if (res.status === 200) foods = foodDocs;
		 else console.log("Error: " + err);
	 }

	 async function addFood(meal) {
		const res = await fetch(`http://localhost:4000/api/meal`, {
			method: "POST",
			credentials: "include",
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			},
			body: new URLSearchParams({
				id: localStorage.getItem("id"),
				meal: meal,
				foods: selectedFood,
				date: date.toLocaleDateString()
			})
		});
		showContent = '';
		await getMeals();
	 }

	const handleClick = (meal) => {
		showContent = meal === showContent ? '' : meal;
	}

	onMount(async () => {
		isLoggedIn();
		await getMeals();
		await getFood();
		formatDate();
	});
</script>

<Auth />

<svelte:head>
	<title>MF | Track</title>
	<meta name="Daily Tracker" content="Track" />
</svelte:head>
<div class="text-column">
	<p>Current Daily Macros:</p>
	<ul>
		<li>{dailyMacros.calories}kcal</li>
		<li>{dailyMacros.carbs}g Carbs</li>
		<li>{dailyMacros.fats}g Fats</li>
		<li>{dailyMacros.protein}g Protein</li>
	</ul>
	<a href="/track" role="button" class="secondary" on:click={() => setDateToday()}> Present </a>
	<span>
		<a href="/track" role="button" class="secondary" on:click={() => changeDate(-1)}> ← </a>
			{formattedDate}
		<a href="/track" role="button" class="secondary" on:click={() => changeDate(1)}> → </a>
	</span>
</div>

{#if meals && meals.length}
	{#each meals as meal}
		<h1>{meal}</h1>
		<p>Current Macros:</p>
		{#if mealMacros[meal]}
			<ul>
				{#if mealMacros[meal].calories}<li>{mealMacros[meal].calories}kcal</li>{/if}
				{#if mealMacros[meal].carbs}<li>{mealMacros[meal].carbs}g Carbs</li>{/if}
				{#if mealMacros[meal].fats}<li>{mealMacros[meal].fats}g Fats</li>{/if}
				{#if mealMacros[meal].protein}<li>{mealMacros[meal].protein}g Protein</li>{/if}
			</ul>
		{/if}
		{#if mealFoods && mealFoods.length}
			{#each mealFoods as mealFood}
				{#if mealFood.name === meal}
					{#each mealFood.foods as foodItem}
						<b>{foodItem.name}</b>
						<ul>
							<li>{foodItem.calories}kcal</li>
							<li>{foodItem.carbs}g Carbs</li>
							<li>{foodItem.fats}g Fats</li>
							<li>{foodItem.protein}g Protein</li>
						</ul>
					{/each}
				{/if}
			{/each}
		{/if}
		<button type="button" on:click={() => handleClick(meal)}>Add {meal} Food</button>
		{#if showContent === meal}
			<div style="display:flex;align-items: center;">
				<select name="food" id="food" bind:value={selectedFood}>
					{#if foods.length}
						<option value="" selected="selected" hidden="hidden">Select Food</option>
						{#each foods as food}
							<option value={food._id}>{food.name}</option>
						{/each}
					{/if}
				</select>
				<button type="button" on:click={() => addFood(meal)}> + </button>
			</div>
		{/if}
	{/each}
{/if}

<style>
	a {
		margin: 1em;
	}

	select {
		margin-right: 5em;
	}
</style>
