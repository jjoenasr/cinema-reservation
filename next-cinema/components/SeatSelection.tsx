"use client";

import React, { useState } from 'react';

interface SeatSelectionProps {
  totalRows: number;
  seatsPerRow: number;
  bookedSeats: string[];
  onSeatSelect: (selectedSeats: string[]) => void;
}

const SeatSelection = ({ totalRows, seatsPerRow, bookedSeats, onSeatSelect }: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleSeatClick = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return;

    const isSelected = selectedSeats.includes(seatId);
    const newSelection = isSelected
      ? selectedSeats.filter((seat) => seat !== seatId)
      : [...selectedSeats, seatId];
    
    setSelectedSeats(newSelection);
    onSeatSelect(newSelection);
  };

  const getSeatStatus = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return 'booked';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-2 sm:p-4 md:p-6">
      <div className="w-full bg-gray-800 p-4 sm:p-6 md:p-8 rounded-t-lg overflow-x-auto">
        <div className="w-full h-6 sm:h-8 bg-gray-400 rounded-lg mb-8 sm:mb-12 text-center text-gray-800 font-bold text-sm sm:text-base">
          Screen
        </div>
        <div className="min-w-fit">
          <div className="grid gap-2 sm:gap-3 md:gap-4">
            {Array.from({ length: totalRows }, (_, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-1 sm:gap-2">
                {Array.from({ length: seatsPerRow }, (_, seatIndex) => {
                  const seatId = `${String.fromCharCode(65 + rowIndex)}${seatIndex + 1}`;
                  const status = getSeatStatus(seatId);
                  return (
                    <button
                      key={seatId}
                      onClick={() => handleSeatClick(seatId)}
                      disabled={status === 'booked'}
                      className={`
                        w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 
                        rounded text-[10px] sm:text-xs font-medium
                        transition-colors duration-200
                        ${status === 'available' && 'bg-gray-200 hover:bg-blue-200'}
                        ${status === 'selected' && 'bg-green-500 text-white'}
                        ${status === 'booked' && 'bg-red-500 text-white cursor-not-allowed'}
                      `}
                    >
                      {seatId}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white p-3 sm:p-4 rounded-b-lg shadow">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-gray-800 text-sm sm:text-base">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-800 text-sm sm:text-base">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-800 text-sm sm:text-base">Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection; 