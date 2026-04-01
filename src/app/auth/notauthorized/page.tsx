'use client'

import { useRouter } from "next/navigation";

export default function NotAuthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-r from-blue-400 to-blue-600 px-4">

      <div className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-center">

        <img
          src="/rapunzel.jpg" 
          alt="Not Authorized"
          className="w-full h-40 object-cover rounded-lg mb-6"
        />

        <h1 className="text-xl font-bold text-gray-800 mb-1">
          ❌ Anda belum login
        </h1>

        <p className="text-gray-600 mb-5">
          Silakan login terlebih dahulu
        </p>

        <button
          onClick={() => router.push("/auth/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          ← Kembali
        </button>

      </div>
    </div>
  );
}