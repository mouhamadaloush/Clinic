"use client"

import Image from 'next/image';
import React, { useState } from 'react';

const ProfileData = ({ user }: { user: any }) => {
  const [userData, setUserData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    gender: user?.gender || 'M',
    image: user?.image || '/images/profile.jpg',
  });

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      <Image src={userData.image} alt="" width={300} height={300}
        className='w-36 h-36 rounded object-cover'
      />

      <div className='flex items-start justify-start gap-2 flex-wrap'>
        {isEdit ? (
          <input className='bg-gray-50 text-3xl font-medium mt-4' type="text" value={userData?.firstName} onChange={e => setUserData(prev => ({ ...prev, firstName: e.target.value }))} />
        ) : (
          <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData?.firstName}</p>
        )}

        {isEdit ? (
          <input className='bg-gray-50 text-3xl font-medium mt-4' type="text" value={userData?.lastName} onChange={e => setUserData(prev => ({ ...prev, lastName: e.target.value }))} />
        ) : (
          <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData?.lastName}</p>
        )}
      </div>

      <hr className='bg-zinc-400 h-[1px] border-none' />
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData?.email}</p>
          <p>Phone:</p>
          {isEdit ? (
            <input className='bg-gray-100 max-w-52' type="text" value={userData?.phone} onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
          ) : (
            <p className='text-blue-400'>{userData?.phone}</p>
          )}
        </div>
      </div>

      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {isEdit ? (
            <select className='max-w-20 bg-gray-100' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData?.gender}>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          ) : (
            <p className='text-gray-400'>{userData?.gender === "M" ? "Male" : "Female"}</p>
          )}

          <p>Birthday:</p>
          {isEdit ? (
            <input className='max-w-20 bg-gray-100' type="date" onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData?.dob} />
          ) : (
            <p className='text-gray-400'>{userData?.dob}</p>
          )}
        </div>
      </div>

      <div className='mt-10'>
        {isEdit ? (
          <button className='border border-mainColor px-8 py-2 rounded-full hover:text-white hover:bg-mainColor transition-all' onClick={() => setIsEdit(false)}>Save Information</button>
        ) : (
          <button className='border border-mainColor px-8 py-2 rounded-full hover:text-white hover:bg-mainColor transition-all' onClick={() => setIsEdit(true)}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default ProfileData;
