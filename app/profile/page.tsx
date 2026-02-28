"use client";
import { useEffect, useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiEdit2, FiSave, FiX, FiCheckCircle } from "react-icons/fi";
import { authAPI } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function ProfilePage() {
    const { showToast } = useToast();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await authAPI.getMe();
            if (data.success) {
                setUser(data.user);
                setFormData({
                    name: data.user.name || "",
                    email: data.user.email || "",
                    phone: data.user.phone || "",
                    address: data.user.address || ""
                });
            }
        } catch (err: any) {
            showToast(err.message || "خطأ في جلب بيانات الملف الشخصي", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await authAPI.updateProfile(formData);
            if (data.success) {
                setUser(data.user);
                setIsEditing(false);
                showToast("تم تحديث الملف الشخصي بنجاح", "success");
                // Update local storage user data
                const localUserData = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...localUserData, ...data.user }));
            }
        } catch (err: any) {
            showToast(err.message || "خطأ في تحديث الملف الشخصي", "error");
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast("كلمات المرور الجديدة غير متطابقة", "error");
            return;
        }
        try {
            const data = await authAPI.updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            if (data.success) {
                setShowPasswordForm(false);
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                showToast("تم تغيير كلمة المرور بنجاح", "success");
            }
        } catch (err: any) {
            showToast(err.message || "خطأ في تغيير كلمة المرور", "error");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
                <div className="max-w-4xl mx-auto flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3D2E]"></div>
                    <p className="mt-4 text-gray-600 font-medium">جاري تحميل بياناتك...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 font-arabic">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FiUser className="text-[#0B3D2E]" />
                        حسابي
                    </h1>
                    <p className="text-gray-600 mt-2 font-medium">إدارة معلوماتك الشخصية وإعدادات الأمان</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 md:p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold text-gray-900">المعلومات الشخصية</h2>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 text-[#0B3D2E] font-bold hover:bg-green-50 px-4 py-2 rounded-lg transition-colors"
                                        >
                                            <FiEdit2 className="w-4 h-4" />
                                            تعديل
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 block">الاسم بالكامل</label>
                                            <div className="relative">
                                                <FiUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    disabled={!isEditing}
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:bg-white outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 block">البريد الإلكتروني</label>
                                            <div className="relative">
                                                <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="email"
                                                    disabled={!isEditing}
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:bg-white outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 block">رقم الهاتف</label>
                                            <div className="relative">
                                                <FiPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    disabled={!isEditing}
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:bg-white outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 block">العنوان</label>
                                            <div className="relative">
                                                <FiMapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    disabled={!isEditing}
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:bg-white outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-[#0B3D2E] text-white py-3 rounded-xl font-bold hover:bg-[#082d22] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/10"
                                            >
                                                <FiSave className="w-5 h-5" />
                                                حفظ التغييرات
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({
                                                        name: user.name || "",
                                                        email: user.email || "",
                                                        phone: user.phone || "",
                                                        address: user.address || ""
                                                    });
                                                }}
                                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FiX className="w-5 h-5" />
                                                إلغاء
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Password Management */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 md:p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <FiLock className="text-gray-400" />
                                        كلمة المرور
                                    </h2>
                                    {!showPasswordForm && (
                                        <button
                                            onClick={() => setShowPasswordForm(true)}
                                            className="text-[#0B3D2E] font-bold hover:bg-green-50 px-4 py-2 rounded-lg transition-colors border border-green-100"
                                        >
                                            تغيير كلمة المرور
                                        </button>
                                    )}
                                </div>

                                {showPasswordForm && (
                                    <form onSubmit={handleUpdatePassword} className="space-y-5 animate-fadeIn">
                                        <div className="grid grid-cols-1 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700 block">كلمة المرور الحالية</label>
                                                <input
                                                    type="password"
                                                    required
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:bg-white outline-none transition-all font-medium"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700 block">كلمة المرور الجديدة</label>
                                                    <input
                                                        type="password"
                                                        required
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:bg-white outline-none transition-all font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700 block">تأكيد كلمة المرور الجديدة</label>
                                                    <input
                                                        type="password"
                                                        required
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#0B3D2E] focus:bg-white outline-none transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-[#0B3D2E] text-white py-3 rounded-xl font-bold hover:bg-[#082d22] transition-colors shadow-lg shadow-green-900/10"
                                            >
                                                تحديث كلمة المرور
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowPasswordForm(false);
                                                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                                                }}
                                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                            >
                                                إلغاء
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Stats */}
                    <div className="space-y-6">
                        <div className="bg-[#0B3D2E] rounded-2xl p-8 text-white shadow-xl shadow-green-900/20">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20">
                                    <FiUser className="w-12 h-12" />
                                </div>
                                <h3 className="text-xl font-bold mb-1">{user.name}</h3>
                                <p className="text-green-200 text-sm font-medium">{user.email}</p>
                                <div className="mt-6 pt-6 border-t border-white/10 w-full flex justify-center items-center gap-2">
                                    <FiCheckCircle className="text-green-400" />
                                    <span className="text-sm font-bold opacity-90">حساب موثق</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
