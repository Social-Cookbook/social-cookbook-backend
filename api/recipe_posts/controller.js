import Recipe_posts_DAO from "./dao.js";

export default class Recipe_Posts_Controller {
    static async apiGetPosts(req, res, next) {
        const postsPerPage = req.query.postsPerPage ? parseInt(req.query.postsPerPage, 10) : 20
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
            let post = await Recipe_posts_DAO.getPostById(Number(postId))
            
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
            const id = req.body.id
            const title = req.body.title
            const description = req.body.description
            const steps = req.body.steps
            const ingredients = req.body.ingredients
            const totalPrice = req.body.totalPrice
            const photoURLs = req.body.photoURLs

            const post = {
                id: id,
                title: title,
                description: description,
                steps: steps,
                ingredients: ingredients,
                totalPrice: totalPrice,
                photoURLs: photoURLs,
            }
            const userId = req.body.userId

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
            const id = req.body.id
            const title = req.body.title
            const description = req.body.description
            const steps = req.body.steps
            const ingredients = req.body.ingredients
            const totalPrice = req.body.totalPrice
            const photoURLs = req.body.photoURLs

            const post = {
                id: id,
                title: title,
                description: description,
                steps: steps,
                ingredients: ingredients,
                totalPrice: totalPrice,
                photoURLs: photoURLs,
            }

            const postResponse = await Recipe_posts_DAO.updatePost(
                post,
                req.body.userId,
            )

            var { error } = postResponse
            if (error) {
                res.status(400).json({ error })
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
            const photoURLs = req.body.photoURLs

            const post = {
                title: title,
                description: description,
                steps: steps,
                ingredients: ingredients,
                totalPrice: totalPrice,
                photoURLs: photoURLs,
            }
            
            const postResponse = await Recipe_posts_DAO.updatePostById(
                post,
                Number(postId),
                req.body.userId,
            )

            var { error } = postResponse
            if (error) {
                res.status(400).json({ error })
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
                Number(postId),
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
                Number(postId),
                userId,
            )
            res.json({ status: "success" })

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}