import { Signup, Login } from "./AuthController.js";
import userVerification from "./AuthMiddleware.js";
import express from "express";

const auth_router = express.Router();
auth_router.post("/signup", Signup);
auth_router.post("/login", Login);
auth_router.post("/", userVerification, (req, res, next) => {
  if (res.locals.username) {
    const username = res.locals.username;
    return res.json({ status: true, user: username });
  } else {
    return res.json({ status: false });
  }
});

export default auth_router;
