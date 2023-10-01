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

        const { postsList, totalNumPosts } = await Recipe_posts_DAO.getRecipePosts({
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
}