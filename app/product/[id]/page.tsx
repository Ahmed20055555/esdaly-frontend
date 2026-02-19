"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FiShoppingCart, FiHeart, FiArrowRight, FiStar, FiThumbsUp, FiPackage, FiTag, FiLayers, FiInfo, FiCheckCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCart } from "../../../store/slices/cartSlice";
import { toggleFavorite } from "../../../store/slices/favoritesSlice";
import { productsAPI, reviewsAPI, ordersAPI } from "../../../lib/api";
import { getFirstImageUrl } from "../../../lib/imageUtils";
import Breadcrumbs from "../../../components/breadcrumbs/breadcrumbs";
import ShareButtons from "../../../components/share-buttons/sharebuttons";
import { saveRecentlyViewed } from "../../../components/recently-viewed/recentlyviewed";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const favorites = useSelector((state: any) => state.favorites);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: ""
  });
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);


  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);

        // التحقق من صحة ID
        if (!params.id || typeof params.id !== 'string') {
          console.error("Invalid product ID:", params.id);
          router.push("/");
          return;
        }

        const response = await productsAPI.getById(params.id as string);
        console.log("Product data:", response);
        if (response && response.success && response.product) {
          const productData = response.product;

          // تحويل البيانات من Backend إلى التنسيق المتوقع مع جميع التفاصيل
          const formattedProduct = {
            id: productData._id || productData.id,
            name: productData.name || '',
            nameEn: productData.nameEn,
            slug: productData.slug,
            description: productData.description || productData.shortDescription || '',
            shortDescription: productData.shortDescription,
            price: productData.price || 0,
            comparePrice: productData.comparePrice,
            sku: productData.sku,
            category: productData.category,
            images: productData.images || [],
            stock: productData.stock || { quantity: 0, trackInventory: true, lowStockThreshold: 10 },
            variants: productData.variants || [],
            attributes: productData.attributes || {},
            tags: productData.tags || [],
            rating: productData.rating || { average: 0, count: 0 },
            sales: productData.sales || { count: 0, revenue: 0 },
            isFeatured: productData.isFeatured || false,
            isActive: productData.isActive !== undefined ? productData.isActive : true,
            createdAt: productData.createdAt,
            updatedAt: productData.updatedAt,
            image: getFirstImageUrl(productData.images)
          };

          setProduct(formattedProduct);
          saveRecentlyViewed({
            id: formattedProduct.id,
            name: formattedProduct.name,
            image: formattedProduct.image,
            price: formattedProduct.price,
          });

          setSelectedImageIndex(0);
          if (formattedProduct.id) {
            fetchReviews(formattedProduct.id);
          }
          const catId = productData.category?._id || productData.category;
          if (catId) {
            productsAPI.getAll({ category: catId, limit: 5 }).then((r) => {
              if (r.success && r.products) {
                const related = r.products
                  .filter((p: any) => (p._id || p.id) !== formattedProduct.id)
                  .slice(0, 4)
                  .map((p: any) => ({
                    id: p._id || p.id,
                    name: p.name,
                    price: p.price,
                    image: getFirstImageUrl(p.images),
                  }));
                setRelatedProducts(related);
              }
            }).catch(() => { });
          }
          fetchUserOrders();
          // ❌❌ 
        } else {
          console.error("Product not found or invalid response:", response);
          router.push("/");
        }
      } catch (error: any) {
        console.error("Error fetching product:", error);
        // عرض رسالة خطأ للمستخدم بدلاً من إعادة التوجيه مباشرة
        alert(error.message || 'حدث خطأ في جلب تفاصيل المنتج');
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchProduct();
    }
  }, [params.id, router]);


  const fetchReviews = async (productId: string) => {
    try {
      setReviewsLoading(true);
      const response = await reviewsAPI.getAll(productId, { page: 1, limit: 10 });

      if (response.success) {
        setReviews(response.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await ordersAPI.getAll({ page: 1, limit: 100 });
      if (response.success) {
        // كل الطلبات (ليس فقط المسلّمة) حتى يقدر يقيّم بعد الشراء مباشرة
        console.log("Orders data:", response);
        setUserOrders(response.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      alert('يرجى كتابة التعليق');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('يجب تسجيل الدخول لإضافة تقييم');
        router.push('/login?redirect=/product/' + params.id);
        return;
      }

      setReviewSubmitting(true);

      const productId = product?.id ? String(product.id) : '';
      const orderWithProduct = (userOrders || []).find((order: any) =>
        (order.items || []).some((item: any) => {
          const p = item.product;
          if (!p) return false;
          const id = typeof p === 'string' ? p : (p._id || p.id);
          return id && String(id) === productId;
        })
      );

      const response = await reviewsAPI.create({
        product: product?.id,
        order: orderWithProduct?._id,
        rating: reviewForm.rating,
        title: reviewForm.title.trim(),
        comment: reviewForm.comment.trim()
      });
      console.log("response", response);
      if (response.success) {
        setShowReviewForm(false);
        setReviewForm({ rating: 5, title: "", comment: "" });
        // إظهار التقييم الجديد فوراً في القائمة
        if (response.review) {
          setReviews((prev) => [response.review, ...prev]);
        } else {
          fetchReviews(product?.id);
        }
        // تحديث تقييم المنتج (المتوسط وعدد التقييمات) بعد إعادة جلب المنتج
        try {
          const productRes = await productsAPI.getById(params.id as string);
          if (productRes?.success && productRes?.product?.rating) {
            const newRating = productRes.product.rating;
            setProduct((prev: any) => prev ? { ...prev, rating: newRating } : prev);
          }
        } catch (_) { }
        alert('تم إضافة التقييم بنجاح!');
      } else {
        alert(response.message || 'حدث خطأ أثناء إضافة التقييم');
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      alert(error.message || 'حدث خطأ أثناء إضافة التقييم');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const hasPurchasedProduct = () => {
    if (!product?.id || !userOrders?.length) return false;
    const productId = String(product.id);
    return userOrders.some((order: any) =>
      (order.items || []).some((item: any) => {
        const p = item.product;
        if (!p) return false;
        const itemProductId = typeof p === 'string' ? p : (p._id || p.id);
        return itemProductId && String(itemProductId) === productId;
      })
    );
  };

  const isFavorite = product ? favorites.some((item: any) => item.id === product.id) : false;

  const handleAddToCart = (product: any, quantity: number) => {
    if (!product) return;

    const stockQty = product.stock?.trackInventory !== false && product.stock?.quantity != null
      ? product.stock.quantity
      : 999;
    if (quantity > stockQty) {
      alert(`المخزون المتاح: ${stockQty} قطعة فقط`);
      return;
    }

    let currentCart: any[];

    try {
      const stored = JSON.parse(localStorage.getItem("cart") || "[]");
      currentCart = Array.isArray(stored) ? stored : [];
    } catch {
      currentCart = [];
    }

    const existingItem = currentCart.find((item: any) => item.id === product.id);

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > stockQty) {
        alert(`المخزون المتاح: ${stockQty} قطعة. الكمية الحالية في السلة: ${existingItem.quantity}`);
        return;
      }
      existingItem.quantity = newQty;
    } else {
      currentCart.push({ ...product, quantity });
    }

    dispatch(setCart(currentCart));
    localStorage.setItem("cart", JSON.stringify(currentCart));
    alert("تم إضافة المنتج للسلة بنجاح!");
  };

  const handleToggleFavorite = () => {
    if (product) {
      dispatch(toggleFavorite(product));
      const currentFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const exists = currentFavorites.find((fav: any) => fav.id === product.id);
      if (exists) {
        const updated = currentFavorites.filter((fav: any) => fav.id !== product.id);
        localStorage.setItem("favorites", JSON.stringify(updated));
      } else {
        currentFavorites.push(product);
        localStorage.setItem("favorites", JSON.stringify(currentFavorites));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3D2E] mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const categoryId = product.category?._id || product.category;
  const categoryName = product.category?.name || 'الفئات';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 min-[280px]:px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', href: '/' },
            { label: 'الفئات', href: '/categories' },
            ...(categoryId ? [{ label: categoryName, href: `/categories/${categoryId}` }] : []),
            { label: product.name },
          ].flat()}
        />
        <button
          onClick={() => router.back()}
          className="mb-2 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base text-[#0B3D2E] hover:text-green-600 transition-colors"
        >
          <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>العودة</span>
        </button>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 p-3 sm:p-4 md:p-6 lg:p-12">
            {/* صور المنتج */}
            <div className="space-y-4">
              {/* الصورة الرئيسية */}
              <div className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={getFirstImageUrl([product.images[selectedImageIndex] ?? product.images[0]])}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-sm">لا توجد صورة</span>
                  </div>
                )}
              </div>

              {/* معرض الصور المصغرة */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {product.images.map((img: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                        ? 'border-[#0B3D2E] ring-2 ring-[#0B3D2E]'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <Image
                        src={getFirstImageUrl([img])}
                        alt={`${product.name} - صورة ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 25vw, 20vw"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* معلومات المنتج */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {product.name}
                </h1>
                <ShareButtons title={product.name} url={`/product/${product.id}`} />
                <div className="mt-3 sm:mt-4" />
                {/* Rating - يظهر دائماً */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.round(product.rating?.average ?? 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {product.rating?.count > 0
                      ? `(${(product.rating.average ?? 0).toFixed(1)}) - ${product.rating.count} تقييم`
                      : 'لا توجد تقييمات بعد'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
                      if (hasPurchasedProduct()) setShowReviewForm(true);
                    }}
                    className="text-sm font-medium text-[#0B3D2E] hover:underline"
                  >
                    قيم المنتج
                  </button>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {product.comparePrice && product.comparePrice > product.price ? (
                    <div className="flex items-center gap-3">
                      <p className="text-2xl md:text-3xl font-bold text-[#0B3D2E]">
                        {product.price} جنيه
                      </p>
                      <p className="text-xl text-gray-400 line-through">
                        {product.comparePrice} جنيه
                      </p>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        خصم {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                      </span>
                    </div>
                  ) : (
                    <p className="text-2xl md:text-3xl font-bold text-[#0B3D2E]">
                      {product.price} جنيه
                    </p>
                  )}
                </div>

                {/* الفئة */}
                {product.category && (
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      <FiLayers className="w-4 h-4" />
                      {typeof product.category === 'object' ? product.category.name : 'فئة'}
                    </span>
                  </div>
                )}

                {/* SKU */}
                {product.sku && (
                  <div className="mb-4 text-sm text-gray-500">
                    <span className="font-medium">رمز المنتج:</span> {product.sku}
                  </div>
                )}

                {/* المخزون */}
                {product.stock && (
                  <div className="mb-4">
                    {product.stock.quantity > 0 ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <FiCheckCircle className="w-5 h-5" />
                        <span className="font-medium">
                          متوفر ({product.stock.quantity} قطعة)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <FiPackage className="w-5 h-5" />
                        <span className="font-medium">غير متوفر</span>
                      </div>
                    )}
                    {product.stock.quantity > 0 && product.stock.quantity <= (product.stock.lowStockThreshold || 10) && (
                      <p className="text-xs text-orange-600 mt-1">⚠️ الكمية محدودة</p>
                    )}
                  </div>
                )}

                {/* الخصائص */}
                {product.attributes && Object.keys(product.attributes).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">الخصائص</h3>
                    <div className="space-y-2">
                      {product.attributes.size && product.attributes.size.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">المقاسات المتاحة:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {product.attributes.size.map((size: string, idx: number) => (
                              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {product.attributes.color && product.attributes.color.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">الألوان المتاحة:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {product.attributes.color.map((color: string, idx: number) => (
                              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                {color}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {product.attributes.material && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">المادة:</span>
                          <span className="text-gray-600 mr-2">{product.attributes.material}</span>
                        </div>
                      )}
                      {product.attributes.brand && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">العلامة التجارية:</span>
                          <span className="text-gray-600 mr-2">{product.attributes.brand}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">الخيارات المتاحة</h3>
                    <div className="space-y-4">
                      {product.variants.map((variant: any, idx: number) => (
                        <div key={idx}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {variant.name}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {variant.options.map((option: string, optIdx: number) => (
                              <button
                                key={optIdx}
                                onClick={() => setSelectedVariant({ ...variant, selectedOption: option })}
                                className={`px-4 py-2 rounded-lg border-2 transition-all ${selectedVariant?.name === variant.name && selectedVariant?.selectedOption === option
                                  ? 'border-[#0B3D2E] bg-[#0B3D2E] text-white'
                                  : 'border-gray-300 hover:border-[#0B3D2E]'
                                  }`}
                              >
                                {option}
                                {variant.price && (
                                  <span className="text-xs mr-1">(+{variant.price} جنيه)</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag: string, idx: number) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                          <FiTag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* الوصف */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">الوصف</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
                  {product.shortDescription && product.shortDescription !== product.description && (
                    <p className="text-gray-500 text-sm mt-2">{product.shortDescription}</p>
                  )}
                </div>

                {/* معلومات إضافية */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FiInfo className="w-4 h-4" />
                    معلومات إضافية
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {product.sales && product.sales.count > 0 && (
                      <div className="flex justify-between">
                        <span>عدد المبيعات:</span>
                        <span className="font-medium">{product.sales.count}</span>
                      </div>
                    )}
                    {product.isFeatured && (
                      <div className="flex items-center gap-2 text-green-600">
                        <FiStar className="w-4 h-4 fill-current" />
                        <span>منتج مميز</span>
                      </div>
                    )}
                    {product.createdAt && (
                      <div className="flex justify-between">
                        <span>تاريخ الإضافة:</span>
                        <span>{new Date(product.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* الكمية */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكمية
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => {
                      const maxQuantity = product.stock?.quantity || 999;
                      setQuantity(Math.min(maxQuantity, quantity + 1));
                    }}
                    disabled={product.stock && product.stock.quantity > 0 && quantity >= product.stock.quantity}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                {product.stock && product.stock.quantity > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    متوفر {product.stock.quantity} قطعة
                  </p>
                )}
              </div>

              {/* الأزرار */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleAddToCart(product, quantity)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#0B3D2E] text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  <span>إضافة للسلة</span>
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-colors ${isFavorite
                    ? "bg-red-50 text-red-600 border-2 border-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <FiHeart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                  <span>{isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* منتجات ذات صلة */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">منتجات ذات صلة</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-[#0B3D2E]/20 transition-all"
                >
                  <div className="aspect-square relative bg-gray-50">
                    {p.image && p.image !== '/placeholder.jpg' ? (
                      <Image src={p.image} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" sizes="25vw" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">لا صورة</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#0B3D2E]">{p.name}</p>
                    <p className="text-[#0B3D2E] font-bold text-sm mt-1">{p.price} جنيه</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div id="reviews" className="mt-12 bg-white rounded-2xl shadow-xl p-6 md:p-12 scroll-mt-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">التقييمات والمراجعات</h2>
            <button
              onClick={() => {
                const token = localStorage.getItem('token');
                if (!token) {
                  router.push('/login?redirect=/product/' + params.id + '#reviews');
                  return;
                }
                if (!hasPurchasedProduct()) {
                  alert('يجب شراء المنتج أولاً لتتمكن من التقييم. قم بإتمام عملية الشراء ثم عد هنا.');
                  return;
                }
                setShowReviewForm(!showReviewForm);
              }}
              className="bg-[#0B3D2E] text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              {showReviewForm ? 'إلغاء' : 'إضافة تقييم'}
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التقييم
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="focus:outline-none"
                    >
                      <FiStar
                        className={`w-8 h-8 ${star <= reviewForm.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان التقييم (اختياري)
                </label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                  placeholder="عنوان التقييم"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التعليق <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] resize-none"
                  placeholder="اكتب تقييمك هنا..."
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="bg-[#0B3D2E] text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reviewSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
              </button>
            </form>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B3D2E]"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review: any) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#0B3D2E] rounded-full flex items-center justify-center text-white font-bold">
                        {review.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{review.user?.name || 'مستخدم'}</p>
                        {review.isVerified && (
                          <span className="text-xs text-green-600">✓ تم الشراء</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  {review.title && (
                    <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>
                  )}

                  <p className="text-gray-600 mb-3">{review.comment}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {new Date(review.createdAt).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    {review.helpful && review.helpful.count > 0 && (
                      <span className="flex items-center gap-1">
                        <FiThumbsUp className="w-4 h-4" />
                        {review.helpful.count} مفيد
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
