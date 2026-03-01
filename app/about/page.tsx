"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCheckCircle, FiUsers, FiAward, FiHeart, FiArrowRight } from 'react-icons/fi';
import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs';

export default function AboutPage() {
    const stats = [
        { label: 'عميل سعيد', value: '5,000+', icon: FiUsers },
        { label: 'منتج متاح', value: '200+', icon: FiCheckCircle },
        { label: 'سنوات خبرة', value: '3+', icon: FiAward },
        { label: 'تقييم إيجابي', value: '98%', icon: FiHeart },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <Breadcrumbs items={[{ label: 'الرئيسية', href: '/' }, { label: 'من نحن' }]} />

                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16 mt-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">قصتنا في ESDALY</h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        نسعى دائماً لتقديم أفضل تشكيلة من الحجاب والملابس الإسلامية والموضة المحتشمة.
                        بدأنا رحلتنا بشغف لنخلق مساحة تجد فيها كل امرأة ما يناسب ذوقها الراقي بأسعار منافسة وجودة لا تضاهى.
                    </p>
                </div>

                {/* Vision & Mission */}
                <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                        {/* Placeholder for an about image */}
                        <div className="absolute inset-0 bg-[#0B3D2E]/10 mix-blend-multiply z-10" />
                        <Image
                            src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop"
                            alt="About ESDALY"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-[#0B3D2E] mb-4">رؤيتنا</h2>
                            <p className="text-gray-600 leading-relaxed">
                                أن نكون الوجهة الأولى والمفضلة لكل امرأة تبحث عن الأناقة المحتشمة، وأن نقدم تجربة تسوق استثنائية تجمع بين الجودة، والأناقة، والسعر المناسب.
                            </p>
                        </div>
                        <div className="w-16 h-1 bg-green-500 rounded-full"></div>
                        <div>
                            <h2 className="text-3xl font-bold text-[#0B3D2E] mb-4">مهمتنا</h2>
                            <p className="text-gray-600 leading-relaxed">
                                توفير منتجات عالية الجودة تواكب أحدث صيحات الموضة مع الحفاظ على الحشمة والوقار. نحن نهتم بكل تفصيلة بدءاً من اختيار الأقمشة وحتى وصول المنتج ليديك.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-[#0B3D2E] rounded-3xl p-12 text-white mb-20 shadow-2xl relative overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                        {stats.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <div key={idx} className="text-center group">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4 group-hover:bg-green-500/20 transition-colors">
                                        <Icon className="w-8 h-8 text-green-300" />
                                    </div>
                                    <div className="text-4xl font-bold mb-2">{stat.value}</div>
                                    <div className="text-green-100/80">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">لماذا تختارين ESDALY؟</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "جودة ممتازة", desc: "نختار أفضل وأجود أنواع الأقمشة لضمان راحتك وأناقتك دائماً." },
                            { title: "تصاميم عصرية", desc: "مواكبة لأحدث صيحات الموضة مع الحفاظ على الطابع المحتشم والأنيق." },
                            { title: "خدمة عملاء مميزة", desc: "فريق دعم متاح لمساعدتك والرد على كافة استفساراتك بكل حب." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                                    <FiCheckCircle className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center pb-8 border-t border-gray-200 pt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">هل أنتِ مستعدة لتجربة تسوق مختلفة؟</h2>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-[#0B3D2E] text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        تصفحي أحدث المنتجات
                        <FiArrowRight className="w-5 h-5 rotate-180" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
