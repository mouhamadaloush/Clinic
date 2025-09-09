"use client"

import { useAuth } from '@/context/AuthContext';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const MainSection = () => {
  const { isAuthenticated, token, expiry, userId, isStaff } = useAuth();

  return (
    <div className='outfit-font'>
      <div className='bg-mainColor w-full h-auto mt-[26px] flex
        flex-wrap flex-col md:flex-row rounded-lg px-6 md:px-10 lg:px-20
        items-center justify-center relative'>
        {/* left side */}
        <div className='text-white md:w-1/2 flex flex-col items-center md:items-start justify-center gap-4 py-10 mx-auto md:py-[10vw] md:mb-[-30px]'>
          
          <div className='text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-tight lg:leading-tight'>Book Appointment <br /> With Trusted Doctor</div>
          
          <div className='flex flex-col md:flex-row items-center gap-3 text-sm font-light'>
            <Image src="/images/group-profiles.png" alt='' width={130} height={65} className='w-28' />
            <div className='text-[18px] font-normal hidden sm:block'>
              Simply browse through our extensive list of trusted doctors, <br /> 
              schedule your appointment hassle-free.
            </div>
          
          </div>
          
          <Link href="/appointment" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'>
            Book Appointments 
            <Image src="/images/arrow-icon.svg" alt='' width={14} height={10} className='w-3' />
          
          </Link>
        
        </div>
        <div className='md:w-1/2 relative md:h-[597px] max-h-full'>
          <Image src="/images/main.png" alt="main" width={882} height={596}
            className='w-full md:absolute  bottom-0 rounded-lg'
          />
        </div>
      </div>
    </div>
  )
}

export default MainSection