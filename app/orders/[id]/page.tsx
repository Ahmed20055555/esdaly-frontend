"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiPackage, FiTruck, FiMapPin, FiCreditCard, FiCheckCircle, FiArrowRight, FiHome } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { ordersAPI } from "@/lib/api";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/fotter";
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs";

export default function OrderStatusPage() {
    const router = useRouter();
    const params = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (params.id) {
            fetchOrder();
        }
    }, [params.id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const data = await ordersAPI.getById(params.id as string);
            if (data.success) {
                setOrder(data.order);
            } else {
                setError(data.message || "الطلب غير موجود");
            }
        } catch (err: any) {
            setError(err.message || "حدث خطأ أثناء جلب تفاصيل الطلب");
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status: string) => {
        const statusMap: any = {
            pending: { text: "قيد الانتظار", color: "text-amber-600", bg: "bg-amber-50", icon: <FiPackage className="w-6 h-6" /> },
            confirmed: { text: "تم التأكيد", color: "text-blue-600", bg: "bg-blue-50", icon: <FiCheckCircle className="w-6 h-6" /> },
            processing: { text: "جاري التجهيز", color: "text-purple-600", bg: "bg-purple-50", icon: <FiPackage className="w-6 h-6" /> },
            shipped: { text: "تم الشحن", color: "text-indigo-600", bg: "bg-indigo-50", icon: <FiTruck className="w-6 h-6" /> },
            delivered: { text: "تم التوصيل", color: "text-green-600", bg: "bg-green-50", icon: <FiCheckCircle className="w-6 h-6" /> },
            cancelled: { text: "ملغي", color: "text-red-600", bg: "bg-red-50", icon: <FiArrowRight className="w-6 h-6" /> }
        };
        return statusMap[status] || { text: status, color: "text-gray-600", bg: "bg-gray-50", icon: <FiPackage className="w-6 h-6" /> };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3D2E]"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">عذراً، لم يتم العثور على الطلب</h2>
                        <p className="text-gray-600 mb-8">{error || "تأكد من رقم الطلب الصحيح"}</p>
                        <Link href="/" className="inline-flex items-center gap-2 bg-[#0B3D2E] text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-all font-semibold">
                            <FiHome />
                            العودة للرئيسية
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const status = getStatusInfo(order.status);

    return (
        <div className="min-h-screen bg-gray-50 font-arabic">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-8">
                <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "حسابي", href: "/profile" }, { label: "تفاصيل الطلب" }]} />

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header / Status Banner */}
                        <div className={`p-6 rounded-2xl ${status.bg} border border-opacity-20 flex flex-col md:flex-row items-center justify-between gap-4`}>
                            <div className="flex items-center gap-4">
                                <div className={`${status.color} p-3 bg-white rounded-full shadow-sm`}>
                                    {status.icon}
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">طلب رقم: {order.orderNumber}</h1>
                                    <p className={`font-bold ${status.color}`}>{status.text}</p>
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-sm text-gray-500">تاريخ الطلب</p>
                                <p className="font-bold text-gray-800">{new Date(order.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>

                        {/* Product List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50">
                                <h2 className="text-lg font-bold text-gray-900">المنتجات المباعة</h2>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="p-6 flex items-center gap-4">
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <FiPackage className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                                            <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                                            {item.variant && (
                                                <p className="text-xs text-blue-600 font-medium">النوع: {item.variant.name} - {item.variant.value}</p>
                                            )}
                                        </div>
                                        <div className="text-left font-bold text-[#0B3D2E]">
                                            {item.price} ج.م
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping & Payment Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FiMapPin className="text-[#0B3D2E]" />
                                    عنوان التوصيل
                                </h2>
                                <div className="space-y-1 text-gray-600 font-medium">
                                    <p className="text-gray-900 font-bold">{order.shippingAddress.name}</p>
                                    <p>{order.shippingAddress.phone}</p>
                                    <p>{order.shippingAddress.street}</p>
                                    <p>{order.shippingAddress.city}، {order.shippingAddress.state}</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FiCreditCard className="text-[#0B3D2E]" />
                                    طريقة الدفع
                                </h2>
                                <div className="space-y-2">
                                    <p className="font-bold text-gray-900">
                                        {order.payment.method === 'cash' ? 'الدفع عند الاستلام' :
                                            order.payment.method === 'bank_transfer' ? 'تحويل بنكي' : 'بطاقة ائتمان'}
                                    </p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold ring-1 ring-blue-200">
                                        <span className={`w-2 h-2 rounded-full ${order.payment.status === 'paid' ? 'bg-green-500' : 'bg-blue-400'}`}></span>
                                        {order.payment.status === 'paid' ? 'تم الدفع' : 'في انتظار الدفع'}
                                    </div>
                                    {order.payment.transactionId && (
                                        <p className="text-xs text-gray-500 mt-2">رقم المعاملة: {order.payment.transactionId}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#0B3D2E] text-white rounded-2xl p-6 shadow-xl sticky top-24">
                            <h2 className="text-xl font-bold mb-6 pb-4 border-b border-white/10">ملخص التكلفة</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center opacity-80">
                                    <span>المجموع الفرعي</span>
                                    <span className="font-bold">{order.pricing.subtotal} ج.م</span>
                                </div>
                                <div className="flex justify-between items-center opacity-80">
                                    <span>تكلفة الشحن</span>
                                    <span className="font-bold">{order.pricing.shipping === 0 ? 'مجاني' : `${order.pricing.shipping} ج.م`}</span>
                                </div>
                                {order.pricing.discount > 0 && (
                                    <div className="flex justify-between items-center text-red-300">
                                        <span>خصم</span>
                                        <span className="font-bold">-{order.pricing.discount} ج.م</span>
                                    </div>
                                )}
                                <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xl font-black">
                                    <span>الإجمالي</span>
                                    <span className="text-yellow-400">{order.pricing.total} ج.م</span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                <Link href="/" className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold transition-all border border-white/10">
                                    متابعة التسوق
                                </Link>
                                <Link href="/profile" className="w-full flex items-center justify-center gap-2 text-white/70 hover:text-white py-2 text-sm font-bold transition-all">
                                    الذهاب لقائمة طلباتي
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
