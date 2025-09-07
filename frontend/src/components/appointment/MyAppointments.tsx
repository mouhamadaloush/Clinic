"use client"

import React, { useEffect, useState, useCallback } from 'react'; // Add useCallback
import Image from 'next/image';
import Link from 'next/link';
import CancelAppointmentDialog from '@/components/appointment/CancelAppointmentDialog';
import Lottie from 'lottie-react';
import teeth from "../../../public/animations/cleantooth.json"
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type Appointment = {
  id: number;
  user: number;
  reason_of_appointment: string;
  time: string;
  name?: string;
  image?: string;
};

type AppointmentsByDate = {
  [date: string]: Appointment[];
};


const MyAppointments = () => {
  const [data, setData] = useState<AppointmentsByDate>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("authToken")
    if (!tokenFromStorage) {
      router.push("/login")
    }
  },[router])

  const fetchAppointments = useCallback(() => {
    setLoading(true);
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('id');

    if (!authToken || !userId) {
      setError("Authentication token or user ID not found in localStorage.");
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/appointment/get_user_appointments/`, {
      headers: {
        'Authorization': `Token ${authToken}`,
      },
      cache: 'no-store',
    })
      .then(res => res.json())
      .then((allData: AppointmentsByDate) => {
        setData(allData || {});
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

      if (loading) {
        return (
          <div className='flex justify-center items-center w-full h-[75vh]'>
            <Lottie
              animationData={teeth} 
              loop={true} 
              style={{ width: 125, height: 125 }} 
            />
          </div>
        );
      }
  if (error) return <div className='h-[89vh] flex items-center justify-center px-[30px] md:px-[60px]'>
    <p className="text-red-500">Error: {error}</p>
  </div>;

  return (
    <div className='outfit-font'>
      <p className='pb-3 mt-12 font-medium text-zinc-600 border-b'>My Appointments</p>

      <div>
        {Object.entries(data).flatMap(([date, appointments]) =>
          appointments.map(item => (
            <div key={item.id} className='gap-4 flex flex-wrap sm:gap-6 py-4 border-b'>
              <div>
                <Image
                  className='w-32 h-auto bg-indigo-50'
                  src={item.image || '/images/doctor.png'}
                  alt='Doctor'
                  width={128}
                  height={128}
                />
              </div>

              <div className='flex-1 text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item?.name || 'Mohammed'}</p>
                <p className='text-xs mt-1'>
                  <span className='text-sm text-neutral-700 font-medium'>Date:</span> {date}
                </p>
                <p className='text-xs mt-1'>
                  <span className='text-sm text-neutral-700 font-medium'>Time:</span>{' '}
                  {item.time?.slice(0, 5)}
                </p>
                <p className='text-xs mt-1'>
                  <span className='text-sm text-neutral-700 font-medium'>Reason:</span>{' '}
                  {item.reason_of_appointment}
                </p>
              </div>

              <div className='flex flex-col gap-2 justify-end w-full sm:w-auto'>
                {/* <button className='w-full sm:!w-fit text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-mainColor hover:text-white transition-all duration-300'>
                  Pay Online
                </button> */}

                <Link href={`/my-appointments/record/${item.id}`} className='w-full sm:!w-fit text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-mainColor hover:text-white transition-all duration-300'>
                  Show Record
                </Link>

                <CancelAppointmentDialog
                  id={item.id}
                  onAppointmentCancelled={fetchAppointments}
                  trigger={
                    <button className='w-full sm:!w-fit text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>
                      Cancel appointment
                    </button>
                  }
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAppointments;