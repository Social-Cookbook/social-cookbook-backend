import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectId

let following_data

export default class Following_DAO {
    static async injectDB(conn) {
        if(following_data) {
            return
        }

        try {
            following_data = await conn.db(process.env.SC_NS).collection("following")
        } catch (e) {
            console.error('Unable to establish a connection: ${e}')
        }
    }

    static async getFollowing({
        filters = null,
        page = 0,
        usersPerPage = 20,
    } = {}) {

        let query
        if (filters) {
            if ("name" in filters) {
                query = { $text: { $search: filters["name"] } }
            } else if ("user" in filters) {
                query = { "user": { $eq: filters["user"] } }
            }
        }

        let cursor
        try {
            cursor = await following_data.find(query)
        } catch (e) {
            console.error('Unable to issue find command: ' + e)
            return { userFollowingList: [], numUsers: 0 }
        }

        const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page)

        try {
            const userFollowingList = await displayCursor.toArray()
            const numUsers = await following_data.countDocuments(query)

            return { userFollowingList, numUsers}
        } catch (e) {
            console.error('Unable to convert cursor to array or problem counting documents, ${e}')
            return { userFollowingList: [], numUsers: 0 }
        }
    }

    static async getFollowingByUserId(userId) {
        try {
            userId = new ObjectId(userId)
        } catch (e) {
            console.error('Invalid user id given: ' + e)
        }

        const query = { "user" : userId} 

        try {
            return await following_data.findOne(query)
        } catch (e) {
            console.error('Unable to issue find command: ' + e)
            return []
        }
    }

    static async putNewFollowing(followingId, userId) {
        try {
            userId = new ObjectId(userId)
            followingId = new ObjectId(followingId)
        } catch (e) {
            console.error('Invalid user id given: ' + e)
            return { error: 'Invalid user id given (both must be 24-digit hex strings)' }
        }
        try {
            const updateResponse = await following_data.updateOne(
                {
                    user: userId,
                },
                {
                    /*
                    $push: {
                        followers: doc.followers,
                    }
                    */

                    $addToSet: {
                        follows: followingId,
                    }
                }
            )

            console.log(updateResponse)
            return updateResponse
        } catch (e) {
            console.error('Unable to add new follower: ' + e)
            return { error : e }
        }
    }
}