import app from "./server.js";
import mongodb from "mongodb";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Recipe_posts_DAO from "./api/recipe_posts/dao.js";
import UserDataDAO from "./api/user_info/userDAO.js";
import Followers_DAO from "./api/followers/followersDAO.js";
import Following_DAO from "./api/following/followingDAO.js";
dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT;

MongoClient.connect(process.env.SC_DB_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await UserDataDAO.injectDB(client);
    await Recipe_posts_DAO.injectDB(client);
    await Followers_DAO.injectDB(client);
    await Following_DAO.injectDB(client);
  });

mongoose
  .connect(process.env.SC_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

MongoClient.connect(process.env.SC_DB_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await Recipe_posts_DAO.injectDB(client);
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });

export default app;
