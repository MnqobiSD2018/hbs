'use client';

import { Calendar } from '../../components/ui/calendar';
import { Card } from '../../components/ui/card';
import { Avatar } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Stethoscope, User } from 'lucide-react';

const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Sarah Wilson',
    specialization: 'Cardiologist',
    location: 'Medical Center, Downtown',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&h=200&auto=format&fit=crop',
    availableSlots: ['09:00', '10:00', '14:00', '15:00'],
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialization: 'Neurologist',
    location: 'Health Plaza, Uptown',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop',
    availableSlots: ['11:00', '13:00', '16:00', '17:00'],
  },
];

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Book Your Appointment</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Doctor List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5" />
              Available Doctors
            </h2>
            {mockDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedDoctor?.id === doctor.id ? 'ring-2 ring-primary' : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedDoctor(doctor)}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <img src={doctor.imageUrl} alt={doctor.name} className="object-cover" />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Stethoscope className="w-4 h-4" />
                      {doctor.specialization}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {doctor.location}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Calendar */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Select Date
            </h2>
            <Card className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </Card>
          </div>

          {/* Time Slots */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Available Time Slots
            </h2>
            <Card className="p-4">
              {selectedDoctor ? (
                <div className="grid grid-cols-2 gap-2">
                  {selectedDoctor.availableSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedTime === slot ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Please select a doctor to view available time slots
                </p>
              )}
              {selectedDoctor && selectedTime && (
                <Button className="w-full mt-4">
                  Book Appointment
                </Button>
              )}
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
