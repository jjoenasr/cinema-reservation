"use client";

import { useState } from 'react';
import React from 'react';
import SeatSelection from './SeatSelection';

interface BookingSectionProps {
  movieId: number;
  movieTitle: string;
}

export default function BookingSection({ movieId, movieTitle }: BookingSectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);

  const screeningTimes = [
    '10:00 AM',
    '1:00 PM',
    '4:00 PM',
    '7:00 PM',
    '10:00 PM'
  ];

  const handleTimeSelect = async (time: string) => {
    setSelectedTime(time);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${movieId}/seats?screening_time=${time}`);
      const data = await response.json();
      setBookedSeats(data.booked_seats);
    } catch (error) {
      console.error('Error fetching booked seats:', error);
      setBookedSeats([]);
    }
  };

  const handleBooking = async () => {
    if (!selectedTime || selectedSeats.length === 0) {
      alert('Please select a time and seats');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movie_id: movieId,
          seats: selectedSeats,
          screening_time: selectedTime,
          user_email: 'user@example.com', // In a real app, this would come from user authentication
        }),
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      const data = await response.json();
      alert(`Booking confirmed! Booking ID: ${data.booking_id}`);
      setSelectedSeats([]);
    } catch (error) {
      console.error('Error booking seats:', error);
      alert('Failed to book seats. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Book Tickets for {movieTitle}</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-center mb-4">Select Screening Time:</h3>
        <div className="flex flex-wrap gap-4 justify-center">
          {screeningTimes.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeSelect(time)}
              className={`px-4 py-2 rounded-lg ${
                selectedTime === time
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {selectedTime && (
        <>
          <h3 className="text-lg font-semibold mb-4 text-center">Select Your Seats:</h3>
          <SeatSelection
            totalRows={8}
            seatsPerRow={12}
            bookedSeats={bookedSeats}
            onSeatSelect={setSelectedSeats}
          />

          <div className="mt-8">
            <div className="text-center mb-4">
              <p className="text-lg">
                Selected Seats: {selectedSeats.join(', ') || 'None'}
              </p>
              <p className="text-lg">
                Total Price: ${selectedSeats.length * 12}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                  isLoading || selectedSeats.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                onClick={handleBooking}
                disabled={isLoading || selectedSeats.length === 0}
              >
                {isLoading ? 'Booking...' : 'Book Tickets'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 