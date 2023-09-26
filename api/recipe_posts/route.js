import express from 'express';

const recipe_posts_router = express.Router();

recipe_posts_router.route("/").get((req, res) => {
    res.send("Hello World");
});

recipe_posts_router.route("/create").post((req, res) => {
    const { a } = req.body
})

export default recipe_posts_router;