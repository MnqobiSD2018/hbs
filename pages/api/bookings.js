import dbConnect from "../../lib/mongodb";
import Booking from "../../models/Booking";
import Doctor from "../../models/Doctors"; // Import the Doctor model
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const bookings = await Booking.find({ userId })
        .populate("doctor", "name specialty") // Fetch doctor details
        .sort({ date: -1 });

      console.log("Bookings with populated doctors:", bookings);  // Add this log
      return res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res.status(500).json({ success: false, error: "Failed to fetch bookings" });
    }
  } 
  else if (req.method === "POST") { 
    
    try {
      const { userId, appointmentType, doctor, date, time, description, nextOfKin } = req.body;

      // Check if the selected time slot is still available
      const doctorData = await Doctor.findById(doctor);
      if (!doctorData || !doctorData.availableSlots.includes(time)) {
          return res.status(400).json({ error: "Time slot unavailable. Please choose another." });
      }

      // Create a new booking
      const newBooking = await Booking.create({ userId, appointmentType, doctor, date, time, description, nextOfKin });

      // Remove the booked time slot
      await Doctor.findByIdAndUpdate(doctor, { $pull: { availableSlots: time } });

      res.status(201).json(newBooking);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Booking failed" });
  }
    
    // This was unreachable before! Check Github Commit History
    /**try {
      const { appointmentType, doctor, date, time, description, nextOfKin, userId } = req.body;

      if (!appointmentType || !doctor || !date || !time || !description || !userId) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Ensure doctor is stored as ObjectId
      const doctorExists = await Doctor.findById(doctor);
      if (!doctorExists) {
        return res.status(400).json({ error: "Doctor not found" });
      }
      
      const newBooking = new Booking({
        userId,
        appointmentType,
        doctor,
        date,
        time,
        description,
        nextOfKin,
      });

      await newBooking.save();
      return res.status(201).json({ message: "Booking successful", booking: newBooking });
    } catch (error) {
      console.error("Booking Error:", error);
      return res.status(500).json({ error: "Failed to create booking" });
    } */
    
  } else if (req.method === "DELETE") {
    try {
      const { bookingId } = req.body;

      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ error: "Booking not found" });

      // Restore the canceled time slot
      await Doctor.findByIdAndUpdate(booking.doctor, { $push: { availableSlots: booking.time } });

      // Delete the booking
      await Booking.findByIdAndDelete(bookingId);

      res.status(200).json({ message: "Appointment canceled, slot restored" });
  } catch (error) {
      res.status(500).json({ error: "Cancellation failed" });
  }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
   

}

/**
   * 
  if (req.method === "GET") {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const bookings = await Booking.find({ userId }).sort({ date: -1 });

      return res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res.status(500).json({ success: false, error: "Failed to fetch bookings" });
    }
  } else {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

   * if (req.method === "POST") {
    try {
      const { appointmentType, doctor, date, time, description, nextOfKin, userId } = req.body;

      if (!appointmentType || !doctor || !date || !time || !description) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const newBooking = new Booking({
      userId,
      appointmentType,
      doctor,
      date,
      time,
      description,
      nextOfKin,
  });
 
    await newBooking.save();
  res.status(201).json({ message: "Booking successful" });
  console.log("Booking successful", req.body);
} catch (error) {
  console.error("Booking Error:", error);
  res.status(500).json({ error: "Failed to create booking" });
}
} else {
  // 🚨 THIS IS IMPORTANT
res.setHeader("Allow", ["POST"]);
res.status(405).json({ error: "Method not allowed" });

   */
  
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


