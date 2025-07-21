const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://sithara:xsMTb2X15KvZ3UX6@cluster0.rplzco6.mongodb.net/devTinder")

}

module.exports = connectDB;
