"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiArrowRight, FiUpload, FiX } from "react-icons/fi";
import Image from "next/image";
import { API_BASE_URL } from "../../../../../lib/api";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchCategory();
  }, [params.id]);

  const fetchCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/categories/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setFormData(data.category);
        if (data.category.image) {
          setImagePreview(data.category.image);
        }
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      formDataToSend.append('name', formData.name);
      if (formData.nameEn) {
        formDataToSend.append('nameEn', formData.nameEn);
      }
      if (formData.description) {
        formDataToSend.append('description', formData.description);
      }
      formDataToSend.append('order', formData.order?.toString() || '0');
      formDataToSend.append('isActive', formData.isActive.toString());

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await fetch(`${API_BASE_URL}/categories/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        alert('تم تحديث الفئة بنجاح!');
        router.push('/admin/categories');
      } else {
        alert(data.message || 'حدث خطأ أثناء تحديث الفئة');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('حدث خطأ أثناء تحديث الفئة');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
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
          <h1 className="text-3xl font-bold text-gray-900">تعديل الفئة</h1>
          <p className="text-gray-600 mt-2">تعديل معلومات الفئة</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* الاسم */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اسم الفئة *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
          />
        </div>

        {/* الوصف */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الوصف
          </label>
          <textarea
            rows={3}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
          />
        </div>

        {/* الصورة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            صورة الفئة
          </label>
          {imagePreview && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-300 mb-4">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}
          {!imagePreview && (
            <label className="block cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#0B3D2E] transition-colors">
              <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-600">اختر صورة</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الترتيب
          </label>
          <input
            type="number"
            min="0"
            value={formData.order || 0}
            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
          />
        </div>

        {/* Active */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">نشط</span>
          </label>
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
