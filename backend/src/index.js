import { app } from './app.js'
import connectDB from './db/index.js'

import dotenv from 'dotenv'
dotenv.config({
    path:"./.env"
})

const port = process.env.PORT

connectDB().
then(()=>{
     app.listen(port, '0.0.0.0', () => {
    console.log('Server running at http://0.0.0.0:3000');
    })
})
.catch((err)=>{
    console.log("MongoDB connection error" ,err); 
})