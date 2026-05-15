const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || typeof uri !== "string") {
    throw new Error(
      "MONGO_URI is not defined. Make sure .env is loaded and MONGO_URI is set."
    );
  }

  await mongoose.connect(uri);
  console.log("Database connected");
  
};

module.exports = connectDB;