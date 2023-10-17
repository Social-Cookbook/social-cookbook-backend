import mongodb from 'mongodb'
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

    static async addUser(user){
        try{
            const newUser = {
                user_id: ObjectId(user.id),
                user_name: user.name,
                user_username: user.username,
                user_password: user.password
            }
            return await users.insertOne(newUser)
        }
        catch(e){
            console.error(`unable to post review: ${e}`)
            return {error: e}
        }
    }

    static async updateUser(user){
        try{
            const updateResponse = await users.updateOne(
                {user_id: ObjectId(user.id)},
                { $set:{user_name: user.name, 
                    user_username: user.username, 
                    user_password: user.password}
                },
            )
            return updateResponse
    
        }
        catch(e){
            console.error(`unable to update review ${e}`)
            return {error: e}
        }
    }
}