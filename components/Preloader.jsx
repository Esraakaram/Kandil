'use client';

import React, { useState, useEffect } from 'react';

export const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-300 pointer-events-none opacity-90">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#d61c23]/20 border-t-[#d61c23] rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-gray-500 animate-pulse">قنديل للاستثمار العقاري...</p>
      </div>
    </div>
  );
};

export default Preloader;
