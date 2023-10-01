let recipe_posts

export default class Recipe_posts_DAO {
    static async injectDB(conn) {
        if (recipe_posts) {
            return
        }
        try {
            recipe_posts = await conn.db(process.env.SC_NS).collection("posts")
        } catch (e) {
            console.error(`Unable to establish a connection: ${e}`)
        }
    }

    static async getRecipePosts({
        filters = null,
        page = 0,
        postsPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            if ("name" in filters) {
                // May need to config some stuff for $text
                query = { $text: { $search: filters["name"] } }
            } else if ("title" in filters) {
                query = { "title": { $eq: filters["title"] } }
            }
        }

        let cursor
        try {
            cursor = await recipe_posts.find(query)
        } catch (e) {
            console.error(`Unable to issue find command: ${e}`)
            return { postsList: [], totalNumPosts: 0 }
        }

        const displayCursor = cursor.limit(postsPerPage).skip(postsPerPage * page)

        try {
            const postsList = await displayCursor.toArray()
            const totalNumPosts = await recipe_posts.countDocuments(query)
            return { postsList, totalNumPosts }
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
            return { postsList: [], totalNumPosts: 0 }
        }
    }
}