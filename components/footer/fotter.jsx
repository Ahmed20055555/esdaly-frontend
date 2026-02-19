'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMail, FiPhone, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import { useToast } from "@/context/ToastContext";
import { newsletterAPI } from "@/lib/api";

export default function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    } , 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const footerLinks = {
    shop: [
      { name: 'كل المنتجات', href: '/' },
      { name: 'عروض خاصة', href: '/offers' },
      { name: 'منتجات مميزة', href: '/featured' },
      { name: 'الأكثر مبيعاً', href: '/bestsellers' },
      { name: 'الفئات', href: '/categories' },
    ],
    support: [
      { name: 'مركز المساعدة', href: '/help' },
      { name: 'الشحن والتوصيل', href: '/shipping' },
      { name: 'سياسة الإرجاع', href: '/returns' },
      { name: 'دليل المقاسات', href: '/size-guide' },
    ],
    about: [
      { name: 'من نحن', href: '/about' },
      { name: 'قصتنا', href: '/about' },
      { name: 'اتصل بنا', href: '/contact' },
      { name: 'الشروط والأحكام', href: '/terms' },
    ],
  };

  const socialLinks = [
    { icon: FiFacebook, href: '#', label: 'Facebook' },
    { icon: FiInstagram, href: 'https://www.instagram.com/esdaly_hijab?igsh=bXJnbHpsdWNjNHc=', label: 'Instagram' },
    { icon: FiTwitter, href: '#', label: 'Twitter' },
    { icon: FiYoutube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-[#0B3D2E] text-white mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto px-2 min-[280px]:px-3 sm:px-4 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
        {/* Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-6 sm:mb-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 min-[280px]:gap-3 mb-3 sm:mb-4">
              <Image
                src="/foto/navbar-fotoo.png"
                alt="ESDALY Logo"
                width={40}
                height={40}
                className="w-10 h-10 min-[280px]:w-12 min-[280px]:h-12 rounded-full object-cover border-2 border-white/20"
              />
              <span className="text-lg sm:text-xl md:text-2xl font-light italic tracking-wide">
                ESDALY
              </span>
            </div>
            <p className="text-white/80 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
              متجرك المفضل للحجاب والموضة الإسلامية. نقدم لك أفضل المنتجات بجودة عالية وأسعار مناسبة.
            </p>
            {/* Social Media */}
            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">التسوق</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-green-300 transition-colors duration-200 text-xs sm:text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">الدعم</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-green-300 transition-colors duration-200 text-xs sm:text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & About */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">من نحن</h3>
            <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-green-300 transition-colors duration-200 text-xs sm:text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6">
              <div className="flex items-center gap-1.5 sm:gap-2 text-white/80 text-xs sm:text-sm">
                <FiMail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="break-all">info@esdaly.com</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-white/80 text-xs sm:text-sm">
                <FiPhone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="break-all">+966 50 123 4567</span>
              </div>
              <div className="flex items-start gap-1.5 sm:gap-2 text-white/80 text-xs sm:text-sm">
                <FiMapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span>جمهورية مصر العربية</span>
              </div>
              {/* Live Clock */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-white/90 text-xs sm:text-sm font-medium mt-3 sm:mt-4 pt-2 border-t border-white/10">
                <FiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-base sm:text-lg font-semibold tabular-nums">
                  {formatTime(currentTime)}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Newsletter */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
            <div className="text-center sm:text-right">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1">اشتراك في النشرة</h3>
              <p className="text-white/70 text-xs sm:text-sm">تابعي العروض والأحدث أولاً بأول</p>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const email = newsletterEmail.trim();
                if (!email) {
                  showToast('أدخلي بريدك الإلكتروني', 'error');
                  return;
                }
                setNewsletterLoading(true);
                try {
                  const res = await newsletterAPI.subscribe({ email, source: 'footer' });
                  setNewsletterEmail('');
                  showToast(res.message || 'تم تسجيل بريدك بنجاح، سنتواصل معك قريباً');
                } catch (err) {
                  showToast(err.message || 'حدث خطأ، حاولي لاحقاً', 'error');
                } finally {
                  setNewsletterLoading(false);
                }
              }}
              className="flex gap-2 w-full sm:w-auto max-w-md"
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                className="flex-1 min-w-0 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                disabled={newsletterLoading}
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="flex-shrink-0 px-4 py-2.5 rounded-lg bg-white text-[#0B3D2E] font-semibold text-sm hover:bg-green-50 transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {newsletterLoading ? (
                  <span className="w-4 h-4 border-2 border-[#0B3D2E] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    اشتراك
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-4 sm:pt-6 md:pt-8 mt-4 sm:mt-6 md:mt-8">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-white/60 text-xs sm:text-sm text-center md:text-right">
              © {currentYear} ESDALY. جميع الحقوق محفوظة.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center md:justify-end text-xs sm:text-sm">
              <Link href="/privacy" className="text-white/60 hover:text-green-300 transition-colors duration-200 whitespace-nowrap">
                سياسة الخصوصية
              </Link>
              <span className="text-white/20 hidden sm:inline">|</span>
              <Link href="/terms" className="text-white/60 hover:text-green-300 transition-colors duration-200 whitespace-nowrap">
                الشروط والأحكام
              </Link>
              <span className="text-white/20 hidden sm:inline">|</span>
              <Link href="/help" className="text-white/60 hover:text-green-300 transition-colors duration-200 whitespace-nowrap">
                المساعدة
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
