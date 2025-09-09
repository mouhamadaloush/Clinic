"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import teeth from "../../../public/animations/cleantooth.json";
import Lottie from 'lottie-react';
import { useRouter } from 'next/navigation';
import ChangePasswordModal from '../dialog/ChangePasswordModal';

const ProfileData = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("authToken");
    if (!tokenFromStorage) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const id = localStorage.getItem("id");
    if (!authToken || !id) {
      console.error("Authentication token or ID not found in localStorage.");
      return;
    }
    fetch(`https://clinic-ashen.vercel.app/auth/${id}`, {
      headers: { 'Authorization': `Token ${authToken}` },
      cache: "no-cache",
    })
      .then(res => res.json())
      .then(data => {
        setUserData({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          dob: data.dob || '',
          gender: data.gender || 'M',
          image: data.image || '/images/profile.png',
        });
      })
      .catch(err => console.error(err));
  }, []);

  if (!userData) {
    return (
      <div className='flex justify-center items-center w-full h-[75vh]'>
        <Lottie animationData={teeth} loop={true} style={{ width: 125, height: 125 }} />
      </div>
    );
  }

  return (
    <>
      <div className='max-w-lg flex flex-col gap-2 text-sm'>
        <Image src={userData.image} alt="Profile" width={100} height={100}
          className='w-[125px] h-[125px] rounded-full object-cover border-4 border-white shadow-md'
        />

        <div className='flex items-center gap-2 flex-wrap'>
          <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData?.firstName}</p>
          <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData?.lastName}</p>
        </div>

        <hr className='bg-zinc-300 h-[1px] border-none my-4' />
        
        <div>
          <p className='text-neutral-500 underline mt-3 font-semibold'>CONTACT INFORMATION</p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
            <p className='font-medium'>Email id:</p>
            <p className='text-blue-500'>{userData?.email}</p>
            <p className='font-medium'>Phone:</p>
            <p className='text-neutral-600'>{userData?.phone}</p>
          </div>
        </div>

        <div className='mt-6'>
          <p className='text-neutral-500 underline font-semibold'>BASIC INFORMATION</p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
            <p className='font-medium'>Gender:</p>
            <p className='text-neutral-600'>{userData?.gender === "M" ? "Male" : "Female"}</p>
            <p className='font-medium'>Birthday:</p>
            <p className='text-neutral-600'>{userData?.dob}</p>
          </div>
        </div>

        <div className='mt-10'>
          <button 
            onClick={() => setIsModalOpen(true)}
            className='border border-mainColor px-8 py-2 rounded-full text-mainColor font-semibold hover:text-white hover:bg-mainColor transition-all'
          >
            Change Password
          </button>
        </div>
      </div>

      <ChangePasswordModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProfileData;