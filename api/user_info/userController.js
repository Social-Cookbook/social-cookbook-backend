import UserDataDAO from "./userDAO.js";

export default class User_Data_Controller{
    static async apiGetUsers(req, res, next){
        console.log('here')
        const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if(req.query.name){
            filters.name = req.query.name
        } else if(req.query.username){
            filters.username = req.query.username
        }

        const {userList, totalUsers} = await UserDataDAO.getUsers({
            filters,
            page,
            usersPerPage
        })

        let response = {
            users: userList,
            page: page,
            filters: filters,
            entries_per_page: usersPerPage,
            total_results: totalUsers,
        }
        res.json(response)
    }
    
    static async apiCreateUsers(req, res, next){
        try{
            //creates all user data
            const userID = req.body.id
            const name = req.body.name
            const username = req.body.username
            const password = req.body.password

            const user = {
                id: userID,
                name: name,
                username: username,
                password: password,
            }

            const createUserResponse = await UserDataDAO.addUser(
                user
            )
            res.json({status: "success"})
        }
        catch(e){
            res.status(500).json({error: e.message})
        }
    }

    static async apiUpdateUsers(req, res, next){
        try{
            //can update name, username, and password
            const userID = req.body.id
            const name = req.body.name
            const username = req.body.username
            const password = req.body.password

            const user = {
                id: userID,
                name: name,
                username: username,
                password: password,
            }

            const updateUserResponse = await UserDataDAO.updateUser(
                user
            )

            var { error } = updateUserResponse
            if(error){
                res.status(400).json({error})
            }

            if(updateUserResponse.modifiedCount === 0){
                throw new Error("unable to update user")
            }

            res.json({status:"success"})
        }
        catch(e){
            res.status(500).json({error:e.message})
        }
    }
}