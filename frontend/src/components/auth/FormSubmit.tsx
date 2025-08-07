"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

const FormSubmit = () => {

  const router = useRouter();
  const { login } = useAuth();

  const [state, setState] = useState("Sign Up");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("M");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");


  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (state === "Login") {
      if (!email || !password) {
        setError("Please enter both email and password.");
        setIsLoading(false);
        return;
      }

      try {
        const apiEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login/`;
        const credentials = `${email}:${password}`;
        const encodedCredentials = btoa(credentials);

        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${encodedCredentials}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          login(data.token, data.expiry, data.user);
          toast.success('Login successful!');
          const params = new URLSearchParams(window.location.search);
          const fromPage = params.get('from');
          router.push(fromPage || '/');
        } else {
          toast.error(data.detail || 'Login failed. Please check your credentials.');
          setError(data.detail);
        }

      } catch (err) {
        const errorMessage = 'A network error occurred. Please try again later.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    else if (state === "Sign Up") {
      try {
        const apiEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/register/`;
        
        const requestBody = {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          gender,
          dob,
          phone,
        };

        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (response.ok) {
            toast.success('Account created successfully! Please log in.');
            setState('Login'); 
        } else {
            const errorMessage = data.detail || 'Registration failed. Please check your details.';
            toast.error(errorMessage);
            setError(errorMessage);
        }

      } catch (err) {
        const errorMessage = 'A network error occurred during registration.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };


  return (
    <form onSubmit={onSubmitHandler} className='min-h-[70vh] flex items-center outfit-font mt-8'>
      <div className='flex flex-col gap-4 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold text-zinc-800'>{state === "Sign Up" ? "Create Account" : "Login"}</p>
        <p>Please {state === "Sign Up" ? "sign up" : "log in"} to book an appointment</p>

        {state === "Sign Up" && (
          <>
            <div className='w-full'>
              <p>First Name</p>
              <input required className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-mainColor' type="text" onChange={(e) => setFirstName(e.target.value)} value={firstName} />
            </div>
            <div className='w-full'>
              <p>Last Name</p>
              <input required className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-mainColor' type="text" onChange={(e) => setLastName(e.target.value)} value={lastName} />
            </div>
            <div className='w-full'>
                <p>Date of Birth</p>
                <input required className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-mainColor' type="date" onChange={(e) => setDob(e.target.value)} value={dob} />
            </div>
            <div className='w-full'>
                <p>Gender</p>
                <select required className='border border-zinc-300 rounded w-full p-2 mt-1 bg-white focus:outline-mainColor' value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                </select>
            </div>
            <div className='w-full'>
                <p>Phone Number</p>
                <input required className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-mainColor' type="tel" placeholder='+963992820554' onChange={(e) => setPhone(e.target.value)} value={phone} />
            </div>
          </>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input required className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-mainColor' type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input required className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-mainColor' type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
        </div>

        {error && <p className='text-red-500 text-xs'>{error}</p>}

        <button disabled={isLoading} className='bg-mainColor text-white w-full py-2 rounded-md text-base hover:bg-opacity-90 disabled:bg-zinc-400 disabled:cursor-not-allowed'>
          {isLoading ? 'Loading...' : (state === "Sign Up" ? "Create Account" : "Login")}
        </button>

        <div>
            {state === "Sign Up"
              ? <p>Already have an account? <span onClick={() => { setState("Login"); setError(null); }} className='text-mainColor underline cursor-pointer'>Login here</span></p>
              : <p>Don&apos;t have an account? <span onClick={() => { setState("Sign Up"); setError(null); }} className='text-mainColor underline cursor-pointer'>Create one</span></p>
            }
        </div>
      </div>
    </form>
  )
}

export default FormSubmit
