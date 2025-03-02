import dotenv from "dotenv"
dotenv.config()
import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

async function dbConnect(){
try{
   await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
   console.log('Database connected to express')
}
catch(err){
console.log(err.message)
process.exit(1)
}
}

export default dbConnect