'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Game1 from "@/components/Game1";

export default function Home() {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");

    if (!isLogin) {
      router.replace("/auth/notauthorized"); 
    } else {
      setIsAllowed(true); 
    }
  }, []);

  if (isAllowed === null) {
    return null; 
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <h1 className="text-4xl font-bold mb-4 text-white">
        Selamat Datang!
      </h1>
      <Game1 />
    </div>
  );
}