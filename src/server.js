import { app } from "./app.js";
import dotenv from 'dotenv'

dotenv.config({
    path:'./.env'
})

try {
    app.listen(process.env.PORT,()=>{
        console.log(`main server started at port: ${process.env.PORT}`)
    })
    app.get('/',(req,res)=>{
        res.send(`the server is listening here`)
    })
} catch (error) {
    console.error(`somthing went wrong while starting server`,error)
    process.exit(0);
}