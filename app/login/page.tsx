"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiArrowRight, FiGithub, FiChevronDown, FiUserPlus } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";
import { authAPI } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { GoogleLogin } from "@react-oauth/google";



function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectParams = searchParams ? searchParams.get("redirect") : null;
    const redirectUrl = redirectParams || "/";

    const { showToast } = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState<string | null>(null);
    const [hasEmailAccount, setHasEmailAccount] = useState(false);

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
                localStorage.setItem("showEmailForm", "false");
                // Trigger event so navbar updates
                window.dispatchEvent(new Event('auth-change'));

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

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            setLoading(true);
            const res = await authAPI.google(credentialResponse.credential);
            if (res && res.success) {
                localStorage.setItem("token", res.token);
                localStorage.setItem("user", JSON.stringify(res.user));

                // Trigger event so navbar updates
                window.dispatchEvent(new Event('auth-change'));

                showToast("تم تسجيل الدخول بواسطة Google بنجاح!", "success");
                setTimeout(() => {
                    router.push(redirectUrl);
                    router.refresh();
                }, 1000);
            } else {
                showToast(res?.message || "فشل تسجيل الدخول بواسطة جوجل", "error");
                setLoading(false);
            }
        } catch (error: any) {
            showToast(error?.message || "حدث خطأ أثناء الاتصال بالخادم", "error");
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedHasAccount = localStorage.getItem("hasEmailAccount");
        if (savedHasAccount === "true") setHasEmailAccount(true);
    }, []);

    useEffect(() => {
        localStorage.setItem("hasEmailAccount", String(hasEmailAccount));
    }, [hasEmailAccount]);

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

                    <div className="mb-8 text-center lg:text-right">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">أهلاً بكِ مجدداً</h2>
                        <p className="text-gray-500 font-medium text-lg">سجلي دخولكِ لمتابعة تجربة التسوق</p>
                    </div>

                    {/* Primary Action: Google Login */}
                    <div className="space-y-6">
                        <div className="flex flex-col items-center gap-4 p-4 sm:p-6 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md w-full">
                            <p className="text-sm font-bold text-gray-700 mb-1">الدخول السريع بواسطة</p>
                            <div className="w-full flex justify-center scale-95 sm:scale-100 overflow-hidden">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => showToast("فشل تسجيل الدخول بواسطة جوجل", "error")}
                                    useOneTap
                                    shape="pill"
                                    theme="outline"
                                    width="320"
                                    text="continue_with"
                                />
                            </div>
                        </div>

                        {/* Divider & Email Form - Only show if user might have an account */}
                        {hasEmailAccount && (
                            <>
                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-400 font-medium">أو عبر البريد الإلكتروني</span>
                                    </div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                                        <div className="space-y-2 group">
                                            <label className="block text-sm font-bold text-[#0B3D2E] mr-1">
                                                البريد الإلكتروني
                                            </label>
                                            <div className="relative flex items-center transition-all duration-300 transform group-focus-within:scale-[1.01]">
                                                <div className="absolute right-4 text-gray-400 group-focus-within:text-[#0B3D2E] z-10">
                                                    <FiMail className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    onFocus={() => setIsFocused('email')}
                                                    onBlur={() => setIsFocused(null)}
                                                    required
                                                    placeholder="your@email.com"
                                                    className={`w-full pr-12 pl-4 py-3.5 bg-gray-50/50 border-2 rounded-2xl focus:outline-none transition-all ${isFocused === 'email' ? 'border-[#0B3D2E] bg-white shadow-lg' : 'border-gray-100 hover:border-gray-200'}`}
                                                    dir="rtl"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 group">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-sm font-bold text-[#0B3D2E]">
                                                    كلمة المرور
                                                </label>
                                                <Link href="/forgot-password" className="text-xs font-bold text-[#E5B869] hover:text-[#0B3D2E] transition-colors">
                                                    نسيتِ كلمة المرور؟
                                                </Link>
                                            </div>
                                            <div className="relative flex items-center transition-all duration-300 transform group-focus-within:scale-[1.01]">
                                                <div className="absolute right-4 text-gray-400 group-focus-within:text-[#0B3D2E] z-10">
                                                    <FiLock className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    onFocus={() => setIsFocused('password')}
                                                    onBlur={() => setIsFocused(null)}
                                                    required
                                                    placeholder="••••••••"
                                                    className={`w-full pr-12 pl-4 py-3.5 bg-gray-50/50 border-2 rounded-2xl focus:outline-none transition-all ${isFocused === 'password' ? 'border-[#0B3D2E] bg-white shadow-lg' : 'border-gray-100 hover:border-gray-200'}`}
                                                    dir="rtl"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="relative w-full overflow-hidden bg-[#0B3D2E] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#082d22] transition-colors disabled:opacity-70 group shadow-xl"
                                        >
                                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                            {loading ? (
                                                <span className="flex items-center justify-center gap-3">
                                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                    جاري الدخول...
                                                </span>
                                            ) : (
                                                "دخول البريد الإلكتروني"
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            </>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-12 p-6 bg-[#0B3D2E]/5 rounded-2xl border border-[#0B3D2E]/10 text-center">
                        <p className="text-gray-600 font-medium">
                            ليس لديكِ حساب حتى الآن؟
                        </p>
                        <Link
                            href="/register"
                            onClick={() => {
                                localStorage.setItem("hasEmailAccount", "true");
                                setHasEmailAccount(true);
                            }}
                            className="mt-2 inline-flex items-center gap-2 text-[#0B3D2E] hover:text-[#E5B869] font-bold transition-all hover:translate-x-1"
                        >
                            <FiUserPlus className="w-5 h-5" />
                            انضمي إلينا وسجلي حساباً جديداً
                        </Link>
                    </div>

                </div>
            </div >
        </div >
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-[#0B3D2E] border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
