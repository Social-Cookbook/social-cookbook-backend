import Followers_DAO from "./followersDAO.js";

export default class Followers_Data_Controller {
    static async apiGetFollowers(req, res, next) {
        const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.user) {
            filters.user = req.query.user
        } else if (req.query.name) {
            filters.name = req.query.name
        }

        const { userFollowersList, numUsers } = await Followers_DAO.getFollowers({
            filters,
            page, 
            usersPerPage,
        })

        let response = {
            users: userFollowersList,
            page: page,
            filters: filters,
            entries_per_page: usersPerPage,
            total_results: numUsers,
        }

        res.json(response)
    }

    static async apiGetFollowersByUserId(req, res, next) {
        try {
            const { userId } = req.params;
            let user = await Followers_DAO.getFollowersByUserId(userId)
            
            if (!user) {
                throw new Error(
                    `Unable to get followers for user with id ${userId} as it may not exist`
                )
            }

            res.json(user)
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }
}