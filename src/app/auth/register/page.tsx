'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthFormWrapper from "@/components/AuthFormWrapper";
import SocialAuth from "@/components/SocialAuth";
import Link from "next/link";
import { toast } from "react-toastify";
import { FiRefreshCw, FiEye, FiEyeOff } from "react-icons/fi";

interface RegisterFormData {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  captchaInput: string;
}

interface ErrorObject {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  captcha?: string;
}

const generateCaptcha = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    captchaInput: ""
  });

  const [errors, setErrors] = useState<ErrorObject>({});
  const [captcha, setCaptcha] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [strength, setStrength] = useState(0);
  const [confirmStrength, setConfirmStrength] = useState(0);

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  // PASSWORD STRENGTH
  const calculateStrength = (password: string) => {
    let score = 0;

    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;

    setStrength(score);
  };

  const calculateConfirmStrength = (password: string) => {
    let score = 0;

    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;

    setConfirmStrength(score);
  };

  // WARNA BAR
  const getColor = (value: number) => {
    if (value <= 25) return "bg-red-500";
    if (value <= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
    }

    if (name === "password") calculateStrength(value);
    if (name === "confirmPassword") calculateConfirmStrength(value);

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: ErrorObject = {};

    // USERNAME
    if (!formData.username) {
      newErrors.username = "Username wajib diisi";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    } else if (formData.username.length > 8) {
      newErrors.username = "Maksimal 8 karakter";
    }

    // EMAIL
    if (!formData.email || !formData.email.endsWith("@gmail.com")) {
      newErrors.email = "Format email tidak valid";
    }

    // PHONE
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = "Nomor telepon minimal 10 karakter";
    }

    // PASSWORD
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    }

    // CONFIRM PASSWORD
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password tidak cocok";
    }

    // CAPTCHA
    if (!formData.captchaInput) {
      newErrors.captcha = "Captcha wajib diisi";
    } else if (formData.captchaInput !== captcha) {
      newErrors.captcha = "Harus sesuai dengan captcha yang ditampilkan";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Registrasi gagal!", { theme: "dark" });
      return;
    }

    toast.success("Register berhasil!", { theme: "dark" });

    setTimeout(() => {
      router.push("/auth/login");
    }, 1500);
  };

  return (
    <AuthFormWrapper title="Register">
      <form onSubmit={handleSubmit} className="space-y-5 w-full">

        {/* USERNAME */}
        <div>
          <label className="text-sm font-medium">Username (max 8 karakter)</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            maxLength={8}
            placeholder="Masukkan username"
            className={`w-full px-4 py-2 rounded border ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Masukkan email"
            className={`w-full px-4 py-2 rounded border ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-red-500 italic text-sm">{errors.email}</p>}
        </div>

        {/* PHONE */}
        <div>
          <label className="text-sm font-medium">Nomor Telepon</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Masukkan nomor telepon"
            className={`w-full px-4 py-2 rounded border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <label className="text-sm font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Masukkan password"
            className="w-full px-4 py-2 rounded border border-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-gray-500"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>

          {formData.password && (
            <>
              <div className="mt-2 h-2 bg-gray-200 rounded">
                <div
                  className={`h-2 rounded ${getColor(strength)}`}
                  style={{ width: `${strength}%` }}
                />
              </div>
              <p className="text-sm">Strength: {strength}%</p>
            </>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="relative">
          <label className="text-sm font-medium">Konfirmasi Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Masukkan ulang password"
            className="w-full px-4 py-2 rounded border border-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-8 text-gray-500"
          >
            {showConfirm ? <FiEyeOff /> : <FiEye />}
          </button>

          {formData.confirmPassword && (
            <>
              <div className="mt-2 h-2 bg-gray-200 rounded">
                <div
                  className={`h-2 rounded ${getColor(confirmStrength)}`}
                  style={{ width: `${confirmStrength}%` }}
                />
              </div>
              <p className="text-sm">Strength: {confirmStrength}%</p>
            </>
          )}

          {errors.confirmPassword && (
            <p className="text-red-500 italic text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        {/* CAPTCHA */}
        <div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium">Captcha:</span>

            <span className="font-mono font-bold bg-gray-200 px-3 py-1 rounded text-lg tracking-widest">
              {captcha}
            </span>

            <button
              type="button"
              onClick={() => setCaptcha(generateCaptcha())}
              className="hover:rotate-180 transition"
            >
              <FiRefreshCw />
            </button>
          </div>

          <input
            name="captchaInput"
            value={formData.captchaInput}
            onChange={handleChange}
            placeholder="Masukkan captcha"
            className={`w-full mt-2 px-4 py-2 rounded border ${
              errors.captcha ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.captcha && (
            <p className="text-red-500 italic text-sm">{errors.captcha}</p>
          )}
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Register
        </button>

        <p className="text-center text-sm text-gray-500">Atau masuk dengan</p>
        <SocialAuth />

        <p className="text-center text-sm">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>

      </form>
    </AuthFormWrapper>
  );
}