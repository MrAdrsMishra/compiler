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
    app.get('/',async(req,res)=>{
        let response=await axios.get(`${process.env.RUNNER_URL}/health`)
       res.send(response)
    })
} catch (error) {
    console.error(`somthing went wrong while starting server`,error)
    process.exit(0);
}