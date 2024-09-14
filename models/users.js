import mongoose, { model, models } from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: [true, "Email already exyst"],
    required: [true, "Email is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  image: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = models.User || mongoose.model("User", UserSchema);
export default User;
