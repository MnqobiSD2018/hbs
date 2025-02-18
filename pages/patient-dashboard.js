import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react"; // Import icons


export default function PatientDashboard() {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();


    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/login");
    };

    useEffect(() => {
        console.log("Checking localStorage for user...");
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (!loggedInUser) {
            console.log("No user found, redirecting to login...");
            //router.push("/login");
        } else {
            console.log("User loaded from storage:", loggedInUser); 
            setUser(loggedInUser);
        }
    }, []);
    
    if (!user) {
        return <p>Loading...</p>; // Prevents flashing before redirect
    }

    const loggedInUsertest = JSON.parse(localStorage.getItem("user"));

    console.log(loggedInUsertest.name);
   

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold">Patient Dashboard</h1>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                    <p className="text-lg">Welcome</p>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                        Logout
                    </button>
                </div>

                {/* Hamburger Menu Button (Mobile) */} 
                <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-blue-700 text-white p-4 flex flex-col items-center space-y-4">
                    <p className="text-lg">Welcome, User!</p>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                        Logout
                    </button>
                </div>
            )}

            {/* Booking Options */}
            <div className="flex flex-col items-center p-6">
                <div className="grid grid-cols-2 gap-6 w-full max-w-lg mt-6">
                    <button onClick={() => router.push("./appointments/general-checkup")} className="bg-blue-500 text-white p-4 rounded-lg w-full">
                        General Checkup
                    </button>
                    <button onClick={() => router.push("./appointments/specialist-visit")} className="bg-green-500 text-white p-4 rounded-lg w-full">
                        Specialist Visit
                    </button>
                    <button onClick={() => router.push("./appointments/book-for-someone")} className="bg-yellow-500 text-white p-4 rounded-lg w-full">
                        Book for Someone Else
                    </button>
                    <button onClick={() => router.push("./appointments/vaccination")} className="bg-purple-500 text-white p-4 rounded-lg w-full">
                        Vaccination Booking
                    </button>
                    <button onClick={() => router.push("/patient-settings")} className="bg-gray-500 text-white p-4 rounded-lg w-full">
                         Settings
                    </button>
                    <button onClick={() => router.push("/booking-history")} className="bg-gray-500 text-white p-4 rounded-lg w-full">
                        View Booking History
                    </button>
                </div>
            </div>
        </div>
    );
}
