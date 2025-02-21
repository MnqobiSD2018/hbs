import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ManageDoctors from "@/components/ManageDoctors";
import Appointments from "@/components/Appointments";
import Patients from "@/components/Patients";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("doctors");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const userRole = localStorage.getItem("userRole"); // Get role from localStorage
        if (userRole !== "admin") {
            //alert("Access denied! Admins only.");
            //router.push("/login");
        } else {
            setIsLoggedIn(true);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        alert("Logged out successfully!");
        router.push("/login");
    };


    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white p-4">
                <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
                <ul>
                    <li
                        className={`p-2 cursor-pointer ${activeTab === "doctors" ? "bg-gray-700" : ""}`}
                        onClick={() => setActiveTab("doctors")}
                    >
                        Manage Doctors
                    </li>
                    <li
                        className={`p-2 cursor-pointer ${activeTab === "appointments" ? "bg-gray-700" : ""}`}
                        onClick={() => setActiveTab("appointments")}
                    >
                        View Appointments
                    </li>
                    <li
                        className={`p-2 cursor-pointer ${activeTab === "patients" ? "bg-gray-700" : ""}`}
                        onClick={() => setActiveTab("patients")}
                    >
                        Patients
                    </li>
                </ul>
                <button
                    onClick={handleLogout}
                    className="mt-6 w-full bg-red-500 text-white p-2 rounded"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                {activeTab === "doctors" && <ManageDoctors />}
                {activeTab === "appointments" && <p>Appointments Management (Coming Soon)</p>}
                {activeTab === "patients" && <Patients/>}
            </div>
        </div>
    );
}
