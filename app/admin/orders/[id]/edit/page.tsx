"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import { API_BASE_URL } from "../../../../../lib/api";

export default function EditOrderPage() {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    trackingNumber: '',
    estimatedDelivery: ''
  });

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
        setFormData({
          status: data.order.status,
          trackingNumber: data.order.shipping?.trackingNumber || '',
          estimatedDelivery: data.order.shipping?.estimatedDelivery ? new Date(data.order.shipping.estimatedDelivery).toISOString().split('T')[0] : ''
        });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/orders/${params.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('تم تحديث حالة الطلب بنجاح!');
        router.push(`/admin/orders/${params.id}`);
      } else {
        alert(data.message || 'حدث خطأ أثناء تحديث الطلب');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('حدث خطأ أثناء تحديث الطلب');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3D2E]"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">تعديل حالة الطلب</h1>
          <p className="text-gray-600 mt-2">رقم الطلب: {order.orderNumber}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* الحالة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            حالة الطلب *
          </label>
          <select
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
          >
            <option value="pending">قيد الانتظار</option>
            <option value="confirmed">مؤكد</option>
            <option value="processing">قيد المعالجة</option>
            <option value="shipped">تم الشحن</option>
            <option value="delivered">تم التسليم</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>

        {/* رقم التتبع */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رقم التتبع
          </label>
          <input
            type="text"
            value={formData.trackingNumber}
            onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
            placeholder="رقم التتبع"
          />
        </div>

        {/* تاريخ التسليم المتوقع */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تاريخ التسليم المتوقع
          </label>
          <input
            type="date"
            value={formData.estimatedDelivery}
            onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-[#0B3D2E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
