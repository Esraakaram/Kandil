'use client';

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from '@/lib/navigation';
import { Phone, Menu, X, ChevronDown, MapPin } from 'lucide-react';
import { api } from '@/services/api';


export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const [citiesData, setCitiesData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    api.getCitiesWithArea()
      .then((data) => setCitiesData(data))
      .catch((err) => console.error('Error fetching header areas:', err));
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProjectsDropdownOpen(false);
    setMobileSubmenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/home' && (location.pathname === '/' || location.pathname === '/home')) return true;
    return location.pathname.startsWith(path);
  };

  const allAreas = citiesData.flatMap((c) => c.areas || []);

  return (
    <>
      {/* Top Bar for Desktop */}
      <div className="bg-[#1a0406] text-gray-300 text-xs py-2 border-b border-[#3a080c] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-white/90">
              <MapPin className="w-3.5 h-3.5 text-[#ea0600]" />
              ٢١ مكرم عبيد - مدينة نصر - القاهرة
            </span>
            <span className="text-white/60">|</span>
            <span className="text-white/80">الخط الساخن: <strong className="text-[#f59e0b] font-bold">19473</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/kandilrealestateinvestment" target="_blank" rel="noreferrer" className="hover:text-[#ea0600] transition-colors" title="Facebook">
              <i className="fa-brands fa-facebook-f text-sm"></i>
            </a>
            <a href="https://www.instagram.com/kandil.realestate/" target="_blank" rel="noreferrer" className="hover:text-[#ea0600] transition-colors" title="Instagram">
              <i className="fa-brands fa-instagram text-sm"></i>
            </a>
            <a href="https://www.youtube.com/c/KandilRealEstate" target="_blank" rel="noreferrer" className="hover:text-[#ea0600] transition-colors" title="YouTube">
              <i className="fa-brands fa-youtube text-sm"></i>
            </a>
            <a href="https://wa.me/201010099116" target="_blank" rel="noreferrer" className="hover:text-[#ea0600] transition-colors" title="WhatsApp">
              <i className="fa-brands fa-whatsapp text-sm"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 backdrop-blur-md py-4 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-3 group">
            <img
              src="/assets/Images/kd1.png"
              alt="Kandil Real Estate"
              className="h-11 md:h-13 w-auto object-contain transition-transform group-hover:scale-102"
              onError={(e) => {
                // fallback to text if image unavailable
                (e.target ).style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="text-[#d61c23] font-extrabold text-lg md:text-xl leading-tight tracking-tight">
                قنديل
              </span>
              <span className="text-gray-500 text-[10px] md:text-xs font-semibold">
                للاستثمار العقاري
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              to="/home"
              className={`font-semibold text-sm transition-colors py-1 ${
                isActive('/home') ? 'text-[#d61c23] border-b-2 border-[#d61c23]' : 'text-gray-700 hover:text-[#d61c23]'
              }`}
            >
              الرئيسية
            </Link>

            <Link
              to="/whyus"
              className={`font-semibold text-sm transition-colors py-1 ${
                isActive('/whyus') ? 'text-[#d61c23] border-b-2 border-[#d61c23]' : 'text-gray-700 hover:text-[#d61c23]'
              }`}
            >
              لماذا قنديل
            </Link>

            {/* Projects with Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setProjectsDropdownOpen(true)}
              onMouseLeave={() => setProjectsDropdownOpen(false)}
            >
              <button
                className={`font-semibold text-sm flex items-center gap-1 transition-colors py-1 ${
                  isActive('/projectcategory') || isActive('/unit') || isActive('/comprojects')
                    ? 'text-[#d61c23] border-b-2 border-[#d61c23]'
                    : 'text-gray-700 hover:text-[#d61c23]'
                }`}
              >
                <span>المشروعات</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>

              {/* Submenu Dropdown */}
              {projectsDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    to="/unit"
                    className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#d61c23]/5 hover:text-[#d61c23] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span>الوحدات المتاحة</span>
                      <span className="text-[11px] bg-[#d61c23]/10 text-[#d61c23] px-2 py-0.5 rounded-full font-bold">54+</span>
                    </div>
                  </Link>

                  <Link
                    to="/comprojects"
                    className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#d61c23]/5 hover:text-[#d61c23] transition-colors"
                  >
                    <span>المشروعات التجارية والخدمية</span>
                  </Link>

                  <Link
                    to="/portfolio"
                    className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#d61c23]/5 hover:text-[#d61c23] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span>سابقة الأعمال والتسليمات</span>
                      <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">منجز</span>
                    </div>
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <Link
                    to="/projectcategory"
                    className="block px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-[#d61c23]"
                  >
                    مشروعات سكنية حسب المنطقة
                  </Link>

                  <div className="max-h-56 overflow-y-auto">
                    {allAreas.map((area) => (
                      <Link
                        key={area.id}
                        to={`/projectcategory/${area.id}`}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-[#d61c23]/5 hover:text-[#d61c23] transition-colors"
                      >
                        {area.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/portfolio"
              className={`font-semibold text-sm transition-colors py-1 ${
                isActive('/portfolio') || isActive('/unit/paid') ? 'text-[#d61c23] border-b-2 border-[#d61c23]' : 'text-gray-700 hover:text-[#d61c23]'
              }`}
            >
              سابقة الأعمال
            </Link>

            <Link
              to="/finishcategory"
              className={`font-semibold text-sm transition-colors py-1 ${
                isActive('/finishcategory') ? 'text-[#d61c23] border-b-2 border-[#d61c23]' : 'text-gray-700 hover:text-[#d61c23]'
              }`}
            >
              التشطيبات
            </Link>

            <Link
              to="/mediaCategories"
              className={`font-semibold text-sm transition-colors py-1 ${
                isActive('/mediaCategories') ? 'text-[#d61c23] border-b-2 border-[#d61c23]' : 'text-gray-700 hover:text-[#d61c23]'
              }`}
            >
              المركز الإعلامي
            </Link>

            <Link
              to="/callus"
              className={`font-semibold text-sm transition-colors py-1 ${
                isActive('/callus') ? 'text-[#d61c23] border-b-2 border-[#d61c23]' : 'text-gray-700 hover:text-[#d61c23]'
              }`}
            >
              اتصل بنا
            </Link>
          </nav>

          {/* Hotline CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="tel:19473"
              className="hidden sm:inline-flex items-center gap-2 bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-md transition-all hover:scale-103"
            >
              <Phone className="w-4 h-4 text-[#f59e0b] animate-pulse" />
              <span className="font-mono text-base tracking-wider">19473</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-[#d61c23] rounded-md transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Off-Canvas Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto p-5">
            <div>
              {/* Drawer Header */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <Link to="/home" className="flex items-center gap-2">
                  <img src="/assets/Images/kd1.png" alt="Logo" className="h-10 w-auto" />
                  <span className="text-[#d61c23] font-extrabold text-base">قنديل للاستثمار العقاري</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-4 space-y-1">
                <Link
                  to="/home"
                  className="block px-3 py-2.5 rounded-lg text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-[#d61c23]"
                >
                  الرئيسية
                </Link>

                <Link
                  to="/whyus"
                  className="block px-3 py-2.5 rounded-lg text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-[#d61c23]"
                >
                  لماذا قنديل
                </Link>

                {/* Submenu Accordion */}
                <div>
                  <button
                    onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-[#d61c23]"
                  >
                    <span>المشروعات</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${mobileSubmenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileSubmenuOpen && (
                    <div className="pr-4 pl-2 space-y-1 py-1 border-r-2 border-[#d61c23]/30 mr-3">
                      <Link
                        to="/unit"
                        className="block px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[#d61c23]"
                      >
                        الوحدات المتاحة
                      </Link>
                      <Link
                        to="/comprojects"
                        className="block px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[#d61c23]"
                      >
                        المشروعات التجارية والخدمية
                      </Link>
                      <Link
                        to="/projectcategory"
                        className="block px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[#d61c23]"
                      >
                        مشروعات سكنية حسب المنطقة
                      </Link>
                      {allAreas.map((area) => (
                        <Link
                          key={area.id}
                          to={`/projectcategory/${area.id}`}
                          className="block px-3 py-1.5 text-xs text-gray-600 hover:text-[#d61c23]"
                        >
                          • {area.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/portfolio"
                  className="block px-3 py-2.5 rounded-lg text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-[#d61c23]"
                >
                  سابقة الأعمال
                </Link>

                <Link
                  to="/finishcategory"
                  className="block px-3 py-2.5 rounded-lg text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-[#d61c23]"
                >
                  التشطيبات
                </Link>

                <Link
                  to="/mediaCategories"
                  className="block px-3 py-2.5 rounded-lg text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-[#d61c23]"
                >
                  المركز الإعلامي
                </Link>

                <Link
                  to="/callus"
                  className="block px-3 py-2.5 rounded-lg text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-[#d61c23]"
                >
                  اتصل بنا
                </Link>

                <Link
                  to="/dashboard"
                  className="block px-3 py-2.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-[#d61c23]"
                >
                  لوحة التحكم (Admin)
                </Link>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-gray-100">
              <a
                href="tel:19473"
                className="flex items-center justify-center gap-2 w-full bg-[#d61c23] text-white font-bold py-3 rounded-lg shadow"
              >
                <Phone className="w-5 h-5 text-[#f59e0b]" />
                <span>الخط الساخن: 19473</span>
              </a>

              <div className="flex justify-center gap-5 mt-4 text-gray-500">
                <a href="https://www.facebook.com/kandilrealestateinvestment" target="_blank" rel="noreferrer">
                  <i className="fa-brands fa-facebook-f text-lg"></i>
                </a>
                <a href="https://www.instagram.com/kandil.realestate/" target="_blank" rel="noreferrer">
                  <i className="fa-brands fa-instagram text-lg"></i>
                </a>
                <a href="https://wa.me/201010099116" target="_blank" rel="noreferrer">
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                </a>
                <a href="https://www.youtube.com/c/KandilRealEstate" target="_blank" rel="noreferrer">
                  <i className="fa-brands fa-youtube text-lg"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
