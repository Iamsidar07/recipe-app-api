import express from "express";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import cors from "cors";
import { OpenAIApi, Configuration } from "openai";
import { result } from "./recommondedRecipe.js";

dotenv.config(); //env config

const app = express();
const port = 8080;

//middleware
app.use(bodyParser.json());
app.use(cors());

//creating openai configuration


console.log(process.env.ORGANIZATION_ID, process.env.OPENAI_API_KEY)

const configuration = new Configuration({
    organization: process.env.ORGANIZATION_ID,
    apiKey: process.env.OPENAI_API_KEY,
});

//Creating openai 

const openai = new OpenAIApi(configuration);

//get request

app.get("/",async(req,res)=>{
    res.status(500).json({result})
})

//post request
app.post("/api/v1/findRecipe", async (req, res) => {
    //Getting recomendation recipe
    const ingredients = req.body.ingredients;
    
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages:[
            { role:"system",content:"You are a master chef you know to make every recipe."},
            { role: "user", content: `I have following ingridients ${ [...ingredients]
    }.From this suggest me a recipe so that I can make food.The response should be a object give below and remember image should be from pixel website.Make sure that "recipeImageUrl" is emoji icon of recipe and "ingredientImageUrl" is emoji icon of individual ingredient this is important . your response should be a object. id should be unique every time and type of mongodb id.
        {
            "_id":"",
            "title": "",
            "description": "",
            "recipeImageUrl": "",
            "ingredients": [
                {
                    "name": "",
                    "ingredientImageUrl": "",
                    "quantity:" in gm",
                },
            ],
            "direction": [
                "step1",
                "step2",
            ],
            "serving": "4",
            "time": "30 minutes",
            "difficulty": "easy",
            "category": "Pasta",
        } 
        make sure all the fields are presents and all weights are in gram.Direction should be more descriptive explain all direction like I am 5. 
        ` }
        ],
        
    });

    const result=completion.data.choices[0].message;
    console.log(result)

    res.status(500).json({ "result":result.content });
});





//listen app
app.listen(port, () => {
    console.log("listening on port http://localhost:8080");
})