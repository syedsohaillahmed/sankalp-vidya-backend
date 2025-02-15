import { model, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { type } from "os";

const classSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  classGrade:{
    type:Number,
    required:true
  },
  alternateNames: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
},
{
  timestamps:true
});

classSchema.plugin(mongooseAggregatePaginate);

export const Class = model("Class", classSchema) 