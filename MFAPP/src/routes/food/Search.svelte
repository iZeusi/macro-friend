<script>
    import { debounce } from 'lodash';

    let searchOccurred = false;
    let searchTerm = '';
    let foods = [];

    const debouncedSearch = debounce(async () => {
        const res = await fetch(`http://localhost:4000/api/food/${searchTerm}`, {
            method: "GET",
            credentials: "include",
        });
        const { error, foodDocs } = await res.json();
        if (res.status === 200) foods = foodDocs;
        else {
            console.log(error);
            foods = [];
        }
        searchOccurred = true;
    }, 500);

    function handleInput(event) {
        if (event.target.value && event.target.value !== searchTerm) {
            searchTerm = event.target.value;
            debouncedSearch();
        }
        if (!event.target.value || event.target.value === '') {
            searchTerm = '';
            searchOccurred = false;
            foods = [];
        }
    }
</script>

<input type="text" on:input={handleInput} />

{#if foods && foods.length}
    {#each foods as food}
        <h4>{food.name}</h4>
        <p>Per {food.weight} grams,</p>
        <ul>
            <li>{food.calories}kcal</li>
            <li>{food.carbs}g Carbs</li>
            <li>{food.fats}g Fats</li>
            <li>{food.protein}g Protein</li>
        </ul>
    {/each}
{:else}
    {#if searchTerm !== '' && searchOccurred}
        <h2>Could not find food...</h2>
    {/if}
    {#if searchTerm !== '' && !searchOccurred}
        <h2>Searching...</h2>
    {/if}
{/if}