"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiArrowRight, FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { authAPI } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectParams = searchParams ? searchParams.get("redirect") : null;
    const redirectUrl = redirectParams || "/";

    const { showToast } = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.login({
                email,
                password,
            });

            if (response && response.success) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));

                showToast("تم تسجيل الدخول بنجاح! أهلاً بك", "success");
                // add small delay for the toast
                setTimeout(() => {
                    router.push(redirectUrl);
                    router.refresh(); // Important to refresh navbar state
                }, 1000);
            } else {
                const errorMsg = response?.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة";
                showToast(errorMsg, "error");
                setLoading(false);
            }
        } catch (error: any) {
            console.error("Login error:", error);
            const errorMessage = error?.message || "حدث خطأ أثناء تسجيل الدخول";
            showToast(errorMessage, "error");
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 flex-col md:flex-row">
            {/* Background Shapes */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#0B3D2E]/20 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#E5B869]/20 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: "2s" }}></div>

            <div className="flex w-full max-w-6xl mx-auto z-10 p-4 sm:p-6 lg:p-8 min-h-[600px] shadow-2xl rounded-3xl overflow-hidden bg-white/60 backdrop-blur-xl border border-white/40 my-8">

                {/* Left Side - Informational/Brand */}
                <div className="hidden lg:flex flex-col w-1/2 bg-[#0B3D2E] rounded-2xl p-12 text-white relative overflow-hidden items-start justify-between">
                    {/* Darker overlay patterns */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at center, #ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                    <div className="absolute -bottom-32 -left-32 w-80 h-80 border-[40px] border-white/10 rounded-full"></div>
                    <div className="absolute top-10 right-10 w-20 h-20 border-4 border-[#E5B869]/30 rounded-full"></div>

                    <div className="relative z-10 w-full">
                        <Link href="/" className="inline-block p-3 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-all cursor-pointer border border-white/10 group mb-12">
                            <FiArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <h1 className="text-5xl font-extrabold mb-6 leading-tight font-arabic tracking-tight">
                            أهلاً بك في <br /> <span className="text-[#E5B869] drop-shadow-md">إسدالي</span>
                        </h1>
                        <p className="text-green-50 text-xl leading-relaxed max-w-md font-light">
                            سجل دخولك الآن واكتشف أحدث تشكيلات الملابس والإسدالات التي تليق بكِ وتبرز أناقتك. عالم من الجمال في انتظارك.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex -space-x-4 space-x-reverse mb-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`w-12 h-12 rounded-full border-2 border-[#0B3D2E] bg-gray-200 flex items-center justify-center overflow-hidden`}>
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt={`User ${i}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <div className="w-12 h-12 rounded-full border-2 border-[#0B3D2E] bg-[#E5B869] flex items-center justify-center text-xs font-bold text-[#0B3D2E]">
                                +2k
                            </div>
                        </div>
                        <p className="text-sm text-green-100 font-medium">انضمي إلى أكثر من 2000 عميلة سعيدة</p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 p-6 sm:p-12 lg:p-16 flex flex-col justify-center">

                    {/* Mobile Back Button */}
                    <div className="lg:hidden mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-[#0B3D2E] font-medium hover:text-[#E5B869] transition-colors">
                            <FiArrowRight className="w-5 h-5" /> العودة للرئيسية
                        </Link>
                    </div>

                    <div className="mb-10 text-center lg:text-right">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">تسجيل الدخول</h2>
                        <p className="text-gray-500 font-medium text-lg">يسعدنا رؤيتك مجدداً!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className={`relative transition-all duration-300 ${isFocused === 'email' ? 'scale-[1.02]' : ''}`}>
                            <label className={`absolute right-4 transition-all duration-300 pointer-events-none ${email || isFocused === 'email' ? '-top-3 text-xs bg-white px-2 text-[#0B3D2E] font-bold' : 'top-4 text-gray-400'}`}>
                                البريد الإلكتروني
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute right-4 text-gray-400">
                                    <FiMail className={`w-5 h-5 transition-colors ${isFocused === 'email' ? 'text-[#0B3D2E]' : ''}`} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setIsFocused('email')}
                                    onBlur={() => setIsFocused(null)}
                                    required
                                    className={`w-full pr-12 pl-4 py-4 bg-transparent border-2 rounded-xl focus:outline-none transition-all outline-none ${isFocused === 'email' ? 'border-[#0B3D2E] shadow-lg shadow-green-900/5' : 'border-gray-200 hover:border-gray-300'}`}
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <div className={`relative transition-all duration-300 ${isFocused === 'password' ? 'scale-[1.02]' : ''}`}>
                            <div className="flex justify-between items-center w-full px-1 mb-2">
                                <label className={`text-gray-900 font-bold transition-opacity duration-300 ${password || isFocused === 'password' ? 'opacity-0' : 'opacity-0'}`}>المرور</label>
                                <Link href="/forgot-password" className="text-sm font-semibold text-[#0B3D2E] hover:text-[#E5B869] transition-colors">
                                    نسيت كلمة المرور؟
                                </Link>
                            </div>
                            <label className={`absolute right-4 transition-all duration-300 pointer-events-none z-10 ${password || isFocused === 'password' ? 'top-5 text-xs bg-white px-2 text-[#0B3D2E] font-bold' : 'top-12 text-gray-400'}`}>
                                كلمة المرور
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute right-4 text-gray-400 z-10">
                                    <FiLock className={`w-5 h-5 transition-colors ${isFocused === 'password' ? 'text-[#0B3D2E]' : ''}`} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setIsFocused('password')}
                                    onBlur={() => setIsFocused(null)}
                                    required
                                    className={`w-full pr-12 pl-4 py-4 bg-transparent border-2 rounded-xl focus:outline-none transition-all outline-none ${isFocused === 'password' ? 'border-[#0B3D2E] shadow-lg shadow-green-900/5' : 'border-gray-200 hover:border-gray-300'}`}
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="relative w-full overflow-hidden bg-[#0B3D2E] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#082d22] transition-colors disabled:opacity-70 disabled:cursor-not-allowed group shadow-xl shadow-green-900/20"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            {loading ? (
                                <span className="flex items-center justify-center gap-3">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    جاري الدخول...
                                </span>
                            ) : (
                                "دخول"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-gray-500 font-medium text-sm">أو الدخول بواسطة</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-gray-700">
                            <FcGoogle className="w-6 h-6" /> Google
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-gray-700">
                            <FiGithub className="w-6 h-6" /> Facebook
                        </button>
                    </div>

                    <p className="mt-10 text-center text-gray-600 font-medium">
                        ليس لديك حساب؟{" "}
                        <Link href="/register" className="text-[#0B3D2E] hover:text-[#E5B869] font-bold transition-colors underline underline-offset-4">
                            سجل الآن
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
