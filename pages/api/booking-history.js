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
    } else {
        return res.status(450).json({success: false, error: "Forbidden"})
    }
}