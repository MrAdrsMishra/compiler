import axios from "axios";
import { app } from "./app.js";
import dotenv from 'dotenv'

dotenv.config({
    path:'./.env'
})

try {
    app.listen(process.env.PORT,()=>{
        console.log(`main server started at port: ${process.env.PORT}`)
    })
    app.get('/health',(req,res)=>{
        res.send('compiler backend running fine')
    })
} catch (error) {
    console.error(`somthing went wrong while starting server`,error)
    process.exit(0);
}