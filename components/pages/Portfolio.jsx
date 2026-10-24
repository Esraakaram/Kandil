'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/lib/navigation';
import {
  Building2,
  Maximize2,
  Bed,
  Bath,
  CheckCircle,
  MapPin,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  ExternalLink,
  Phone,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { api, getImageUrl } from '@/services/api';

export const Portfolio = () => {
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [soldUnits, setSoldUnits] = useState([]);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'units'
  const [expandedProjects, setExpandedProjects] = useState({});
  const [selectedArea, setSelectedArea] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const PROJECTS_PER_PAGE = 6;
  const UNITS_PER_PAGE = 9;

  useEffect(() => {
    Promise.all([
      api.getPortfolioProjects(),
      api.getAllUnits()
    ])
      .then(([portfolioRes, unitsRes]) => {
        const projects = Array.isArray(portfolioRes) ? portfolioRes : [];
        setPortfolioProjects(projects);

        // Auto-expand the first 2 projects so units are visible right away
        const initialExpanded = {};
        projects.slice(0, 2).forEach((p) => {
          initialExpanded[p.id] = true;
        });
        setExpandedProjects(initialExpanded);

        const allUnits = Array.isArray(unitsRes) ? unitsRes : [];
        const sold = allUnits.filter((u) => u.status === 'Sold' || u.status === 'تم البيع');
        setSoldUnits(sold);

        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching portfolio data:', err);
        setLoading(false);
      });
  }, []);

  const toggleProjectExpand = (id) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Get unique areas from projects
  const uniqueAreas = [
    'ALL',
    ...Array.from(new Set(portfolioProjects.map((p) => p.areaName).filter(Boolean)))
  ];

  const filteredProjects = portfolioProjects.filter((p) => {
    if (selectedArea === 'ALL') return true;
    return p.areaName === selectedArea;
  });

  const filteredSoldUnits = soldUnits.filter((u) => {
    if (selectedArea === 'ALL') return true;
    return (u.nameLocation && u.nameLocation.includes(selectedArea)) || u.project?.areaName === selectedArea;
  });

  const currentList = activeTab === 'projects' ? filteredProjects : filteredSoldUnits;
  const pageSize = activeTab === 'projects' ? PROJECTS_PER_PAGE : UNITS_PER_PAGE;
  const totalPages = Math.ceil(currentList.length / pageSize);

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  const paginatedSoldUnits = filteredSoldUnits.slice(
    (currentPage - 1) * UNITS_PER_PAGE,
    currentPage * UNITS_PER_PAGE
  );

  const renderPagination = (totalItems) => {
    if (totalPages <= 1) return null;

    const startIdx = (currentPage - 1) * pageSize + 1;
    const endIdx = Math.min(currentPage * pageSize, totalItems);

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(totalPages, start + maxVisible - 1);
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    };

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-10 border-t border-gray-200 text-xs text-gray-500">
        <div>
          عرض <span className="font-bold text-gray-900">{startIdx}</span> إلى{' '}
          <span className="font-bold text-gray-900">{endIdx}</span> من أصل{' '}
          <span className="font-bold text-gray-900">{totalItems}</span> {activeTab === 'projects' ? 'مشروع' : 'وحدة'}
        </div>

        <div className="flex items-center gap-1.5" dir="ltr">
          <button
            onClick={() => {
              setCurrentPage(1);
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
            title="الصفحة الأولى"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setCurrentPage((prev) => Math.max(1, prev - 1));
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
            title="الصفحة السابقة"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {getPageNumbers().map((pg) => (
            <button
              key={pg}
              onClick={() => {
                setCurrentPage(pg);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className={`min-w-[36px] h-[36px] px-2.5 rounded-xl font-bold transition flex items-center justify-center ${
                pg === currentPage
                  ? 'bg-[#d61c23] text-white shadow-sm'
                  : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              {pg}
            </button>
          ))}

          <button
            onClick={() => {
              setCurrentPage((prev) => Math.min(totalPages, prev + 1));
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
            title="الصفحة التالية"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setCurrentPage(totalPages);
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
            title="الصفحة الأخيرة"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-16 pb-20 bg-gray-50/50">
      {/* 1. Hero Banner */}
      <div className="bg-[#26070a] text-white py-14 md:py-20 border-b border-[#3d0d12]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 bg-[#d61c23]/20 border border-[#d61c23]/40 text-[#f59e0b] px-4 py-1.5 rounded-full font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>أكثر من 24 عاماً من الثقة والإنجازات منذ 2001</span>
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              سابقة الأعمال والتسليمات
            </h1>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              سجل حافل بالمشروعات والوحدات السكنية التي تم إنجازها وتسليمها لعملائنا في أرقى مناطق القاهرة الجديدة ومدينة الشروق بأعلى مواصفات الجودة ومقاومة الزلازل.
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                <span className="block text-2xl font-black text-[#f59e0b] font-mono">+68</span>
                <span className="text-[11px] text-gray-300 font-bold">مشروعاً مكتملاً</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                <span className="block text-2xl font-black text-[#f59e0b] font-mono">+24</span>
                <span className="text-[11px] text-gray-300 font-bold">عاماً في الصدارة</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                <span className="block text-2xl font-black text-emerald-400 font-mono">100%</span>
                <span className="text-[11px] text-gray-300 font-bold">دقة في التسليم</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls & Tabs */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-gray-100 shadow-sm space-y-5">
          {/* Top Tier: View Mode Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => {
                  setActiveTab('projects');
                  setCurrentPage(1);
                }}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'projects'
                    ? 'bg-[#d61c23] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>مشروعات سابقة الأعمال ({portfolioProjects.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('units');
                  setCurrentPage(1);
                }}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'units'
                    ? 'bg-[#d61c23] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>الوحدات المباعة ({soldUnits.length})</span>
              </button>
            </div>

            <div className="text-xs text-gray-500 font-semibold hidden md:block">
              {activeTab === 'projects'
                ? `عرض المشروعات السكنية المكتملة والمسلّمة`
                : `استعراض الوحدات السكنية المسلّمة للعملاء`}
            </div>
          </div>

          {/* Bottom Tier: Area Filter Pills */}
          {uniqueAreas.length > 2 && (
            <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 shrink-0">
                <MapPin className="w-4 h-4 text-[#d61c23]" />
                <span>تصفية حسب المنطقة:</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 scrollbar-thin">
                {uniqueAreas.map((area) => (
                  <button
                    key={area}
                    onClick={() => {
                      setSelectedArea(area);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                      selectedArea === area
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
                    }`}
                  >
                    {area === 'ALL' ? 'كافة المناطق' : area}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Content Body */}
      <section className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#d61c23] border-t-transparent"></div>
            <p className="mt-3 text-sm text-gray-500 font-bold">جاري تحميل مشروعات ووحدات سابقة الأعمال...</p>
          </div>
        ) : activeTab === 'projects' ? (
          /* ============================================================== */
          /* MODE 1: مشروعات سابقة الأعمال بوحداتها (Projects with their units) */
          /* ============================================================== */
          <div className="space-y-8">
            {filteredProjects.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center space-y-3">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="text-base font-bold text-gray-700">لا توجد مشاريع في سابقة الأعمال حالياً</h3>
                <p className="text-xs text-gray-500">
                  يمكن لمدير النظام إضافة المشروعات المنجزة أو المباعة لسابقة الأعمال من لوحة التحكم بضغطة زر واحدة.
                </p>
              </div>
            ) : (
              paginatedProjects.map((project) => {
                const isExpanded = !!expandedProjects[project.id];
                const unitsList = project.units || [];

                return (
                  <div
                    key={project.id}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
                  >
                    {/* Project Header Bar */}
                    <div className="p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full lg:w-auto">
                        {/* Project Thumbnail */}
                        <div className="relative w-28 h-24 sm:w-36 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                          <img
                            src={getImageUrl(project.imageName || project.mainImage)}
                            alt={project.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <span className="absolute bottom-1.5 right-1.5 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                            تم البيع ✓
                          </span>
                        </div>

                        {/* Project Info */}
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-[#d61c23] bg-red-50 px-2.5 py-0.5 rounded-lg">
                              {project.areaName || 'القاهرة الجديدة'}
                            </span>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                              مشروع منجز ومسلم
                            </span>
                            {project.deliveryDate && (
                              <span className="text-[11px] font-bold text-gray-500">
                                استلام: {project.deliveryDate}
                              </span>
                            )}
                          </div>

                          <h2 className="text-xl sm:text-2xl font-black text-gray-900 truncate">
                            {project.name}
                          </h2>

                          <p className="text-xs text-gray-500 line-clamp-2 max-w-2xl">
                            {project.aboutProject?.replace(/<[^>]*>/g, '') ||
                              'مشروع سكني متكامل من قنديل للاستثمار العقاري تم تنفيذه وتسليمه وفق أعلى المواصفات الهندسية.'}
                          </p>
                        </div>
                      </div>

                      {/* Project Action buttons */}
                      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
                        <Link
                          to={`/projectcategory/0/project/${project.id}/detail`}
                          className="px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-bold border border-gray-200 transition flex items-center gap-1.5"
                        >
                          <span>تفاصيل المشروع</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => toggleProjectExpand(project.id)}
                          className="px-5 py-2.5 rounded-xl bg-[#d61c23] hover:bg-[#b7151b] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
                        >
                          <span>وحدات المشروع ({unitsList.length})</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Units Grid of this Project */}
                    {isExpanded && (
                      <div className="p-6 sm:p-8 bg-slate-50/60 border-t border-gray-100 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black text-gray-800 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-[#d61c23]" />
                            <span>الوحدات التابعة لمشروع {project.name}:</span>
                          </h4>
                          <span className="text-xs font-bold text-gray-500">
                            {unitsList.length} وحدة مسجلة
                          </span>
                        </div>

                        {unitsList.length === 0 ? (
                          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                            <p className="text-xs text-gray-500 font-bold">
                              تم تسليم كافة وحدات هذا المشروع بالكامل ولم يتم إدراج تقسيمات إضافية.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {unitsList.map((unit) => (
                              <div
                                key={unit.id}
                                className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <h5 className="font-bold text-sm text-gray-900 line-clamp-1">
                                      {unit.title}
                                    </h5>
                                    <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full shrink-0">
                                      تم البيع ✓
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-4 text-xs text-gray-500 my-3 py-2 border-y border-gray-100">
                                    <span className="flex items-center gap-1 font-semibold">
                                      <Maximize2 className="w-3.5 h-3.5 text-[#d61c23]" />
                                      {unit.area} م²
                                    </span>
                                    <span className="flex items-center gap-1 font-semibold">
                                      <Bed className="w-3.5 h-3.5 text-[#d61c23]" />
                                      {unit.numberRoom} غرف
                                    </span>
                                    <span className="flex items-center gap-1 font-semibold">
                                      <Bath className="w-3.5 h-3.5 text-[#d61c23]" />
                                      {unit.numberBathroom} حمام
                                    </span>
                                  </div>
                                </div>

                                <Link
                                  to={`/unit/${unit.id}`}
                                  className="block text-center py-2 bg-gray-50 hover:bg-[#d61c23] text-gray-700 hover:text-white rounded-xl text-xs font-bold transition-colors border border-gray-200"
                                >
                                  معاينة تفاصيل الوحدة والمسقط
                                </Link>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {renderPagination(filteredProjects.length)}
          </div>
        ) : (
          /* ============================================================== */
          /* MODE 2: كافة الوحدات المباعة والمسلمة (Flat Sold Units Grid) */
          /* ============================================================== */
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSoldUnits.length === 0 ? (
                <div className="col-span-full bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center space-y-3">
                  <Layers className="w-12 h-12 text-gray-400 mx-auto" />
                  <h3 className="text-base font-bold text-gray-700">لا توجد وحدات مباعة معروضة حالياً</h3>
                </div>
              ) : (
                paginatedSoldUnits.map((unit) => (
                  <div
                    key={unit.id}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        <img
                          src={getImageUrl(unit.imageName)}
                          alt={unit.title}
                          className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-300"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                          تم البيع والتسليم ✓
                        </span>
                      </div>

                      <div className="p-6">
                        <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-1">
                          {unit.title}
                        </h3>
                        <p className="text-gray-500 text-xs mb-4 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#d61c23]" />
                          <span>{unit.nameLocation || unit.project?.name || 'القاهرة الجديدة'}</span>
                        </p>

                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 text-gray-600 text-xs font-semibold">
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

                    <div className="p-6 pt-0">
                      <Link
                        to={`/unit/${unit.id}`}
                        className="w-full block text-center py-2.5 bg-gray-50 hover:bg-[#d61c23] text-gray-700 hover:text-white font-bold text-xs rounded-xl transition-colors border border-gray-200"
                      >
                        معاينة تفاصيل الوحدة
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            {renderPagination(filteredSoldUnits.length)}
          </div>
        )}
      </section>

      {/* 4. Bottom Contact CTA */}
      <section className="max-w-7xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-r from-[#26070a] to-[#3d0d12] text-white p-10 md:p-14 rounded-3xl shadow-xl border border-red-950">
          <h3 className="text-2xl md:text-3xl font-black mb-3">
            هل ترغب في الانضمام إلى قائمة ملاك مشروعات قنديل؟
          </h3>
          <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto mb-8">
            تواصل معنا اليوم للتعرف على المشروعات والوحدات المتاحة حالياً بأفضل خطط السداد في القاهرة الجديدة.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/unit"
              className="px-8 py-3.5 rounded-full bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold text-sm shadow transition-all hover:scale-105"
            >
              استعرض الوحدات المتاحة للبيع
            </Link>
            <a
              href="tel:19473"
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#d61c23] font-bold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#f59e0b]" />
              <span>الخط الساخن: 19473</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
