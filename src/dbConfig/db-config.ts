 import mongoose from "mongoose";

export default async function connect() {
    try{        
        await mongoose.connect(process.env.MONGO_URL!);
        const connection = mongoose.connection;
        connection.on('connected', ()=>{
            console.log('MongoDB connected successfully!!');
        })
        connection.on('error', (err)=>{
            console.log('Error while connecting MongoDB, please check database up and running. error details:' + err)
            process.exit();
        })
    }catch(error){
        console.log("Something goes wrong, details" + error)
    }
}