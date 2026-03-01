"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiUpload, FiX } from "react-icons/fi";
import Image from "next/image";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    description: "",
    parentCategory: "",
    order: "0",
    isActive: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      if (formData.parentCategory) {
        formDataToSend.append('parentCategory', formData.parentCategory);
      }
      formDataToSend.append('order', formData.order);
      formDataToSend.append('isActive', formData.isActive.toString());

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await fetch('' + (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api').replace('/api', '') + '/api/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        alert('تم إنشاء الفئة بنجاح!');
        router.push('/admin/categories');
      } else {
        const errorMsg = data.error || data.message || 'حدث خطأ أثناء إنشاء الفئة';
        const details = data.details ? `\nالتفاصيل: ${data.details}` : '';
        const hint = data.hint ? `\n💡 تلميح: ${data.hint}` : '';
        const full = data.fullError ? `\nخطأ مفصل: ${JSON.stringify(data.fullError, null, 2)}` : '';
        alert(`${errorMsg}${details}${hint}${full}`);
      }
    } catch (error: any) {
      console.error('Error creating category:', error);
      alert(`حدث خطأ أثناء إنشاء الفئة: ${error.message || 'Error'}`);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">إضافة فئة جديدة</h1>
          <p className="text-gray-600 mt-2">أضف فئة جديدة للمتجر</p>
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
            placeholder="اسم الفئة"
          />
        </div>

        {/* الاسم بالإنجليزية */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الاسم بالإنجليزية
          </label>
          <input
            type="text"
            value={formData.nameEn}
            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
            placeholder="Category Name (English)"
          />
        </div>

        {/* الوصف */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الوصف
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
            placeholder="وصف الفئة"
          />
        </div>

        {/* الصورة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            صورة الفئة
          </label>
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
          {imagePreview && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-300">
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
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الترتيب
          </label>
          <input
            type="number"
            min="0"
            value={formData.order}
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
            disabled={loading}
            className="flex-1 bg-[#0B3D2E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? "جاري الحفظ..." : "حفظ الفئة"}
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
