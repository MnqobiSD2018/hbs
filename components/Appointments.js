import { useState, useEffect } from "react";
import axios from "axios";


export default function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {

      
      const { data } = await axios.get("/api/appointments");
      console.log(data);
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Appointments</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Appointments</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border border-gray-300 text-left">Patient</th>
                <th className="p-3 border border-gray-300 text-left">Doctor</th>
                <th className="p-3 border border-gray-300 text-left">Date</th>
                <th className="p-3 border border-gray-300 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <tr key={appt._id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-200">
                    <td className="p-3 border border-gray-300">{appt.userId?.name || "Unknown"}</td>
                    <td className="p-3 border border-gray-300">{appt.doctor?.name || "Unknown"}</td>
                    <td className="p-3 border border-gray-300">{new Date(appt.date).toLocaleDateString()}</td>
                    <td className="p-3 border border-gray-300">{appt.time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No upcoming appointments.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
