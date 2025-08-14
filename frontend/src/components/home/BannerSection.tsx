/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BannerSection = () => {
  return (
    <div className='flex bg-mainColor rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-10 md:mx-10'>
      {/* left side */}
      <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
        <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
          <p>Book Appointment </p>
          <p className='mt-4'>With 100+ Trusted Doctors</p>
        </div>
        <Link href="/login" className='bg-white inline-block text-sm sm:text-base text-gray-600  px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all'>Create account</Link>
      </div>

      {/* right side */}
      <div className='hidden md:block md:w-1/2 lg:w-[470px] relative'>
        <img src='/images/banner.png' alt='banner' className='w-full h-[300px] lg:h-[440px] absolute bottom-0 right-0 object-cover' />
      </div>
    </div>
  )
}

export default BannerSection