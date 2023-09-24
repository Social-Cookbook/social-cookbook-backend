import express from "express"
import cors from "cors"
import recipe_posts from "./api/recipe_posts.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/recipe_posts", recipe_posts)
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

export default app

