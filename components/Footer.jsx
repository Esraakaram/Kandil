'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/lib/navigation';
import { MapPin, Phone, Mail, ArrowLeft, Send } from 'lucide-react';
import { api } from '@/services/api';


export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [citiesData, setCitiesData] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    api.getCitiesWithArea()
      .then((data) => setCitiesData(data))
      .catch((err) => console.error('Error fetching footer data:', err));
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const allAreas = citiesData.flatMap((c) => c.areas || []).slice(0, 6);

  return (
    <footer className="bg-[#150304] text-gray-300 relative overflow-hidden">
      {/* Top Discover / CTA Area */}
      <div className="bg-gradient-to-r from-[#d61c23] via-[#9b1116] to-[#4d0d12] text-white py-12 relative shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
              ابحث عن وحدتك السكنية أو استثمارك القادم مع قنديل
            </h3>
            <p className="text-white/80 text-sm md:text-base font-medium">
              أكثر من 22 عاماً من الريادة والتميز العقاري في أرقى أحياء القاهرة الجديدة والتجمع الخامس.
            </p>
          </div>

          <Link
            to="/unit"
            className="inline-flex items-center gap-2 bg-white text-[#d61c23] hover:bg-[#f59e0b] hover:text-white px-7 py-3.5 rounded-full font-bold text-base shadow-xl transition-all duration-300 hover:scale-105 shrink-0"
          >
            <span>استكشف الوحدات المتاحة</span>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About & Contact */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img
                src="/assets/Images/kd1.png"
                alt="Kandil Real Estate"
                className="h-12 w-auto brightness-200"
                onError={(e) => {
                  (e.target ).style.display = 'none';
                }}
              />
              <span className="text-white font-extrabold text-xl">قنديل للاستثمار العقاري</span>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              شركة قنديل للاستثمار العقاري وإدارة المشروعات، رائدة التطوير العمراني في المدن الجديدة منذ عام 2001 بأسس متينة من الثقة والالتزام والجودة.
            </p>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-[#ea0600] shrink-0 mt-0.5" />
                <span>٢١ مكرم عبيد - مدينة نصر - القاهرة</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 text-[#f59e0b] shrink-0" />
                <a href="tel:19473" className="hover:text-white font-mono text-base font-bold">19473</a>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-[#ea0600] shrink-0" />
                <a href="mailto:info@kandil-realestate.com" className="hover:text-white">info@kandil-realestate.com</a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/kandilrealestateinvestment"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877f2] hover:text-white flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <i className="fa-brands fa-facebook-f text-sm"></i>
              </a>
              <a
                href="https://www.instagram.com/kandil.realestate/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#e4405f] hover:text-white flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <i className="fa-brands fa-instagram text-sm"></i>
              </a>
              <a
                href="https://wa.me/201010099116"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#25d366] hover:text-white flex items-center justify-center transition-colors"
                title="WhatsApp"
              >
                <i className="fa-brands fa-whatsapp text-sm"></i>
              </a>
              <a
                href="https://www.youtube.com/c/KandilRealEstate"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#ff0000] hover:text-white flex items-center justify-center transition-colors"
                title="YouTube"
              >
                <i className="fa-brands fa-youtube text-sm"></i>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-12 after:h-0.5 after:bg-[#ea0600]">
              روابط سريعة
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/home" className="hover:text-white hover:translate-x-[-4px] inline-block transition-transform">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/whyus" className="hover:text-white hover:translate-x-[-4px] inline-block transition-transform">
                  لماذا قنديل
                </Link>
              </li>
              <li>
                <Link to="/projectcategory" className="hover:text-white hover:translate-x-[-4px] inline-block transition-transform">
                  المشروعات السكنية
                </Link>
              </li>
              <li>
                <Link to="/unit" className="hover:text-white hover:translate-x-[-4px] inline-block transition-transform">
                  الوحدات المتاحة
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-white hover:translate-x-[-4px] inline-block transition-transform">
                  سابقة الأعمال (المشروعات بوحداتها)
                </Link>
              </li>
              <li>
                <Link to="/comprojects" className="hover:text-white hover:translate-x-[-4px] inline-block transition-transform">
                  المشروعات التجارية
                </Link>
              </li>
              <li>
                <Link to="/finishcategory" className="hover:text-white hover:translate-x-[-4px] inline-block transition-transform">
                  التشطيبات والديكور
                </Link>
              </li>
              <li>
                <Link to="/mediaCategories" className="hover:text-white hover:translate-x-[-4px] inline-block transition-transform">
                  المركز الإعلامي
                </Link>
              </li>
              <li>
                <Link to="/callus" className="hover:text-white hover:translate-x-[-4px] inline-block transition-transform">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Areas */}
          <div>
            <h4 className="text-white font-bold text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-12 after:h-0.5 after:bg-[#ea0600]">
              أبرز المناطق
            </h4>
            <ul className="space-y-3 text-sm">
              {allAreas.map((area) => (
                <li key={area.id}>
                  <Link
                    to={`/projectcategory/${area.id}`}
                    className="hover:text-white hover:translate-x-[-4px] inline-block transition-transform"
                  >
                    مشاريع {area.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/projectcategory" className="text-[#ea0600] hover:underline text-xs font-semibold">
                  عرض كل المناطق &larr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Guarantee */}
          <div>
            <h4 className="text-white font-bold text-base mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-12 after:h-0.5 after:bg-[#ea0600]">
              النشرة العقارية
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              اشترك معنا لتصلك أحدث المشروعات والعروض الحصرية للوحدات المتاحة بمقدمات وتسهيلات تنافسية.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ea0600] transition-colors"
                />
                <button
                  type="submit"
                  className="absolute left-1.5 top-1.5 bottom-1.5 px-3 bg-[#d61c23] hover:bg-[#b7151b] text-white rounded-md flex items-center justify-center transition-colors"
                  aria-label="اشتراك"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-[#22c55e] font-semibold">
                  ✓ تم الاشتراك في النشرة البريدية بنجاح!
                </p>
              )}
            </form>

            <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[#f59e0b] font-bold text-xs block mb-1">ضمان قنديل للالتزام</span>
              <p className="text-gray-400 text-xs">
                التزام صارم بمواعيد التسليم ودقة في المواصفات الهندسية لجميع مشروعاتنا.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 py-6 text-xs text-gray-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            جميع الحقوق محفوظة © {currentYear} شركة قنديل للاستثمار العقاري وإدارة المشروعات
          </p>
          <div className="flex items-center gap-4">
            <Link to="/whyus" className="hover:text-gray-400">عن الشركة</Link>
            <span>•</span>
            <Link to="/callus" className="hover:text-gray-400">فروعنا</Link>
            <span>•</span>
            <Link to="/dashboard/Login" className="hover:text-gray-400 text-gray-600">تسجيل الدخول</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
