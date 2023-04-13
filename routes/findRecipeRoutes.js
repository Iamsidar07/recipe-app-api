import express from "express";
import * as dotenv from "dotenv";
import Recipe from "../mongodb/models/Recipe.js";
import { Configuration, OpenAIApi } from 'openai';
import { v2 as cloudinary } from "cloudinary"

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRETE_KEY

})

const configuration = new Configuration({
    organization: process.env.ORGANIZATION_ID,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.route("/").post(async (req, res) => {

    const ingredients = req.body.ingredients;

    try {
        const getRecipeDetail = async () => {
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a master chef you know to make every recipe." },
                    {
                        role: "user", content: `I have following ingridients ${[...ingredients]
                            }.From this suggest me a recipe so that I can make food.The response should be a object give below."ingredientEmoji" is emoji icon of ingredient.use unsplash to get all images.Image that you are giving they are not exist so Send only images that are exist. Make sure to explain all of the steps of direction.Make sure to direct return only object do not any extra line not even single line.Do not add any extra word after or before object.id should be contains of alphabates and numbers and id should be unique. Please make sure to check all images are exist. Do not send 404 images.
{"title": "","description": "","recipeImageUrl":"","ingredients": [{"name": "","ingredientEmoji": "","quantity:" in gm",},],"direction": ["step1","step2"],"serving": "4","time": "30 minutes","difficulty": "easy","category": "Pasta",} 
        make sure all the fields are presents and all weights are in gram.Direction should be more descriptive explain all direction like I am 5. Direction should be in Hinglish language.
        ` }
                ],

            });
            return completion.data.choices[0].message.content;
        }

        const getRecipeImageUrl = async (recipeDetail) => {
            const imageCompletion = await openai.createImage({
                prompt: `${recipeDetail.title},Cinematic, realistic, Food phtotography, Marvel theme`,
                n: 1,
                size: "1024x1024",
                response_format: 'url',
            });
            return imageCompletion.data.data[0].url;
        }
        const uploadToMongoDB = async (recipeDetail, recipeImageUrlFromCloudinary) => {
            recipeDetail["recipeImageUrl"] = recipeImageUrlFromCloudinary;
            const newRecipe = await Recipe.create(recipeDetail);
            return newRecipe;
        }

        const recipeDetailRes = await getRecipeDetail();
        const recipeDetail = JSON.parse(recipeDetailRes);

        const recipeImageUrlFromDalle = await getRecipeImageUrl(recipeDetail);

        const recipeImageUrlFromCloudinaryResponse=await cloudinary.uploader.upload(recipeImageUrlFromDalle);
        const recipeImageUrlFromCloudinary=recipeImageUrlFromCloudinaryResponse.url;
        

        const newRecipeDetail = await uploadToMongoDB(recipeDetail, recipeImageUrlFromCloudinary);


        res.status(200).json({ success: true, result: newRecipeDetail });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error
        })
    }


});






export default router;
