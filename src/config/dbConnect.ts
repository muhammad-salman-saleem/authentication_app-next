import mongoose from "mongoose";
import {  ConnectOptions } from "mongoose";

const mongoURI =
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/db_authentication?authSource=db_authentication";

  const connect = async () => {
    const options: ConnectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  
    try {
      await mongoose.connect(mongoURI, options);
      console.log("DB connection created.");
    } catch (err: any) {
      console.log(err.message);
      console.error("Failed to connect to MongoDB", err);
    }
  };

export default connect;
