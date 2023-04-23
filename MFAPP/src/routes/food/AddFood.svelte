<script>

    const contents = ['Add Food'];
    let showContent = '';

    let foodName = '';
    let foodCalories = 0;
    let foodCarbs = 0;
    let foodFats = 0;
    let foodProtein = 0;

    const handleClick = (payload) => {
        showContent = payload === showContent ? '' : payload;
    }

    async function postFood() {
        if ((foodCarbs * 4) + (foodFats * 9) + (foodProtein * 4) === foodCalories) {
            const res = await fetch('http://localhost:4000/api/food', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: new URLSearchParams({
                    'name': foodName,
                    'calories': foodCalories,
                    'carbs': foodCarbs,
                    'fats': foodFats,
                    'protein': foodProtein,
                    'weight': 100,
                    'contributor': localStorage.getItem('id')
                })
            });
            const { error } = await res.json();
            if (error) {
                return console.error(401, {
                    error
                });
            } else {
                console.log("Success!");
                showContent = '';
                //Do something, close food tab?
            }
        } else {
            console.log("Macros do not add up to Calories.");
        }
    }
</script>

{#each contents as content}
    <div>
        <button type="button" on:click={() => handleClick(content)}>{content}</button>
        {#if showContent === content}
            <h3>Please make sure stats are for 100g of food</h3>
            <div class="field">
                <label for="name" class="label">Name</label>
                <input type="text" name="name" class="input" placeholder=" " bind:value={foodName} />
            </div>
            <br>

            <div class="field">
                <label for="calories" class="label">Calories</label>
                <input type="number" name="calories" class="input" placeholder=" " bind:value={foodCalories} />
            </div>
            <br>

            <div class="field">
                <label for="carbs" class="label">Carbs (g)</label>
                <input type="number" name="carbs" class="input" placeholder=" " bind:value={foodCarbs} />
            </div>
            <br>

            <div class="field">
                <label for="fats" class="label">Fat (g)</label>
                <input type="number" name="fats" class="input" placeholder=" " bind:value={foodFats} />
            </div>
            <br>

            <div class="field">
                <label for="protein" class="label">Protein (g)</label>
                <input type="number" name="protein" class="input" placeholder=" " bind:value={foodProtein} />
            </div>
            <br>

            <button on:click={postFood}>Add</button>
        {/if}
    </div>
{/each}

<style>
    div {
        padding: 10px 0;
        border-bottom: 1px solid #eaeaea;
    }

    button {
        margin: 0;
    }
</style>