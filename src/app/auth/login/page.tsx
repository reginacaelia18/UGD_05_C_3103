'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthFormWrapper from "@/components/AuthFormWrapper";
import SocialAuth from "@/components/SocialAuth";
import Link from "next/link";
import { toast } from "react-toastify";
import { FiRefreshCw, FiEye, FiEyeOff } from "react-icons/fi";

interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
  rememberMe?: boolean;
}

interface ErrorObject {
  email?: string;
  password?: string;
  captcha?: string;
}

const generateCaptcha = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    captchaInput: ""
  });

  const [errors, setErrors] = useState<ErrorObject>({});
  const [attempts, setAttempts] = useState(3);

  const [captcha, setCaptcha] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ tambahan

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: ErrorObject = {};

    if (!formData.email) newErrors.email = "Email tidak boleh kosong";
    if (!formData.password) newErrors.password = "Password tidak boleh kosong";

    if (formData.captchaInput.trim() === "") {
      newErrors.captcha = 'Captcha belum diisi';
    } else if (formData.captchaInput !== captcha) {
      newErrors.captcha = "Captcha salah";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      if (attempts > 0) {
        const newAttempt = attempts - 1;
        setAttempts(newAttempt);

        toast.error(`Login Gagal! Sisa kesempatan: ${newAttempt}`, {
          theme: 'dark',
          position: 'top-right'
        });

        if (newAttempt === 0) {
          toast.error("Kesempatan login habis!", {
            theme: 'dark',
            position: 'top-right'
          });
        }
      }

      return;
    }

    toast.success("Login Berhasil!", {
      theme: 'dark',
      position: 'top-right'
    });

    router.push("/home");
  };

  return (
    <AuthFormWrapper title="Login">

      <p className="text-center text-sm text-gray-600 mb-2">
        Sisa kesempatan: <span className="font-bold">{attempts}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 w-full">

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan email"
          />
          {errors.email && <p className="text-red-600 text-sm italic">{errors.email}</p>}
        </div>

        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type={showPassword ? "text" : "password"} // ✅ perubahan kecil
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan password"
          />

          <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-500"
             >
             {showPassword ? <FiEyeOff /> : <FiEye />}
           </button>

          {errors.password && <p className="text-red-600 text-sm italic">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.rememberMe || false}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))
              }
              className="mr-2"
            />
            Ingat saya
          </label>

          <Link href="/auth/forgot-password" className="text-blue-600 text-sm font-semibold">
            Forgot Password?
          </Link>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium">Captcha:</span>

            <span className="font-mono font-bold bg-gray-200 px-3 py-1 rounded text-lg">
              {captcha}
            </span>

            <button
              type="button"
              onClick={() => setCaptcha(generateCaptcha())}
              className="text-gray-600 hover:text-blue-600 transition duration-300 hover:rotate-180 text-lg"
              title="Refresh Captcha"
            >
              <FiRefreshCw />
            </button>
          </div>

          <input
            name="captchaInput"
            value={formData.captchaInput}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan captcha"
          />
          {errors.captcha && <p className="text-red-600 text-sm italic">{errors.captcha}</p>}
        </div>

        <button
          type="submit"
          disabled={attempts === 0}
          className={`w-full py-2.5 rounded-lg text-white font-semibold
          ${attempts === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          Sign In
        </button>

        <button
          type="button"
          disabled={attempts !== 0}
          onClick={() => {
            setAttempts(3);
            setCaptcha(generateCaptcha());
            toast.success("Kesempatan direset!", {
              theme: 'dark',
              position: 'top-right'
            });
          }}
          className={`w-full py-2.5 rounded-lg text-white font-semibold
          ${attempts === 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Reset Kesempatan
        </button>

        <SocialAuth />

        <p className="text-center text-sm text-gray-600">
          Tidak punya akun?{" "}
          <Link href="/auth/register" className="text-blue-600 font-semibold">
            Daftar
          </Link>
        </p>

      </form>
    </AuthFormWrapper>
  );
};

export default LoginPage;