import express from "express";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import Cors from "cors";
import connectDB from "./mongodb/connect.js";
import findRecipeRoutes from "./routes/findRecipeRoutes.js";
import allRecipeRoutes from "./routes/allRecipeRoutes.js";

dotenv.config(); //env config

const app = express();
const port = 8080;

//middleware
app.use(bodyParser.json());
app.use(Cors());

app.use("/api/v1/all",allRecipeRoutes);
app.use("/api/v1/findRecipe",findRecipeRoutes);

//start server

const startServer=()=>{
    // console.log(process.env.MONGODB_URL)
    try {
        connectDB(process.env.MONGODB_URL)
        app.get("/", async (req, res) => {
            res.send("Recipe app")
        })
        app.listen(port, () => console.log("Server is running"))
    } catch (error) {
        console.error(error)
    }
}

startServer();
