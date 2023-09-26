import express from "express"
import cors from "cors"
import recipe_posts_router from "./api/recipe_posts/route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/recipe-posts", recipe_posts_router)
app.use("*", (req, res) => res.status(404).json())

export default app