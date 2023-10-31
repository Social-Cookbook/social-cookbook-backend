import express from 'express';
import Followers_Data_Controller from "./followersController.js"

const followers_router = express.Router();

followers_router.route("/").get(Followers_Data_Controller.apiGetFollowers);
followers_router.route("/:userId").get(Followers_Data_Controller.apiGetFollowersByUserId)

export default followers_router;