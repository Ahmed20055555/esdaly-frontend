"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiHeart, FiStar, FiFilter, FiTrendingUp, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import { productsAPI } from "@/lib/api";
import { getFirstImageUrl } from "@/lib/imageUtils";
import { useToast } from "@/context/ToastContext";

export default function BestsellersPage() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const favorites = useSelector((state: any) => state.favorites);
  const cart = useSelector((state: any) => state.cart);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  useEffect(() => {
    fetchBestsellers();
  }, [currentPage]);

  const fetchBestsellers = async () => {
    try {
      setLoading(true);
      const res = await productsAPI.getAll({ sort: "popular", page: currentPage, limit });
      if (res.success) {
        setProducts(
          (res.products || []).map((p: any) => ({
            id: p._id,
            name: p.name,
            description: p.description || p.shortDescription || "",
            price: p.price,
            comparePrice: p.comparePrice,
            image: getFirstImageUrl(p.images),
            stock: p.stock?.quantity ?? 0,
          }))
        );
        setTotal(res.total ?? 0);
        setTotalPages(res.pages ?? 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: any) => {
    const stock = item.stock ?? 0;
    const inCart = (cart.find((c: any) => c.id === item.id)?.quantity ?? 0) + 1;
    if (stock === 0) {
      showToast("المنتج غير متوفر", "error");
      return;
    }
    if (inCart > stock) {
      showToast("الكمية المتاحة: " + stock, "error");
      return;
    }
    dispatch(addToCart(item));
    showToast("تمت إضافة المنتج للسلة");
  };

  const handleToggleFavorite = (item: any) => {
    dispatch(toggleFavorite(item));
    const now = !favorites.some((f: any) => f.id === item.id);
    showToast(now ? "تمت الإضافة للمفضلة" : "تمت الإزالة من المفضلة");
  };

  const isFavorite = (id: string) => favorites.some((f: any) => f.id === id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "الأكثر مبيعاً" }]} />
        <div className="flex items-center gap-2 mt-2 mb-6">
          <FiTrendingUp className="w-8 h-8 text-[#0B3D2E]" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">الأكثر مبيعاً</h1>
        </div>
        <p className="text-gray-600 mb-8">المنتجات الأكثر طلباً من عملائنا</p>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3D2E]" />
            <p className="mt-4 text-gray-600">جاري التحميل...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">لا توجد منتجات حالياً</h2>
            <Link href="/" className="inline-flex items-center gap-2 bg-[#0B3D2E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700">
              الرئيسية <FiChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((item) => (
                <div
                  key={item.id}
                  className={`group flex flex-col bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all ${item.stock === 0 ? "opacity-60" : ""}`}
                >
                  <Link href={`/product/${item.id}`} className="relative aspect-square bg-gray-100 block">
                    {item.image && item.image !== "/placeholder.jpg" ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" sizes="25vw" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">لا صورة</div>
                    )}
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-[#0B3D2E]">{item.name}</h3>
                    </Link>
                    <div className="flex items-center justify-between mt-auto pt-3">
                      <span className="text-[#0B3D2E] font-bold">{item.price} جنيه</span>
                      <div className="flex gap-1">
                        <button onClick={() => handleToggleFavorite(item)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600" aria-label="مفضلة">
                          <FiHeart className={`w-4 h-4 ${isFavorite(item.id) ? "fill-red-500 text-red-500" : ""}`} />
                        </button>
                        {item.stock > 0 && (
                          <button onClick={() => handleAddToCart(item)} className="p-2 rounded-full hover:bg-[#0B3D2E] hover:text-white text-gray-600" aria-label="سلة">
                            <FiShoppingCart className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border disabled:opacity-50">
                  <FiChevronRight className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 text-gray-700">{currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border disabled:opacity-50">
                  <FiChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
