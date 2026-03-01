'use client';
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { FiShoppingCart, FiHeart, FiSearch, FiUser, FiLogOut, FiPackage } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const cart = useSelector((state) => state.cart);
  const favorites = useSelector((state) => state.favorites);
  const cartCount = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
  const favoritesCount = Array.isArray(favorites) ? favorites.length : 0;
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [user, setUser] = useState(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Listen for custom auth event and localStorage changes
    window.addEventListener('auth-change', checkUser);
    return () => window.removeEventListener('auth-change', checkUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // التمرير للأسفل - إخفاء الـ navbar
        setHideNavbar(true);
      } else if (currentScrollY < lastScrollY.current) {
        // التمرير للأعلى - إظهار الـ navbar
        setHideNavbar(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'الفئات', href: '/categories' },
    { name: 'العروض', href: '/offers' },
    { name: 'منتجات مميزة', href: '/featured' },
    { name: 'الأكثر مبيعاً', href: '/bestsellers' },
    { name: 'من نحن', href: '/about' },
    { name: 'اتصل بنا', href: '/contact' },
    { name: 'لوحه التحكم', href: '/admin' },
  ];

  return (
    <nav
      className={`
        z-50 bg-[#0B3D2E] text-white
        transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${hideNavbar ? '-translate-y-full' : 'translate-y-0'}
        ${isScrolled ? 'shadow-lg' : ''}
      `}
    >
      <div className="max-w-7xl mx-auto flex flex-col px-1.5 min-[280px]:px-2 sm:px-4 lg:px-8">

        <div className="flex items-center justify-between h-14 min-[280px]:h-16 md:h-20">

          <div className='flex items-center' >
            <div className="md:hidden flex items-center gap-1 min-[280px]:gap-2">

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 min-[280px]:p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-5 h-5 min-[280px]:w-6 min-[280px]:h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            <div className="flex justify-center items-center gap-1.5 min-[280px]:gap-2">

              <Image
                src="/foto/navbar-fotoo.png"
                alt="logo"
                width={32}
                height={32}
                priority
                className="object-cover w-8 h-8 min-[280px]:w-10 min-[280px]:h-10 rounded-full"
              />

              <div className="flex justify-center">
                <span className="
                  text-base min-[280px]:text-lg md:text-xl lg:text-2xl
                  font-light
                  italic
                  tracking-wide
                  text-white
                  ">
                  ESDALY
                </span>
              </div>

            </div>


          </div>

          <div className="flex items-center gap-2">
            {/* User Menu */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-200"
                  aria-label="Profile"
                  title="الملف الشخصي"
                >
                  <FiUser className="w-4 h-4 text-green-300" />
                  <span className="text-sm font-bold text-white max-w-[120px] truncate">مرحباً، {user.name?.split(' ')[0] || 'مستخدم'}</span>
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                    window.dispatchEvent(new Event('auth-change'));
                    router.push('/');
                  }}
                  className="p-2 text-white hover:text-red-400 hover:bg-white/10 rounded-full transition-colors duration-200"
                  aria-label="Logout"
                  title="تسجيل الخروج"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-white hover:text-green-300 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <FiUser className="w-5 h-5" />
                <span className="text-sm">تسجيل الدخول</span>
              </button>
            )}

            {/* Mobile Icons & Menu Button */}
            <div className="flex gap-1 min-[280px]:gap-1.5 items-center">
              <button
                onClick={() => router.push('/search')}
                className="cursor-pointer p-1 min-[280px]:p-1.5 text-white hover:text-green-300 hover:bg-white/10 rounded-lg transition-colors duration-200"
                aria-label="بحث"
                title="بحث"
              >
                <FiSearch className="w-4 h-4 min-[280px]:w-5 min-[280px]:h-5" />
              </button>
              <button
                onClick={() => router.push('/favorites')}
                className="cursor-pointer p-1 min-[280px]:p-1.5 text-white hover:text-green-300 hover:bg-white/10 rounded-lg transition-colors duration-200 relative"
                aria-label="Favorites"
              >
                <FiHeart className="w-4 h-4 min-[280px]:w-5 min-[280px]:h-5" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] min-[280px]:text-xs rounded-full w-4 h-4 min-[280px]:w-5 min-[280px]:h-5 flex items-center justify-center">
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="p-1 min-[280px]:p-1.5 cursor-pointer text-white hover:text-green-300 hover:bg-white/10 rounded-lg transition-colors duration-200 relative"
                aria-label="Cart"
              >
                <FiShoppingCart className="w-4 h-4 min-[280px]:w-5 min-[280px]:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] min-[280px]:text-xs rounded-full w-4 h-4 min-[280px]:w-5 min-[280px]:h-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>

        </div>

        <div className=" hidden w-full border-t border-t border-white/100 py-5 text-center md:flex justify-center items-center ">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                router.push(link.href);
              }}
              className="px-4 py-2 text-sm font-medium text-white hover:text-green-300 hover:bg-white/10 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </div>

      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 min-[280px]:px-3 sm:px-4 pt-2 pb-3 sm:pb-4 space-y-1 bg-[#0B3D2E] border-t border-white/10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                router.push(link.href);
                setIsOpen(false);
              }}
              className="block px-3 min-[280px]:px-4 py-2 min-[280px]:py-2.5 text-sm min-[280px]:text-base font-medium text-white hover:text-green-300 hover:bg-white/10 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              {link.name}
            </a>
          ))}
          {/* Mobile User Menu */}
          {user ? (
            <div className="pt-2 min-[280px]:pt-3 border-t border-white/10 mt-2 space-y-1.5 min-[280px]:space-y-2">
              <div className="px-3 min-[280px]:px-4 py-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                  <FiUser className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-green-300">مرحباً بك</span>
                  <span className="text-sm font-bold text-white truncate max-w-[150px]">{user.name}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  router.push('/profile');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 min-[280px]:gap-3 px-3 min-[280px]:px-4 py-2 min-[280px]:py-2.5 text-sm min-[280px]:text-base text-white hover:text-green-300 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <FiUser className="w-4 h-4 min-[280px]:w-5 min-[280px]:h-5 flex-shrink-0" />
                <span className="truncate">الملف الشخصي</span>
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  setUser(null);
                  window.dispatchEvent(new Event('auth-change'));
                  setIsOpen(false);
                  router.push('/');
                }}
                className="w-full flex items-center gap-2 min-[280px]:gap-3 px-3 min-[280px]:px-4 py-2 min-[280px]:py-2.5 text-sm min-[280px]:text-base text-white hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <FiLogOut className="w-4 h-4 min-[280px]:w-5 min-[280px]:h-5 flex-shrink-0" />
                <span className="truncate">تسجيل الخروج</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                router.push('/login');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 min-[280px]:gap-3 px-3 min-[280px]:px-4 py-2 min-[280px]:py-2.5 text-sm min-[280px]:text-base text-white hover:text-green-300 hover:bg-white/10 rounded-lg transition-colors duration-200 mt-2 min-[280px]:mt-3 border-t border-white/10 pt-2 min-[280px]:pt-3"
            >
              <FiUser className="w-4 h-4 min-[280px]:w-5 min-[280px]:h-5 flex-shrink-0" />
              <span className="truncate">تسجيل الدخول</span>
            </button>
          )}

          {/* Mobile Icons in Menu */}
          <div className="flex items-center justify-center gap-3 min-[280px]:gap-4 pt-2 min-[280px]:pt-3 border-t border-white/10 mt-2">
            <button
              onClick={() => {
                router.push('/favorites');
                setIsOpen(false);
              }}
              className="p-1.5 min-[280px]:p-2 text-white hover:text-green-300 hover:bg-white/10 rounded-lg transition-colors duration-200 relative"
              aria-label="Favorites"
            >
              <FiHeart className="w-4 h-4 min-[280px]:w-5 min-[280px]:h-5" />
              {favoritesCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] min-[280px]:text-xs rounded-full w-4 h-4 min-[280px]:w-5 min-[280px]:h-5 flex items-center justify-center">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                router.push('/cart');
                setIsOpen(false);
              }}
              className="p-1.5 min-[280px]:p-2 text-white hover:text-green-300 hover:bg-white/10 rounded-lg transition-colors duration-200 relative"
              aria-label="Cart"
            >
              <FiShoppingCart className="w-4 h-4 min-[280px]:w-5 min-[280px]:h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] min-[280px]:text-xs rounded-full w-4 h-4 min-[280px]:w-5 min-[280px]:h-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>



    </nav >
  );
}
