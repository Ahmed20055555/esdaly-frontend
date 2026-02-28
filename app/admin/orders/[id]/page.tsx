"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiArrowRight, FiEdit } from "react-icons/fi";
import Image from "next/image";
import { API_BASE_URL } from "../../../../lib/api";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/orders/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      pending: 'قيد الانتظار',
      confirmed: 'مؤكد',
      processing: 'قيد المعالجة',
      shipped: 'تم الشحن',
      delivered: 'تم التسليم',
      cancelled: 'ملغي'
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3D2E]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">الطلب غير موجود</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#0B3D2E] hover:text-green-600"
        >
          <FiArrowRight className="w-5 h-5" />
          <span>العودة</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">تفاصيل الطلب</h1>
          <p className="text-gray-600 mt-2">رقم الطلب: {order.orderNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* معلومات الطلب */}
        <div className="lg:col-span-2 space-y-6">
          {/* المنتجات */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">المنتجات</h2>
            <div className="space-y-4">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex gap-4 border-b pb-4 last:border-0">
                  {item.image && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                    <p className="text-sm font-semibold text-[#0B3D2E]">
                      {item.price} جنيه × {item.quantity} = {(parseFloat(item.price) * item.quantity).toFixed(2)} جنيه
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* عنوان الشحن */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">عنوان الشحن</h2>
            <div className="text-gray-600">
              <p>{order.shippingAddress?.name}</p>
              <p>{order.shippingAddress?.phone}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
              <p>{order.shippingAddress?.zipCode}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>
        </div>

        {/* ملخص الطلب */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">ملخص الطلب</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">الحالة:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المجموع الفرعي:</span>
                <span className="font-semibold">{order.pricing?.subtotal} جنيه</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الشحن:</span>
                <span className="font-semibold">{order.pricing?.shipping || 0} جنيه</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الضريبة:</span>
                <span className="font-semibold">{order.pricing?.tax || 0} جنيه</span>
              </div>
              {order.pricing?.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>الخصم:</span>
                  <span className="font-semibold">-{order.pricing.discount} جنيه</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between">
                <span className="text-lg font-bold text-gray-900">المجموع الكلي:</span>
                <span className="text-lg font-bold text-[#0B3D2E]">{order.pricing?.total} جنيه</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push(`/admin/orders/${params.id}/edit`)}
            className="w-full flex items-center justify-center gap-2 bg-[#0B3D2E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            <FiEdit className="w-5 h-5" />
            <span>تعديل حالة الطلب</span>
          </button>
        </div>
      </div>
    </div>
  );
}
