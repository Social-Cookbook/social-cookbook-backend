import express from 'express';
import Recipe_Posts_Controller from "../recipe_posts/controller.js"
import Following_Data_Controller from "../following/followingController.js"

import multer from "multer"
import AWS from "aws-sdk"
import multerS3 from "multer-s3"

const recipe_posts_router = express.Router();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'social-cookbook-images',
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
});


recipe_posts_router.route("/").get(Recipe_Posts_Controller.apiGetPosts);

//Testing using another controller (Following_Data_Controller): disregard these (they work)
//recipe_posts_router.route("/").get(Following_Data_Controller.apiGetFollowing);
//recipe_posts_router.route("/followingonly/:userId").get(Following_Data_Controller.apiGetOnlyFollowing)

recipe_posts_router.route("/:postId").get(Recipe_Posts_Controller.apiGetPostById);
recipe_posts_router.route("/create").post(Recipe_Posts_Controller.apiCreatePosts);
recipe_posts_router.route("/update").put(Recipe_Posts_Controller.apiUpdatePosts);
recipe_posts_router.route("/:postId/update").put(Recipe_Posts_Controller.apiUpdatePostById);
recipe_posts_router.route("/delete").delete(Recipe_Posts_Controller.apiDeletePosts);
recipe_posts_router.route("/:postId/delete").delete(Recipe_Posts_Controller.apiDeletePostById);
recipe_posts_router.route("/upload").post(upload.any('images'), function (req, res) {
    let files = req.files;
    let urls = [];
    let urlBase = "https://social-cookbook-images.s3.amazonaws.com/";
    if (files) {
        files.forEach(function (file) {
            let url = urlBase + file.key;
            urls.push(url);
        })
    }
    res.json({ status: "success", urls: urls });
});
recipe_posts_router.route("/user/:userId").get(Recipe_Posts_Controller.apiGetPostByUserId);

//routes utilizing controller functions that rely on followingDAO.js
recipe_posts_router.route("/followingonly/:userId").get(Recipe_Posts_Controller.apiGetOnlyFollowing);
recipe_posts_router.route("/followingposts/:userId").get(Recipe_Posts_Controller.apiGetPostByFollowingList);

export default recipe_posts_router;