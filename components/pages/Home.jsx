'use client';

 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from '@/lib/navigation';
import {
  Search,

  Bed,
  Bath,
  Maximize2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Award,
  Handshake,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Building2,
  Phone
} from 'lucide-react';
import { api, getImageUrl } from '@/services/api';


export const Home = () => {
  const navigate = useNavigate();

  // State
  const [sliders, setSliders] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [citiesData, setCitiesData] = useState([]);
  const [projectsWithArea, setProjectsWithArea] = useState([]);
  const [featuredUnits, setFeaturedUnits] = useState([]);
  const [whyUsItems, setWhyUsItems] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [landingPage, setLandingPage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search filter bar state
  const [selectedCityId, setSelectedCityId] = useState('1');
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  useEffect(() => {
    Promise.all([
      api.getSliders(),
      api.getCitiesWithArea(),
      api.getProjectsWithArea(),
      api.getFeaturedUnits(),
      api.getWhyUs(),
      api.getMedia(),
      api.getLandingPage().catch(() => null)
    ])
      .then(([slidersRes, citiesRes, projectsRes, unitsRes, whyUsRes, mediaRes, lpRes]) => {
        setSliders(slidersRes);
        setCitiesData(citiesRes);
        setProjectsWithArea(projectsRes);
        setFeaturedUnits(unitsRes);
        setWhyUsItems(whyUsRes);
        setMediaItems(mediaRes);
        if (lpRes) setLandingPage(lpRes);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching home data:', err);
        setLoading(false);
      });
  }, []);

  const validSliders = sliders.filter((s) => s.mediaPath && !s.mediaPath.endsWith('.php'));

  // Slider auto-rotation
  useEffect(() => {
    if (validSliders.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % validSliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [validSliders.length]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (selectedCityId && selectedAreaId) {
      navigate(`/search/${selectedCityId}/project/${selectedAreaId}`);
    } else {
      navigate('/unit');
    }
  };

  const currentCityAreas = _optionalChain([citiesData, 'access', _2 => _2.find, 'call', _3 => _3((c) => String(c.city.id) === selectedCityId), 'optionalAccess', _4 => _4.areas]) || [];

  return (
    <div className="space-y-16">
      {/* 1. Hero Carousel */}
      <section className="relative min-h-[500px] sm:min-h-[580px] md:min-h-[640px] lg:h-[82vh] max-h-[850px] bg-slate-900 text-white overflow-hidden flex items-center">
        {validSliders.length > 0 ? (
          validSliders.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={getImageUrl(slide.mediaPath)}
                alt="Kandil Hero"
                className="w-full h-full object-cover object-center filter brightness-60"
                onError={(e) => {
                  (e.target ).src =
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80';
                }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent"></div>
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-[#26070a]"></div>
        )}

        {/* Hero Content Overlay */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 w-full py-16 md:py-24 text-center md:text-right">
          <div className="max-w-2xl bg-black/45 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl">
            <span className="inline-block px-4 py-1 rounded-full bg-[#f59e0b] text-[#26070a] text-xs md:text-sm font-extrabold uppercase tracking-wider mb-4 shadow">
              خبرة تتجاوز 22 عاماً في التطوير العقاري
            </span>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight text-white mb-4">
              قنديل للاستثمار العقاري
              <span className="block text-[#ff4d4f] text-xl sm:text-3xl md:text-4xl mt-2 font-bold">
                وجهتك الأولى لامتلاك منزل المستقبل
              </span>
            </h1>

            <p className="text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed mb-8">
              نقدم مشروعات سكنية وتجارية استثنائية بأرقى مواقع القاهرة الجديدة والتجمع الخامس مع أطول فترات سداد وأعلى جودة في التنفيذ.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                to="/unit"
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold text-sm sm:text-base shadow-xl flex items-center gap-2 transition-all hover:scale-103"
              >
                <span>تصفح الوحدات المتاحة</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <a
                href="tel:19473"
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#d61c23] font-bold text-sm sm:text-base border border-white/30 backdrop-blur transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#f59e0b]" />
                <span>اتصل بنا 19473</span>
              </a>
            </div>
          </div>
        </div>

        {/* Prev / Next Navigation Arrows */}
        {validSliders.length > 1 && (
          <>
            <button
              onClick={() => setActiveSlide((prev) => (prev - 1 + validSliders.length) % validSliders.length)}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/40 hover:bg-[#d61c23] text-white flex items-center justify-center transition backdrop-blur-md border border-white/10 shadow-lg"
              aria-label="السابق"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % validSliders.length)}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black/40 hover:bg-[#d61c23] text-white flex items-center justify-center transition backdrop-blur-md border border-white/10 shadow-lg"
              aria-label="التالي"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Carousel dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {validSliders.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === activeSlide ? 'w-8 bg-[#f59e0b]' : 'w-2.5 bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`شريحة ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 2. Fast Search Filter Bar ("دوّر على أي وحدات عندنا") */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-30">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <Search className="w-6 h-6 text-[#d61c23]" />
            <h2 className="text-xl md:text-2xl font-black text-gray-800">
              دوّر على أي وحدات عندنا
            </h2>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* City */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">اختر المدينة</label>
              <select
                value={selectedCityId}
                onChange={(e) => {
                  setSelectedCityId(e.target.value);
                  setSelectedAreaId('');
                  setSelectedProjectId('');
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#d61c23]"
              >
                {citiesData.map((c) => (
                  <option key={c.city.id} value={c.city.id}>
                    {c.city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">اختر المنطقة</label>
              <select
                value={selectedAreaId}
                onChange={(e) => {
                  setSelectedAreaId(e.target.value);
                  setSelectedProjectId('');
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#d61c23]"
              >
                <option value="">كل المناطق</option>
                {currentCityAreas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Project */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">اختر المشروع</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#d61c23]"
              >
                <option value="">كل المشروعات</option>
                {projectsWithArea
                  .filter((p) => !selectedAreaId || String(p.id) === selectedAreaId)
                  .flatMap((p) => p.viewProject)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg"
              >
                <Search className="w-5 h-5" />
                <span>بحث عن وحدات</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 3. Core Values & Pillars */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#d61c23] font-extrabold text-sm uppercase tracking-wider block mb-2">
            قيم شركة قنديل
          </span>
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            لماذا يثق بنا آلاف العملاء لأكثر من عقدين؟
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            منذ انطلاقنا عام 2001، التزمنا بمعايير لا مساومة فيها لتحقيق أعلى قيمة سكنية واستثمارية لعملائنا.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center group">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#d61c23]/10 text-[#d61c23] flex items-center justify-center mb-4 group-hover:bg-[#d61c23] group-hover:text-white transition-colors">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-2">الثقة</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              سجل حافل بالنزاهة والشفافية في كافة مراحل التعاقد والتسليم مع عملائنا الكرام.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center group">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#d61c23]/10 text-[#d61c23] flex items-center justify-center mb-4 group-hover:bg-[#d61c23] group-hover:text-white transition-colors">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-2">الجودة</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              تطبيق أدق المواصفات الهندسية ومواد البناء الفاخرة مع رقابة جودة دائمة.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center group">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#d61c23]/10 text-[#d61c23] flex items-center justify-center mb-4 group-hover:bg-[#d61c23] group-hover:text-white transition-colors">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-2">الالتزام</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              تسليم المشروعات في المواعيد المحددة مع وفاء كامل بكافة البنود والمزايا.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center group">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#d61c23]/10 text-[#d61c23] flex items-center justify-center mb-4 group-hover:bg-[#d61c23] group-hover:text-white transition-colors">
              <Handshake className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-2">المصداقية</h3>
            <p className="text-gray-600 text-xs leading-relaxed">
              شراكة حقيقية تمتد لما بعد البيع مع خدمات صيانة وإدارة مرافق متطورة.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Company Metrics Counter */}
      <section className="bg-gradient-to-r from-[#d61c23] to-[#2e080b] text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <span className="block text-4xl md:text-5xl font-black text-[#f59e0b] font-mono mb-2">
                +{landingPage?.totalUnits ?? 628}
              </span>
              <span className="text-white/80 text-sm md:text-base font-bold">إجمالي الوحدات</span>
            </div>

            <div>
              <span className="block text-4xl md:text-5xl font-black text-[#f59e0b] font-mono mb-2">
                +{landingPage?.projectsCount ?? 68}
              </span>
              <span className="text-white/80 text-sm md:text-base font-bold">المشروعات</span>
            </div>

            <div>
              <span className="block text-4xl md:text-5xl font-black text-[#f59e0b] font-mono mb-2">
                +{landingPage?.underConstructionCount ?? 90}
              </span>
              <span className="text-white/80 text-sm md:text-base font-bold">تحت الإنشاء</span>
            </div>

            <div>
              <span className="block text-4xl md:text-5xl font-black text-[#f59e0b] font-mono mb-2">
                +{landingPage?.deliveredUnitsCount ?? 528}
              </span>
              <span className="text-white/80 text-sm md:text-base font-bold">وحدة تم تسليمها</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Units ("جديد وحدات للبيع") */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-[#d61c23] font-extrabold text-sm uppercase tracking-wider block mb-1">
              أحدث الفرص السكنية
            </span>
            <h2 className="text-3xl font-black text-gray-900">
              جديد وحدات للبيع
            </h2>
          </div>

          <Link
            to="/unit"
            className="inline-flex items-center gap-2 text-[#d61c23] font-bold text-sm hover:underline"
          >
            <span>عرض كل الوحدات (54 وحدة)</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredUnits.slice(0, 3).map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image & Status Tag */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img
                    src={getImageUrl(unit.imageName)}
                    alt={unit.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target ).src =
                        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full shadow-md ${
                      unit.status === 'Sold'
                        ? 'bg-red-500 text-white'
                        : 'bg-[#22c55e] text-white'
                    }`}
                  >
                    {unit.status === 'Sold' ? 'تم البيع' : 'متاح للبيع'}
                  </span>

                  {/* Price Tag */}
                  {unit.price > 0 && (
                    <div className="absolute bottom-3 right-3 bg-[#d61c23]/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow">
                      <span>{unit.typePrice || 'مقدم'}: </span>
                      <span className="font-mono text-sm text-[#f59e0b] font-black mr-1">
                        {unit.price.toLocaleString('ar-EG')}
                      </span>
                      <span> جنيه</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6">
                  {/* Plot / Project Name (PDF Page 10) */}
                  <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#d61c23] min-w-0">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{unit.project?.name || unit.projectName || unit.nameLocation || 'مشروع قنديل'}</span>
                    </div>
                    {unit.codeUnit && (
                      <span className="shrink-0 bg-red-50 text-[#d61c23] font-bold px-2 py-0.5 rounded text-[11px] font-mono">
                        قطعة {unit.codeUnit}
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-lg text-gray-900 mb-2 group-hover:text-[#d61c23] transition-colors line-clamp-1">
                    {unit.title}
                  </h3>

                  <p className="text-gray-500 text-xs font-medium mb-4 line-clamp-1">
                    {unit.nameLocation || 'القاهرة الجديدة'}
                  </p>

                  {/* Specs Pill Grid */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 text-gray-600 text-xs font-semibold mb-4">
                    <div className="flex items-center gap-1.5 justify-center">
                      <Maximize2 className="w-4 h-4 text-[#d61c23]" />
                      <span>{unit.area} م²</span>
                    </div>

                    <div className="flex items-center gap-1.5 justify-center">
                      <Bed className="w-4 h-4 text-[#d61c23]" />
                      <span>{unit.numberRoom} غرف</span>
                    </div>

                    <div className="flex items-center gap-1.5 justify-center">
                      <Bath className="w-4 h-4 text-[#d61c23]" />
                      <span>{unit.numberBathroom} حمام</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 pb-6 pt-0">
                <Link
                  to={`/unit/${unit.id}`}
                  className="w-full block text-center py-2.5 rounded-lg bg-gray-50 hover:bg-[#d61c23] text-[#d61c23] hover:text-white font-bold text-sm border border-gray-200 hover:border-transparent transition-all"
                >
                  عرض تفاصيل الوحدة
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Residential Areas Showcase ("مشاريعنا السكنية") */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#d61c23] font-extrabold text-sm uppercase tracking-wider block mb-1">
              خريطة المشروعات
            </span>
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              مشروعاتنا السكنية في أرقى أحياء القاهرة الجديدة
            </h2>
            <p className="text-gray-500 text-sm">
              اختر المنطقة لاكتشاف كافة المشاريع المتاحة والمواصفات المعمارية.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsWithArea.map((area) => (
              <Link
                key={area.id}
                to={`/projectcategory/${area.id}`}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={
                      _optionalChain([area, 'access', _5 => _5.viewProject, 'access', _6 => _6[0], 'optionalAccess', _7 => _7.imageName])
                        ? getImageUrl(area.viewProject[0].imageName)
                        : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={area.areaName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target ).src =
                        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  
                  <div className="absolute bottom-4 right-4 left-4 flex justify-between items-end text-white">
                    <div>
                      <h3 className="font-black text-xl text-white mb-1 group-hover:text-[#f59e0b] transition-colors">
                        {area.areaName}
                      </h3>
                      <span className="text-xs text-gray-200 font-medium">
                        {_optionalChain([area, 'access', _8 => _8.viewProject, 'optionalAccess', _9 => _9.length]) || 0} مشروعات سكنية
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center group-hover:bg-[#f59e0b] transition-colors">
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Why Kandil Highlight Video Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#d61c23] via-[#3d0a0e] to-[#26070a] rounded-3xl overflow-hidden shadow-2xl text-white grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="p-8 md:p-14 space-y-6">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#f59e0b] text-[#26070a] text-xs font-black">
              عن الشركة
            </span>

            <h2 className="text-3xl md:text-4xl font-black leading-tight">
              لماذا تختار قنديل للاستثمار العقاري؟
            </h2>

            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              "نعتمد على رؤية واضحة واستراتيجيات مبتكرة لتحقيق أهداف عملائنا بأعلى مستويات الجودة والاحترافية. نحرص على اختيار المواقع الأكثر حيوية مع تصميمات هندسية تضمن الخصوصية والراحة القصوى."
            </p>

            <ul className="space-y-3 text-sm text-gray-200 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#f59e0b] shrink-0" />
                <span>إشراف هندسي وتنفيذي مباشر من إدارة الشركة</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#f59e0b] shrink-0" />
                <span>تسهيلات سداد ميسرة بدون فوائد تناسب خطتك المالية</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#f59e0b] shrink-0" />
                <span>واجهات معمارية كلاسيكية ومودرن فاخرة مع أفضل الخامات</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/whyus"
                className="inline-flex items-center gap-2 bg-white text-[#d61c23] hover:bg-[#f59e0b] hover:text-white px-7 py-3 rounded-full font-bold text-sm shadow transition-all hover:scale-103"
              >
                <span>تعرف أكثر على قنديل</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Video Container */}
          <div className="relative h-72 md:h-full min-h-[350px] bg-slate-800">
            <iframe
              src={landingPage?.videoUrl || "https://www.youtube.com/embed/5oXlbsDoiPE"}
              title="جولة داخل مشروعات قنديل"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* 8. Media Center & Latest News */}
      {mediaItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-[#d61c23] font-extrabold text-sm uppercase tracking-wider block mb-1">
                المركز الإعلامي
              </span>
              <h2 className="text-3xl font-black text-gray-900">
                أحدث الأخبار والمقالات
              </h2>
            </div>

            <Link
              to="/mediaCategories"
              className="inline-flex items-center gap-2 text-[#d61c23] font-bold text-sm hover:underline"
            >
              <span>تصفح كل الأخبار</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mediaItems.slice(0, 3).map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(item.imageName)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target ).src =
                          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(item.created).toLocaleDateString('ar-EG')}</span>
                    </div>

                    <h3 className="font-bold text-base text-gray-900 mb-3 group-hover:text-[#d61c23] transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <div
                      className="text-gray-500 text-xs line-clamp-3 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <Link
                    to={`/mediaCategories/${item.mediaId}/media/${item.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d61c23] group-hover:text-[#f59e0b] transition-colors"
                  >
                    <span>اقرأ المزيد</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
