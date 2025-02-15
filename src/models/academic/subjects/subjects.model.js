import { model, Schema, Types } from "mongoose";

const subjectSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String
        },
        board:{
            type:String
        },
        subjectType:{
            type:String
        },
        category:{
            type:String
        },
        
        active:{
            type:Boolean,
            default:true
        }
    },
    {
        timeStamps:true
    }
)

export const Subject = model("Subject", subjectSchema)