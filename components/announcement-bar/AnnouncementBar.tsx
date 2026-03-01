"use client";

import React, { useState, useEffect } from "react";
import { FiX, FiGift, FiTruck } from "react-icons/fi";

const announcements = [
    {
        icon: <FiGift className="w-4 h-4" />,
        text: "خصم 20% على جميع الإسدالات بمناسبة شهر رمضان المبارك!",
    },
    {
        icon: <FiTruck className="w-4 h-4" />,
        text: "توصيل مجاني للطلبات أكثر من 1000 جنيه!",
    },
];

export default function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!isVisible) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % announcements.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="bg-[#0B3D2E] text-white py-2 px-4 relative flex items-center justify-center overflow-hidden z-50">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at center, #ffffff 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div>
            <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#0B3D2E] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#0B3D2E] to-transparent z-10"></div>

            <div className="flex items-center gap-2 text-sm sm:text-base font-medium relative z-10 animate-[fade-in-up_0.5s_ease-out]">
                <span className="text-[#E5B869]">{announcements[currentIndex].icon}</span>
                <span className="text-center">{announcements[currentIndex].text}</span>
            </div>

            <button
                onClick={() => setIsVisible(false)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors z-20 text-gray-300 hover:text-white"
                aria-label="إغلاق"
            >
                <FiX className="w-4 h-4" />
            </button>

            <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
