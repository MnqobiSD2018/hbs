import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  availability: [{ day: String, slots: [String] }]
});

export default mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);
