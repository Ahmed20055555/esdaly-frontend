"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/fotter";


export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // إخفاء Navbar و Footer في صفحات Admin
  const isAdminPage = pathname?.startsWith('/admin');
  
  if (isAdminPage) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Navbar />
      {children}
      <Footer />

    </>
  );
}
