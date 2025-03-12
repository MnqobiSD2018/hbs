import { useState, useEffect } from "react";

export default function GeneralCheckup() {
    const [availableSlots, setAvailableSlots] = useState([]);
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

    const handleDoctorChange = async (doctorId) => {
        setFormData({ ...formData, doctor: doctorId });
        //selectedDoctor(doctorId);
        // Fetch available slots for selected doctor
        const selectedDoctor = doctors.find((doc) => doc._id === doctorId);
        setAvailableSlots(selectedDoctor?.availableSlots || []);
    };

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
                phone: formData.nextOfKinPhone 
            },
        };

        try {
            // Call API to create booking and update doctor's available slots
            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData),
            });

            if (response.ok) {
                alert("Booking successful!");
                setAvailableSlots((prevSlots) => prevSlots.filter(slot => slot !== formData.time));
                setFormData({ date: "", time: "", doctor: "", description: "", nextOfKinName: "", nextOfKinPhone: "" });
            } else {
                alert("Booking failed. Try again.");
            }
        } catch (error) {
            console.error("Error booking appointment:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Book Appointment</h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">Doctor</label>
                        <select
                            value={formData.doctor}
                            onChange={(e) => handleDoctorChange(e.target.value)}
                            className="border p-3 rounded-lg w-full focus:ring focus:ring-blue-300"
                            required
                        >
                            <option value="">Select a Doctor</option>
                            {doctors.map((doctor) => (
                                <option key={doctor._id} value={doctor._id}>
                                    {doctor.name} ({doctor.specialization})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">Date of Appointment</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="border p-3 rounded-lg w-full focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">Time of Appointment</label>
                        <select
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="border p-3 rounded-lg w-full focus:ring focus:ring-blue-300"
                            required
                        >
                            <option value="">Select a Time Slot</option>
                                {availableSlots.map((slot, index) => (
                            <option key={index} value={slot}>
                                {slot}
                            </option>
                         ))}
                        </select>
                    </div>

                    
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">Description of Checkup</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="border p-3 rounded-lg w-full h-24 focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">Next of Kin Name</label>
                        <input
                            type="text"
                            value={formData.nextOfKinName}
                            onChange={(e) => setFormData({ ...formData, nextOfKinName: e.target.value })}
                            className="border p-3 rounded-lg w-full focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium">Next of Kin Phone Number</label>
                        <input
                            type="tel"
                            value={formData.nextOfKinPhone}
                            onChange={(e) => setFormData({ ...formData, nextOfKinPhone: e.target.value })}
                            className="border p-3 rounded-lg w-full focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-lg font-semibold hover:opacity-90 transition">
                        Book Appointment
                    </button>
                </form>
            </div>
        </div>
    );
}
