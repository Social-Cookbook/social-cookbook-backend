import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import Recipe_posts_DAO from "./api/recipe_posts/dao.js"
import UserDataDAO from "./api/user_info/userDAO.js"
dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT

MongoClient.connect(
    process.env.SC_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    }
).catch(err => {
    console.error(err.stack)
    process.exit(1)
}).then(async client => {
    await UserDataDAO.injectDB(client)
    await Recipe_posts_DAO.injectDB(client)
    
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
})