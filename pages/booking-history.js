import { useEffect, useState } from "react";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Ensure localStorage access only happens in the browser
        if (typeof window !== "undefined") {
          const storedUser = JSON.parse(localStorage.getItem("user"));

          // Check if storedUser exists before using it
          if (!storedUser || !storedUser.id) {
            setError("User not found. Please log in again.");
            setLoading(false);
            return;
          }

          const res = await fetch(`/api/bookings?userId=${storedUser.id}`, {
            headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
          });

          const result = await res.json();

          if (!res.ok) {
            throw new Error(result.error || "Failed to fetch bookings.");
          }

          console.log("Fetched bookings:", result.data); // Debugging log
          setBookings(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(error.message);
      }

      setLoading(false);
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading booking history...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Booking History</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="border p-4 rounded-lg shadow-md">
              <p><strong>Appointment Type:</strong> {booking.appointmentType}</p>
              <p><strong>Doctor:</strong> {booking.doctor?.name || "Unknown"} ({booking.doctor?.specialty || "N/A"})</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.time}</p>
              {booking.description && <p><strong>Description:</strong> {booking.description}</p>}
              {booking.nextOfKin?.name && (
                <p><strong>Next of Kin:</strong> {booking.nextOfKin.name} ({booking.nextOfKin.phone})</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
