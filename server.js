import express from "express"
import cors from "cors"
import recipe_posts_router from "./api/recipe_posts/route.js"
import multer from "multer"
import AWS from "aws-sdk"
import multerS3 from "multer-s3"

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

const app = express()

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'social-cookbook-images',
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
});

app.post('/upload', upload.single('image'), function (req, res, next) {
    console.log(req.file.originalname);
});


app.use(cors())
app.use(express.json())

app.use("/api/recipe-posts", recipe_posts_router)
app.use("*", (req, res) => res.status(404).json())

export default app