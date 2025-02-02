import mongoose, { Schema, model } from "mongoose";
// Define the UserRoles schema
const userRoleSchema = new Schema({
  roleName: {
    type: String,
    required: true,
    unique: true, // Ensure role names are unique
    enum: ["teacher", "student", "systemadmin"], // Restrict to specific roles
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

export const UserRole = model("UserRole", userRoleSchema);
