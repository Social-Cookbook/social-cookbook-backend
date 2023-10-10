import express from 'express';
import Recipe_Posts_Controller from "./controller.js"

const recipe_posts_router = express.Router();

recipe_posts_router.route("/").get(Recipe_Posts_Controller.apiGetPosts);
recipe_posts_router.route("/:postId").get(Recipe_Posts_Controller.apiGetPostById);
recipe_posts_router.route("/create").post(Recipe_Posts_Controller.apiCreatePosts);
recipe_posts_router.route("/update").put(Recipe_Posts_Controller.apiUpdatePosts);
recipe_posts_router.route("/:postId/update").put(Recipe_Posts_Controller.apiUpdatePostById);
recipe_posts_router.route("/delete").delete(Recipe_Posts_Controller.apiDeletePosts);
recipe_posts_router.route("/:postId/delete").delete(Recipe_Posts_Controller.apiDeletePostById);

export default recipe_posts_router;