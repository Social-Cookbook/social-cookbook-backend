import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectId

let followers_data

export default class Followers_DAO {
    static async injectDB(conn) {
        if(followers_data) {
            return
        }

        try {
            followers_data = await conn.db(process.env.SC_NS).collection("follower")
        } catch (e) {
            console.error('Unable to establish a connection: ${e}')
        }
    }

    static async getFollowers({
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
            cursor = await followers_data.find(query)
        } catch (e) {
            console.error('Unable to issue find command: ${e}')
            return { userFollowersList: [], numUsers: 0 }
        }

        const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page)

        try {
            const userFollowersList = await displayCursor.toArray()
            const numUsers = await followers_data.countDocuments(query)

            return { userFollowersList, numUsers}
        } catch (e) {
            console.error('Unable to convert cursor to array or problem counting documents, ${e}')
            return { userFollowersList: [], numUsers: 0 }
        }
    }

    static async getFollowersByUserId(userId) {
        try {
            userId = new ObjectId(userId)
        } catch (e) {
            console.error('Invalid user id given: ${e}')
        }
        const query = { "user" : userId}
        try {
            return await followers_data.findOne(query)
        } catch (e) {
            console.error('Unable to issue find command: ${e}')
            return []
        }
    }
}