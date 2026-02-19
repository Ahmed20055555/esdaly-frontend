'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronRight, FiStar } from 'react-icons/fi';
import { productsAPI } from '@/lib/api';
import { getFirstImageUrl } from '@/lib/imageUtils';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await productsAPI.getAll({ featured: true, limit: 8 });
        if (res.success && res.products?.length) {
          setProducts(
            res.products.map((p) => ({
              id: p._id,
              name: p.name,
              price: p.price,
              comparePrice: p.comparePrice,
              image: getFirstImageUrl(p.images),
              rating: p.rating?.average ?? 0,
            }))
          );
        }
      } catch (e) {
        console.error('Error fetching featured:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiStar className="w-6 h-6 text-amber-500 fill-amber-500" />
            منتجات مميزة
          </h2>
          <Link
            href="/"
            className="text-[#0B3D2E] font-semibold text-sm flex items-center gap-1 hover:underline"
          >
            كل المنتجات
            <FiChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="group bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-md hover:border-[#0B3D2E]/20 transition-all duration-200"
            >
              <div className="aspect-square relative bg-white overflow-hidden">
                {p.image && p.image !== '/placeholder.jpg' ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width:640px) 50vw, 25vw"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">لا صورة</div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#0B3D2E]">{p.name}</p>
                {p.rating > 0 && (
                  <p className="flex items-center gap-1 text-amber-500 text-xs mt-1">
                    <FiStar className="w-3.5 h-3.5 fill-current" /> {p.rating.toFixed(1)}
                  </p>
                )}
                <p className="text-[#0B3D2E] font-bold text-sm mt-1">{p.price} جنيه</p>
                {p.comparePrice > p.price && (
                  <p className="text-xs text-gray-400 line-through">{p.comparePrice} جنيه</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
