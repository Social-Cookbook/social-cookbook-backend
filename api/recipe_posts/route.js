import express from 'express';
import Recipe_Posts_Controller from "./controller.js"

const recipe_posts_router = express.Router();

recipe_posts_router.route("/").get(Recipe_Posts_Controller.apiGetPosts);

recipe_posts_router.route("/create").post((req, res) => {
    const { a } = req.body
})

export default recipe_posts_router;