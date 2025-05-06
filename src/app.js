import express from "express"
import cookieParser from "cookie-parser"
import cors  from "cors";

const app =  express()

app.use(cors())

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(express.static("public"))
app.use(cookieParser())



// routes
import userRouter from "./routes/user.routes.js"

// routes declearation
app.use("/api/v1/users", userRouter)



// app.post("/login", (req, res) => {
//     console.log("method : ",req.method);
//     console.log("headers : ",req.headers);
//     console.log("body : ", req.body);

//     // let rawBody = '';
//     // req.on('data', chunk => {
//     //     rawBody += chunk.toString();
//     // })
//     // req.on('end', () => {
//     //     console.log('rawBody :', rawBody);
//     // })
//     res.send({message: "success", body: req.body})
    
// })



export { app }