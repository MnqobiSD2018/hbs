import dbConnect from "../../lib/mongodb";
import Booking from "../../models/Booking";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { appointmentType, doctor, date, time, description, nextOfKin } = req.body;

      if (!appointmentType || !doctor || !date || !time || !description) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const newBooking = new Booking({
      appointmentType,
      doctor,
      date,
      time,
      description,
      nextOfKin,
  });
     
  await newBooking.save();
  res.status(201).json({ message: "Booking successful" });
} catch (error) {
  console.error("Booking Error:", error);
  res.status(500).json({ error: "Failed to create booking" });
}
} else {
res.status(405).json({ error: "Method not allowed" });
}
  
  /** const session = await getSession({ req });

      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const booking = new Booking({ ...req.body, userId: session.user.id });
      await booking.save();
      return res.status(201).json({ message: "Booking successful", booking });
    } catch (error) {
      return res.status(500).json({ message: "Error booking appointment", error });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }*/

  
}
