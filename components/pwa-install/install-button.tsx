'use client';

import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";

const InstallPWAButton = () => {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setPromptInstall(e);
            setSupportsPWA(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstallClick = async () => {
        if (!promptInstall) {
            return;
        }

        promptInstall.prompt();
        const { outcome } = await promptInstall.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        setPromptInstall(null);
        setSupportsPWA(false);
    };

    if (!supportsPWA) {
        return null;
    }

    return (
        <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-2 py-1 md:px-3 md:py-1.5 bg-[#4CAF50] hover:bg-[#45a049] text-white border border-[#4CAF50]/50 rounded-full transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
            title="تنزيل التطبيق"
        >
            <FiDownload className="w-4 h-4 md:w-5 md:h-5 drop-shadow-sm" />
            <span className="text-[10px] md:text-sm font-bold truncate hidden min-[350px]:block drop-shadow-sm">تنزيل التطبيق</span>
        </button>
    );
};

export default InstallPWAButton;
