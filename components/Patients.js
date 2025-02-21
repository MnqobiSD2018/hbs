import { useState, useEffect } from "react";
import axios from "axios";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: "", email: "", phoneNumber: "" });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await axios.get("/api/patients");
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const { data } = await axios.post("/api/patients", newPatient);
      setPatients([...patients, data]);
      setNewPatient({ name: "", email: "", phoneNumber: "" });
    } catch (error) {
      console.error("Error creating patient:", error);
    }
  };

  const handleUpdate = async (id, updatedInfo) => {
    try {
      const { data } = await axios.put(`/api/patients/${id}`, updatedInfo);
      setPatients(patients.map((p) => (p._id === id ? data : p)));
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/patients/${id}`);
      setPatients(patients.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Patients Management</h2>

      {/* Create Patient Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Patient</h3>
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={newPatient.email}
            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newPatient.phoneNumber}
            onChange={(e) => setNewPatient({ ...newPatient, phoneNumber: e.target.value })}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Add Patient
          </button>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Patients List</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 border border-gray-300 text-left">Name</th>
                <th className="p-3 border border-gray-300 text-left">Email</th>
                <th className="p-3 border border-gray-300 text-left">Phone Number</th>
                <th className="p-3 border border-gray-300 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient._id} className="border-b border-gray-200">
                    <td className="p-3 border border-gray-300">{patient.name}</td>
                    <td className="p-3 border border-gray-300">{patient.email}</td>
                    <td className="p-3 border border-gray-300">{patient.phoneNumber}</td>
                    <td className="p-3 border border-gray-300 text-center space-x-2">
                      <button
                        onClick={() => handleUpdate(patient._id, { phoneNumber: "NewPhone" })}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition duration-300"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(patient._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No patients found.
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
