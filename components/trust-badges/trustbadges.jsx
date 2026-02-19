'use client';
import { FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

const badges = [
  {
    icon: FiTruck,
    title: 'شحن سريع',
    description: 'توصيل لجميع المحافظات',
  },
  {
    icon: FiShield,
    title: 'دفع آمن',
    description: 'معاملاتك محمية',
  },
  {
    icon: FiRefreshCw,
    title: 'إرجاع سهل',
    description: 'خلال 14 يوم',
  },
  {
    icon: FiHeadphones,
    title: 'دعم متواصل',
    description: 'نحن هنا لمساعدتك',
  },
];

export default function TrustBadges() {
  return (
    <section className="py-6 sm:py-8 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {badges.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-center gap-3 sm:gap-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-[#0B3D2E]/10 transition-all duration-200"
            >
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0B3D2E]/10 flex items-center justify-center text-[#0B3D2E]">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{title}</h3>
                <p className="text-xs sm:text-sm text-gray-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
