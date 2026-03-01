'use client';
import { useEffect, useState } from 'react';
import Image from "next/image";
import { FiShoppingCart, FiHeart, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleFavorite } from "@/store/slices/favoritesSlice";
import { useRouter } from "next/navigation";
import { productsAPI, categoriesAPI } from "@/lib/api";
import { getFirstImageUrl } from "@/lib/imageUtils";
import { useToast } from "@/context/ToastContext";
import Link from 'next/link';

export default function Homesection() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { showToast } = useToast();
  const favorites = useSelector((state) => state.favorites);
  const cart = useSelector((state) => state.cart);
  const [gridCols, setGridCols] = useState(4);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [failedImageIds, setFailedImageIds] = useState(new Set());
  const [sortBy, setSortBy] = useState('newest');
  const [productsOutOfStock, setProductsOutOfStock] = useState(false);
  const [categories, setCategories] = useState([]);
  const productsPerPage = 10;

  useEffect(() => {


    async function getApi() {
      try {
        setLoading(true);
        const response = await productsAPI.getAll({
          page: currentPage,
          limit: productsPerPage
        });

        if (response.success) {
          // تحويل البيانات من Backend إلى التنسيق المتوقع
          const formattedProducts = response.products.map((product) => ({
            id: product._id,
            name: product.name,
            description: product.description || product.shortDescription || '',
            price: product.price,
            image: getFirstImageUrl(product.images),
            stock: product.stock?.quantity ?? 0
          }));
          setProducts(formattedProducts);

          // تحديث معلومات Pagination
          if (response.total !== undefined) {
            setTotalProducts(response.total);
            setTotalPages(response.pages || Math.ceil(response.total / productsPerPage));
          } else if (response.pages !== undefined) {
            setTotalPages(response.pages);
            setTotalProducts(response.total || response.count || response.products.length);
          } else {
            // Fallback: calculate from products length
            setTotalProducts(response.products.length);
            setTotalPages(1);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    getApi();
  }, [currentPage]);


  useEffect(() => {

    const product = products.sort((a, b) => {

      if (sortBy == 'price-asc') {
        return a.price - b.price;
      } else if (sortBy == 'price-desc') {
        return b.price - a.price;
      }


    });

    setProducts(product);

  }, [sortBy]);

  // حفظ السلة في localStorage عند التغيير
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("cart", cart);
    }
  }, [cart]);

  // حفظ المفضلة في localStorage عند التغيير
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const handleAddToCart = (item) => {
    const product = products.find((p) => p.id === item.id);
    const stock = product?.stock ?? 0;
    const quantityInCart = (Array.isArray(cart) ? cart.find((c) => c.id === item.id) : null)?.quantity ?? 0;
    const quantityAfterAdd = quantityInCart + 1;

    if (stock === 0) {
      showToast("عذراً، هذا المنتج غير متوفر حالياً", "error");
      return;
    }
    if (quantityAfterAdd > stock) {
      showToast(`عذراً، الكمية المتوفرة هي ${stock} فقط`, "error");
      return;
    }
    dispatch(addToCart(item));
    showToast("تمت إضافة المنتج للسلة");
  };

  const handleToggleFavorite = (item) => {
    dispatch(toggleFavorite(item));
    const nowFavorite = !favorites.some((f) => f.id === item.id);
    showToast(nowFavorite ? "تمت الإضافة للمفضلة" : "تمت الإزالة من المفضلة");
  };

  const isFavorite = (id) => {
    return favorites.some((item) => item.id === id);
  };

  const gridColsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  };

  const getGridColsClass = () => {
    return gridColsMap[gridCols] || gridColsMap[4];
  };

  const handleGridChange = (cols) => {
    setGridCols(cols);
  };

  // paginttion
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // paginttion

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 md:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-2 min-[280px]:px-3 sm:px-4 lg:px-8">

        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            منتجاتنا المميزة
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
            اكتشف أحدث تشكيلات الحجاب
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="mb-4 sm:mb-6 flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-4 items-stretch md:items-center justify-between">

          <div className="flex flex-wrap gap-2 sm:gap-3 flex-1 w-1/2 sm:mb-0 mb-5">

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 min-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] bg-white"
            >
              <option value="newest">الأحدث</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
              <option value="popular">الأكثر مبيعاً</option>
              <option value="rating">الأعلى تقييماً</option>
            </select>

          </div>

          {/* Grid Controls */}
          <div className="flex gap-1.5 sm:gap-2 md:gap-3 justify-center md:justify-end">
            {
              [1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => handleGridChange(num)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 ${num === 3 || num === 4 || num === 5 ? "hidden sm:block" : ""} rounded-full border text-xs sm:text-sm transition-all duration-200 ${gridCols === num
                    ? 'bg-[#0B3D2E] text-white border-[#0B3D2E]'
                    : 'border-gray-300 text-gray-700 hover:bg-[#0B3D2E] hover:text-white hover:border-[#0B3D2E]'
                    }`}
                  aria-label={`عرض ${num} أعمدة`}
                >
                  {num}
                </button>
              ))
            }
          </div>

        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3D2E]"></div>
            <p className="mt-4 text-gray-600">جاري تحميل المنتجات...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">لا توجد منتجات متاحة حالياً</p>
          </div>
        ) : (
          <div className={`grid ${getGridColsClass()} gap-2 sm:gap-3 md:gap-4 lg:gap-6 transition-all duration-300`}>
            {products.map((item) => (
              <div
                key={item.id}
                className={`group flex ${item.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''} flex-col bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative`}
              >
                {/* Image Container - قابل للنقر للذهاب لصفحة المنتج */}
                <Link
                  href={`/product/${item.id}`}
                  className="relative w-full aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700 block"
                >
                  {item.image && item.image !== '/placeholder.jpg' && item.image !== '' && !failedImageIds.has(item.id) ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized
                      onError={() => setFailedImageIds((prev) => new Set(prev).add(item.id))}
                    />

                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                      <span className="text-gray-400 text-sm">لا توجد صورة</span>
                    </div>
                  )}
                </Link>

                {/* Action Buttons Overlay - appear on hover */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  {item.stock === 0 ? (
                    null
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleFavorite(item);
                      }}
                      className={`cursor-pointer ${item.stock === 0 ? 'opacity-20 cursor-not-allowed' : ''} w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-[#0B3D2E] hover:text-white transition-all duration-200 ${isFavorite(item.id) ? 'bg-[#0B3D2E] text-white' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      aria-label="إضافة للمفضلة"
                    >
                      <FiHeart className={`w-5 h-5 ${isFavorite(item.id) ? 'fill-current text-red-500' : ''}`} />
                    </button>
                  )}

                  {item.stock === 0 ? (
                    null
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className={`cursor-pointer ${item.stock === 0 ? 'opacity-20 cursor-not-allowed' : ''} w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-[#0B3D2E] hover:text-white transition-all duration-200 text-gray-700 dark:text-gray-300`}
                      aria-label="إضافة للسلة"
                    >
                      <FiShoppingCart className="w-5 h-5" />
                    </button>
                  )}

                </div>

                {/* Product Info */}
                <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-grow">
                  {/* اسم المنتج - قابل للنقر */}
                  <Link href={`/product/${item.id}`} className="block mb-1 sm:mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm md:text-base flex-1 line-clamp-2 hover:text-[#0B3D2E] transition-colors">
                      {item.name}
                    </h3>
                  </Link>

                  <Link href={`/product/${item.id}`} className="block mb-1 sm:mb-2">
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {item.description}
                    </p>
                  </Link>

                  {item.stock === 0 && (
                    <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-indigo-500 text-white text-xs font-medium w-fit">
                      نفد من المنتج
                    </div>
                  )}

                  {/* عدد المخزون */}
                  {typeof item.stock === 'number' && (
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1">
                      المخزون: {item.stock} {item.stock === 0 ? '(نفد)' : 'قطعة'}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto flex-wrap gap-1 sm:gap-2">

                    <Link href={`/product/${item.id}`} className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#0B3D2E] dark:text-green-400">
                        {item.price} جنيه
                      </span>
                      {item.comparePrice && item.comparePrice > item.price && (
                        <>
                          <span className="text-xs sm:text-sm text-gray-400 line-through">
                            {item.comparePrice} جنيه
                          </span>
                          <span className="text-[10px] sm:text-xs bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                            خصم {Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)}%
                          </span>
                        </>
                      )}
                    </Link>

                    <div className="flex gap-2">

                      {item.stock === 0 ? (
                        null
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleFavorite(item);
                          }}
                          className={`cursor-pointer w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-[#0B3D2E] hover:text-white transition-all duration-200 ${isFavorite(item.id) ? 'bg-[#0B3D2E] text-white' : 'text-gray-600 dark:text-gray-400'
                            }`}
                          aria-label="إضافة للمفضلة"
                        >
                          <FiHeart className={`w-4 h-4 ${isFavorite(item.id) ? 'fill-current text-red-500' : ''}`} />
                        </button>
                      )}

                      {item.stock === 0 ? (
                        null
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          className="cursor-pointer w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-[#0B3D2E] hover:text-white transition-all duration-200 text-gray-600 dark:text-gray-400"
                          aria-label="إضافة للسلة"
                        >
                          <FiShoppingCart className="w-4 h-4" />
                        </button>
                      )}

                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && totalPages > 1 && (
          <div className="mt-6 sm:mt-8 md:mt-12 flex flex-col items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-wrap justify-center">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border text-xs sm:text-sm transition-all duration-200 ${currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-[#0B3D2E] hover:text-white hover:border-[#0B3D2E]'
                  }`}
                aria-label="الصفحة السابقة"
              >
                <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg border text-xs sm:text-sm transition-all duration-200 ${currentPage === page
                    ? 'bg-[#0B3D2E] text-white border-[#0B3D2E]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-[#0B3D2E] hover:text-white hover:border-[#0B3D2E]'
                    }`}
                  aria-label={`الصفحة ${page}`}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border text-xs sm:text-sm transition-all duration-200 ${currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-[#0B3D2E] hover:text-white hover:border-[#0B3D2E]'
                  }`}
                aria-label="الصفحة التالية"
              >
                <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Page Info */}
            <p className="text-xs sm:text-sm text-gray-600 px-2 text-center">
              عرض {((currentPage - 1) * productsPerPage) + 1} - {Math.min(currentPage * productsPerPage, totalProducts)} من {totalProducts} منتج
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
