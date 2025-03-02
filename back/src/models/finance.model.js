

import User from './user.model.js'
import mongoose,{Schema,model} from 'mongoose'



const financeSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        enum:["income","expense"],
        required:true
    },
    category:{
        type:String,
        required:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:User,
        required:true
    }
},{timestamps:true})

const Finance= model('Finance',financeSchema)
export default Finance
