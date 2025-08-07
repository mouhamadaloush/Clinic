import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
    <div className='md:mx-10 outfit-font'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        {/* Left Section */}
        <div>
          <Image src="/images/logo.svg" alt='' className='w-40 mb-5' width={160} height={46} />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore repellendus deleniti nemo quis laboriosam quod accusamus! Perferendis asperiores commodi iusto voluptatibus? Ut natus nihil nostrum pariatur quam nulla nobis eos!</p>
        </div>

        {/* center Section */}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Private policy</li>
          </ul>
        </div>

        {/* right section */}
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>0933 981 269</li>
            <li>mohammedshakokah@gmail.com</li>
          </ul>
        </div>

      </div>

      {/* Copy Right */}
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025@ Prescripto - All Right Reversed.</p>
      </div>

    </div>
  )
}

export default Footer