"use client";

import Register from "../Components/Auth/Register";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  
  const handleClose = () => {
    router.push("/");
  };
  
  const handleSwitchToLogin = () => {
    router.push("/login");
  };
  
  const handleSuccess = (data) => {
    // Redirect to home page after successful registration
    router.push("/");
  };
  
  return (
    <Register 
      onClose={handleClose}
      onSwitchToLogin={handleSwitchToLogin}
      onSuccess={handleSuccess}
    />
  );
}
