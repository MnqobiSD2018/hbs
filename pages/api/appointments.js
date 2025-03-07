import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]"; // Import NextAuth settings
import dbConnect from "../../lib/mongodb";
import Appointment from "../../models/Appointments";
import Doctor from "../../models/Doctors";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        return res.status(401).json({ error: "Unauthorized - Please log in" });
      }

      const { doctorId, appointmentDateTime } = req.body;
      const patientId = session.user.id;

      if (!doctorId || !appointmentDateTime) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      const newAppointment = new Appointment({
        doctorId,
        patientId,
        appointmentDateTime,
        status: "Confirmed",
      });

      await newAppointment.save();
      res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
    } catch (error) {
      console.error("Error booking appointment:", error);
      res.status(500).json({ error: "Failed to book appointment" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
