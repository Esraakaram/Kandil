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
  const [units, setUnits] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roomsFilter, setRoomsFilter] = useState('all');
  const [bathroomsFilter, setBathroomsFilter] = useState('all');
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [minArea, setMinArea] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    Promise.all([api.getAllUnits(), api.getCitiesWithArea()])
      .then(([unitsRes, citiesRes]) => {
        setUnits(unitsRes);
        setCitiesData(citiesRes);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching units:', err);
        setLoading(false);
      });
  }, []);

  // Filter & sort logic
  const filteredUnits = useMemo(() => {
    return units
      .filter((unit) => {
        // Keyword
        if (searchTerm) {
          const matchTitle = unit.title.toLowerCase().includes(searchTerm.toLowerCase());
          const matchLoc = (unit.nameLocation || '').toLowerCase().includes(searchTerm.toLowerCase());
          if (!matchTitle && !matchLoc) return false;
        }

        // Area
        if (selectedArea && unit.nameLocation && !unit.nameLocation.includes(selectedArea)) {
          return false;
        }

        // Status
        if (statusFilter !== 'all') {
          if (statusFilter === 'Sold' && unit.status !== 'Sold') return false;
          if (statusFilter === 'Available' && unit.status === 'Sold') return false;
        }

        // Rooms
        if (roomsFilter !== 'all') {
          if (unit.numberRoom !== Number(roomsFilter)) return false;
        }

        // Bathrooms
        if (bathroomsFilter !== 'all') {
          if (unit.numberBathroom !== Number(bathroomsFilter)) return false;
        }

        // Price
        if (unit.price > 0 && unit.price > maxPrice) {
          return false;
        }

        // Area size
        if (unit.area < minArea) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'area-asc') return a.area - b.area;
        if (sortBy === 'area-desc') return b.area - a.area;
        return 0;
      });
  }, [units, searchTerm, selectedArea, statusFilter, roomsFilter, bathroomsFilter, maxPrice, minArea, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const currentUnits = filteredUnits.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedArea('');
    setStatusFilter('all');
    setRoomsFilter('all');
    setBathroomsFilter('all');
    setMaxPrice(3000000);
    setMinArea(0);
    setSortBy('default');
    setCurrentPage(1);
  };

  const allAreaNames = Array.from(new Set(units.map((u) => u.nameLocation).filter(Boolean)));

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-[#26070a] text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
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
                <option value="النرجس الجديدة">النرجس الجديدة</option>
                <option value="بيت الوطن">بيت الوطن</option>
                <option value="شمال الرحاب">شمال الرحاب</option>
                <option value="النورث هاوس">النورث هاوس</option>
                <option value="الأندلس">الأندلس</option>
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
                  {maxPrice.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
              <input
                type="range"
                min="300000"
                max="3000000"
                step="50000"
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
                إجمالي النتائج: <strong className="text-[#d61c23] font-black">{filteredUnits.length}</strong> وحدة
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
            {currentUnits.length === 0 ? (
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
                          src={getImageUrl(unit.imageName)}
                          alt={unit.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target ).src =
                              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
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
                        src={getImageUrl(unit.imageName)}
                        alt={unit.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target ).src =
                            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
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
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
                  aria-label="الصفحة السابقة"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg font-bold text-xs transition-colors ${
                      page === currentPage
                        ? 'bg-[#d61c23] text-white'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
