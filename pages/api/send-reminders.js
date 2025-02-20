import dbConnect from "../../lib/mongodb"; // Ensure database connection
import Booking from "../../models/Booking"; // Import the Booking model
import User from "../../models/User" //import user model
import { sendSms } from "../../utils/sendSms"; // import sms function
import Doctor from "../../models/Doctors";
import moment from "moment";

export default async function handler(req, res) {
    console.log("SENDING REMINDERS");
  if (req.method !== "POST") {
    //return res.status(405).json({ error: "Method Not Allowed" });
  }

  await dbConnect();
  console.log("Connecting to the Database");

  try {
    const tomorrow = moment().add(1, "days").startOf("day").toDate();
    const endOfTomorrow = moment().add(1, "days").endOf("day").toDate();

    // Fetch appointments happening tomorrow
    const bookings = await Booking.find({
      date: { $gte: tomorrow, $lt: endOfTomorrow },
    }).populate("doctor");

    if (bookings.length === 0) {
      return res.status(200).json({ message: "No appointments for tomorrow." });
    }

    // Send SMS notifications
    for (const booking of bookings) {
        console.log("Processing booking ID:", booking._id);

        const { userId, doctor, description, date } = booking;

        // Fetch the user's phone number from the User collection
        const user = await User.findById(userId);

        if (!user || !user.phoneNumber) {
            console.warn(`No phone number found for user ID: ${userId}`);
            continue;
        }

        const phoneNumber = user.phoneNumber; // User's phone number

      if (!phoneNumber) {
        console.warn(`No phone number found for booking ID: ${booking._id}`);
        continue;
      }

      const message = `Reminder: Your appointment with Dr. ${doctor.name} is scheduled for ${moment(date).format(
        "MMMM Do YYYY"
      )}. Details: ${description || "No description provided."}`;

      console.log(`Sending reminder to: ${phoneNumber}`);

      await sendSms(phoneNumber, message)

      //console.log("Sending reminder to:", phoneNumber);
      //alert("Sending reminder to:" + phoneNumber + "Message is: " + message);

      //await sendSms(phoneNumber, message);
    }

    res.status(200).json({ message: "Reminders sent successfully." });
    console.log("Reminders sent successfully.");
    
  } catch (error) {
    console.error("Error sending reminders:", error);
    res.status(500).json({ error: "Failed to send reminders." });
  }
}
