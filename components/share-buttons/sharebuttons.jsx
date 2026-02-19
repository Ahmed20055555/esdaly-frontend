'use client';
import { useState } from 'react';
import { FiShare2, FiCheck } from 'react-icons/fi';

export default function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== 'undefined' ? window.location.origin + (url || '') : url || '';
  const text = title ? `${title} - ESDALY` : 'شوف المنتج على ESDALY';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + fullUrl)}`;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-600">مشاركة:</span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
        aria-label="مشاركة عبر واتساب"
      >
        واتساب
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
        aria-label="نسخ الرابط"
      >
        {copied ? <FiCheck className="w-4 h-4 text-green-600" /> : <FiShare2 className="w-4 h-4" />}
        {copied ? 'تم النسخ' : 'نسخ الرابط'}
      </button>
    </div>
  );
}
