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
            console.error(`unable to post review: ${e}`)
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
}