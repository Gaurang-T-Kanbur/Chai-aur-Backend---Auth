import express from "express";
import router from "./modules/auth/auth.routes.js";
import { errorMiddleware } from "./common/middleware/error.middleware.js";

const app = express();

app.use(express.json())

app.use((req, res, next) => {
    console.log('====================================');
    console.log("Request Received");
    console.log('====================================');
    next()
})

app.use("/auth", router)

const getMiddleware = (req, res, next) => {
    console.log('====================================');
    console.log("Request waiting");
    console.log('====================================');
    req.Namaskaar = "Jai Hanuman"
    next()
}

const greetMiddleware = (req, res, next) => {
    req.name = req.query.name
    next()
}
app.get('/', getMiddleware, (req, res) => {
    res.status(200)
        .send(`Jai Jai Shri Ram ${req.Namaskaar}`)
   
})



app.get('/greet', greetMiddleware, (req, res) => {
    res.status(200)
        .send(`Hello ${req.name ?? "Sir"}`)
})

app.use(errorMiddleware)

export default app