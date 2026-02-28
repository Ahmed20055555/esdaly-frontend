"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiUpload, FiX } from "react-icons/fi";
import Image from "next/image";
import { API_BASE_URL } from "../../../../lib/api";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    comparePrice: "",
    category: "",
    stock: {
      quantity: "0",
      trackInventory: true,
      lowStockThreshold: "10"
    },
    tags: "",
    isActive: true,
    isFeatured: false
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من البيانات قبل الإرسال
    if (!formData.name || !formData.description || !formData.price) {
      alert('يرجى ملء جميع الحقول المطلوبة (الاسم، الوصف، السعر)');
      return;
    }

    if (images.length === 0) {
      alert('يجب إضافة صورة واحدة على الأقل للمنتج');
      return;
    }

    // الفئة اختيارية - إذا لم تكن هناك فئات، Backend سينشئ فئة افتراضية
    // إذا كانت هناك فئات، يجب اختيار واحدة
    if (categories.length > 0 && !formData.category) {
      alert('يجب اختيار فئة للمنتج');
      return;
    }


    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('shortDescription', formData.shortDescription || '');
      formDataToSend.append('price', formData.price);
      if (formData.comparePrice) {
        formDataToSend.append('comparePrice', formData.comparePrice);
      }

      // إضافة الفئة - إذا لم تكن موجودة، Backend سينشئ فئة افتراضية
      if (formData.category) {
        formDataToSend.append('category', formData.category);
      }
      // إذا لم تكن هناك فئة، Backend سينشئ فئة "عام" تلقائياً

      // إرسال stock كـ fields منفصلة أو JSON
      // Backend يتوقع stock كـ object، لذا نرسله كـ JSON string
      const stockData = {
        quantity: parseInt(formData.stock.quantity.toString()) || 0,
        trackInventory: formData.stock.trackInventory,
        lowStockThreshold: parseInt(formData.stock.lowStockThreshold.toString()) || 10
      };
      formDataToSend.append('stock', JSON.stringify(stockData));

      if (formData.tags) {
        formDataToSend.append('tags', formData.tags);
      }
      formDataToSend.append('isActive', formData.isActive.toString());
      formDataToSend.append('isFeatured', formData.isFeatured.toString());

      // Add images
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const token = localStorage.getItem('token');
      if (!token) {
        alert('يجب تسجيل الدخول أولاً');
        router.push('/admin/login');
        return;
      }

      console.log('📤 Sending product data...');
      console.log('📤 Form data:', {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        imagesCount: images.length
      });

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      let data;
      try {
        const text = await response.text();
        console.log('📥 Response text:', text);
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('❌ Error parsing response:', parseError);
        alert('خطأ في استجابة الخادم. تحقق من console للمزيد من التفاصيل.');
        return;
      }
      console.log('📥 Response data:', data);

      if (!response.ok) {
        // Handle HTTP errors (4xx, 5xx)
        let errorMessage = data.message || 'حدث خطأ أثناء إنشاء المنتج';

        if (response.status === 401) {
          errorMessage = 'غير مصرح لك. يرجى تسجيل الدخول مرة أخرى';
          localStorage.removeItem('token');
          router.push('/admin/login');
        } else if (response.status === 403) {
          errorMessage = 'ليس لديك صلاحية لإضافة منتجات';
        } else if (data.errors && data.errors.length > 0) {
          errorMessage = data.errors.map((err: any) => err.msg || err.message || err).join('\n');
        } else if (data.error) {
          errorMessage = data.error;
        }

        alert(`خطأ ${response.status}: ${errorMessage}`);
        console.error('❌ Backend error:', data);
        return;
      }

      if (data.success) {
        alert('تم إنشاء المنتج بنجاح!');
        router.push('/admin/products');
      } else {
        // عرض رسالة خطأ مفصلة
        let errorMessage = data.message || 'حدث خطأ أثناء إنشاء المنتج';

        if (data.errors && data.errors.length > 0) {
          errorMessage = data.errors.map((err: any) => err.msg || err.message).join('\n');
        }

        alert(errorMessage);
        console.error('Backend error:', data);
      }
    } catch (error: any) {
      console.error('Error creating product:', error);

      if (error.message?.includes('fetch') || error.message?.includes('Failed')) {
        alert('لا يمكن الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
      } else {
        alert('حدث خطأ أثناء إنشاء المنتج: ' + (error.message || 'خطأ غير معروف'));
      }
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
          <h1 className="text-3xl font-bold text-gray-900">إضافة منتج جديد</h1>
          <p className="text-gray-600 mt-2">أضف منتج جديد إلى المتجر</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* الاسم */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اسم المنتج *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
            placeholder="اسم المنتج"
          />
        </div>

        {/* الوصف */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الوصف *
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
            placeholder="وصف المنتج"
          />
        </div>

        {/* الوصف القصير */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الوصف القصير
          </label>
          <textarea
            rows={2}
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
            placeholder="وصف قصير للمنتج"
          />
        </div>

        {/* السعر */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              السعر *
            </label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              السعر قبل الخصم
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.comparePrice}
              onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* الفئة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الفئة {categories.length > 0 && '*'}
          </label>
          {categories.length > 0 ? (
            <select
              required={categories.length > 0}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
            >
              <option value="">اختر الفئة</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
              ⚠️ لا توجد فئات متاحة. يجب إضافة فئة أولاً من لوحة التحكم.
            </div>
          )}
        </div>

        {/* المخزون */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الكمية
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock.quantity}
              onChange={(e) => setFormData({
                ...formData,
                stock: { ...formData.stock, quantity: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حد المخزون المنخفض
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock.lowStockThreshold}
              onChange={(e) => setFormData({
                ...formData,
                stock: { ...formData.stock, lowStockThreshold: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.stock.trackInventory}
                onChange={(e) => setFormData({
                  ...formData,
                  stock: { ...formData.stock, trackInventory: e.target.checked }
                })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">تتبع المخزون</span>
            </label>
          </div>
        </div>

        {/* الصور */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            صور المنتج *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-300">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#0B3D2E] transition-colors">
              <div className="text-center">
                <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-600">إضافة صورة</span>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العلامات (مفصولة بفواصل)
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
            placeholder="حجاب، قطن، أنيق"
          />
        </div>

        {/* Options */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">نشط</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">مميز</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#0B3D2E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? "جاري الحفظ..." : "حفظ المنتج"}
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
