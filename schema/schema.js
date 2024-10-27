import mongoose from "mongoose";

export const schema = new mongoose.Schema({
  username: {
    type: String,
    maxLength: [15, "Name can't be greater than 15 characters"],
    minLength: [4, "Name can't be less than 4 characters"],
    required: true,
  },
  email: {
    type: String,
    unique: true,
    match: [/.+\@.+\./, "Please enter a valid email"],
    required: true,
  },
  password: { type: String, required: true },
  gender: { type: String, enum: ["male", "female"] },
  avatar: { type: String, required: true },
});
