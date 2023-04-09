import mongoose from "mongoose";
import IngredientSchema from "./Ingredient.js";
const Recipe = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        recipeImageUrl: { type: String, required: true },
        ingredients: [
            { type: String, required: true }
        ],
        direction: [
            String
        ],
        serving: { type: String, required: true },
        time: { type: String, required: true },
        difficulty: { type: String, required: true },
        category: { type: String, required: true }
    }
)

const RecipeSchema = mongoose.model("Recipe", Recipe);
export default RecipeSchema;