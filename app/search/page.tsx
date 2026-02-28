"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiShoppingCart, FiHeart, FiArrowRight, FiX } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { productsAPI } from "@/lib/api";
import { useDispatch } from "react-redux";

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = searchParams.get("q");
        if (q) {
            setQuery(q);
            handleSearch(q);
        }
    }, [searchParams]);

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);
            setError(null);
            const data = await productsAPI.getAll({ search: searchQuery, limit: 20 });
            if (data.success) {
                setResults(data.products || []);
            }
        } catch (err: any) {
            setError(err.message || "حدث خطأ أثناء البحث");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(query)}`);
        handleSearch(query);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 font-arabic">
            <div className="max-w-7xl mx-auto">
                {/* Search Header */}
                <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 mb-8 border border-gray-100">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">ابحث عن منتجاتك المفضلة</h1>
                        <form onSubmit={onSubmit} className="relative">
                            <FiSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="ابحث بالاسم، الفئة أو المواصفات..."
                                className="w-full pr-14 pl-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#0B3D2E]/5 focus:bg-white outline-none transition-all text-lg font-medium"
                            />
                            <button
                                type="submit"
                                className="absolute left-2 top-2 bottom-2 px-8 bg-[#0B3D2E] text-white rounded-xl font-bold hover:bg-[#082d22] transition-colors shadow-lg shadow-green-900/10"
                            >
                                بحث
                            </button>
                        </form>
                    </div>
                </div>

                {/* Results Area */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                            {loading ? "جاري البحث..." : results.length > 0 ? `تم العثور على ${results.length} منتج` : query ? "لا توجد نتائج" : "ابدأ البحث الآن"}
                        </h2>
                        {results.length > 0 && (
                            <button className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#0B3D2E] transition-colors">
                                <FiFilter /> تصفية النتائج
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3D2E]"></div>
                            <p className="mt-4 text-gray-500 font-medium">نبحث لك عن أفضل الخيارات...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 rounded-2xl p-12 text-center border border-red-100">
                            <FiX className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <p className="text-red-700 font-bold">{error}</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {results.map((product: any) => (
                                <div
                                    key={product._id}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                                >
                                    <div
                                        className="relative aspect-square overflow-hidden cursor-pointer"
                                        onClick={() => router.push(`/product/${product.id || product._id}`)}
                                    >
                                        <Image
                                            src={product.images?.[0]?.url || "/foto/placeholder.png"}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dispatch({ type: "cart/addToCart", payload: { ...product, id: product.id || product._id, quantity: 1 } });
                                                }}
                                                className="w-full py-2 bg-white text-[#0B3D2E] rounded-lg font-bold flex items-center justify-center gap-2"
                                            >
                                                <FiShoppingCart /> إضافة للسلة
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-5 text-right">
                                        <h3
                                            className="font-bold text-gray-900 mb-1 truncate hover:text-[#0B3D2E] cursor-pointer"
                                            onClick={() => router.push(`/product/${product.id || product._id}`)}
                                        >
                                            {product.name}
                                        </h3>
                                        <p className="text-[#0B3D2E] font-bold text-lg">{product.price?.toLocaleString()} جنيه</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : query && (
                        <div className="bg-white rounded-3xl p-20 text-center border border-gray-100">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiSearch className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">لم نجد أي منتجات تطابق "{query}"</h3>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto">جرب كلمات بحث مختلفة أو تصفح أقسام المتجر الرئيسية</p>
                            <button
                                onClick={() => router.push("/categories")}
                                className="px-8 py-3 bg-[#0B3D2E] text-white rounded-xl font-bold hover:bg-[#082d22] transition-all"
                            >
                                تصفح الفئات
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
