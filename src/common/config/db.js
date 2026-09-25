import mongoose from "mongoose";
import env from './env.js'

async function dbConnect() {

    const DB = await mongoose.connect(env.MONGO_URI)

    console.log("DB Connected")
    
}

// docker exec -it auth-mongodb mongosh


export default dbConnect;

