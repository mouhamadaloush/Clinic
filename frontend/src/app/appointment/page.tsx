
import BookingSlots from '@/components/appointment/BookingSlots'
import Image from 'next/image'
import React from 'react'

const page = () => {

  return (
    <div className='mt-[37px] outfit-font'>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <Image src="/images/doctor.png" alt='' width={266} height={376}
            className='bg-mainColor w-full sm:max-w-72 rounded-lg'
          />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            Dr. Richard James <Image src="/images/verified.png" width={24} height={24} alt='' className='w-5' /></p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>MBBS - General Physician</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>2 Years</button>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <Image src="/images/about.png" width={17} height={16} alt='' /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>
              Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.
            </p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>$50</span>
          </p>
        </div>
      </div>

      <BookingSlots />
    </div>
  )
}

export default page