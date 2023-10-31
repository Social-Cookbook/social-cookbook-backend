import { Signup, Login } from "./AuthController.js";
import userVerification from "./AuthMiddleware.js";
import express from 'express';

const auth_router = express.Router();
auth_router.post('/signup', Signup)
auth_router.post('/login', Login)
auth_router.post('/', userVerification) // will is line conflict with recipe_post auth_router ???

export default auth_router;