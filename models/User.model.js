const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    imageUrl: {
      type: String,
    required: [true, "Image is required."],
    },
    gitHub: String,
    linkedIn: String,
    twitter: String,
    instagram: String,
    reviews: [{
      review: String,
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt : {type: Date, default: Date.now}
    }]
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
