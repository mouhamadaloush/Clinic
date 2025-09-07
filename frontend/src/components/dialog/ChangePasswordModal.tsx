"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // <-- 1. استيراد toast

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- 4. Hook لمنع السكرول في الخلفية ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // دالة التنظيف لإعادة السكرول عند إغلاق المكون
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  // -----------------------------------------

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match."); // <-- 2. استخدام toast للخطأ
      return;
    }

    setIsLoading(true);
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch('https://clinic-ashen.vercel.app/auth/password_change/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        // عرض رسالة الخطأ القادمة من الباك إند
        throw new Error(data.error || 'Operation failed. Please check your current password.');
      }
      
      // عرض رسالة النجاح القادمة من الباك إند
      toast.success(data.message || "Password changed successfully."); // <-- 2. استخدام toast للنجاح
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(onClose, 1500); // إغلاق الـ Popup بعد النجاح

    } catch (error: any) {
      toast.error(error.message); // <-- 2. استخدام toast للخطأ
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-neutral-800">Change Password</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mainColor focus:border-mainColor"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mainColor focus:border-mainColor"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mainColor focus:border-mainColor"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-mainColor text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;