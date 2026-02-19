'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0B3D2E] via-[#0d4a38] to-[#0a3328] text-white">
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* النص */}
          <div className="flex-1 text-center lg:text-right order-2 lg:order-1">
            <p className="text-green-200 text-sm sm:text-base font-medium mb-2 sm:mb-3 tracking-wide">
              متجرك الأول للسديلات والعبايات
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
              أناقة تليق
              <span className="block text-green-300 mt-1">بكِ</span>
            </h1>
            <p className="text-white/90 text-base sm:text-lg max-w-xl mx-auto lg:mr-0 mb-6 sm:mb-8">
              تشكيلات حصرية من الحجاب والعبايات بجودة عالية وأسعار مناسبة. اكتشفي أحدث الموديلات واطلبي براحة من منزلك.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
              <button
                onClick={() => router.push('/')}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#0B3D2E] font-semibold rounded-xl hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                تسوقي الآن
              </button>
              <button
                onClick={() => router.push('/offers')}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200"
              >
                العروض الخاصة
              </button>
            </div>
          </div>

          {/* الصورة / أيقونة */}
          <div className="flex-1 flex justify-center lg:justify-start order-1 lg:order-2">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72">
              <Image
                src="/foto/navbar-fotoo.png"
                alt="ESDALY"
                width={280}
                height={280}
                className="object-cover rounded-3xl shadow-2xl border-4 border-white/20"
              />
              <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-green-400/30 rounded-2xl blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
