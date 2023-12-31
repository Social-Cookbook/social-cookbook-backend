import Following_DAO from "../following/followingDAO.js";

export default class Following_Data_Controller {
    static async apiGetFollowing(req, res, next) {
        const usersPerPage = req.query.usersPerPage ? parseInt(req.query.usersPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.user) {
            filters.user = req.query.user
        } else if (req.query.name) {
            filters.name = req.query.name
        }

        const { userFollowingList, numUsers } = await Following_DAO.getFollowing({
            filters,
            page, 
            usersPerPage,
        })

        let response = {
            users: userFollowingList,
            page: page,
            filters: filters,
            entries_per_page: usersPerPage,
            total_results: numUsers,
        }

        res.json(response)
    }

    static async apiGetFollowingByUserId(req, res, next) {
        try {
            const { userId } = req.params;
            let user = await Following_DAO.getFollowingByUserId(userId)
            
            if (!user) {
                throw new Error(
                    `Unable to get following for user with id ${userId} as it may not exist`
                )
            }

            res.json(user)
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    // return the list of users that the user with userId is following, instead of the whole document
    // get rid of other entries like _id, user
    static async apiGetOnlyFollowingByUserId(req, res, next) {
        try {
            const { userId } = req.params;
            let user = await Following_DAO.getFollowingByUserId(userId)
            
            if (!user) {
                throw new Error(
                    `Unable to get following for user with id ${userId} as it may not exist`
                )
            }
            let followingList = user.follows
            console.log(followingList)
            res.json(followingList)
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    static async apiPutNewFollowingByUserId(req, res, next) {
        try {
            const { userId } = req.params;              //your user id
            const followingId = req.body.following        //id of the user you are following   
            
            const putResponse = await Following_DAO.putNewFollowing(
                followingId,
                userId,
            )
            
            var { error } = putResponse
            if (error) {
                res.status(400).json({ error })
                return
            }

            if (putResponse.modifiedCount === 0 && putResponse.matchedCount === 1) {
                throw new Error (
                    "Unable to put new follower - follower already exists",
                )
            } else if (putResponse.modifiedCount === 0) {
                throw new Error (
                    "Unable to put new follower - user may not be the original follower",
                )
            }

            res.json({ status: "success" })

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiGetFollowingNumber(req, res, next) {
        try {
            const { userId } = req.params;
            let user = await Following_DAO.getFollowingByUserId(userId)
            
            if (!user) {
                throw new Error(
                    `Unable to get following for user with id ${userId} as it may not exist`
                )
            }
            let followingList = user.follows
            let numFollowing = followingList.length
            res.json(numFollowing)
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    static async apiDeleteFollowingByUserId(req, res, next) {
        try {
            const { userId } = req.params;              //your user id
            const followingId = req.body.following        //id of the user you are following

            const deleteResponse = await Following_DAO.deleteFollowing(
                followingId,
                userId,
            )

            var { error } = deleteResponse
            if (error) {
                res.status(400).json({ error })
                return
            }

            if (deleteResponse.modifiedCount === 0 && deleteResponse.matchedCount === 1) {
                throw new Error (
                    "Unable to delete follower - follower does not exist",
                )
            } else if (deleteResponse.modifiedCount === 0) {
                throw new Error (
                    "Unable to delete follower - user may not be the original follower",
                )
            }

            res.json({ status: "success" })

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }


    /* methods for current logged in user */ 
    
    static async apiGetFollowingForLoggedInUser(req, res, next) {
        try {
            const userId = res.locals.userId;
            let user = await Following_DAO.getFollowingByUserId(userId)
            
            if (!user) {
                throw new Error(
                    `Unable to get following for user with id ${userId} as it may not exist. Probably you did not follow any users yet`
                )
            }

            res.json(user)
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    static async apiPutNewFollowingForLoggedInUser(req, res, next) {
        try {
            const userId = res.locals.userId;
            const followingId = req.body.following;        //id of the user you are following   
            
            const putResponse = await Following_DAO.putNewFollowing(
                followingId,
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

    static async apiGetFollowingNumberForLoggedInUser(req, res, next) {
        try {
            const userId = res.locals.userId;
            let user = await Following_DAO.getFollowingByUserId(userId)
            
            if (!user) {
                throw new Error(
                    `Unable to get following for user with id ${userId} as it may not exist. Probably you did not follow any users yet`
                )
            }
            let followingList = user.follows
            let numFollowing = followingList.length
            res.json(numFollowing)
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }

    static async apiDeleteFollowingForLoggedInUser(req, res, next) {
        try {
            const userId = res.locals.userId;
            const followingId = req.body.following        //id of the user you are following   
            
            const deleteResponse = await Following_DAO.deleteFollowing(
                followingId,
                userId,
            )
            
            var { error } = deleteResponse
            if (error) {
                res.status(400).json({ error })
                return
            }

            if (deleteResponse.modifiedCount === 0 && deleteResponse.matchedCount === 1) {
                throw new Error (
                    "Unable to delete follower - follower does not exist",
                )
            } else if (deleteResponse.modifiedCount === 0) {
                throw new Error (
                    "Unable to delete follower - user may not be the original follower",
                )
            }

            res.json({ status: "success" })

        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }


    // return the list of users that the user with userId is following, instead of the whole document
    // get rid of other entries like _id, user
    static async apiGetOnlyFollowingForLoggedInUser(req, res, next) {
        try {
            const userId = res.locals.userId;
            let user = await Following_DAO.getFollowingByUserId(userId)
            
            if (!user) {
                throw new Error(
                    `Unable to get following for user with id ${userId} as it may not exist. Probably you did not follow any users yet`
                )
            }
            let followingList = user.follows
            console.log(followingList)
            res.json(followingList)
        } catch (e) {
            res.status(404).json({ error: e.message })
        }
    }
}