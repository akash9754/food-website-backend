import dotenv from "dotenv/config"
import connectDb from "./db/index.js"
import { app } from "./app.js"



connectDb()
.then( () => {
    app.listen(process.env.PORT  || 8000, () => {
        console.log(`server is Running at port : ${process.env.PORT}`);  
    })
})
.catch((err) => {
    console.log("Mongo DB connection failed!!! ", err);
    
})