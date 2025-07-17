import mongoose from "mongoose"

const DB_NAME = "hackathon"

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n mongoDB connected ! DB host : ${connectionInstance.connection.host} `);
    } catch (error) {
        console.log("mongodb connection error !");
        process.exit(1)  
    }
}

export default connectDB