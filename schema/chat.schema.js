import mongoose from "mongoose";

const chatSchema  = new mongoose.Schema({
    username: String,
    message: String,
    image: String,
    timeStamp: Date,
});

export const chatModel = mongoose.model("Chat", chatSchema);