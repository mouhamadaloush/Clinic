"use client"

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from 'axios';

type Slot = {
  dateTime: Date;
  time: string;
}

const BookingSlots = () => {
  const [docSlots, setDocSlots] = useState<Slot[][]>([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getAvailableSlots = () => {
    let allSlots: Slot[][] = [];
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(currentDate);
      endTime.setHours(16, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        let currentHour = new Date().getHours();
        let currentMinutes = new Date().getMinutes();
        currentDate.setHours(currentHour > 8 ? currentHour : 9);
        currentDate.setMinutes(currentMinutes > 30 ? 0 : 30);
        if (currentMinutes > 30) currentDate.setHours(currentDate.getHours() + 1);

      } else {
        currentDate.setHours(9, 0, 0, 0);
      }

      let timeSlots: Slot[] = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });
        timeSlots.push({
          dateTime: new Date(currentDate),
          time: formattedTime
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      allSlots.push(timeSlots);
    }
    setDocSlots(allSlots);
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot.');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please provide a reason for your appointment.');
      return;
    }

    setIsLoading(true);

    const date = selectedSlot.dateTime;
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

    const requestBody = {
      chosen_date: formattedDate,
      reason_of_appointment: reason,
    };

    try {
      const token = Cookies.get('authToken');
      if (!token) {
        toast.error("You must be logged in to book an appointment.");
        setIsLoading(false);
        return;
      }

      const apiEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/appointment/make_appointment/`;

      const response = await axios.post(apiEndpoint, requestBody, {
        headers: {
          'Authorization': `Token ${token}`,
        }
      });

      toast.success('Appointment booked successfully!');
      setSelectedSlot(null);
      setReason('');

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.detail || 'Failed to book appointment.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAvailableSlots();
  }, []);

  useEffect(() => {
    setSelectedSlot(null);
  }, [slotIndex]);


  return (
    <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
      <p className='text-lg'>Booking slots</p>

      <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4 pb-2'>
        {docSlots.length > 0 && docSlots.map((item, index) => (
          item.length > 0 &&
          <div key={index}
            onClick={() => setSlotIndex(index)}
            className={`text-center py-6 min-w-20 rounded-lg cursor-pointer transition-colors ${slotIndex === index ? "bg-mainColor text-white" : "border border-gray-200 hover:bg-gray-50"}`}
          >
            <p className='text-sm'>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
            <p className='text-2xl font-bold'>{item[0] && item[0].dateTime.getDate()}</p>
          </div>
        ))}
      </div>

      <p className='mt-6 text-lg'>Available Times</p>
      <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4 pb-2'>
        {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
          <p
            onClick={() => setSelectedSlot(item)}
            key={index}
            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-colors ${selectedSlot?.time === item.time ? "bg-mainColor text-white" : "text-gray-500 border border-gray-300 hover:bg-gray-100"}`}>
            {item.time.toLowerCase()}
          </p>
        ))}
        {docSlots.length > 0 && docSlots[slotIndex].length === 0 && (
          <p className='text-gray-400'>No more slots available for today.</p>
        )}
      </div>

      <div className='mt-6'>
        <p className='text-lg'>Reason for Appointment</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className='w-full max-w-lg mt-2 p-3 border border-gray-300 rounded-lg focus:outline-mainColor focus:ring-1 focus:ring-mainColor'
          rows={4}
          placeholder='e.g. General check-up, follow-up, etc.'
        />
      </div>

      <button
        onClick={handleBooking}
        disabled={isLoading}
        className='bg-mainColor text-white text-sm font-light px-14 py-3 rounded-full my-6 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-opacity-90 transition-colors'>
        {isLoading ? 'Booking...' : 'Book an appointment'}
      </button>
    </div>
  );
}

export default BookingSlots;
