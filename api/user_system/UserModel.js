import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "New user",
  },
  username: {
    type: String,
    default: "cookbook_default_username",
    // required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  bio: {
    type: String,
    default: "This is my bio",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

export default mongoose.model("User", userSchema);