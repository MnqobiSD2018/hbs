import dbConnect from "../../lib/mongodb";
import Booking from "../../models/Booking";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const appointments = await Booking.find().populate("doctor").populate("userId");
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointments." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
