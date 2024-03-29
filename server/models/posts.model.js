const dbConfig = require("../config/config");
const {ObjectId} = require("mongodb");

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

var schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    }},
    { timestamps: true });

const Post = mongoose.model("posts", schema);
module.exports = Post;