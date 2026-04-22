"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "../Components/Nav/Nav";
import MyProfile from "../Components/MyProfile/MyProfile";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  
  // Get user from localStorage or auth context
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (!user) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-800 mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const initialTab = searchParams.get('tab') || 'profile';

  return (
    <MyProfile
      user={user}
      onUserUpdate={handleUserUpdate}
      initialTab={initialTab}
      onClose={() => window.location.href = "/"}
    />
  );
}
