"use client";
import { useSelector, useDispatch } from "react-redux";
import { FiHeart, FiShoppingCart, FiX, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// Assuming favorites slice exists and has removeFromFavorites action
// import { removeFromFavorites } from "@/store/slices/favoritesSlice";

export default function FavoritesPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const favorites = useSelector((state: any) => state.favorites);

    // Note: I'll use a placeholder for removeFromFavorites as I'm not sure about the exact action name
    const handleRemove = (productId: string) => {
        dispatch({ type: "favorites/removeFromFavorites", payload: productId });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 font-arabic">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <FiHeart className="text-red-500 fill-red-500" />
                            المفضلة
                        </h1>
                        <p className="text-gray-600 mt-2 font-medium">المنتجات التي نالت إعجابك وتفكر في اقتنائها</p>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-[#0B3D2E] hover:underline"
                    >
                        <FiArrowRight /> تصفح المزيد من المنتجات
                    </Link>
                </div>

                {favorites.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm p-20 text-center border border-gray-100">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiHeart className="w-12 h-12 text-red-200" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">قائمتك المفضلة فارغة</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">لا تدع الفرصة تفوتك! ابدأ بإضافة المنتجات التي تعجبك لتجدها هنا لاحقاً بسهولة</p>
                        <Link
                            href="/"
                            className="inline-block px-10 py-4 bg-[#0B3D2E] text-white rounded-2xl hover:bg-[#082d22] transition-all duration-300 font-bold shadow-lg shadow-green-900/10"
                        >
                            اكتشف المنتجات الآن
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((product: any) => (
                            <div
                                key={product.id || product._id}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group relative"
                            >
                                <button
                                    onClick={() => handleRemove(product.id || product._id)}
                                    className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    title="إزالة من المفضلة"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>

                                <div
                                    className="relative h-64 overflow-hidden cursor-pointer"
                                    onClick={() => router.push(`/product/${product.id || product._id}`)}
                                >
                                    <Image
                                        src={product.images?.[0]?.url || "/foto/placeholder.png"}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                                </div>

                                <div className="p-5">
                                    <h3
                                        className="font-bold text-gray-900 mb-2 truncate group-hover:text-[#0B3D2E] cursor-pointer"
                                        onClick={() => router.push(`/product/${product.id || product._id}`)}
                                    >
                                        {product.name}
                                    </h3>
                                    <p className="text-[#0B3D2E] font-bold text-lg mb-4">{product.price?.toLocaleString()} جنيه</p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.push(`/product/${product.id || product._id}`)}
                                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm"
                                        >
                                            التفاصيل
                                        </button>
                                        <button
                                            onClick={() => dispatch({ type: "cart/addToCart", payload: { ...product, id: product.id || product._id, quantity: 1 } })}
                                            className="p-2.5 bg-[#0B3D2E] text-white rounded-xl hover:bg-[#082d22] transition-colors shadow-lg shadow-green-900/10"
                                        >
                                            <FiShoppingCart className="w-5 h-5" />
                                        </button>
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
