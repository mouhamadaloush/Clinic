"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import LogoutDialog from '../dialog/LogoutDialog';

const NavbarDoctor = () => {
  const router = useRouter();

  const handleLogoutSuccess = () => {
    router.push('/');
  };

  
  useEffect(()=>{
    const isStaff = localStorage.getItem("isStaff")
    if(!isStaff){
      router.push('/');
    }
  },[router])
  

  return (
    <div>
      <div className='flex items-center justify-between px-4 sm:px-10 py-3 border-b bg-white'>
        <Link href="/" className='flex items-center gap-2 text-xs'>
          <Image src="/images/logo.jpg" alt='logo' width={50} height={60}
            className='cursor-pointer'
          />
          <p className='text-[22px] font-semibold text-[#000b6d]'>
            DentoFolio
          </p>
          <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>Doctor</p>
        </Link>
        
        <LogoutDialog onLogoutSuccess={handleLogoutSuccess}>
          <button className='bg-mainColor text-white text-sm px-10 py-2 rounded-full'>
            Logout
          </button>
        </LogoutDialog>

      </div>
    </div>
  )
}

export default NavbarDoctor
