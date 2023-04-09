import mongoose from "mongoose";

const Ingredient = new mongoose.Schema(
    {
        name: { type: String, required: true },
        ingredientImageUrl: { type: String, required: true },
        quantity: { type: String, required: true }
    }
)

const IngredientSchema = mongoose.model("Ingredient",Ingredient) 

export default IngredientSchema;