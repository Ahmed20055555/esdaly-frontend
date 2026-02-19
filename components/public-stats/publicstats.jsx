'use client';
import { useEffect, useState } from 'react';
import { FiPackage, FiGrid, FiShoppingBag, FiStar } from 'react-icons/fi';
import { statsAPI } from '../../../lib/api';

const items = [
  { key: 'productsCount', label: 'منتج', icon: FiPackage },
  { key: 'categoriesCount', label: 'فئة', icon: FiGrid },
  { key: 'ordersCount', label: 'طلب مُنفّذ', icon: FiShoppingBag },
  { key: 'featuredCount', label: 'منتج مميز', icon: FiStar },
];

export default function PublicStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await statsAPI.getPublic();
        if (res.success && res.stats) setStats(res.stats);
      } catch (e) {
        console.error('Error fetching public stats:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading || !stats) return null;

  return (
    <section className="py-8 sm:py-10 bg-[#0B3D2E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-white/95">
          أرقام تتحدث عننا
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map(({ key, label, icon: Icon }) => {
            const value = stats[key] ?? 0;
            return (
              <div
                key={key}
                className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-200"
              >
                <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-green-300 mb-2" />
                <span className="text-2xl sm:text-3xl font-bold tabular-nums">{value.toLocaleString('ar-EG')}</span>
                <span className="text-sm text-white/80 mt-1">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
