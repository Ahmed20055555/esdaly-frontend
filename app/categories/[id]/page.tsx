"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiHeart, FiFilter, FiGrid, FiList, FiArrowRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { productsAPI, categoriesAPI } from "@/lib/api";
import { getFirstImageUrl } from "@/lib/imageUtils";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const favorites = useSelector((state: any) => state.favorites);
  const cart = useSelector((state: any) => state.cart);
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    if (params.id) {
      fetchCategory();
      fetchProducts();
    }
  }, [params.id, currentPage]);

  const fetchCategory = async () => {
    try {
      const response = await categoriesAPI.getById(params.id as string);
      if (response.success) {
        setCategory(response.category);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll({
        category: params.id as string,
        page: currentPage,
        limit: productsPerPage
      });

      if (response.success) {
        const formattedProducts = response.products.map((product: any) => ({
          id: product._id,
          name: product.name,
          description: product.description || product.shortDescription || '',
          price: product.price,
          comparePrice: product.comparePrice,
          image: getFirstImageUrl(product.images),
          stock: product.stock?.quantity ?? 0
        }));
        setProducts(formattedProducts);
        setTotalPages(response.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✔✔

  const handleAddToCart = (product: any) => {
    const stock = typeof product.stock === 'number' ? product.stock : 0;
    const cartItem = cart.find((c: any) => c.id === product.id);
    const quantityInCart = cartItem?.quantity ?? 0;
    const quantityAfterAdd = quantityInCart + 1;

    if (stock === 0) {
      alert("مفيش من المنتج ده في المخزن");
      return;
    }
    if (quantityAfterAdd > stock) {
      alert("مفيش من المنتج ده في المخزن (المتوفر: " + stock + " قطعة)");
      return;
    }

    dispatch(addToCart(product));
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = currentCart.find((item: any) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(currentCart));
    alert("تم إضافة المنتج للسلة بنجاح!");
  };

  const handleToggleFavorite = (product: any) => {
    dispatch(toggleFavorite(product));
  };

  const isFavorite = (productId: string) => {
    return favorites.some((item: any) => item.id === productId);
  };

  if (loading && !category) {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3D2E]"></div>
            <p className="mt-4 text-gray-600">جاري التحميل...</p>
          </div>
        </div>

      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">الفئة غير موجودة</h2>
            <button
              onClick={() => router.push('/categories')}
              className="bg-[#0B3D2E] text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              العودة للفئات
            </button>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "الفئات", href: "/categories" }, { label: category.name }]} />
        {/* Header */}
        <div className="mb-8 mt-2">
          <button
            onClick={() => router.push('/categories')}
            className="text-[#0B3D2E] hover:text-green-700 mb-4 flex items-center gap-2"
          >
            <FiArrowRight className="w-4 h-4 rotate-180" />
            <span>العودة للفئات</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600">{category.description}</p>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3D2E]"></div>
            <p className="mt-4 text-gray-600">جاري تحميل المنتجات...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">لا توجد منتجات في هذه الفئة</h2>
            <p className="text-gray-600 mb-8">سيتم إضافة منتجات قريباً</p>
            <button
              onClick={() => router.push('/')}
              className="bg-[#0B3D2E] text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              تصفح جميع المنتجات
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative"
                >
                  {/* صورة المنتج */}
                  <div
                    className="relative w-full aspect-square overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    {product.image && product.image !== '/placeholder.jpg' ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-sm">لا توجد صورة</span>
                      </div>
                    )}

                    {/* أزرار الإجراءات */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(product);
                        }}
                        className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center shadow-lg transition-all duration-200 ${isFavorite(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
                          }`}
                      >
                        <FiHeart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-[#0B3D2E] hover:text-white transition-all duration-200 text-gray-700"
                      >
                        <FiShoppingCart className="w-5 h-5" />
                      </button>
                    </div>

                    {/* خصم */}
                    {product.comparePrice && product.comparePrice > product.price && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        خصم {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                      </div>
                    )}
                  </div>

                  {/* معلومات المنتج */}
                  <div className="p-4">
                    <h3
                      className="font-semibold text-gray-900 text-sm md:text-base mb-2 cursor-pointer hover:text-[#0B3D2E] line-clamp-2"
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-[#0B3D2E]">
                        {product.price} جنيه
                      </span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          {product.comparePrice} جنيه
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  السابق
                </button>
                <span className="px-4 py-2 text-gray-700">
                  صفحة {currentPage} من {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
