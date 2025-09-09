import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div className='outfit-font'>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <Image src="/images/contact.png" alt='' width={1000} height={1000}
          className='w-full md:max-w-[360px] h-[360px] object-center'
        />

        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-lg text-gray-600'>Our OFFICE</p>
          <p className='text-gray-500'>54709 Willms Station <span>Suite 350, Washington, USA</span></p>
          <p className='text-gray-500'>Tel: (415) 555‑0132 <span>Email: greatstackdev@gmail.com</span></p>
          <p className='font-semibold text-lg text-gray-600'>Careers at PRESCRIPTO</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>
    </div>
  )
}

export default page