import { useState, useEffect } from "react";

export default function ManageDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [newDoctor, setNewDoctor] = useState({ name: "", specialty: "", availableHours: "" });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await fetch("../api/doctors");
            const data = await res.json();
            setDoctors(data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    const handleAddDoctor = async () => {
        if (!newDoctor.name || !newDoctor.specialty || !newDoctor.availableHours) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const res = await fetch("../api/doctors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newDoctor),
            });

            if (res.ok) {
                alert("Doctor added successfully!");
                setNewDoctor({ name: "", specialty: "", availableHours: "" });
                fetchDoctors(); // Refresh doctors list
            } else {
                alert("Failed to add doctor");
            }
        } catch (error) {
            console.error("Error adding doctor:", error);
        }
    };

    const handleDeleteDoctor = async (id) => {
        if (window.confirm("Are you sure you want to delete this doctor?")) {
            try {
                const res = await fetch("../api/admin/delete-doctor", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id }),
                });

                if (res.ok) {
                    alert("Doctor deleted successfully!");
                    fetchDoctors(); // Refresh doctors list
                } else {
                    alert("Failed to delete doctor");
                }
            } catch (error) {
                console.error("Error deleting doctor:", error);
            }
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Manage Doctors</h1>

            {/* Add Doctor Form */}
            <div className="border p-4 rounded mb-4 bg-gray-100">
                <h2 className="text-lg font-semibold">Add New Doctor</h2>
                <input
                    type="text"
                    placeholder="Doctor's Name"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    className="border p-2 rounded w-full mt-2"
                />
                <input
                    type="text"
                    placeholder="Specialty"
                    value={newDoctor.specialty}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                    className="border p-2 rounded w-full mt-2"
                />
                <input
                    type="text"
                    placeholder="Available Hours (e.g., 9-17)"
                    value={newDoctor.availableHours}
                    onChange={(e) => setNewDoctor({ ...newDoctor, availableHours: e.target.value })}
                    className="border p-2 rounded w-full mt-2"
                />
                <button
                    onClick={handleAddDoctor}
                    className="mt-4 bg-blue-500 text-white p-2 rounded w-full"
                >
                    Add Doctor
                </button>
            </div>

            {/* Display Doctors */}
            {doctors.map((doctor) => (
                <div key={doctor._id} className="border p-4 rounded mb-4 flex justify-between items-center">
                    <div>
                        <p className="text-lg font-semibold">{doctor.name} - {doctor.specialty}</p>
                        <p>Available Hours: {doctor.availableHours}</p>
                    </div>
                    <button
                        onClick={() => handleDeleteDoctor(doctor._id)}
                        className="bg-red-500 text-white px-3 py-2 rounded"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}
