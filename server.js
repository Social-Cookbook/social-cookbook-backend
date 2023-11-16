import cookieParser from "cookie-parser";
import auth_router from "./api/user_system/AuthRoute.js";
import authRoute from "./api/user_system/AuthRoute.js";
import express from "express";
import cors from "cors";
import recipe_posts_router from "./api/recipe_posts/route.js";
import user_info_router from "./api/user_info/route.js";
import followers_info_router from "./api/followers/followersRoute.js";


const app = express()

const corsOptions = {
    origin: 'http://localhost:3001', // The exact origin of the frontend
    credentials: true, // This allows the server to accept cookies from the frontend
};

app.use(cors(corsOptions))
app.use(express.json())

app.use(cookieParser());
app.use("/", authRoute);
app.use("/api/auth", auth_router)
app.use("/api/recipe-posts", recipe_posts_router);
app.use("/api/followers", followers_info_router);
app.use("/api/users", user_info_router);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
