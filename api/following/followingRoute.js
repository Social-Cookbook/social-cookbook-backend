import express from 'express';
import Following_Data_Controller from "./followingController.js"
import userVerification from "../user_system/AuthMiddleware.js";

const following_router = express.Router();

following_router.route("/").get(Following_Data_Controller.apiGetFollowing);
// following_router.route("/:userId").get(Following_Data_Controller.apiGetFollowingByUserId)
// following_router.route("/followingonly/:userId").get(Following_Data_Controller.apiGetOnlyFollowing)
// following_router.route("/:userId/following").put(Following_Data_Controller.apiPutNewFollowingByUserId)
// following_router.route("/numFollowing/:userId").get(Following_Data_Controller.apiGetFollowingNumber)

/* for logged in user */
following_router.route("/loggedInUser").get(userVerification, Following_Data_Controller.apiGetFollowingForLoggedInUser)
following_router.route("/loggedInUser").put(userVerification, Following_Data_Controller.apiPutNewFollowingForLoggedInUser)
following_router.route("/loggedInUser").delete(userVerification, Following_Data_Controller.apiDeleteFollowingForLoggedInUser)
following_router.route("/loggedInUser/onlyfollowing").get(userVerification, Following_Data_Controller.apiGetOnlyFollowingForLoggedInUser)
following_router.route("/loggedInUser/numFollowing").get(userVerification, Following_Data_Controller.apiGetFollowingNumberForLoggedInUser)

export default following_router;