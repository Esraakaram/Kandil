'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';

export const FloatingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Channel List */}
      {isOpen && (
        <div className="mb-3 flex flex-col gap-2.5 items-end animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Hotline Call */}
          <a
            href="tel:19473"
            className="flex items-center gap-2.5 bg-white text-gray-800 px-3.5 py-2 rounded-full shadow-lg border border-gray-100 hover:bg-[#d61c23] hover:text-white transition-all group"
            title="اتصل بالخط الساخن"
          >
            <span className="text-xs font-bold font-mono">19473</span>
            <div className="w-8 h-8 rounded-full bg-[#d61c23] text-white flex items-center justify-center group-hover:bg-white group-hover:text-[#d61c23] transition-colors">
              <Phone className="w-4 h-4 text-[#f59e0b]" />
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/201010099116"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 bg-white text-gray-800 px-3.5 py-2 rounded-full shadow-lg border border-gray-100 hover:bg-[#25d366] hover:text-white transition-all group"
            title="محادثة واتساب"
          >
            <span className="text-xs font-bold">واتساب مبيعات</span>
            <div className="w-8 h-8 rounded-full bg-[#25d366] text-white flex items-center justify-center">
              <i className="fa-brands fa-whatsapp text-lg"></i>
            </div>
          </a>

          {/* Facebook Messenger */}
          <a
            href="https://www.facebook.com/kandilrealestateinvestment"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 bg-white text-gray-800 px-3.5 py-2 rounded-full shadow-lg border border-gray-100 hover:bg-[#1877f2] hover:text-white transition-all group"
            title="فيسبوك ماسنجر"
          >
            <span className="text-xs font-bold">فيسبوك</span>
            <div className="w-8 h-8 rounded-full bg-[#1877f2] text-white flex items-center justify-center">
              <i className="fa-brands fa-facebook-messenger text-base"></i>
            </div>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/kandil.realestate/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 bg-white text-gray-800 px-3.5 py-2 rounded-full shadow-lg border border-gray-100 hover:bg-[#e4405f] hover:text-white transition-all group"
            title="انستجرام"
          >
            <span className="text-xs font-bold">انستجرام</span>
            <div className="w-8 h-8 rounded-full bg-[#e4405f] text-white flex items-center justify-center">
              <i className="fa-brands fa-instagram text-base"></i>
            </div>
          </a>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-[#d61c23] to-[#d61c23] text-white shadow-2xl flex items-center justify-center hover:scale-108 transition-transform duration-200 border-2 border-white focus:outline-none cursor-pointer"
        aria-label="تواصل معنا"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative flex items-center justify-center">
            <MessageCircle className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#f59e0b] rounded-full border-2 border-white animate-pulse"></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default FloatingWidget;
