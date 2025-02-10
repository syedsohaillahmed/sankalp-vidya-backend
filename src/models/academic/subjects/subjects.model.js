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
        classGrade:{
            type: Schema.Types.ObjectId,
            ref: "Class",
            required:true
        },
        active:{
            type:Boolean,
            default:true
        }
    }
)

export const Subject = model("Subject", subjectSchema)