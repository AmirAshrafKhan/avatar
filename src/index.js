// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import express from "express";
import { app } from "./app.js";

import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB  Connection failed", error);
  });

/*
import express from "express"

const app = express()

;(async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("err", error);
            throw error
        })
        app.listen(port .env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    }catch (error){
        console.error("error", error)
    }

})()
*/
