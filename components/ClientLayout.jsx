'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import FloatingWidget from './FloatingWidget';
import BackToTop from './BackToTop';
import Preloader from './Preloader';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname ? pathname.startsWith('/dashboard') : false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfd] text-[#1e293b] selection:bg-[#d61c23] selection:text-white">
      <Preloader />
      {!isDashboard && <Header />}
      <main className="flex-1">{children}</main>
      {!isDashboard && <Footer />}
      {!isDashboard && <FloatingWidget />}
      <BackToTop />
    </div>
  );
}
