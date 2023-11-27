import Followers_DAO from "../followers/followersDAO.js";

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

    static async apiCreateEntry(req, res, next) {
        try {
            const userId = req.body.user
            const followers = req.body.followers

            const entry = {
                user: userId,
                followers: followers,
            }

            const createResponse = await Followers_DAO.addFollowerEntry(entry)

            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdateFollowersByUserId(req, res, next) {
        try {
            const { userId } = req.params;
            const followers = req.body.followers

            const docu = {
                followers: followers,
            }

            const updateResponse = await Followers_DAO.updateFollowersByUserId(
                docu,
                userId,
            )

            var { error } = updateResponse
            if (error) {
                res.status(400).json({ error })
                return
            }

            if (updateResponse.modifiedCount === 0) {
                throw new Error(
                    "Unable to update - user id might not exist.",
                )
            }

            res.json({ status: "success" })

        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    static async apiPutNewFollowerByUserId(req, res, next) {
        try {
            const { userId } = req.params;              //id of the person you want to follow - will be in route
            const yourObjId = req.body.follower        //your user id - you are the follower     

            const putResponse = await Followers_DAO.putNewFollower(
                yourObjId,
                userId,
            )

            var { error } = putResponse
            if (error) {
                res.status(400).json({ error })
                return
            }

            if (putResponse.modifiedCount === 0 && putResponse.matchedCount === 1) {
                throw new Error(
                    "Unable to put new follower - follower already exists",
                )
            } else if (putResponse.modifiedCount === 0) {
                throw new Error(
                    "Unable to put new follower - user may not be the original follower",
                )
            }

            res.json({ status: "success" })

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiGetFollowersNumber(req, res, next) {
        try {
            const { userId } = req.params;
            let user = await Followers_DAO.getFollowersByUserId(userId)

            if (!user) {
                throw new Error(
                    `Unable to get followers for user with id ${userId} as it may not exist`
                )
            }
            let followersList = user.followers
            let numFollowers = followersList.length
            res.json(numFollowers)
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    /* for logged in user */

    static async apiGetFollowersForLoggedInUser(req, res, next) {
        try {
            const userId = res.locals.userId;
            let user = await Followers_DAO.getFollowersByUserId(userId)

            if (!user) {
                throw new Error(
                    `Unable to get followers for user with id ${userId} as it may not exist. Probably you did not follow any users yet`
                )
            }

            res.json(user)
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    static async apiPutNewFollowersForLoggedInUser(req, res, next) {
        try {
            const userId = res.locals.userId;
            const followersId = req.body.followers;        //id of the user you are followers   

            const putResponse = await Followers_DAO.putNewFollowers(
                followersId,
                userId,
            )

            var { error } = putResponse
            if (error) {
                res.status(400).json({ error })
                return
            }

            // if (putResponse.modifiedCount === 0 && putResponse.matchedCount === 1) {
            //     throw new Error (
            //         "Unable to put new follower - follower already exists",
            //     )
            // } else if (putResponse.modifiedCount === 0) {
            //     throw new Error (
            //         "Unable to put new follower - user may not be the original follower",
            //     )
            // }

            res.json({ status: "success" })

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiGetFollowersNumberForLoggedInUser(req, res, next) {
        try {
            const userId = res.locals.userId;
            let user = await Followers_DAO.getFollowersByUserId(userId)
            // console.log(user)
            if (!user) {
                throw new Error(
                    `Unable to get follower number for user with id ${userId} as it may not exist. Probably you did not follow any users yet`
                )
            }
            let followersList = user.followers
            let numFollowers = followersList.length
            res.json(numFollowers)
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    static async apiDeleteFollowersForLoggedInUser(req, res, next) {
        try {
            const userId = res.locals.userId;
            const followersId = req.body.followers        //id of the user you are followers   

            const deleteResponse = await Followers_DAO.deleteFollowers(
                followersId,
                userId,
            )

            var { error } = deleteResponse
            if (error) {
                res.status(400).json({ error })
                return
            }

            if (deleteResponse.modifiedCount === 0 && deleteResponse.matchedCount === 1) {
                throw new Error(
                    "Unable to delete follower - follower does not exist",
                )
            } else if (deleteResponse.modifiedCount === 0) {
                throw new Error(
                    "Unable to delete follower - user may not be the original follower",
                )
            }

            res.json({ status: "success" })

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }


}