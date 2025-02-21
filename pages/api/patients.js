import dbConnect from "../../lib/mongodb";
import User from "../../models/User";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const patients = await User.find({ role: "patient" }); // Only fetch patients
      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patients." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
