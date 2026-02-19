'use client';
import Link from 'next/link';
import { FiChevronLeft } from 'react-icons/fi';

/**
 * items: [{ label: string, href?: string }]
 * آخر عنصر عادة بدون href (الصفحة الحالية)
 */
export default function Breadcrumbs({ items }) {
  if (!items?.length) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap py-2" aria-label="مسار التنقل">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <FiChevronLeft className="w-4 h-4 text-gray-400 rotate-180" aria-hidden />}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-[#0B3D2E] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-medium text-gray-900' : ''}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
