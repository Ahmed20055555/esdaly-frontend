"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/store/slices/cartSlice";
import { ordersAPI, authAPI } from "@/lib/api";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/fotter";
import { FiMapPin, FiCreditCard, FiUser, FiPhone, FiMail, FiLock } from "react-icons/fi";
import { getFirstImageUrl } from "@/lib/imageUtils";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const cart = useSelector((state: any) => state.cart || []);
  const storedUser = useSelector((state: any) => state.auth?.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [user, setUser] = useState<any>(null);

  // حساب المجموع
  const subtotal = cart.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
  const shipping = 50; // قيمة ثابتة للشحن مؤقتاً
  const total = subtotal + shipping;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "مصر"
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");

  const [bankTransferInfo, setBankTransferInfo] = useState({
    accountNumber: "",
    transactionNumber: ""
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const response = await authAPI.getMe();
      console.log("getMe response:", response);

      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        // Fill form with user data if available
        if (response.user.address) {
          setShippingAddress({
            name: response.user.name || "",
            phone: response.user.phone || "",
            street: response.user.address.street || "",
            city: response.user.address.city || "",
            state: response.user.address.state || "",
            zipCode: response.user.address.zipCode || "",
            country: response.user.address.country || "مصر"
          });
        } else {
          setShippingAddress(prev => ({
            ...prev,
            name: response.user.name || "",
            phone: response.user.phone || "",
            email: response.user.email || ""
          }));
        }
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      }
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem("token");
    }
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum: number, item: any) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);

    const shipping = subtotal > 3000 ? 0 : 30; // شحن مجاني للطلبات فوق 500 جنيه
    const total = subtotal + shipping;

    return { subtotal, shipping, total, discount: 0 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isAuthenticated) {
      setError("يجب تسجيل الدخول أولاً");
      setLoading(false);
      router.push("/login?redirect=/checkout");
      return;
    }

    // Validate shipping address
    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.street ||
      !shippingAddress.city || !shippingAddress.state) {
      setError("يرجى ملء جميع حقول العنوان المطلوبة");
      setLoading(false);
      return;
    }

    // Validate payment method
    const validPaymentMethods = ['cash', 'bank_transfer'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      setError("طريقة الدفع المختارة غير صحيحة");
      setLoading(false);
      return;
    }

    // Validate bank transfer info if method is bank_transfer
    if (paymentMethod === 'bank_transfer') {
      if (!bankTransferInfo.transactionNumber || bankTransferInfo.transactionNumber.trim() === '') {
        setError("يرجى إدخال رقم المعاملة للتحويل البنكي");
        setLoading(false);
        return;
      }
    }

    try {
      const { subtotal, shipping, discount, total } = calculateTotals();

      // Prepare order items
      const items = cart.map((item: any) => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: getFirstImageUrl(item.image) // تخزين صورة واحدة فقط للطلب
      }));

      const orderData = {
        items,
        shippingAddress,
        billingAddress: shippingAddress,
        pricing: {
          subtotal,
          shipping,
          discount: 0,
          total
        },
        payment: {
          method: paymentMethod,
          status: "pending", // All payments start as pending
          ...(paymentMethod === "bank_transfer" && {
            transactionId: bankTransferInfo.transactionNumber,
            accountNumber: bankTransferInfo.accountNumber || undefined
          })
        },
        notes,
      };

      const response = await ordersAPI.create(orderData);

      if (response.success) {
        // Clear cart only if NOT test mode


        // direct to order confirmation
        router.push(`/orders/${response.order._id}`);
      } else {
        setError(response.message || "حدث خطأ أثناء إنشاء الطلب");
      }
    } catch (error: any) {
      console.error("❌ Checkout error:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      // Handle specific error types
      let errorMessage = "حدث خطأ أثناء إنشاء الطلب";

      if (error.message?.includes('network') || error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        errorMessage = "لا يمكن الاتصال بالخادم. تأكد من:\n1. تشغيل Backend على http://localhost:5000\n2. تسجيل الدخول كـ User";
      } else if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        errorMessage = "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى";
        localStorage.removeItem("token");
        setTimeout(() => {
          router.push("/login?redirect=/checkout");
        }, 2000);
      } else if (error.message?.includes('400') || error.message?.includes('validation')) {
        errorMessage = error.message || "يرجى التحقق من صحة البيانات المدخلة";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center bg-white rounded-2xl shadow-xl p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">السلة فارغة</h2>
            <p className="text-gray-600 mb-8">لم تقم بإضافة أي منتجات للسلة بعد</p>
            <button
              onClick={() => router.push("/")}
              className="bg-[#0B3D2E] text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              تصفح المنتجات
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "السلة", href: "/cart" }, { label: "إتمام الطلب" }]} />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 mt-2">إتمام الطلب</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}



        {!isAuthenticated && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
            <p className="mb-2">يجب تسجيل الدخول لإتمام الطلب</p>
            <button
              onClick={() => router.push("/login?redirect=/checkout")}
              className="text-yellow-800 underline font-semibold"
            >
              تسجيل الدخول
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* معلومات الشحن */}
          <div className="lg:col-span-2 space-y-6">
            {/* عنوان الشحن */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiMapPin className="w-5 h-5" />
                عنوان الشحن
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الشارع والحي <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدينة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المنطقة <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الرمز البريدي
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الدولة
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                  />
                </div>
              </div>
            </div>

            {/* طريقة الدفع */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiCreditCard className="w-5 h-5" />
                طريقة الدفع
              </h2>

              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === "cash"
                  ? "border-[#0B3D2E] bg-green-50"
                  : "border-gray-200 hover:border-[#0B3D2E]"
                  }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#0B3D2E]"
                  />
                  <div className="flex-1">
                    <span className="font-medium block">الدفع عند الاستلام</span>
                    <span className="text-sm text-gray-500">ادفع نقداً عند استلام الطلب</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${paymentMethod === "bank_transfer"
                  ? "border-[#0B3D2E] bg-green-50"
                  : "border-gray-200 hover:border-[#0B3D2E]"
                  }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#0B3D2E]"
                  />
                  <div className="flex-1">
                    <span className="font-medium block">تحويل بنكي</span>
                    <span className="text-sm text-gray-500">تحويل مباشر إلى حسابنا البنكي</span>
                  </div>
                </label>
              </div>

              {/* معلومات التحويل البنكي */}
              {paymentMethod === "bank_transfer" && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">معلومات الحساب البنكي:</h3>
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">اسم البنك:</span> البنك الأهلي المصري
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">رقم الحساب:</span> EG1234567890123456789012
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">IBAN:</span> EG1234567890123456789012
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم المعاملة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required={paymentMethod === "bank_transfer"}
                      value={bankTransferInfo.transactionNumber}
                      onChange={(e) => setBankTransferInfo({
                        ...bankTransferInfo,
                        transactionNumber: e.target.value
                      })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                      placeholder="أدخل رقم المعاملة من البنك"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      يرجى إدخال رقم المعاملة بعد إتمام التحويل
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الحساب المرسل منه (اختياري)
                    </label>
                    <input
                      type="text"
                      value={bankTransferInfo.accountNumber}
                      onChange={(e) => setBankTransferInfo({
                        ...bankTransferInfo,
                        accountNumber: e.target.value
                      })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                      placeholder="رقم الحساب المرسل منه"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ملاحظات */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">ملاحظات إضافية (اختياري)</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                placeholder="أي ملاحظات خاصة بالطلب..."
              />
            </div>
          </div>

          {/* ملخص الطلب */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">ملخص الطلب</h2>

              {/* المنتجات */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item: any) => {
                  const imageUrl = getFirstImageUrl(item.image);
                  return (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      <div className="relative w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                        {imageUrl && imageUrl !== '/placeholder.jpg' ? (
                          <Image
                            src={imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                            unoptimized
                            onError={(e) => {
                              console.error('Image load error:', imageUrl);
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 text-xs">لا توجد صورة</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-gray-500">الكمية: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-[#0B3D2E]">
                        {(parseFloat(item.price) * item.quantity).toFixed(2)} جنيه
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* الحسابات */}
              <div className="space-y-3 mb-6 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-semibold">{totals.subtotal.toFixed(2)} جنيه</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الشحن:</span>
                  <span className="font-semibold">
                    {totals.shipping === 0 ? "مجاني" : `${totals.shipping.toFixed(2)} جنيه`}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>المجموع الكلي:</span>
                    <span className="text-[#0B3D2E]">{totals.total.toFixed(2)} جنيه</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !isAuthenticated}
                className={`w-full py-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${'bg-[#0B3D2E] text-white hover:bg-green-700'
                  }`}
              >
                {loading
                  ? "جاري المعالجة..." : "تأكيد الطلب"}
              </button>

            </div>
          </div>
        </form>

      </div>

    </div>
  );
}
