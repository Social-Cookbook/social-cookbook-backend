import mongodb from 'mongodb'
import Following_DAO from '../following/followingDAO.js'
import Followers_DAO from '../followers/followersDAO.js'
import Recipe_posts_DAO from "../recipe_posts/dao.js"

const ObjectId = mongodb.ObjectId

let user_data

export default class UserDataDAO {
    static async injectDB(conn){
        if(user_data){
            return
        }
        try{
            user_data = await conn.db(process.env.SC_NS).collection("users")
        } catch (e){
            console.error(`Unable to establish a connection: ${e}`)
        }
    }

    static async getUsers({
        filters = null,
        page = 0,
        usersPerPage = 20,
    } = {}) {
        let query 
        if(filters) {
            if("name" in filters){
                query = {"name": {$eq: filters["name"]}}
            } else if ("username" in filters){
                query = {"username": {$eq: filters["username"]}}
            }
        }

        let cursor

        try {
            cursor = await user_data.find(query)
        }
        catch(e){
            console.error(`unable to issue find command, ${e}`)
            return { userList: [], totalUsers: 0}
        }

        const displayCursor = cursor.limit(usersPerPage).skip(usersPerPage * page)
        
        try{
            const userList = await displayCursor.toArray()
            const totalUsers = await user_data.countDocuments(query)

            return {userList, totalUsers}
        }
        catch(e){
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
            return { userList: [], totalUsers: 0}
        }
    }

    static async getUserById(userId) {
        try {
            userId = new ObjectId(userId)
        } catch (e) {
            console.error(`Invalid user id given: ${e}`)
            // return []
        }
        const query = { "_id" :  userId}
        try {
            return await user_data.findOne(query)
        } catch (e) {
            console.error(`Unable to issue find command: ${e}`)
            return []
        }
    }

		static async getUserByUsername(username) {
			const query = { "username" :  username}
			try {
					return await user_data.findOne(query)
			} catch (e) {
					console.error(`Unable to issue find command: ${e}`)
					return []
			}
		}

    static async addUser(user){
        try{
            const newUser = {
                //input must be a 24 character hex string, 12 byte Uint8Array, or an integer
                _id: new ObjectId(user.id),
                name: user.name,
                username: user.username,
                password: user.password,
                email: user.email,
                bio: user.bio,
            }
            return await user_data.insertOne(newUser)
        }
        catch(e){
            console.error(`unable to add user: ${e}`)
            return {error: e}
        }
    }

    static async updateUser(user){
        try{
            const updateResponse = await user_data.updateOne(
                {   _id: new ObjectId(user.id),
                },
                {   
                    $set:{
                        name: user.name, 
                        username: user.username, 
                        password: user.password,
                        email: user.email,
                        bio: user.bio,
                    }
                },
            )
            console.log(new ObjectId(user.id))
            return updateResponse
    
        }
        catch(e){
            console.error(`user update error ${e}`)
            return {error: e}
        }
    }

    static async getUserPageInfoById(username, isCurrentUser, currentUserId) {
        let user = await this.getUserByUsername(username);
				let userId = user._id;
        let user_followers = await Followers_DAO.getFollowersByUserId(userId)
        let user_following = await Following_DAO.getFollowingByUserId(userId)
        let numFollowers
        if (user_followers) {
            numFollowers = user_followers.followers.length
        } else {
            numFollowers = 0
        }
        let numFollowing
        if (user_following) {
            numFollowing = user_following.follows.length
        } else {
            numFollowing = 0
        }

        let { postsList, numPosts } = await Recipe_posts_DAO.getPostByUserId(userId)

        if (!postsList) {
            postsList = []
        }
        if (!numPosts) {
            numPosts = 0
        }

        let userInfo = {
            username : user.username,
            profile_picture : null,
            num_followers : numFollowers,
            num_following : numFollowing,
            posts : postsList,
            num_posts : numPosts,
						is_current_user: isCurrentUser,
						follows: user_followers.followers.some(val => val.toString() == currentUserId),
						user_id: userId,
        }
        return userInfo;
    }
}