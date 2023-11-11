import express from 'express';
import Following_Data_Controller from "./followingController.js"

const following_router = express.Router();

following_router.route("/").get(Following_Data_Controller.apiGetFollowing);
following_router.route("/:userId").get(Following_Data_Controller.apiGetFollowingByUserId)

export default following_router;