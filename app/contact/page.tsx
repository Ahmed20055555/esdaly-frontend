"use client";
import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });

            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        }, 1500);
    };

    const contactInfo = [
        {
            title: 'اتصل بنا',
            details: '+20 123 456 7890',
            icon: FiPhone,
            action: 'tel:+201234567890'
        },
        {
            title: 'البريد الإلكتروني',
            details: 'support@esdaly.com',
            icon: FiMail,
            action: 'mailto:support@esdaly.com'
        },
        {
            title: 'العنوان',
            details: 'القاهرة، مصر',
            icon: FiMapPin,
            action: '#'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'الرئيسية', href: '/' }, { label: 'اتصل بنا' }]} />

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 mt-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">يسعدنا تواصلك معنا</h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        فريق خدمة العملاء لدينا مستعد دائماً للرد على استفساراتك، ومساعدتك في اختيار ما يناسبك، أو استقبال مقترحاتك وملاحظاتك بصدر رحب.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">معلومات الاتصال</h2>

                        <div className="space-y-6">
                            {contactInfo.map((info, idx) => {
                                const Icon = info.icon;
                                return (
                                    <a
                                        key={idx}
                                        href={info.action}
                                        className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow group border border-gray-100"
                                    >
                                        <div className="w-12 h-12 bg-[#0B3D2E]/10 text-[#0B3D2E] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#0B3D2E] group-hover:text-white transition-colors">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                                            <p className="text-gray-600" dir="ltr">{info.details}</p>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>

                        <div className="bg-[#0B3D2E] rounded-xl p-8 text-white mt-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                            <h3 className="font-bold text-xl mb-4 relative z-10">ساعات العمل</h3>
                            <ul className="space-y-3 relative z-10 text-green-50">
                                <li className="flex justify-between border-b border-green-700/50 pb-2">
                                    <span>الأحد - الخميس</span>
                                    <span>9ص - 10م</span>
                                </li>
                                <li className="flex justify-between border-b border-green-700/50 pb-2">
                                    <span>الجمعة</span>
                                    <span>1م - 11م</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>السبت</span>
                                    <span>9ص - 10م</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">أرسل لنا رسالة</h2>

                            {success ? (
                                <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6 text-center">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FiSend className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">تم الإرسال بنجاح!</h3>
                                    <p>شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن عبر بريدك الإلكتروني.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">الاسم بالكامل *</label>
                                            <input
                                                type="text"
                                                id="name"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0B3D2E] focus:border-[#0B3D2E] transition-colors bg-gray-50 focus:bg-white outline-none"
                                                placeholder="أدخل اسمك"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0B3D2E] focus:border-[#0B3D2E] transition-colors bg-gray-50 focus:bg-white outline-none text-left"
                                                placeholder="your@email.com"
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">الموضوع *</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            required
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0B3D2E] focus:border-[#0B3D2E] transition-colors bg-gray-50 focus:bg-white outline-none"
                                            placeholder="عنوان رسالتك"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">نص الرسالة *</label>
                                        <textarea
                                            id="message"
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0B3D2E] focus:border-[#0B3D2E] transition-colors bg-gray-50 focus:bg-white outline-none resize-none"
                                            placeholder="اكتب هنا كل ما تود إخبارنا به..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center items-center gap-2 bg-[#0B3D2E] text-white py-4 px-8 rounded-xl font-bold hover:bg-green-700 focus:ring-4 focus:ring-green-900/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        {loading ? (
                                            <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                        ) : (
                                            <>
                                                إرسال الرسالة
                                                <FiSend className="w-5 h-5 rtl:-scale-x-100" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
