"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { categoriesAPI } from "@/lib/api";
import { getImageUrl } from "@/lib/imageUtils";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoriesAPI.getAll();
            if (response && response.success) {
                setCategories(response.categories || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col pt-16 items-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3D2E]"></div>
                <p className="mt-4 text-gray-600">جاري تحميل الفئات...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "الفئات" }]} />

                {/* Header */}
                <div className="mb-8 mt-2 text-center md:text-right">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">تصفح أقسام المتجر</h1>
                    <p className="text-gray-600 max-w-2xl">تسوق من خلال تشكيلتنا الواسعة من الفئات والمنتجات المختارة بعناية لتلبية جميع احتياجاتك.</p>
                </div>

                {/* Categories Grid */}
                {categories.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">لا توجد فئات حالياً</h2>
                        <p className="text-gray-600">عد لاحقاً لرؤية الفئات الجديدة</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categories.map((category: any) => (
                            <div
                                key={category._id}
                                onClick={() => router.push(`/categories/${category._id}`)}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                            >
                                {/* Category Image */}
                                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                                    {category.image ? (
                                        <Image
                                            src={getImageUrl(category.image)}
                                            alt={category.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-green-50">
                                            <span className="text-green-800/20 text-4xl font-bold">
                                                {category.name.substring(0, 1)}
                                            </span>
                                        </div>
                                    )}
                                    {/* Overlay for better text readability and styling */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                                    {/* Text over image */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                            <span className="text-sm text-green-300 font-medium">عرض المنتجات</span>
                                            <svg className="w-4 h-4 text-green-300 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
