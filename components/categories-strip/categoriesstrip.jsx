'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiChevronLeft } from 'react-icons/fi';
import { categoriesAPI } from '@/lib/api';
import { getImageUrl } from '@/lib/imageUtils';

export default function CategoriesStrip() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await categoriesAPI.getAll();
        if (response.success && response.categories?.length) {
          setCategories(response.categories.slice(0, 6));
        }
      } catch (e) {
        console.error('Error fetching categories:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading || categories.length === 0) return null;

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
          تسوقي حسب الفئة
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const img = cat.image ? getImageUrl(cat.image) : null;
            return (
              <button
                key={cat._id}
                onClick={() => router.push(`/categories/${cat._id}`)}
                className="group flex flex-col items-center p-4 rounded-2xl bg-gray-50 hover:bg-[#0B3D2E]/5 border border-transparent hover:border-[#0B3D2E]/20 transition-all duration-200"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-200 mb-2 ring-2 ring-white shadow-md group-hover:ring-[#0B3D2E]/30 transition-all">
                  {img && img !== '/placeholder.jpg' ? (
                    <Image
                      src={img}
                      alt={cat.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                      {cat.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-[#0B3D2E] line-clamp-2 text-center">
                    {cat.name}
                  </span>
                  <FiChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-[#0B3D2E] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
