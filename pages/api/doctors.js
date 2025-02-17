import dbConnect from "../../lib/mongodb";
import Doctor from "../../models/Doctors";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const doctors = await Doctor.find({});
      res.status(200).json(doctors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch doctors" });
    }
  } else if (req.method === "POST") {
    try {
        const { name, specialty, availableHours } = req.body;
        const newDoctor = new Doctor({ name, specialty, availableHours });
        await newDoctor.save();
        res.status(201).json(newDoctor);
    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({ error: "Failed to add doctor" });
    }
} else {
    res.status(405).json({ error: "Method Not Allowed" });
}

/** if (req.method === "POST") {
    try {
      const { name, specialty, availableHours } = req.body;
      const newDoctor = new Doctor({ name, specialty, availableHours });
      await newDoctor.save();
      res.status(201).json(newDoctor);
    } catch (error) {
      res.status(500).json({ error: "Failed to add doctor" });
    }
  }
  else {
    res.status(405).json({ error: "Method Not Allowed" });
  } */
}
