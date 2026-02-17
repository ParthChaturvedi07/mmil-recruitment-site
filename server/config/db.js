import mongoose from "mongoose";
import {ENV} from './env.js'


export const connectDb = async ()=>{
  console.log(ENV.MONGO_URI)
   try {
    if(!ENV.MONGO_URI){
        throw new Error("MONGO_URI not found")
    }
    await mongoose.connect(ENV.MONGO_URI)
    console.log("DB connected") 
   } catch (error) {
     console.error("DB connection failed", error.message) 
   }
}