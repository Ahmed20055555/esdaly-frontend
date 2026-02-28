"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "@/store/slices/cartSlice";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";
import { getFirstImageUrl, getImageUrl } from "@/lib/imageUtils";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state: any) => state.cart);
  const [isClient, setIsClient] = useState(false);

  const fixedCart = useMemo(() => {
    return cart.map((item: any) => {

      let imageUrl = item.image;

      // If image URL is truncated or invalid, try to fix it
      if (imageUrl && typeof imageUrl === 'string') {
        // Ensure the URL is complete
        if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('/')) {
          imageUrl = getImageUrl(imageUrl);
        } else if (imageUrl.startsWith('/')) {
          const origin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api').replace(/\/api\/?$/, '');
          imageUrl = `${origin}${imageUrl}`;
        }

      }

      return {
        ...item,
        image: imageUrl
      };
    });
  }, [cart]);

  useEffect(() => {
    console.log("cart", cart);
    // تحديث localStorage عند تغيير السلة
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updated = currentCart.filter((item: any) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {

    const product = fixedCart.find((p: any) => p.id === id) as any
    const stock = product?.stock || 0;

    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    if (newQuantity > stock) {
      alert("مفيش من المنتج ده في المخزن (المتوفر: " + stock + " قطعة)");
      return;
    }

    dispatch(updateQuantity({ id, quantity: newQuantity }));
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const item = currentCart.find((i: any) => i.id === id);
    if (item) {
      item.quantity = newQuantity;
      localStorage.setItem("cart", JSON.stringify(currentCart));
    }
  };

  const handleClearCart = () => {
    if (confirm("هل أنت متأكد من حذف جميع المنتجات من السلة؟")) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    }
  };

  const totalPrice = fixedCart.reduce((sum: number, item: any) => {
    return sum + parseFloat(item.price) * item.quantity;
  }, 0);

  const totalItems = fixedCart.reduce((sum: number, item: any) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 min-[280px]:px-3 sm:px-4 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="text-center bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
            <FiShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-300 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">السلة فارغة</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">لم تقم بإضافة أي منتجات للسلة بعد</p>
            <button
              onClick={() => router.push("/")}
              className="bg-[#0B3D2E] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-green-700 transition-colors"
            >
              تصفح المنتجات
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-2 min-[280px]:px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "سلة التسوق" }]} />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8 mt-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">سلة التسوق</h1>
          {fixedCart.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-xs sm:text-sm md:text-base text-red-600 hover:text-red-700 font-medium"
            >
              حذف الكل
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* قائمة المنتجات */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {fixedCart.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4 hover:shadow-lg transition-shadow"
              >
                {/* صورة المنتج */}
                <div
                  className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={() => router.push(`/product/${item.id}`)}
                >
                  {item.image && item.image !== '/placeholder.jpg' && item.image.length > 0 ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                      unoptimized
                      onError={(e) => {
                        console.error('❌ Image load error for cart item:', item.name, 'URL:', item.image);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400 text-sm">لا توجد صورة</span>
                    </div>
                  )}
                </div>

                {/* معلومات المنتج */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-[#0B3D2E]"
                      onClick={() => router.push(`/product/${item.id}`)}
                    >
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* الكمية */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* السعر */}
                    <div className="text-left">
                      <p className="text-xl font-bold text-[#0B3D2E]">
                        {(parseFloat(item.price) * item.quantity).toFixed(2)} جنيه
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.price} جنيه للقطعة
                      </p>
                    </div>

                    {/* زر الحذف */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="حذف المنتج"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ملخص الطلب */}
          <div className="lg:col-span-1 space-y-4">
            {/* تنبيه الشحن المجاني */}
            {totalPrice > 0 && totalPrice < 3000 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <p className="text-sm font-medium text-amber-800">
                  أضيفي <span className="font-bold">{(3000 - totalPrice).toFixed(0)}</span> جنيه للشحن المجاني
                </p>
                <div className="mt-2 h-2 bg-amber-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${Math.min(100, (totalPrice / 3000) * 100)}%` }} />
                </div>
                <p className="text-xs text-amber-700 mt-1">الشحن مجاني للطلبات فوق 3000 جنيه</p>
              </div>
            )}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6 sticky top-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">ملخص الطلب</h2>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                  <span>عدد المنتجات:</span>
                  <span className="font-semibold">{totalItems}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-semibold">{totalPrice.toFixed(2)} جنيه</span>
                </div>
                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900">
                    <span>المجموع الكلي:</span>
                    <span className="text-[#0B3D2E]">{totalPrice.toFixed(2)} جنيه</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-[#0B3D2E] text-white py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-green-700 transition-colors mb-3 sm:mb-4"
              >
                إتمام الطلب
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full flex items-center justify-center gap-2 text-[#0B3D2E] border-2 border-[#0B3D2E] py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-green-50 transition-colors"
              >
                <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>متابعة التسوق</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
