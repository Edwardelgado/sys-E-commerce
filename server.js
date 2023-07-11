import express from "express"
import dotenv from "dotenv"
import connectDatabase from "./config/MongoDB.js"
import ImportData from "./Dataimport.js"
import productRoute from "./Routes/ProductRoutes.js"
import { errorHandler, notEncontrado } from "./Middleware/Errors.js"
import userRouter from "./Routes/UserRoutes.js"
import orderRouter from "./Routes/orderRoutes.js"

dotenv.config()
connectDatabase()
const app = express()
app.use(express.json())

//load

// app.get("/api/products",(req,res)=>{
//     res.json(products)
// })
// app.get("/api/users",(req,res)=>{
//     res.json(users)
// })
// API
app.use("/api/import", ImportData)
app.use("/api/products", productRoute)
app.use("/api/users", userRouter)
app.use("/api/orders",orderRouter)
app.get("/api/config/paypal", (req,res)=>{
    res.send(process.env.PAYPAL_CLIENTE_ID)
})

app.use(notEncontrado)
app.use(errorHandler)


app.get("/",(req,res)=>{
    res.send("API is Running...")
})

const PORT = process.env.PORT || 1000;

app.listen(PORT, console.log(`Server run in port ${PORT}`))