import { useState, useEffect } from "react";

export default function GeneralCheckup() {
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        doctor: "",
        description: "",
        nextOfKinName: "",
        nextOfKinPhone: "",
    });

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await fetch("/api/doctors");
                if (!res.ok) throw new Error("Failed to fetch doctors");
                const data = await res.json();
                setDoctors(data);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };
        fetchDoctors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        
        const bookingData = {
            userId: user.id,
            appointmentType: "General Checkup",
        doctor: formData.doctor, 
        date: formData.date,
        time: formData.time,
        description: formData.description,
        nextOfKin: { 
            name: formData.nextOfKinName, 
            phone: formData.nextOfKinPhone },
          };

          try {
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData),
            });
    
            if (response.ok) {
                alert("Booking successful!");
                setFormData({ date: "", time: "", doctor: "", description: "", nextOfKinName: "", nextOfKinPhone: "" });
            } else {
                alert("Booking failed. Try again.");
            }
        } catch (error) {
            console.error("Error booking appointment:", error);
        }

    };
   
    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">General Checkup Booking</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                    <span>Date of Appointment</span>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="border p-2 rounded w-full"
                        required
                    />
                </label>

                <label className="block">
                    <span>Time of Appointment</span>
                    <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="border p-2 rounded w-full"
                        required
                    />
                </label>

                <label className="block">
                    <span>Doctor</span>
                    <select
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    className="border p-2 rounded w-full"
                    required
                    >
                    <option value="">Select a Doctor</option>
                    {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                            {doctor.name} ({doctor.specialty})
                        </option>
                    ))}
                    </select>
                </label>

                <label className="block">
                    <span>Description of Checkup</span>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="border p-2 rounded w-full"
                        required
                    />
                </label>

                <label className="block">
                    <span>Next of Kin Name</span>
                    <input
                        type="text"
                        value={formData.nextOfKinName}
                        onChange={(e) => setFormData({ ...formData, nextOfKinName: e.target.value })}
                        className="border p-2 rounded w-full"
                        required
                    />
                </label>

                <label className="block">
                    <span>Next of Kin Phone Number</span>
                    <input
                        type="tel"
                        value={formData.nextOfKinPhone}
                        onChange={(e) => setFormData({ ...formData, nextOfKinPhone: e.target.value })}
                        className="border p-2 rounded w-full"
                        required
                    />
                </label>

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Book Appointment
                </button>
            </form>
        </div>
    );
}
