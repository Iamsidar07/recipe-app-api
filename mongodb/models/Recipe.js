import mongoose from "mongoose";
const Recipe = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        recipeImageUrl: { type: String, required: true },
        ingredients: [
            {
                name: { type: String, required: true },
                ingredientEmoji: { type: String, required: true },
                quantity: { type: String, required: true }
            }
        ],
        direction: [
            String
        ],
        directions: [
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