import mongoose, { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
// Define the UserRoles schema
const userRoleSchema = new Schema({
  roleName: {
    type: String,
    required: true,
    unique: true, // Ensure role names are unique
    enum: ["teacher", "student", "systemadmin"], // Restrict to specific roles
  },
  roleDisplayName:{
    type: String,
  },
  roleId: {
    type: String,
    required: true,
    unique: true, // Ensure role IDs are unique
  },
  active:{
    type:Boolean,
    default:true
  }
});

userRoleSchema.plugin(mongooseAggregatePaginate);

export const UserRole = model("UserRole", userRoleSchema);
