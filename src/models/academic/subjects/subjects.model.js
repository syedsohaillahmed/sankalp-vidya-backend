import { model, Schema, Types } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

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

subjectSchema.plugin(mongooseAggregatePaginate);

export const Subject = model("Subject", subjectSchema)