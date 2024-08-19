import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
  name: {
    type: String,
  },
  password: {
    type: String,
    requierd: [true, "Password is requierd"],
  },
  email: {
    type: String,
    requierd: [true, "Email is requierd"],
    unique: true,
  },
  token: {
    type: String,
    default: null,
  },
});

const User = model("User", schema);

export default User;
