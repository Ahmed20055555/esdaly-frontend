"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiUser, FiPhone, FiArrowRight } from "react-icons/fi";
import { authAPI } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { GoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.register(formData);

            if (response && response.success) {
                showToast("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول", "success");
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            } else {
                const errorMsg = response?.message || "حدث خطأ أثناء إنشاء الحساب";
                showToast(errorMsg, "error");
                setLoading(false);
            }
        } catch (error: any) {
            console.error("Register error:", error);
            showToast(error?.message || "حدث خطأ أثناء الاتصال بالخادم", "error");
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            setLoading(true);
            const res = await authAPI.google(credentialResponse.credential);
            if (res && res.success) {
                localStorage.setItem("token", res.token);
                localStorage.setItem("user", JSON.stringify(res.user));

                // Trigger event so navbar updates
                window.dispatchEvent(new Event('auth-change'));

                showToast("تم الدخول والتسجيل بواسطة Google بنجاح!", "success");
                setTimeout(() => {
                    router.push("/");
                    router.refresh();
                }, 1000);
            } else {
                showToast(res?.message || "فشل التسجيل بواسطة جوجل", "error");
                setLoading(false);
            }
        } catch (error: any) {
            showToast(error?.message || "حدث خطأ أثناء الاتصال بالخادم", "error");
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 flex-col md:flex-row py-12">
            {/* Background Animated Shapes */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0B3D2E]/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#E5B869]/20 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }}></div>

            <div className="flex w-full max-w-6xl mx-auto z-10 p-4 sm:p-6 lg:p-8 shadow-2xl rounded-3xl overflow-hidden bg-white/70 backdrop-blur-2xl border border-white/50">

                {/* Left Side - Brand (Hidden on Mobile) */}
                <div className="hidden lg:flex flex-col w-5/12 bg-gradient-to-br from-[#0B3D2E] to-[#082d22] rounded-2xl p-12 text-white relative overflow-hidden items-start justify-center">
                    {/* Geometric Patterns */}
                    <div className="absolute top-0 right-0 w-full h-full opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>

                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#E5B869] rounded-full blur-[80px] opacity-30"></div>

                    <div className="relative z-10 w-full mb-12">
                        <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-all cursor-pointer border border-white/10 group">
                            <FiArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="relative z-10 w-full">
                        <h1 className="text-4xl xl:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                            ابدئي رحلة <br /> الأناقة معنا
                        </h1>
                        <p className="text-green-50 text-lg leading-relaxed font-light mb-12">
                            إنشاء حساب جديد يمنحك تجربة تسوق أسرع، تتبع الطلبات بسهولة، والحصول على أحدث العروض الحصرية.
                        </p>

                        <div className="space-y-6">
                            {['تشكيلات حصرية ومتجددة', 'توصيل سريع وموثوق', 'تجربة تسوق آمنة'].map((feature, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#E5B869]/20 flex items-center justify-center">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#E5B869]"></span>
                                    </div>
                                    <span className="font-medium text-lg">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="w-full lg:w-7/12 p-6 sm:p-10 lg:p-16 flex flex-col justify-center bg-white/50 rounded-2xl lg:rounded-none">

                    {/* Mobile Back Button */}
                    <div className="lg:hidden mb-6">
                        <Link href="/" className="inline-flex items-center gap-2 text-[#0B3D2E] font-medium hover:text-[#E5B869] transition-colors">
                            <FiArrowRight className="w-5 h-5" /> العودة
                        </Link>
                    </div>

                    <div className="mb-8 text-center lg:text-right">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">حساب جديد</h2>
                        <p className="text-gray-500 font-medium">سجلي بياناتك وانضمي لعائلة إسدالي</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Name */}
                        <div className={`relative transition-all duration-300 ${isFocused === 'name' ? 'scale-[1.01]' : ''}`}>
                            <label className={`absolute right-4 transition-all duration-300 pointer-events-none z-10 ${formData.name || isFocused === 'name' ? '-top-3 text-xs bg-white/80 backdrop-blur px-2 text-[#0B3D2E] font-bold rounded' : 'top-4 text-gray-400'}`}>
                                الاسم الكامل
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute right-4 text-gray-400 z-10">
                                    <FiUser className={`w-5 h-5 transition-colors ${isFocused === 'name' ? 'text-[#0B3D2E]' : ''}`} />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onFocus={() => setIsFocused('name')}
                                    onBlur={() => setIsFocused(null)}
                                    required
                                    className={`w-full pr-12 pl-4 py-4 bg-white/80 border-2 rounded-xl outline-none transition-all ${isFocused === 'name' ? 'border-[#0B3D2E] shadow-md shadow-green-900/5' : 'border-gray-200 hover:border-gray-300'}`}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className={`relative transition-all duration-300 ${isFocused === 'email' ? 'scale-[1.01]' : ''}`}>
                            <label className={`absolute right-4 transition-all duration-300 pointer-events-none z-10 ${formData.email || isFocused === 'email' ? '-top-3 text-xs bg-white/80 backdrop-blur px-2 text-[#0B3D2E] font-bold rounded' : 'top-4 text-gray-400'}`}>
                                البريد الإلكتروني
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute right-4 text-gray-400 z-10">
                                    <FiMail className={`w-5 h-5 transition-colors ${isFocused === 'email' ? 'text-[#0B3D2E]' : ''}`} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setIsFocused('email')}
                                    onBlur={() => setIsFocused(null)}
                                    required
                                    className={`w-full pr-12 pl-4 py-4 bg-white/80 border-2 rounded-xl outline-none transition-all ${isFocused === 'email' ? 'border-[#0B3D2E] shadow-md shadow-green-900/5' : 'border-gray-200 hover:border-gray-300'}`}
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className={`relative transition-all duration-300 ${isFocused === 'phone' ? 'scale-[1.01]' : ''}`}>
                            <label className={`absolute right-4 transition-all duration-300 pointer-events-none z-10 ${formData.phone || isFocused === 'phone' ? '-top-3 text-xs bg-white/80 backdrop-blur px-2 text-[#0B3D2E] font-bold rounded' : 'top-4 text-gray-400'}`}>
                                رقم الهاتف <span className="text-gray-400 text-[10px] font-normal">(اختياري)</span>
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute right-4 text-gray-400 z-10">
                                    <FiPhone className={`w-5 h-5 transition-colors ${isFocused === 'phone' ? 'text-[#0B3D2E]' : ''}`} />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onFocus={() => setIsFocused('phone')}
                                    onBlur={() => setIsFocused(null)}
                                    className={`w-full pr-12 pl-4 py-4 bg-white/80 border-2 rounded-xl outline-none transition-all ${isFocused === 'phone' ? 'border-[#0B3D2E] shadow-md shadow-green-900/5' : 'border-gray-200 hover:border-gray-300'}`}
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className={`relative transition-all duration-300 ${isFocused === 'password' ? 'scale-[1.01]' : ''}`}>
                            <label className={`absolute right-4 transition-all duration-300 pointer-events-none z-10 ${formData.password || isFocused === 'password' ? '-top-3 text-xs bg-white/80 backdrop-blur px-2 text-[#0B3D2E] font-bold rounded' : 'top-4 text-gray-400'}`}>
                                كلمة المرور
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute right-4 text-gray-400 z-10">
                                    <FiLock className={`w-5 h-5 transition-colors ${isFocused === 'password' ? 'text-[#0B3D2E]' : ''}`} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setIsFocused('password')}
                                    onBlur={() => setIsFocused(null)}
                                    required
                                    minLength={6}
                                    className={`w-full pr-12 pl-4 py-4 bg-white/80 border-2 rounded-xl outline-none transition-all ${isFocused === 'password' ? 'border-[#0B3D2E] shadow-md shadow-green-900/5' : 'border-gray-200 hover:border-gray-300'}`}
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative w-full overflow-hidden bg-[#0B3D2E] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#082d22] transition-colors disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-green-900/20"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                {loading ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        جاري الإنشاء...
                                    </span>
                                ) : (
                                    "إنشاء حساب"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-gray-500 font-medium text-sm">أو التسجيل بواسطة</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => showToast("فشل التسجيل بواسطة جوجل", "error")}
                            useOneTap
                            shape="pill"
                            theme="outline"
                            text="signup_with"
                        />
                    </div>

                    <p className="mt-8 text-center text-gray-600 font-medium">
                        لديك حساب بالفعل؟{" "}
                        <Link href="/login" className="text-[#0B3D2E] hover:text-[#E5B869] font-bold transition-colors underline underline-offset-4">
                            سجل دخولك
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
