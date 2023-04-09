import express from "express";
import Recipe from "../mongodb/models/Recipe.js";

const router = express.Router();


router.route("/").get(async (req, res) => {
    try {
        const recipeDatas = await Recipe.find({});
        res.status(200).json({ success: true, result: recipeDatas })
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
})

export default router;