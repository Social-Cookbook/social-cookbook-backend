import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectId

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

    static async getPosts({
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

    static async getPostById(postId) {
        const query = { "id" : postId }
        try {
            return await recipe_posts.findOne(query)
        } catch (e) {
            console.error(`Unable to issue find command: ${e}`)
            return []
        }
    }

    static async addPost(post, userID) {
        try {
            const new_post = {
                id: post.id,
                title: post.title,
                description: post.description,
                steps: post.steps,
                ingredients: post.ingredients,
                totalPrice: post.totalPrice,
                photoURLs: post.photoURLs,
                userId: new ObjectId(userID),
            }

            return await recipe_posts.insertOne(new_post)
        } catch (e) {
            console.error(`Unable to create post: ${e}`)
            return { error : e }
        }
    }

    static async updatePost(post, userId) {
        try {
            const updateResponse = await recipe_posts.updateOne(
                {
                    id: post.id,
                    userId: new ObjectId(userId),
                },
                {
                    $set: {
                        title: post.title,
                        description: post.description,
                        steps: post.steps,
                        ingredients: post.ingredients,
                        totalPrice: post.totalPrice,
                        photoURLs: post.photoURLs,
                    }
                }
            )

            return updateResponse
        } catch (e) {
            console.error(`Unable to update post: ${e}`)
            return { error : e }
        }
    }

    static async updatePostById(post, postId, userId) {
        try {
            const updateResponse = await recipe_posts.updateOne(
                {
                    id: postId,
                    userId: new ObjectId(userId),
                },
                {
                    $set: {
                        title: post.title,
                        description: post.description,
                        steps: post.steps,
                        ingredients: post.ingredients,
                        totalPrice: post.totalPrice,
                        photoURLs: post.photoURLs,
                    }
                }
            )

            return updateResponse
        } catch (e) {
            console.error(`Unable to update post: ${e}`)
            return { error : e }
        }
    }

    static async deletePost(postId, userId) {
        try {
            const deleteResponse = await recipe_posts.deleteOne(
                {
                    id: postId,
                    userId: new ObjectId(userId),
                }
            )

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete post: ${e}`)
            return { error : e }
        }
    }

    // static async deletePostById(postId, userId) {
    //     try {
    //         const deleteResponse = await recipe_posts.deleteOne(
    //             {
    //                 id: postId,
    //                 userId: new ObjectId(userId),
    //             }
    //         )

    //         return deleteResponse
    //     } catch (e) {
    //         console.error(`Unable to delete post: ${e}`)
    //         return { error : e }
    //     }
    // }
}