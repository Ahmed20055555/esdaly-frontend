"use client";

import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Simple delay before showing the button
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <style jsx>{`
                @keyframes float-up-down {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float-up-down 3s ease-in-out infinite;
                }
            `}</style>

            <div className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[60] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-0'}`}>
                <a
                    href="https://wa.me/201552255167"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#1DA851] transition-colors duration-300 animate-float group"
                    aria-label="تواصل معنا عبر واتساب"
                >
                    <FaWhatsapp className="w-7 h-7 sm:w-8 sm:h-8" />

                    {/* Tooltip */}
                    <span className="hidden sm:block absolute right-[100%] mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white text-gray-800 text-sm font-bold rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                        تواصل معنا
                        {/* Arrow */}
                        <span className="absolute -right-2 top-1/2 -translate-y-1/2 border-8 border-transparent border-l-white"></span>
                    </span>
                </a>
            </div>
        </>
    );
}
