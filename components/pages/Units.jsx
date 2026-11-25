'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '@/lib/navigation';
import {
  Search,
  Filter,
  Maximize2,
  Bed,
  Bath,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RotateCcw,
  Building2
} from 'lucide-react';
import { api, getImageUrl } from '@/services/api';


export const Units = () => {
  const [paginatedData, setPaginatedData] = useState({
    units: [],
    totalCount: 0,
    page: 1,
    totalPages: 1
  });
  const [citiesData, setCitiesData] = useState([]);
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roomsFilter, setRoomsFilter] = useState('all');
  const [bathroomsFilter, setBathroomsFilter] = useState('all');
  const [maxPrice, setMaxPrice] = useState(15000000);
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // 1. Fetch auxiliary data (cities & cover) independently on mount
  useEffect(() => {
    Promise.all([
      api.getCitiesWithArea().catch(() => []),
      api.getCoverImages().catch(() => [])
    ]).then(([citiesRes, coversRes]) => {
      setCitiesData(citiesRes || []);
      if (Array.isArray(coversRes)) {
        const cover = coversRes.find((c) => c.pageName && (c.pageName.includes('عروض') || c.pageName.includes('وحدات')));
        if (cover && cover.imageName) {
          setCoverImage(getImageUrl(cover.imageName));
        }
      }
    });
  }, []);

  // 2. Fast Paginated Fetch - loads only 9 units per page instantly
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    api.getPaginatedUnits({
      page: currentPage,
      limit: itemsPerPage,
      status: statusFilter,
      area: selectedArea,
      rooms: roomsFilter,
      bathrooms: bathroomsFilter,
      maxPrice: maxPrice < 15000000 ? maxPrice : undefined,
      search: searchTerm,
      sort: sortBy
    })
      .then((res) => {
        if (!isCancelled && res) {
          setPaginatedData({
            units: Array.isArray(res.units) ? res.units : [],
            totalCount: res.totalCount ?? 0,
            page: res.page ?? currentPage,
            totalPages: res.totalPages ?? 1
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching units:', err);
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [currentPage, statusFilter, selectedArea, roomsFilter, bathroomsFilter, maxPrice, searchTerm, sortBy]);

  const currentUnits = paginatedData.units;
  const totalCount = paginatedData.totalCount;
  const totalPages = paginatedData.totalPages;

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedArea('');
    setStatusFilter('all');
    setRoomsFilter('all');
    setBathroomsFilter('all');
    setMaxPrice(15000000);
    setSortBy('default');
    setCurrentPage(1);
  };

  const allAreaNames = Array.from(
    new Set([
      'النرجس الجديدة',
      'بيت الوطن',
      'شمال الرحاب',
      'النورث هاوس',
      'الأندلس',
      ...citiesData.flatMap((c) => (c.areas || []).map((a) => a.name))
    ])
  ).filter(Boolean);

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="relative min-h-[220px] md:h-72 bg-[#26070a] text-white overflow-hidden flex items-center">
        {coverImage && (
          <img
            src={coverImage}
            alt="الوحدات المتاحة للبيع"
            className="absolute inset-0 w-full h-full object-cover filter brightness-50"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full py-10">
          <span className="text-[#f59e0b] font-bold text-xs uppercase tracking-wider block mb-2">
            وحدات سكنية جاهزة للتسليم وتحت الإنشاء
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2">
            الوحدات المتاحة للبيع
          </h1>
          <p className="text-gray-300 text-sm max-w-xl">
            اختر شقتك، دوبليكسك أو رووفك في أرقى أحياء القاهرة الجديدة بتسهيلات سداد مريحة.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 self-start lg:sticky lg:top-24">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#d61c23]" />
                <h3 className="font-black text-gray-900 text-base">تصفية النتائج</h3>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs text-gray-400 hover:text-[#d61c23] flex items-center gap-1 font-semibold"
                title="إعادة تعيين"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">بحث بالاسم أو الموقع</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="ابحث برقم المشروع أو الحي..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">حالة الوحدة</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('all');
                    setCurrentPage(1);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    statusFilter === 'all'
                      ? 'bg-[#d61c23] text-white border-[#d61c23]'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  الكل
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('Available');
                    setCurrentPage(1);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    statusFilter === 'Available'
                      ? 'bg-[#22c55e] text-white border-[#22c55e]'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  متاح
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('Sold');
                    setCurrentPage(1);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    statusFilter === 'Sold'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  مباع
                </button>
              </div>
            </div>

            {/* Area Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">المنطقة</label>
              <select
                value={selectedArea}
                onChange={(e) => {
                  setSelectedArea(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
              >
                <option value="">كافة المناطق</option>
                {allAreaNames.map((areaName) => (
                  <option key={areaName} value={areaName}>
                    {areaName}
                  </option>
                ))}
              </select>
            </div>

            {/* Rooms Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">عدد الغرف</label>
              <div className="grid grid-cols-4 gap-1.5">
                {['all', '2', '3', '4'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRoomsFilter(r);
                      setCurrentPage(1);
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      roomsFilter === r
                        ? 'bg-[#d61c23] text-white border-[#d61c23]'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {r === 'all' ? 'الكل' : `${r} غرف`}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">عدد الحمامات</label>
              <div className="grid grid-cols-4 gap-1.5">
                {['all', '1', '2', '3'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setBathroomsFilter(b);
                      setCurrentPage(1);
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      bathroomsFilter === b
                        ? 'bg-[#d61c23] text-white border-[#d61c23]'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {b === 'all' ? 'الكل' : `${b} حمام`}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-1.5">
                <span>أقصى مقدم / سعر:</span>
                <span className="font-mono text-[#d61c23]">
                  {maxPrice >= 15000000 ? 'الكل (غير محدد)' : `${maxPrice.toLocaleString('ar-EG')} ج.م`}
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="15000000"
                step="100000"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-[#d61c23] cursor-pointer"
              />
            </div>
          </div>

          {/* Main Results Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Control Bar: Count, Sort, Grid/List */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-sm font-bold text-gray-700">
                إجمالي النتائج: <strong className="text-[#d61c23] font-black">{loading ? '...' : totalCount}</strong> وحدة
              </span>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value )}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none"
                  >
                    <option value="default">الترتيب الافتراضي</option>
                    <option value="price-asc">السعر: من الأقل للأعلى</option>
                    <option value="price-desc">السعر: من الأعلى للأقل</option>
                    <option value="area-asc">المساحة: من الأصغر للأكبر</option>
                    <option value="area-desc">المساحة: من الأكبر للأصغر</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[#d61c23] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="عرض شبكي"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[#d61c23] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="عرض طولي"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Grid / List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-52 bg-slate-200"></div>
                      <div className="p-5 space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        <div className="pt-3 border-t border-gray-100 flex justify-between gap-4">
                          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <div className="h-10 bg-slate-200 rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : currentUnits.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">لا توجد وحدات تطابق اختياراتك</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  حاول تغيير معايير البحث أو تصفية الأسعار والمناطق للعثور على وحدات مناسبة.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-lg bg-[#d61c23] text-white font-bold text-xs hover:bg-[#b7151b] transition-colors"
                >
                  إعادة ضبط الفلاتر
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentUnits.map((unit) => (
                  <div
                    key={unit.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-52 overflow-hidden bg-gray-100">
                        <img
                          src={getImageUrl(unit.imageName, 'unit')}
                          alt={unit.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target ).src =
                              '/assets/Images/units/4dcb37c1-e2f2-4ab4-b62c-b88d90ead9d3.png';
                          }}
                        />
                        <span
                          className={`absolute top-3 right-3 text-[11px] font-bold px-3 py-1 rounded-full shadow-md ${
                            unit.status === 'Sold' ? 'bg-red-500 text-white' : 'bg-[#22c55e] text-white'
                          }`}
                        >
                          {unit.status === 'Sold' ? 'تم البيع' : 'متاح للبيع'}
                        </span>

                        {unit.price > 0 && (
                          <div className="absolute bottom-3 right-3 bg-[#d61c23]/90 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-bold shadow">
                            <span>{unit.typePrice || 'مقدم'}: </span>
                            <span className="font-mono text-sm text-[#f59e0b] font-black mr-1">
                              {unit.price.toLocaleString('ar-EG')}
                            </span>
                            <span> جنيه</span>
                          </div>
                        )}
                      </div>

                      <div className="p-5">
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

                        <h3 className="font-bold text-base text-gray-900 mb-1.5 group-hover:text-[#d61c23] transition-colors line-clamp-1">
                          {unit.title}
                        </h3>

                        <p className="text-gray-500 text-xs font-medium mb-3 line-clamp-1">
                          {unit.nameLocation || 'القاهرة الجديدة'}
                        </p>

                        <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-gray-100 text-gray-600 text-xs font-semibold mb-2">
                          <div className="flex items-center gap-1 justify-center">
                            <Maximize2 className="w-3.5 h-3.5 text-[#d61c23]" />
                            <span>{unit.area} م²</span>
                          </div>
                          <div className="flex items-center gap-1 justify-center">
                            <Bed className="w-3.5 h-3.5 text-[#d61c23]" />
                            <span>{unit.numberRoom} غرف</span>
                          </div>
                          <div className="flex items-center gap-1 justify-center">
                            <Bath className="w-3.5 h-3.5 text-[#d61c23]" />
                            <span>{unit.numberBathroom} حمام</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <Link
                        to={`/unit/${unit.id}`}
                        className="w-full block text-center py-2.5 rounded-lg bg-gray-50 hover:bg-[#d61c23] text-[#d61c23] hover:text-white font-bold text-xs border border-gray-200 hover:border-transparent transition-all"
                      >
                        تفاصيل الوحدة
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {currentUnits.map((unit) => (
                  <div
                    key={unit.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all p-4 flex flex-col md:flex-row gap-6 items-center"
                  >
                    <div className="w-full md:w-56 h-40 shrink-0 rounded-xl overflow-hidden relative bg-gray-100">
                      <img
                        src={getImageUrl(unit.imageName, 'unit')}
                        alt={unit.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target ).src =
                            '/assets/Images/units/4dcb37c1-e2f2-4ab4-b62c-b88d90ead9d3.png';
                        }}
                      />
                      <span
                        className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          unit.status === 'Sold' ? 'bg-red-500 text-white' : 'bg-[#22c55e] text-white'
                        }`}
                      >
                        {unit.status === 'Sold' ? 'تم البيع' : 'متاح للبيع'}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2 text-right w-full">
                      {/* Plot / Project Name (PDF Page 10) */}
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center gap-1.5 text-xs font-black text-[#d61c23]">
                          <Building2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{unit.project?.name || unit.projectName || unit.nameLocation || 'مشروع قنديل'}</span>
                        </div>
                        {unit.codeUnit && (
                          <span className="bg-red-50 text-[#d61c23] font-bold px-2 py-0.5 rounded text-[11px] font-mono">
                            قطعة {unit.codeUnit}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-lg text-gray-900">{unit.title}</h3>
                      <p className="text-gray-500 text-xs">{unit.nameLocation || 'القاهرة الجديدة'}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 py-1">
                        <span className="flex items-center gap-1 font-semibold">
                          <Maximize2 className="w-4 h-4 text-[#d61c23]" />
                          {unit.area} م²
                        </span>
                        <span className="flex items-center gap-1 font-semibold">
                          <Bed className="w-4 h-4 text-[#d61c23]" />
                          {unit.numberRoom} غرف نوم
                        </span>
                        <span className="flex items-center gap-1 font-semibold">
                          <Bath className="w-4 h-4 text-[#d61c23]" />
                          {unit.numberBathroom} حمام
                        </span>
                      </div>

                      {unit.price > 0 && (
                        <div className="text-sm font-bold text-[#d61c23]">
                          <span>{unit.typePrice || 'مقدم'}: </span>
                          <span className="font-mono text-base font-black text-[#f59e0b]">
                            {unit.price.toLocaleString('ar-EG')}
                          </span>
                          <span> جنيه</span>
                        </div>
                      )}
                    </div>

                    <div className="w-full md:w-auto shrink-0">
                      <Link
                        to={`/unit/${unit.id}`}
                        className="w-full md:w-auto inline-block text-center px-6 py-2.5 rounded-lg bg-[#d61c23] text-white hover:bg-[#b7151b] font-bold text-xs transition-colors shadow"
                      >
                        معاينة وتفاصيل
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-1.5 pt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
                  aria-label="الصفحة السابقة"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {(() => {
                  let range = [];
                  if (totalPages <= 7) {
                    range = Array.from({ length: totalPages }, (_, i) => i + 1);
                  } else if (currentPage <= 3) {
                    range = [1, 2, 3, 4, '...', totalPages];
                  } else if (currentPage >= totalPages - 2) {
                    range = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                  } else {
                    range = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
                  }

                  return range.map((page, idx) =>
                    page === '...' ? (
                      <span key={`dots-${idx}`} className="px-2 text-gray-400 font-bold text-xs select-none">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 350, behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 rounded-lg font-bold text-xs transition-colors ${
                          page === currentPage
                            ? 'bg-[#d61c23] text-white shadow'
                            : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  );
                })()}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
                  aria-label="الصفحة التالية"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Units;
