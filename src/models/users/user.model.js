import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Define the Users schema
const usersSchema = new Schema(
  {
    userName: {
      type: String,
      unique: true,
      sparse: true,
    },
    fullName: {
      type: String,
      required: true,
      index: true,
    },
    avatar: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required:[true, "Phone number is required"],
      match: [/^\d{10}$/, "Alternate phone number must be 10 digits."], // Validate alternate phone number
    },
    alternatePhoneNo: {
      type: String,
      match: [/^\d{10}$/, "Alternate phone number must be 10 digits."], // Validate alternate phone number
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address."], // Email regex validation
    },
    rollNo: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    role: {
      type: Schema.Types.ObjectId, // Reference to UserRoles collection
      ref: "UserRole", // Name of the referenced model
      required: true,
    },
    ratings: {
      type: Number,
      default:0
    },
    lastLogin: {
      type: Date,
    },
    logoutTime: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    watchHistory: [
      {
        videoId: {
          type: Schema.Types.ObjectId,
          ref: "Video",
        },
        watchedAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

usersSchema.plugin(mongooseAggregatePaginate);

// Hash password before saving
usersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Hash the password before saving
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    console.log("error while hashing the password")
    next(err); // Pass the error to the next middleware if there is an issue
  }
});

// Method to check if the password is correct
usersSchema.methods.isPasswordCorrect = async function (password) {
  console.log("password",password)
  console.log("this password",this.password)
  
    return await bcrypt.compare(password, this.password);
  
};


usersSchema.methods.generateAccessToken = async function (params) {
  return await jwt.sign(
    {
      _id: this._id
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
  
}

usersSchema.methods.generateRefreshToken = async function (params) {
  return await jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
  
}

// Create the Users model
export const User = model("User", usersSchema);
