'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 z-40 w-11 h-11 rounded-full bg-[#d61c23]/90 hover:bg-[#d61c23] text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/20 focus:outline-none cursor-pointer"
      title="الرجوع للأعلى"
      aria-label="الرجوع للأعلى"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default BackToTop;
