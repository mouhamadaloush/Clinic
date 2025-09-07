"use client"

import { useAuth } from '@/context/AuthContext';
import Image from 'next/image'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react'
import LogoutDialog from '../dialog/LogoutDialog';
import { CircleX, Menu } from 'lucide-react';

type LinksProps = {
  name: string;
  path: string;
}

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isStaff } = useAuth();

  const links: LinksProps[] = useMemo(() => [
    { name: "home", path: "/" },
    { name: "about us", path: "/about" },
    { name: "contact us", path: "/contact" },
    ...(isStaff ? [{ name: "dashboard", path: "/dashboard" }] : [])
  ], [isStaff]);

  const [showMenu, setShowMenu] = useState(false);

  const handleLogoutSuccess = () => {
    router.push('/');
  };

  return (
    <div className='poppins-font py-[17px] mx-4 sm:mx-[10%] outfit-font'>
      <div className='flex items-center justify-between'>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.jpg" alt='logo' width={50} height={60}
            className=''
          />
          <p className='text-[18px] sm:text-[22px] font-semibold text-[#000b6d]'>
            DentoFolio
          </p>
        </Link>
        <div className='hidden md:flex items-center justify-center gap-[48px]'>
          {
            links.map((link, index) => (
              <div key={index} className='relative'>
                <Link href={link.path}
                  className='text-[16px] font-medium uppercase text-textColor'
                >
                  {link.name}
                </Link>
                {
                  link.path === pathname ?
                    <div className='absolute w-3/5 h-[2px] bg-mainColor bottom-[-6px] left-[50%] translate-x-[-50%]' />
                    : null
                }
              </div>
            ))
          }
        </div>
        <div className='flex items-center justify-end gap-3'>
          {
            isAuthenticated ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <Image src="/images/profile.png" alt='' width={32} height={32} className='rounded-full w-8 h-8 object-cover' />
              <Image src="/images/arrow-down.svg" alt='' width={10} height={10} />
              <div className='absolute top-0 right-0 pt-14 text-textColor font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                  <Link href="/my-profile" className='hover:text-black cursor-pointer'>My Profile</Link>
                  <Link href="/my-appointments" className='hover:text-black cursor-pointer'>My Appointments</Link>
                  
                  <LogoutDialog onLogoutSuccess={handleLogoutSuccess}>
                    <p className='hover:text-black cursor-pointer'>Logout</p>
                  </LogoutDialog>

                </div>
              </div>
            </div>
              :
              <Link href="/login"
                className='text-[12px] sm:text-[14px] lg:text-[18px] font-normal outfit-font rounded-[47px] bg-mainColor text-white px-[15px] sm:px-[20px] lg:px-[36px] py-[13.5px]'>
                Create account
              </Link>
          }
          <Menu onClick={() => setShowMenu(true)} className='w-6 md:hidden cursor-pointer' />
          <div className={`${showMenu ? "fixed w-full" : "w-0 h-0"} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
            <div className='flex items-center justify-between px-5 py-6'>
              <div className='flex items-center gap-2'>
                <Image src="/images/logo.jpg" alt='logo' width={50} height={60}
                  className=''
                />
                <p className='text-[18px] sm:text-[22px] font-semibold text-[#000b6d]'>
                  DentoFolio
                </p>
              </div>
              <CircleX className='w-7 cursor-pointer' onClick={() => setShowMenu(false)} />
            </div>
            <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
              {
                links.map((link, index) => (
                  <Link key={index} href={link.path} onClick={() => setShowMenu(false)}
                    className={`px-4 py-2 rounded inline-block uppercase outfit-font
                      ${link.path === pathname ? "text-white bg-mainColor" : ""}
                    `}
                  >
                    {link.name}
                  </Link>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
      <div className='relative h-[1px] top-[17px] w-full bg-[#ADADAD]' />
    </div>
  )
}

export default Navbar