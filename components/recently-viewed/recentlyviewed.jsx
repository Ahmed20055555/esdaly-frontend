'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiEye, FiTrash2 } from 'react-icons/fi';

const STORAGE_KEY = 'esdaly_recently_viewed';
const MAX_ITEMS = 8;

export function saveRecentlyViewed(item) {
  if (typeof window === 'undefined') return;
  try {
    let list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    list = list.filter((i) => i.id !== item.id);
    list.unshift({
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
    });
    list = list.slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('saveRecentlyViewed', e);
  }
}

export default function RecentlyViewed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setItems([]);
    }
  }, []);


  function removeFromRecentlyViewed(id) {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const newItems = JSON.parse(raw).filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    setItems(newItems);
  }

  if (items.length === 0) return null;

  return (
    <section className="py-6 sm:py-8 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FiEye className="w-5 h-5 text-[#0B3D2E]" />
          شاهدته مؤخراً
        </h2>

        <div className="flex flex-wrap justify-center md:justify-start gap-5 overflow-x-auto pb-2 scrollbar-hide">
          {items.map((item) => (

            <>

              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="w-45 group flex flex-col rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  {item.image && item.image !== '/placeholder.jpg' ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={144}
                      height={144}
                      className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">لا صورة</div>
                  )}
                </div>

                <div className="flex items-center justify-between px-3 py-2 bg-white-500">

                  <div className="flex items-center flex-col text-gray-900">
                    <p className="text-xs font-medium line-clamp-2">{item.name}</p>
                    <p className="font-bold text-xs text-green-500 ">{item.price} جنيه</p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromRecentlyViewed(item.id); }}
                    className=" cursor-pointer text-gray-500 hover:text-gray-700 p-1"
                    aria-label="إزالة من شاهدته مؤخراً"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>

                </div>


              </Link>




            </>


          ))}
        </div>

      </div>
    </section>
  );
}
