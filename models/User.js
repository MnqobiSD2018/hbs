import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "patient"], default: "patient" },
  dateOfBirth: Date,
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  maritalStatus: String,
  employmentStatus: String,
  phoneNumber: String,
  streetAddress: String,
  city: String,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
