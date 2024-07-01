import mongoose from "mongoose";
import { DB_NAME } from "../src/constants.js";

const ConnectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
        console.log("MONGODB connected! db host:",connectionInstance.connection.host);
        
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default ConnectDB;