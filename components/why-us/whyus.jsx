'use client';
import { FiAward, FiHeart, FiZap, FiShield } from 'react-icons/fi';

const points = [
  {
    icon: FiAward,
    title: 'جودة مضمونة',
    description: 'اختيارنا لأجود الخامات والتفاصيل لراحتكِ وأناقتكِ',
  },
  {
    icon: FiHeart,
    title: 'تصاميم حصرية',
    description: 'تشكيلات تناسب ذوقكِ وتواكب الموضة الإسلامية',
  },
  {
    icon: FiZap,
    title: 'تجربة سلسة',
    description: 'طلب من البيت وتوصيل سريع لجميع المحافظات',
  },
  {
    icon: FiShield,
    title: 'ثقة وأمان',
    description: 'دفع آمن وضمان إرجاع لراحة بالكِ',
  },
];

export default function WhyUs() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
          ليه تختارين ESDALY؟
        </h2>
        <p className="text-gray-600 text-center mb-10 sm:mb-12 max-w-xl mx-auto">
          نلتزم بتجربة تسوق مريحة وجودة تستحقينها
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {points.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group text-center p-6 rounded-2xl bg-gray-50 hover:bg-[#0B3D2E]/5 border border-transparent hover:border-[#0B3D2E]/10 transition-all duration-300"
            >
              <div className="inline-flex w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0B3D2E]/10 text-[#0B3D2E] items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
