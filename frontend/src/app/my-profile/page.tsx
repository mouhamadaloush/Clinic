import ProfileData from '@/components/profile/ProfileData'
import { cookies } from 'next/headers';
import React from 'react'

const Page = async () => {

  const authToken = cookies().get('authToken')?.value;
  const userData = cookies().get('userData')?.value;
  if (!authToken) {
    throw new Error("Authentication token not found in cookies.");
  }

  const res = await fetch(`https://clinic-ashen.vercel.app/auth/${userData}`,
    {
      headers:{
        'Authorization': `Token ${authToken}`,
      },
      cache:"no-cache"
    }
  );
  const user = await res.json();

  return (
    <div className='mt-5 outfit-font'>
      <ProfileData user={user} />
    </div>
  );
};

export default Page;
