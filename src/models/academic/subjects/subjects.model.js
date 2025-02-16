import { model, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const subjectSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        board: {
            type: String
        },
        subjectType: {
            type: String
        },
        category: {
            type: String
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true // Note the correct option name: `timestamps`, not `timeStamps`
    }
);

subjectSchema.plugin(mongooseAggregatePaginate);

// Check if the model already exists
const Subject = model("Subject", subjectSchema) || mongoose.models.Subject;

export { Subject };
