import express from 'express';
import Following_Data_Controller from "./followingController.js"

const following_router = express.Router();

following_router.route("/").get(Following_Data_Controller.apiGetFollowing);
following_router.route("/:userId").get(Following_Data_Controller.apiGetFollowingByUserId)
following_router.route("/followingonly/:userId").get(Following_Data_Controller.apiGetOnlyFollowing)
following_router.route("/:userId/following").put(Following_Data_Controller.apiPutNewFollowingByUserId)

export default following_router;