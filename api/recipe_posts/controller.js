import Recipe_posts_DAO from "../recipe_posts/dao.js";
import Following_DAO from "../following/followingDAO.js";

// import multer from "multer"
// import AWS from "aws-sdk"
// import multerS3 from "multer-s3"

export default class Recipe_Posts_Controller {
    static async apiGetPosts(req, res, next) {
        const postsPerPage = req.query.postsPerPage ? parseInt(req.query.postsPerPage, 10) : 100
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.title) {
            filters.title = req.query.title
        } else if (req.query.name) {
            filters.name = req.query.name
        }

        const { postsList, totalNumPosts } = await Recipe_posts_DAO.getPosts({
            filters,
            page, 
            postsPerPage,
        })

        let response = {
            posts: postsList,
            page: page,
            filters: filters,
            entries_per_page: postsPerPage,
            total_results: totalNumPosts,
        }

        res.json(response)
    }

    static async apiGetPostById(req, res, next) {
        try {
            const { postId } = req.params;
            let post = await Recipe_posts_DAO.getPostById(postId)
            
            if (!post) {
                throw new Error(
                    `Unable to get post with id ${postId} as it may not exist`
                )
            }

            res.json(post)
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    static async apiCreatePosts(req, res, next) {
        try {
            const title = req.body.title
            const description = req.body.description
            const steps = req.body.steps
            const ingredients = req.body.ingredients
            const totalPrice = req.body.totalPrice
            const calories = req.body.calories
            const servings = req.body.servings
            const cookTime = req.body.cookTime
            const photoURLs = req.body.photoURLs

            const post = {
                title: title,
                description: description,
                steps: steps,
                ingredients: ingredients,
                totalPrice: totalPrice,
                calories: calories,
                servings: servings,
                cookTime: cookTime,
                photoURLs: photoURLs,
            }
            const userId = res.locals.userId

            const postResponse = await Recipe_posts_DAO.addPost(
                post,
                userId,
            )
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdatePosts(req, res, next) {
        try {
            const title = req.body.title
            const description = req.body.description
            const steps = req.body.steps
            const ingredients = req.body.ingredients
            const totalPrice = req.body.totalPrice
            const calories = req.body.calories
            const servings = req.body.servings
            const cookTime = req.body.cookTime
            const photoURLs = req.body.photoURLs

            const post = {
                title: title,
                description: description,
                steps: steps,
                ingredients: ingredients,
                totalPrice: totalPrice,
                calories: calories,
                servings: servings,
                cookTime: cookTime,
                photoURLs: photoURLs,
            }

            const postResponse = await Recipe_posts_DAO.updatePostById(
                post,
                req.body._id,
                req.body.userId,
            )

            var { error } = postResponse
            if (error) {
                res.status(400).json({ error })
                return 
            }

            if (postResponse.modifiedCount === 0) {
                throw new Error (
                    "Unable to update - user may not be the original poster",
                )
            }
        
            res.json({ status: "success" })

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdatePostById(req, res, next) {
        try {
            const { postId } = req.params;
            const title = req.body.title
            const description = req.body.description
            const steps = req.body.steps
            const ingredients = req.body.ingredients
            const totalPrice = req.body.totalPrice
            const calories = req.body.calories
            const servings = req.body.servings
            const cookTime = req.body.cookTime
            const photoURLs = req.body.photoURLs

            const post = {
                title: title,
                description: description,
                steps: steps,
                ingredients: ingredients,
                totalPrice: totalPrice,
                calories: calories,
                servings: servings,
                cookTime: cookTime,
                photoURLs: photoURLs,
            }
            
            const postResponse = await Recipe_posts_DAO.updatePostById(
                post,
                postId,
                req.body.userId,
            )

            var { error } = postResponse
            if (error) {
                res.status(400).json({ error })
                return
            }

            if (postResponse.modifiedCount === 0) {
                throw new Error (
                    "Unable to update - user may not be the original poster",
                )
            }
        
            res.json({ status: "success" })

        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    static async apiDeletePosts(req, res, next) {
        try {
            const postId = req.query.id
            const userId = req.body.userId

            const postResponse = await Recipe_posts_DAO.deletePost(
                postId,
                userId,
            )
            res.json({ status: "success" })

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeletePostById(req, res, next) {
        try {
            const { postId } = req.params;
            const userId = req.body.userId

            const postResponse = await Recipe_posts_DAO.deletePost(
                postId,
                userId,
            )
            res.json({ status: "success" })

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    // static async apiUploadImage(req, res, next) {
    //     try {
    //         AWS.config.update({
    //             accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //             secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    //         });
    //         const s3 = new AWS.S3();
    //         const upload = multer({
    //             storage: multerS3({
    //                 s3: s3,
    //                 bucket: 'social-cookbook-images',
    //                 key: function (req, file, cb) {
    //                     cb(null, Date.now().toString())
    //                 }
    //             })
    //         });
    //         // app.post('/upload', upload.single('image'), function (req, res, next) {
    //         //     console.log(req.file.originalname);
    //         // });
    //         upload.single('image');
    //         res.json({ status: "success" })
    //     } catch (e) {
    //         res.status(500).json({ error: e.message })
    //     }
    // }

    static async apiGetPostByUserId(req, res, next) {
        try {
            const { userId } = req.params;
            const { postsList, numPosts } = await Recipe_posts_DAO.getPostByUserId(userId)
            
            if (!postsList) {
                throw new Error(
                    `Unable to get posts by user ${userId} as user may not exist`
                )
            }
            
            let response = {
                postList : postsList,
                numPosts : numPosts,
            }
            res.json(response)
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    static async apiGetOnlyFollowing(req, res, next) {
        try {
            const { userId } = req.params;
            let user = await Following_DAO.getFollowingByUserId(userId)
            
            if (!user) {
                throw new Error(
                    `Unable to get following for user with id ${userId} as it may not exist`
                )
            }
            let followingList = user.follows
            console.log(followingList)
            res.json(followingList)
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    static async apiGetPostByFollowingList(req, res, next) {
        try {
            const userId = res.locals.userId;
            let user = await Following_DAO.getFollowingByUserId(userId)
            
            if (!user) {
                throw new Error(
                    `Unable to get following for user with id ${userId} as it may not exist`
                )
            }

            let followingList = user.follows

            const { postsList, numPosts } = await Recipe_posts_DAO.getPostByUserFollowing(followingList)
            
            if (!postsList) {
                throw new Error(
                    `Unable to get posts by user ${userId} as user may not exist`
                )
            }
            
            let response = {
                postList : postsList,
                numPosts : numPosts,
            }
            res.json(response)
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }
}