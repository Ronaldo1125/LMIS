"use client";

import Login from "../Components/Auth/Login";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  const handleClose = () => {
    router.push("/");
  };
  
  const handleSwitchToRegister = () => {
    router.push("/register");
  };
  
  return (
    <Login 
      onClose={handleClose}
      onSwitchToRegister={handleSwitchToRegister}
    />
  );
}
