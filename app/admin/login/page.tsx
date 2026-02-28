"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock } from "react-icons/fi";
import { authAPI } from "../../../lib/api";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login({
        email,
        password
      });

      if (response && response.success) {
        if (response.user.role !== "admin") {
          setError("ليس لديك صلاحية للوصول إلى Dashboard");
          setLoading(false);
          return;
        }

        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        router.push("/admin");
      } else {
        const errorMsg = response?.message || 
                        (response?.errors && response.errors[0]?.msg) || 
                        "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        
        // Add helpful message for wrong credentials
        if (errorMsg.includes("البريد الإلكتروني") || errorMsg.includes("كلمة المرور")) {
          setError(`${errorMsg}\n\n💡 الحل:\n1. تأكد من تشغيل Backend: npm run dev (في مجلد backend)\n2. تأكد من تشغيل MongoDB\n3. شغّل Seeder لإنشاء حساب Admin:\n   cd backend\n   npm run seed:admin\n\n📧 البريد: admin@esdaly.com\n🔑 كلمة المرور: admin123`);
        } else {
          setError(errorMsg);
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error?.message || "حدث خطأ أثناء تسجيل الدخول";
      
      // Check if it's a connection error
      if (errorMessage.includes("لا يمكن الاتصال") || errorMessage.includes("fetch") || errorMessage.includes("Failed")) {
        setError(errorMessage);
      } else {
        setError(`${errorMessage}\n\n💡 تأكد من:\n1. تشغيل Backend على http://localhost:5000\n2. تشغيل MongoDB\n3. تشغيل Seeder: npm run seed:admin`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 md:p-10 border border-gray-200">
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="w-16 h-16 bg-[#0B3D2E] rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl font-bold">E</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ESDALY Admin</h1>
          <p className="text-gray-600">تسجيل الدخول إلى لوحة التحكم</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm whitespace-pre-line">
            {error}
          </div>
        )}
        
        {/* Quick Check Button */}
 

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <FiMail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="أدخل بريدك الإلكتروني"
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] focus:border-[#0B3D2E] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <FiLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="أدخل كلمة المرور"
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] focus:border-[#0B3D2E] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B3D2E] text-white py-3 rounded-lg font-semibold hover:bg-[#0a3528] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                جاري تسجيل الدخول...
              </span>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-600 hover:text-[#0B3D2E]"
          >
            العودة إلى الموقع الرئيسي
          </button>
        </div>
      </div>
    </div>
  );
}
