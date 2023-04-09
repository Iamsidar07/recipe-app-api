import express from "express";
import * as dotenv from "dotenv";
import Recipe from "../mongodb/models/Recipe.js";
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const router = express.Router();

const configuration = new Configuration({
    organization: process.env.ORGANIZATION_ID,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.route("/").post(async (req, res) => {
    //post request
    //Finding recipe from Ingredients
    const ingredients = req.body.ingredients;
    // const ingredients=["tomato","bread","egg","cuccumber"];
    // console.log(ingredients,"ingredients");
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a master chef you know to make every recipe." },
                {
                    role: "user", content: `I have following ingridients ${[...ingredients]
                        }.From this suggest me a recipe so that I can make food.The response should be a object give below.Make sure that "recipeImageUrl" is image url of the recipe and "ingredientImageUrl" is image of ingredient. your response should be a object.Use https://source.unsplash.com/random/?recipeTitle to get all image url. Do not forget to replace the recipeTitle with the recipe title you get. Make sure to explain all of the steps of direction.Make sure to direct return only object do not any extra line not even single line.Do not add any extra word after or before object.id should be contains of alphabates and numbers and id should be unique.
{"id":"","title": "","description": "","recipeImageUrl": "","ingredients": [{"name": "","ingredientImageUrl": "","quantity:" in gm",},],"direction": ["step1","step2"],"serving": "4","time": "30 minutes","difficulty": "easy","category": "Pasta",} 
        make sure all the fields are presents and all weights are in gram.Direction should be more descriptive explain all direction like I am 5. 
        ` }
            ],

        });

        const result = completion.data.choices[0].message.content;

        //create Recipe in mongodb
        console.log(result)
        const newRecipe = await Recipe.create(JSON.parse(result));
        console.log({ newRecipe });
        // console.log(result)
        res.status(200).json({ success: true, result: newRecipe });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error
        })
    }


});






export default router;