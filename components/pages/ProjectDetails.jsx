'use client';

function _optionalChain(ops) {
  let lastAccessLHS = undefined;
  let value = ops[0];
  let i = 1;
  while (i < ops.length) {
    const op = ops[i];
    const fn = ops[i + 1];
    i += 2;
    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      return undefined;
    }
    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value;
      value = fn(value);
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn((...args) => value.call(lastAccessLHS, ...args));
      lastAccessLHS = undefined;
    }
  }
  return value;
}

import React, { useState, useEffect } from 'react';
import { useParams, Link } from '@/lib/navigation';
import {
  MapPin,
  CheckCircle,
  Phone,
  Video,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Send,
  Eye,
  X,
  FileText,
  Download,
  Building2,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { api, getImageUrl } from '@/services/api';

function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return trimmed;
}

export const ProjectDetails = () => {
  const params = useParams();
  const targetProjectId = params.DetailProject || params.projectId;

  const [project, setProject] = useState(null);
  const [projectUnits, setProjectUnits] = useState([]);
  const [activeTab, setActiveTab] = useState('section-about');
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [loading, setLoading] = useState(true);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Inquiry form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!targetProjectId) return;

    Promise.all([
      api.getProjectById(targetProjectId),
      api.getAllUnits()
    ])
      .then(([projRes, unitsRes]) => {
        setProject(projRes);
        const units = (unitsRes || []).filter((u) => u.projectId === Number(targetProjectId));
        setProjectUnits(units);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching project detail:', err);
        setLoading(false);
      });
  }, [targetProjectId]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitting(true);
    setSubmitError('');

    try {
      await api.createContact({
        name,
        phone,
        email,
        project: _optionalChain([project, 'optionalAccess', _ => _.title]) || `مشروع رقم ${targetProjectId}`,
        message: message || 'استفسار عن وحدات المشروع وطرق السداد.'
      });
      setSubmitted(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setSubmitError(err.message || 'حدث خطأ أثناء إرسال الرسالة');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#d61c23] border-t-transparent"></div>
        <p className="mt-2 text-sm text-gray-500">جاري تحميل بيانات المشروع...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">المشروع غير متوفر</h2>
        <Link to="/projectcategory" className="text-[#d61c23] hover:underline font-bold">
          العودة لكافة المشروعات
        </Link>
      </div>
    );
  }

  // Location landmarks (PDF Page 4: 3 default, up to 5)
  const landmarks = (project.locationProjects || []).slice(0, 5);
  // Facade & Entrance images (PDF Page 9)
  const galleryImages = Array.isArray(project.images) ? project.images : [];
  const videoEmbed = getYouTubeEmbedUrl(project.videoURL);
  const pdfBrochureUrl = project.pdfFile ? getImageUrl(project.pdfFile) : null;

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Hero Cover */}
      <div className="relative min-h-[380px] md:min-h-[460px] bg-[#26070a] text-white overflow-hidden flex items-end">
        <img
          src={getImageUrl(project.detailsCoverImage || project.mainImage)}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover filter brightness-50"
          onError={(e) => {
            (e.target).src =
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full py-12">
          <div className="flex items-center gap-2 text-xs text-gray-300 mb-3">
            <Link to="/home" className="hover:text-white">الرئيسية</Link>
            <span>/</span>
            <Link to="/projectcategory" className="hover:text-white">المشروعات السكنية</Link>
            <span>/</span>
            <span className="text-[#f59e0b] font-bold">{project.title}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-200">
            <span className="inline-flex items-center gap-1.5 bg-[#d61c23]/80 backdrop-blur px-3 py-1.5 rounded-full border border-white/20 font-bold">
              <MapPin className="w-4 h-4 text-white" />
              <span>{project.areaName || 'القاهرة الجديدة'}</span>
            </span>

            {project.deliveryDate && project.deliveryDate !== 'تسليم فندقي فاخر' && (
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full font-bold">
                <Calendar className="w-4 h-4 text-[#f59e0b]" />
                <span>{`استلام: ${project.deliveryDate}`}</span>
              </span>
            )}

            {project.status && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-600/80 backdrop-blur px-3 py-1.5 rounded-full font-bold">
                <span>{project.status}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Quick Navigation Bar */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-md border-y border-gray-200 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => scrollToSection('section-about')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeTab === 'section-about'
                  ? 'bg-[#d61c23] text-white shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              عن المشروع
            </button>

            <button
              onClick={() => scrollToSection('section-location')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeTab === 'section-location'
                  ? 'bg-[#d61c23] text-white shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              موقع المشروع
            </button>

            <button
              onClick={() => scrollToSection('section-advantages')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeTab === 'section-advantages'
                  ? 'bg-[#d61c23] text-white shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              مميزات المشروع
            </button>

            <button
              onClick={() => scrollToSection('section-video')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeTab === 'section-video'
                  ? 'bg-[#d61c23] text-white shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              فيديو تعريفي
            </button>

            <button
              onClick={() => scrollToSection('section-units')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeTab === 'section-units'
                  ? 'bg-[#d61c23] text-white shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              الوحدات المتاحة ({projectUnits.length})
            </button>

            <button
              onClick={() => scrollToSection('section-pdf')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeTab === 'section-pdf'
                  ? 'bg-[#d61c23] text-white shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              تفاصيل المشروع (البروشور)
            </button>
          </div>
        </div>
      </div>

      {/* 3. Tab Body & Sidebar */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* ============================================================== */}
            {/* SECTION 1: عن المشروع (PDF Page 9: نبذة + صور الواجهة والمداخل) */}
            {/* ============================================================== */}
            <div id="section-about" className="space-y-8 scroll-mt-36">
                {/* About Content */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h2 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#d61c23]" />
                    <span>نبذة عن المشروع</span>
                  </h2>
                  <div
                    className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-3"
                    dangerouslySetInnerHTML={{ __html: project.aboutProject || `<p>${project.title}</p>` }}
                  />
                </div>

                {/* Facade & Entrance Gallery (PDF Page 9: صور الواجهة والمداخل) */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-[#d61c23]" />
                      <span>صور الواجهة والمداخل (معرض المشروع)</span>
                    </h3>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {galleryImages.length} صور
                    </span>
                  </div>

                  {galleryImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {galleryImages.map((imgName, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedGalleryImage(getImageUrl(imgName))}
                          className="relative h-44 rounded-xl overflow-hidden cursor-pointer group bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md transition"
                        >
                          <img
                            src={getImageUrl(imgName)}
                            alt={`واجهة أو مدخل ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                            onError={(e) => {
                              (e.target).src =
                                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye className="w-7 h-7" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      <p className="text-xs text-gray-500 font-bold">
                        سيتم إضافة صور الواجهة والمداخل للمشروع قريباً.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            {/* ============================================================== */}
            {/* SECTION 2: موقع المشروع وخريطة الوصول */}
            {/* ============================================================== */}
            <div id="section-location" className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 scroll-mt-36">
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#d61c23]" />
                    <span>موقع المشروع وخريطة الوصول</span>
                  </h3>
                  <span className="text-xs font-bold text-gray-500">
                    {project.areaName || 'القاهرة الجديدة'}
                  </span>
                </div>

                {/* Side-by-side FIT layout: Landmarks (Right) & Map Image (Left) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {/* Right side: Landmarks list (3 to 5 items) */}
                  <div className="flex flex-col justify-between space-y-3">
                    <span className="text-xs font-bold text-gray-500 block mb-1">
                      أهم المعالم والمحاور القريبة:
                    </span>

                    {landmarks.length > 0 ? (
                      landmarks.map((loc, idx) => (
                        <div
                          key={loc.id || idx}
                          className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#d61c23]/40 transition shadow-sm"
                        >
                          <div className="w-14 h-14 rounded-xl bg-[#d61c23] text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                            <span className="font-mono font-black text-lg leading-none text-[#f59e0b]">
                              {loc.time}
                            </span>
                            <span className="text-[10px] text-white/90 font-bold">دقائق</span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-[11px] text-gray-400 block font-bold">يبعد عن:</span>
                            <h4 className="text-sm font-bold text-gray-900 truncate">
                              {loc.nameOfStreet}
                            </h4>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="w-14 h-14 rounded-xl bg-[#d61c23] text-white flex flex-col items-center justify-center shrink-0">
                            <span className="font-mono font-black text-lg leading-none text-[#f59e0b]">5</span>
                            <span className="text-[10px] text-white/90 font-bold">دقائق</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-gray-400 block font-bold">يبعد عن:</span>
                            <h4 className="text-sm font-bold text-gray-900">محور محمد نجيب والتسعين</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="w-14 h-14 rounded-xl bg-[#d61c23] text-white flex flex-col items-center justify-center shrink-0">
                            <span className="font-mono font-black text-lg leading-none text-[#f59e0b]">3</span>
                            <span className="text-[10px] text-white/90 font-bold">دقائق</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-gray-400 block font-bold">يبعد عن:</span>
                            <h4 className="text-sm font-bold text-gray-900">المنطقة الخدمية والنوادي</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="w-14 h-14 rounded-xl bg-[#d61c23] text-white flex flex-col items-center justify-center shrink-0">
                            <span className="font-mono font-black text-lg leading-none text-[#f59e0b]">5</span>
                            <span className="text-[10px] text-white/90 font-bold">دقائق</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-gray-400 block font-bold">يبعد عن:</span>
                            <h4 className="text-sm font-bold text-gray-900">الجامعات والمدارس الدولية</h4>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Left side: Map image (FIT alongside landmarks) */}
                  <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 h-full min-h-[340px] max-h-[460px] relative shadow-inner group">
                    {project.locationImage ? (
                      <img
                        src={getImageUrl(project.locationImage)}
                        alt="خريطة موقع المشروع"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 cursor-pointer"
                        onClick={() => setSelectedGalleryImage(getImageUrl(project.locationImage))}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-gray-400">
                        <MapPin className="w-12 h-12 text-[#d61c23] mb-2" />
                        <span className="text-xs font-bold">موقع المشروع في أرقى مناطق {project.areaName || 'القاهرة الجديدة'}</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-lg text-[11px] font-bold pointer-events-none">
                      خريطة الموقع
                    </div>
                  </div>
                </div>
              </div>

            {/* ============================================================== */}
            {/* SECTION 3: مميزات المشروع */}
            {/* ============================================================== */}
            <div id="section-advantages" className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 scroll-mt-36">
                <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#d61c23]" />
                  <span>مميزات وخدمات المشروع الفندقية</span>
                </h3>

                {project.advantageProjects && project.advantageProjects.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {project.advantageProjects.map((adv) => (
                      <div
                        key={adv.id}
                        className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center flex flex-col items-center justify-center gap-2 hover:bg-red-50/40 hover:border-[#d61c23]/30 transition"
                      >
                        <CheckCircle className="w-6 h-6 text-[#d61c23]" />
                        <span className="text-xs font-bold text-gray-800">{adv.text}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {['واجهات مودرن فاخرة', 'أمن وحراسة 24 ساعة', 'انتركم مرئي', 'مصاعد إيطالية مستوردة', 'جراج خاص', 'لاندسكيب ومساحات خضراء'].map((adv, i) => (
                      <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center flex flex-col items-center justify-center gap-2">
                        <CheckCircle className="w-6 h-6 text-[#d61c23]" />
                        <span className="text-xs font-bold text-gray-800">{adv}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            {/* ============================================================== */}
            {/* SECTION 4: فيديو تعريفي */}
            {/* ============================================================== */}
            <div id="section-video" className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 scroll-mt-36">
                <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#d61c23]" />
                  <span>جولة مصورة بالفيديو للمشروع</span>
                </h3>

                {videoEmbed ? (
                  <div className="rounded-2xl overflow-hidden aspect-video bg-black shadow-lg">
                    <iframe
                      src={videoEmbed}
                      title="فيديو المشروع"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <Video className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 font-bold">
                      سيتم إضافة الفيديو التعريفي للمشروع قريباً.
                    </p>
                  </div>
                )}
              </div>

            {/* ============================================================== */}
            {/* SECTION 5: الوحدات المتاحة بهذا المشروع */}
            {/* ============================================================== */}
            <div id="section-units" className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 scroll-mt-36">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#d61c23]" />
                    <span>الوحدات المتاحة بهذا المشروع</span>
                  </h3>
                  <span className="text-xs font-bold text-[#d61c23] bg-red-50 px-3 py-1 rounded-full">
                    {projectUnits.length} وحدة متوفرة
                  </span>
                </div>

                {projectUnits.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {projectUnits.map((unit) => (
                      <div
                        key={unit.id}
                        className="p-5 rounded-xl border border-gray-200 hover:border-[#d61c23] transition-all flex flex-col justify-between bg-white shadow-sm hover:shadow"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{unit.title}</h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                unit.status === 'Sold' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {unit.status === 'Sold' ? 'مباع' : 'متاح'}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
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
                          className="block text-center py-2.5 bg-gray-50 hover:bg-[#d61c23] text-[#d61c23] hover:text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          معاينة وتفاصيل الوحدة
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-xs text-gray-500 font-bold">
                      لا توجد وحدات معروضة للبيع في هذا المشروع حالياً.
                    </p>
                  </div>
                )}
              </div>

            {/* ============================================================== */}
            {/* SECTION 6: تفاصيل المشروع / بروشور PDF */}
            {/* ============================================================== */}
            <div id="section-pdf" className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 scroll-mt-36">
                <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#d61c23]" />
                  <span>بروشور ومخططات المشروع الرسمية (PDF)</span>
                </h3>

                {pdfBrochureUrl ? (
                  <div className="space-y-6">
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4 text-right">
                        <div className="w-16 h-16 rounded-2xl bg-[#d61c23] text-white flex items-center justify-center shrink-0 shadow-md">
                          <FileText className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-gray-900 mb-1">
                            الكتالوج الشامل لمشروع {project.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            يحتوي على كافة المساقط الأفقية، المواصفات التشطيبية، والمخطط العام.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowPdfViewer(true)}
                          className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs border border-gray-200 shadow-sm flex items-center gap-2 transition"
                        >
                          <Eye className="w-4 h-4 text-[#d61c23]" />
                          <span>معاينة البروشور</span>
                        </button>

                        <a
                          href={pdfBrochureUrl}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-2.5 rounded-xl bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold text-xs shadow flex items-center gap-2 transition"
                        >
                          <Download className="w-4 h-4" />
                          <span>تحميل نسخة PDF</span>
                        </a>
                      </div>
                    </div>

                    {/* In-page Embedded PDF viewer when user explicitly clicks preview */}
                    {showPdfViewer && (
                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-600">معاينة مستند الـ PDF:</span>
                          <button
                            onClick={() => setShowPdfViewer(false)}
                            className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>إغلاق المعاينة</span>
                          </button>
                        </div>
                        <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-gray-200 bg-slate-900 shadow-inner">
                          <iframe
                            src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfBrochureUrl)}&embedded=true`}
                            title="معاينة البروشور"
                            className="w-full h-full border-0"
                          ></iframe>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-2">
                    <FileText className="w-10 h-10 text-gray-400 mx-auto" />
                    <h4 className="text-sm font-bold text-gray-700">بروشور المشروع قيد التحديث</h4>
                    <p className="text-xs text-gray-500">
                      يمكنك طلب بروشور ومخططات المشروع مباشرة من خلال نموذج الاستفسار وسيقوم فريق المبيعات بإرساله لك.
                    </p>
                  </div>
                )}
              </div>
            </div>

          {/* Sidebar (1 Col): Direct Inquiry & Contact */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg sticky top-24">
              <h3 className="text-lg font-black text-gray-900 mb-2">
                استفسر عن هذا المشروع
              </h3>
              <p className="text-gray-500 text-xs mb-6">
                سجل بياناتك للتواصل المباشر مع استشاري المبيعات ومعرفة أحدث العروض والأسعار.
              </p>

              {submitted ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <h4 className="font-bold text-sm text-green-800">تم إرسال طلبك بنجاح!</h4>
                  <p className="text-xs text-green-700">
                    سيتواصل معك أحد مستشارينا في أقرب وقت.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">الاسم بالكامل *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسمك الكريم"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف (واتساب) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01xxxxxxxxx"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">رسالتك / استفسارك</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="أرغب في معرفة الوحدات المتاحة والمقدم وفترة السداد..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    />
                  </div>

                  {submitError && (
                    <p className="text-xs text-red-500 font-bold">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold py-3 rounded-lg text-sm shadow transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'جاري الإرسال...' : 'إرسال طلب الحجز والاستفسار'}</span>
                  </button>
                </form>
              )}

              {/* Direct Call / WhatsApp shortcuts */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-2.5">
                <a
                  href="tel:19473"
                  className="w-full py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-gray-200"
                >
                  <Phone className="w-4 h-4 text-[#f59e0b]" />
                  <span>الخط الساخن: 19473</span>
                </a>

                <a
                  href={`https://wa.me/201010099116?text=${encodeURIComponent(
                    `مرحباً، أود الاستفسار عن ${project.title}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-lg bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#128c7e] font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-[#25d366]/20"
                >
                  <i className="fa-brands fa-whatsapp text-sm text-[#25d366]"></i>
                  <span>محادثة واتساب مبيعات</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Lightbox Modal */}
      {selectedGalleryImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <button
            onClick={() => setSelectedGalleryImage(null)}
            className="absolute top-6 left-6 text-white hover:text-gray-300 p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedGalleryImage}
            alt="صورة مكبرة"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
