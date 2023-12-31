import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectId

let followers_data

export default class Followers_DAO {
    static async injectDB(conn) {
        if (followers_data) {
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

            return { userFollowersList, numUsers }
        } catch (e) {
            console.error('Unable to convert cursor to array or problem counting documents, ${e}')
            return { userFollowersList: [], numUsers: 0 }
        }
    }

    static async getFollowersByUserId(userId) {
        try {
            var userObjId = new ObjectId(userId);
        } catch (e) {
            console.error('Invalid user id given: ' + e)
        }
        const query = { "user": userObjId }
        try {
            return await followers_data.findOne(query)
        } catch (e) {
            console.error('Unable to issue find command: ' + e)
            return []
        }
    }

    static async addFollowerEntryNewUser(userId) {
        try {
            let emptyArray = [];

            const new_entry = {
                user: userId,
                followers: emptyArray,
            }

            return await followers_data.insertOne(new_entry)
        } catch (e) {
            console.error('Unable to create new follower entry')
            return { error: e }
        }
    }

    static async updateFollowersByUserId(doc, userId) {
        try {
            userId = new ObjectId(userId)
        } catch (e) {
            console.error('Invalid user id given: ${e}')
            return { error: 'Invalid user id given' }
        }
        try {
            const updateResponse = await followers_data.updateOne(
                {
                    user: userId,
                },
                {
                    $set: {
                        followers: doc.followers,
                    }
                }
            )
            console.log(updateResponse)
            return updateResponse
        } catch (e) {
            console.error('Unable to issue find command: ${e}')
            return { error: e }
        }
    }

    static async putNewFollowers(yourId, userId) {
        try {
            userId = new ObjectId(userId);
            yourId = new ObjectId(yourId);
        } catch (e) {
            console.error('Invalid user id given: ' + e);
            return { error: 'Invalid user id given (both must be 24-digit hex strings)' };
        }

        // Check if 'yourId' is already in 'userId's followers array
        const isAlreadyFollower = await followers_data.countDocuments({
            user: userId,
            followers: yourId
        });

        if (isAlreadyFollower) {
            // If 'yourId' is already a follower, there's no need to add them again
            return { error: 'Already followed' };
        }

        try {
            const updateResponse = await followers_data.updateOne(
                { user: userId },
                { $addToSet: { followers: yourId } },
                { upsert: true } // Creates a new document if one doesn't exist
            );

            console.log(updateResponse);
            return updateResponse;
        } catch (e) {
            console.error('Unable to add new follower: ' + e);
            return { error: e };
        }
    }

    static async deleteFollowers(followerId, userId) {
        try {
            userId = new ObjectId(userId)
            followerId = new ObjectId(followerId)
        } catch (e) {
            console.error('Invalid user id given: ' + e)
            return { error: 'Invalid user id given (both must be 24-digit hex strings)' }
        }
        try {
            const updateResponse = await followers_data.updateOne(
                {
                    user: userId,
                },
                {
                    $pull: {
                        followers: followerId,
                    }
                }
            )

            // console.log(updateResponse)
            return updateResponse
        } catch (e) {
            console.error('Unable to delete follower: ' + e)
            return { error: e }
        }
    }
}