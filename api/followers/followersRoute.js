import express from 'express';
import Followers_Data_Controller from "./followersController.js"

const followers_router = express.Router();

followers_router.route("/").get(Followers_Data_Controller.apiGetFollowers);
followers_router.route("/:userId").get(Followers_Data_Controller.apiGetFollowersByUserId)
followers_router.route("/create").post(Followers_Data_Controller.apiCreateEntry)
followers_router.route("/:userId/update").put(Followers_Data_Controller.apiUpdateFollowersByUserId)
//followers_router.route("/:followId/:yourId/follow").put(Followers_Data_Controller.apiPutNewFollowerByUserId)
followers_router.route("/:userId/follow").put(Followers_Data_Controller.apiPutNewFollowerByUserId)

export default followers_router;