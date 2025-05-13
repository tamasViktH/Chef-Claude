import React from "react"
import IngredientsList from "./components/IngredientsList"
import ClaudeRecipe from "./components/ClaudeRecipe"
import { getRecipeFromChefClaude } from "./ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState([
        "chicken", "all the main spices", "corn", "heavy cream", "pasta"
    ])
    const [recipe, setRecipe] = React.useState("")
    const [inputValue, setInputValue] = React.useState("")
    const [loading, setLoading] = React.useState(false) // Add loading state

    async function getRecipe() {
        setLoading(true) // Start loading
        setRecipe("")    // Optionally clear previous recipe
        const recipeMarkdown = await getRecipeFromChefClaude(ingredients)
        setRecipe(recipeMarkdown)
        setLoading(false) // Stop loading
    }

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
        setInputValue("")
    }

    function removeIngredient(index) {
        setIngredients(prevIngredients =>
            prevIngredients.filter((_, i) => i !== index)
        )
    }

    return (
        <main>
            <div className="app-content">
                <form
                    action={addIngredient}
                    className="add-ingredient-form"
                    style={{ display: "flex", gap: "0.5em", alignItems: "center" }}
                >
                    <input
                        type="text"
                        placeholder="e.g. oregano"
                        aria-label="Add ingredient"
                        name="ingredient"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                    />
                    <button type="submit" disabled={!inputValue.trim()}>Add ingredient</button>
                    <button
                        type="button"
                        onClick={() => removeIngredient(ingredients.length - 1)}
                        disabled={ingredients.length === 0}
                    >
                        Remove ingredient
                    </button>
                </form>

                {ingredients.length > 0 &&
                    <IngredientsList
                        ingredients={ingredients}
                        getRecipe={getRecipe}
                        removeIngredient={removeIngredient}
                    />
                }

                {loading && (
                    <div className="recipe-card">
                        <p>Chef Claude is thinking... 🍳<br />Your delicious recipe is on its way!</p>
                    </div>
                )}

                {!loading && recipe && <ClaudeRecipe recipe={recipe} />}
            </div>
        </main>
    )
}