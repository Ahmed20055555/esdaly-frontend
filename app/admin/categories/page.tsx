"use client";
import { useEffect, useMemo, useState } from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getImageUrl } from "../../../lib/imageUtils";
import { API_BASE_URL } from "../../../lib/api";

export default function AdminCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log("categories", data);
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoriesfixed = useMemo(() => {
    return categories.map((category: any) => {
      return {
        ...category,
        image: category.image ? getImageUrl(category.image) : '/placeholder.jpg'
      };
    });
  }, [categories]);



  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setCategories(categories.filter((c: any) => c._id !== id));
        alert('تم حذف الفئة بنجاح');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('حدث خطأ أثناء حذف الفئة');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3D2E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الفئات</h1>
          <p className="text-gray-600 mt-2">إدارة جميع الفئات</p>
        </div>
        <button
          onClick={() => router.push('/admin/categories/new')}
          className="flex items-center gap-2 bg-[#0B3D2E] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          <span>إضافة فئة جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesfixed.map((category: any) => (
          <div
            key={category._id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
          >
            {category.image && category.image !== '/placeholder.jpg' && (
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded-full ${category.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {category.isActive ? 'نشط' : 'غير نشط'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/admin/categories/${category._id}/edit`)}
                    className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg"
                  >
                    <FiEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500">لا توجد فئات</p>
        </div>
      )}
    </div>
  );
}
