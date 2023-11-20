import User from "./UserModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

const userVerification = (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      const user = await User.findById(data.id)
      if (user) {
				res.locals.username = user.username;
        res.locals.userId = user._id.toString();
				console.log("User Verified:\nUsername: " + res.locals.username + "\nUser ID: " + res.locals.userId);
        return next();
			}
      else return res.json({ status: false })
    }
  })
}

export default userVerification;