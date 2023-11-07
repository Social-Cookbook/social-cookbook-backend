import express from 'express';
import Recipe_Posts_Controller from "./controller.js"
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
recipe_posts_router.route("/:postId").get(Recipe_Posts_Controller.apiGetPostById);
recipe_posts_router.route("/create").post(Recipe_Posts_Controller.apiCreatePosts);
recipe_posts_router.route("/update").put(Recipe_Posts_Controller.apiUpdatePosts);
recipe_posts_router.route("/:postId/update").put(Recipe_Posts_Controller.apiUpdatePostById);
recipe_posts_router.route("/delete").delete(Recipe_Posts_Controller.apiDeletePosts);
recipe_posts_router.route("/:postId/delete").delete(Recipe_Posts_Controller.apiDeletePostById);
// recipe_posts_router.route("/upload").post(Recipe_Posts_Controller.apiUploadImage);
recipe_posts_router.route("/upload").post(upload.single('image'), function (req, res) {
    console.log(req.file.originalname);
    res.json({ status: "success" });
});

export default recipe_posts_router;