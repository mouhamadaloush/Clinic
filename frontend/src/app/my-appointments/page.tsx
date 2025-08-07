import { cookies } from 'next/headers';
import Image from 'next/image'
import React from 'react'

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

const page = async() => {

  let data: AppointmentsByDate = {};
  let error = null;

  try {

    const authToken = cookies().get('authToken')?.value;
    if (!authToken) {
      throw new Error("Authentication token not found in cookies.");
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/appointment/get_user_appointments/`,{
      headers:{
        'Authorization': `Token ${authToken}`,
      },
      cache: 'no-store'
    });

    const allData = await response.json() || [];

    data = allData || []
    
  } catch (err) {
    console.error("Error fetching data:", err);
    error = err instanceof Error ? err.message : 'An unknown error occurred';
  }

  if (error) {
    return (
      <div className='h-[89vh] flex items-center justify-center px-[30px] md:px-[60px]'>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className='outfit-font'>
      <p className='pb-3 mt-12 font-medium text-zinc-600 border-b'>My Appointments</p>

      <div>
        {Object.entries(data).flatMap(([date, appointments]) =>
          appointments.map((item) => (
            <div
              className='gap-4 flex flex-wrap sm:gap-6 py-4 border-b'
              key={item.id}
            >
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
                <p className='text-neutral-800 font-semibold'>{item?.name || 'Doctor Name'}</p>
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
                <button className='w-full sm:!w-fit text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-mainColor hover:text-white transition-all duration-300'>
                  Pay Online
                </button>
                <button className='w-full sm:!w-fit text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>
                  Cancel appointment
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default page