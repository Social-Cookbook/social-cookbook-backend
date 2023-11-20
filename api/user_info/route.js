import express from 'express';
import User_Data_Controller from "./userController.js"

const user_info_router = express.Router();

user_info_router.route("/").get(User_Data_Controller.apiGetUsers);
user_info_router.route("/:userId").get(User_Data_Controller.apiGetUserById);
user_info_router.route("/userpage/:userId").get(User_Data_Controller.apiGetUserPageInfoById);
user_info_router.route("/create").post(User_Data_Controller.apiCreateUsers);
user_info_router.route("/update").put(User_Data_Controller.apiUpdateUsers);

export default user_info_router;