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
        try {
            postId = new ObjectId(postId)
        } catch (e) {
            console.error(`Invalid post id given: ${e}`)
            // return []
        }
        const query = { "_id" :  postId}
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

    // static async updatePost(post, userId) {
    //     try {
    //         const updateResponse = await recipe_posts.updateOne(
    //             {
    //                 _id: new ObjectId(post._id),
    //                 userId: new ObjectId(userId),
    //             },
    //             {
    //                 $set: {
    //                     title: post.title,
    //                     description: post.description,
    //                     steps: post.steps,
    //                     ingredients: post.ingredients,
    //                     totalPrice: post.totalPrice,
    //                     photoURLs: post.photoURLs,
    //                 }
    //             }
    //         )

    //         return updateResponse
    //     } catch (e) {
    //         console.error(`Unable to update post: ${e}`)
    //         return { error : e }
    //     }
    // }

    static async updatePostById(post, postId, userId) {
        try {
            postId = new ObjectId(postId)
        } catch (e) {
            console.error(`Invalid post id given: ${e}`)
            return { error : `Invalid post id given`}
        }
        try {
            const updateResponse = await recipe_posts.updateOne(
                {
                    _id: postId,
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
            console.log(updateResponse)
            return updateResponse
        } catch (e) {
            console.error(`Unable to update post: ${e}`)
            return { error : e }
        }
    }

    static async deletePost(postId, userId) {
        try {
            postId = new ObjectId(postId)
        } catch (e) {
            console.error(`Invalid post id given: ${e}`)
            return { error : `Invalid post id given`}
        }
        try {
            const deleteResponse = await recipe_posts.deleteOne(
                {
                    _id: postId,
                    userId: new ObjectId(userId),
                }
            )

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete post: ${e}`)
            return { error : e }
        }
    }

    static async getPostByUserId(userId) {
        try {
            userId = new ObjectId(userId)
        } catch (e) {
            console.error(`Invalid user id given: ${e}`)
        }

        const query = { "userId" :  userId }
        let cursor

        try {
            cursor = await recipe_posts.find(query)

        } catch (e) {
            console.error(`Unable to issue find command: ${e}`)
            return []
        }

        try {
            const postsList = await cursor.toArray()
            const numPosts = await recipe_posts.countDocuments(query)

            return { postsList, numPosts }
        } catch (e) {
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
            return { postsList: [], totalNumPosts: 0 }
        }
    }
}