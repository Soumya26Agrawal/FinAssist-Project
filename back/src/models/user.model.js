import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    uid: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    // password:{
    //     type:String,
    //     required:true
    // },
    email: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
