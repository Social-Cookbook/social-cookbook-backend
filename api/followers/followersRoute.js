import express from 'express';
import Followers_Data_Controller from "./followersController.js"
import userVerification from "../user_system/AuthMiddleware.js";

const followers_router = express.Router();

followers_router.route("/").get(Followers_Data_Controller.apiGetFollowers);
followers_router.route("/loggedInUser").get(userVerification, Followers_Data_Controller.apiGetFollowersForLoggedInUser)
followers_router.route("/loggedInUser").put(userVerification, Followers_Data_Controller.apiPutNewFollowersForLoggedInUser)
followers_router.route("/loggedInUser").delete(userVerification, Followers_Data_Controller.apiDeleteFollowersForLoggedInUser)
followers_router.route("/loggedInUser/numFollowers").get(userVerification, Followers_Data_Controller.apiGetFollowersNumberForLoggedInUser)

// followers_router.route("/:userId").get(Followers_Data_Controller.apiGetFollowersByUserId)
// //followers_router.route("/create").post(Followers_Data_Controller.apiCreateEntry)
// followers_router.route("/:userId/update").put(Followers_Data_Controller.apiUpdateFollowersByUserId)
// //followers_router.route("/:followId/:yourId/follow").put(Followers_Data_Controller.apiPutNewFollowerByUserId)
// followers_router.route("/:userId/follow").put(Followers_Data_Controller.apiPutNewFollowerByUserId)
// followers_router.route("/numFollowers/:userId").get(Followers_Data_Controller.apiGetFollowersNumber)

export default followers_router;