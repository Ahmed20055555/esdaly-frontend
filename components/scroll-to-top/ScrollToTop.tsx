"use client";

import React, { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;

            setScrollProgress(Number(scroll));

            if (totalScroll > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div
            className={`fixed bottom-24 right-6 sm:right-8 z-50 transition-all duration-500 ease-in-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
                }`}
        >
            <button
                onClick={scrollToTop}
                className="relative group flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                aria-label="العودة للأعلى"
            >
                {/* Progress SVG */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        className="text-gray-200 stroke-current"
                        strokeWidth="6"
                        cx="50"
                        cy="50"
                        r="46"
                        fill="transparent"
                    ></circle>
                    <circle
                        className="text-[#E5B869] stroke-current transition-all duration-300 ease-out drop-shadow-md"
                        strokeWidth="6"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="46"
                        fill="transparent"
                        strokeDasharray={`${scrollProgress * 289} 289`}
                    ></circle>
                </svg>

                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center text-[#0B3D2E] group-hover:text-[#E5B869] transition-colors">
                    <FiArrowUp className="w-5 h-5 group-hover:animate-bounce" />
                </div>
            </button>
        </div>
    );
}
