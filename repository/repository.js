import { schema } from "../schema/schema.js";
import mongoose from "mongoose";

const model = mongoose.model("User", schema);

export default class Repository {
  async add(user) {
    try {
      const newUser = new model(user);
      return await newUser.save();
    } catch (error) {
      console.log(error);
    }
  }

  async findByUsername(username) {
    try {
      return await model.findOne({ username: username });
    } catch (error) {
      console.log(error);
    }
  }
}
