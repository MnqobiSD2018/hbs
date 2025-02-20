import dbConnect from "../../../lib/mongodb";
import Booking from "../../../models/Booking";

export default async function handler(req, res) {
  await dbConnect(); // Ensure database connection

  const { id } = req.query; // Get booking ID from URL

  if (req.method === "DELETE") {
    try {
      const deletedBooking = await Booking.findByIdAndDelete(id);

      if (!deletedBooking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      return res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
      console.error("Error deleting booking:", error);
      return res.status(500).json({ error: "Error deleting booking" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
