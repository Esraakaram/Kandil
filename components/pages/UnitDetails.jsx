'use client';

import React, { useState, useEffect } from 'react';
import { useParams, Link } from '@/lib/navigation';
import {
  Maximize2,
  Bed,
  Bath,
  Calendar,
  MapPin,
  Phone,
  Send,
  Video,
  Eye,
  X,
  CheckCircle2,
  Layers,
  Sparkles,
  ExternalLink,
  Tag,
  Building
} from 'lucide-react';
import { api, getImageUrl } from '@/services/api';

export const UnitDetails = () => {
  const { unitId } = useParams();

  const [unit, setUnit] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [galleryModalImage, setGalleryModalImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inquiry form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!unitId) return;

    api.getUnitById(unitId)
      .then((data) => {
        setUnit(data);
        const cover = data.detailsCoverImage || data.imageName;
        setActiveImage(getImageUrl(cover));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching unit detail:', err);
        setLoading(false);
      });
  }, [unitId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitting(true);
    setErrorMsg('');

    try {
      await api.createContact({
        name,
        phone,
        email,
        project: unit ? `${unit.title} (${unit.nameLocation || unit.project?.name || ''})` : `وحدة ${unitId}`,
        message: message || 'أرغب في حجز موعد لمعاينة هذه الوحدة ومعرفة خطة السداد.'
      });
      setSubmitted(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setErrorMsg(err.message || 'فشل إرسال الرسالة، برجاء المحاولة لاحقاً');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#d61c23] border-t-transparent"></div>
        <p className="mt-3 text-sm text-gray-500 font-bold">جاري تحميل تفاصيل الوحدة العقارية...</p>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-black text-gray-800 mb-4">الوحدة غير متوفرة أو تم نقلها</h2>
        <Link to="/unit" className="text-[#d61c23] hover:underline font-bold text-sm">
          العودة لكافة الوحدات المتاحة
        </Link>
      </div>
    );
  }

  // Safe normalize images array
  const imageCandidates = [];
  if (unit.imageName && unit.imageName !== 'null') imageCandidates.push(unit.imageName);
  if (unit.detailsCoverImage && unit.detailsCoverImage !== 'null') imageCandidates.push(unit.detailsCoverImage);

  if (Array.isArray(unit.unitImages)) {
    unit.unitImages.forEach((img) => {
      const imgName = typeof img === 'object' && img?.imageName ? img.imageName : typeof img === 'string' ? img : null;
      if (imgName && imgName !== 'null' && !imageCandidates.includes(imgName)) {
        imageCandidates.push(imgName);
      }
    });
  }

  const allImages = imageCandidates.map((img) => getImageUrl(img));
  if (allImages.length === 0) {
    allImages.push(getImageUrl('default'));
  }

  // Safe normalize advantages
  let advantages = [];
  if (Array.isArray(unit.advantageUnits)) {
    advantages = unit.advantageUnits
      .map((a) => (typeof a === 'object' && a?.text ? a.text : typeof a === 'string' ? a : null))
      .filter(Boolean);
  } else if (typeof unit.advantageUnits === 'string' && unit.advantageUnits.trim()) {
    try {
      const parsed = JSON.parse(unit.advantageUnits);
      if (Array.isArray(parsed)) {
        advantages = parsed.map((a) => (typeof a === 'object' && a?.text ? a.text : String(a))).filter(Boolean);
      } else {
        advantages = unit.advantageUnits.split(/[\n,،]+/).map((s) => s.trim()).filter(Boolean);
      }
    } catch {
      advantages = unit.advantageUnits.split(/[\n,،]+/).map((s) => s.trim()).filter(Boolean);
    }
  }

  // Safe normalize services
  let services = [];
  if (Array.isArray(unit.serviceUnits)) {
    services = unit.serviceUnits
      .map((s) => (typeof s === 'object' && s?.text ? s.text : typeof s === 'string' ? s : null))
      .filter(Boolean);
  } else if (typeof unit.serviceUnits === 'string' && unit.serviceUnits.trim()) {
    try {
      const parsed = JSON.parse(unit.serviceUnits);
      if (Array.isArray(parsed)) {
        services = parsed.map((s) => (typeof s === 'object' && s?.text ? s.text : String(s))).filter(Boolean);
      } else {
        services = unit.serviceUnits.split(/[\n,،]+/).map((s) => s.trim()).filter(Boolean);
      }
    } catch {
      services = unit.serviceUnits.split(/[\n,،]+/).map((s) => s.trim()).filter(Boolean);
    }
  }

  // Format video embed url
  const getEmbedVideoUrl = (rawUrl) => {
    if (!rawUrl || rawUrl === 'null' || rawUrl === '') return null;
    if (rawUrl.includes('embed')) return rawUrl;
    const match = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : rawUrl;
  };
  const videoEmbed = getEmbedVideoUrl(unit.videoUrl);

  const hasCoordinates = unit.latitude && unit.longitude && Number(unit.latitude) !== 0 && Number(unit.longitude) !== 0;

  return (
    <div className="space-y-10 pb-20 bg-gray-50/50">
      {/* 1. Header Banner */}
      <div className="bg-[#26070a] text-white py-10 md:py-14 border-b border-[#3d0d12]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300 mb-4">
            <Link to="/home" className="hover:text-white transition">الرئيسية</Link>
            <span>/</span>
            <Link to="/unit" className="hover:text-white transition">الوحدات السكنية</Link>
            {unit.project && (
              <>
                <span>/</span>
                <Link to={`/projectcategory/0/project/${unit.project.id}/detail`} className="hover:text-[#f59e0b] transition">
                  {unit.project.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-[#f59e0b] font-bold truncate max-w-xs">{unit.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                {unit.project && (
                  <span className="text-xs font-bold text-[#f59e0b] bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    {unit.project.name}
                  </span>
                )}

                {unit.codeUnit && unit.codeUnit !== 'null' && (
                  <span className="text-xs font-mono font-bold bg-[#d61c23] px-3 py-1 rounded-full text-white shadow-sm">
                    كود: {unit.codeUnit}
                  </span>
                )}

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                    unit.status === 'Sold'
                      ? 'bg-red-950/80 text-red-200 border border-red-700/60'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {unit.status === 'Sold' ? 'تم البيع' : 'متاح للحجز والبيع'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                {unit.title}
              </h1>

              <p className="text-gray-300 text-xs sm:text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#d61c23] shrink-0" />
                <span>{unit.nameLocation || unit.project?.areaName || 'القاهرة الجديدة'}</span>
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 text-right md:text-left shrink-0">
              <span className="text-xs text-gray-300 block font-semibold mb-1">
                {unit.typePrice ? `نظام السداد (${unit.typePrice})` : 'السعر المطلوب'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl md:text-4xl font-black font-mono text-[#f59e0b]">
                  {unit.price > 0 ? unit.price.toLocaleString('ar-EG') : 'اتصل للأسعار'}
                </span>
                <span className="text-xs text-white/90 font-bold">جنيه مصري</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content & Sidebar */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery / Floorplan Viewer */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div
                className="relative h-[340px] sm:h-[460px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer group bg-slate-50 border border-gray-100 flex items-center justify-center p-3"
                onClick={() => setGalleryModalImage(activeImage)}
                title="اضغط لتكبير الصورة أو المسقط الهندسي"
              >
                <img
                  src={activeImage}
                  alt={unit.title}
                  className="max-w-full max-h-full object-contain mx-auto group-hover:scale-103 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
                  }}
                />

                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 opacity-90 group-hover:opacity-100 transition shadow">
                  <Eye className="w-4 h-4 text-[#f59e0b]" />
                  <span>انقر لتكبير المسقط وعرض كامل التفاصيل</span>
                </div>
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`relative w-24 h-18 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImage === img ? 'border-[#d61c23] shadow-md scale-103' : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`صورة ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Technical Specifications Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#d61c23]" />
                <span>المواصفات الفنية للوحدة</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-100 transition">
                  <Maximize2 className="w-6 h-6 text-[#d61c23] mx-auto mb-2" />
                  <span className="text-[11px] text-gray-400 block font-bold">المساحة</span>
                  <span className="font-black text-base text-gray-900 font-mono">{unit.area} م²</span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-100 transition">
                  <Bed className="w-6 h-6 text-[#d61c23] mx-auto mb-2" />
                  <span className="text-[11px] text-gray-400 block font-bold">غرف النوم</span>
                  <span className="font-black text-base text-gray-900 font-mono">{unit.numberRoom} غرف</span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-100 transition">
                  <Bath className="w-6 h-6 text-[#d61c23] mx-auto mb-2" />
                  <span className="text-[11px] text-gray-400 block font-bold">الحمامات</span>
                  <span className="font-black text-base text-gray-900 font-mono">{unit.numberBathroom} حمام</span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-red-100 transition">
                  <Calendar className="w-6 h-6 text-[#d61c23] mx-auto mb-2" />
                  <span className="text-[11px] text-gray-400 block font-bold">سنة الاستلام</span>
                  <span className="font-black text-base text-gray-900 font-mono">{unit.yearOfBuild || '2027'}</span>
                </div>
              </div>

              {/* Extra Spec pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-bold">نظام الدفع:</span>
                  <span className="text-[#d61c23] font-black">{unit.typePrice || 'كاش'}</span>
                </div>
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-bold">كود الوحدة:</span>
                  <span className="text-gray-800 font-mono font-black">{unit.codeUnit && unit.codeUnit !== 'null' ? unit.codeUnit : 'غير محدد'}</span>
                </div>
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-bold">حالة الوحدة:</span>
                  <span className={`font-black ${unit.status === 'Sold' ? 'text-red-600' : 'text-green-600'}`}>
                    {unit.status === 'Sold' ? 'تم البيع' : 'متاحة للبيع'}
                  </span>
                </div>
              </div>
            </div>

            {/* Advantages Section */}
            {advantages.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#d61c23]" />
                  <span>مميزات هذه الوحدة</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {advantages.map((adv, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3 hover:bg-red-50/40 hover:border-red-200 transition"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#d61c23] shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-gray-800">{adv}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services Section */}
            {services.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#d61c23]" />
                  <span>الخدمات المتاحة</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {services.map((srv, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3 hover:bg-red-50/40 hover:border-red-200 transition"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#f59e0b] shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-gray-800">{srv}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description / Overview */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#d61c23]" />
                <span>تفاصيل ووصف الوحدة</span>
              </h3>
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-3"
                dangerouslySetInnerHTML={{
                  __html: unit.description || `<p>${unit.title} بموقع متميز بالقاهرة الجديدة.</p>`
                }}
              />
            </div>

            {/* Location & Google Maps */}
            {hasCoordinates && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#d61c23]" />
                    <span>موقع الوحدة على الخريطة</span>
                  </h3>
                  <a
                    href={`https://www.google.com/maps?q=${unit.latitude},${unit.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#d61c23] hover:underline bg-red-50 px-3 py-1.5 rounded-xl w-fit"
                  >
                    <span>فتح في خرائط Google</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-xs text-gray-500 font-bold">
                  {unit.nameLocation || 'القاهرة الجديدة'}
                </p>

                <div className="w-full h-80 rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-gray-100">
                  <iframe
                    title="موقع الوحدة"
                    src={`https://maps.google.com/maps?q=${unit.latitude},${unit.longitude}&z=15&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Video Walkthrough */}
            {videoEmbed && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Video className="w-5 h-5 text-[#d61c23]" />
                  <span>فيديو توضيحي للوحدة</span>
                </h3>
                <div className="rounded-2xl overflow-hidden aspect-video bg-black shadow-lg">
                  <iframe
                    src={videoEmbed}
                    title="فيديو الوحدة"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (1 col): Inquiry & Booking */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-24">
              <h3 className="text-lg font-black text-gray-900 mb-1">
                احجز موعد للمعاينة
              </h3>
              <p className="text-gray-500 text-xs mb-6">
                سجل بياناتك للتواصل المباشر مع استشاري المبيعات لمعاينة هذه الوحدة على أرض الواقع ومعرفة أنسب خطط السداد.
              </p>

              {submitted ? (
                <div className="p-5 bg-green-50 border border-green-200 rounded-2xl text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-lg">
                    ✓
                  </div>
                  <h4 className="font-bold text-sm text-green-800">تم إرسال طلبك بنجاح!</h4>
                  <p className="text-xs text-green-700">
                    سيتواصل معك مستشار مبيعات قنديل خلال ساعات قليلة.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">الاسم بالكامل *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسمك الكريم"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
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
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mail@example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">ملاحظات أو استفسار</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="أود معرفة تفاصيل الأقساط والمقدم والموعد المناسب للمعاينة..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-500 font-bold">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold py-3 rounded-xl text-sm shadow transition-all flex items-center justify-center gap-2 hover:shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'جاري الإرسال...' : 'تأكيد طلب المعاينة'}</span>
                  </button>
                </form>
              )}

              {/* Direct call / WhatsApp shortcuts */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-2.5">
                <a
                  href={`https://wa.me/201010099116?text=${encodeURIComponent(
                    `مرحباً، أود الاستفسار عن ${unit.title} (كود: ${unit.codeUnit || unit.id})`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#128c7e] font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-[#25d366]/20"
                >
                  <i className="fa-brands fa-whatsapp text-sm text-[#25d366]"></i>
                  <span>تواصل واتساب مع المبيعات</span>
                </a>

                <a
                  href="tel:19473"
                  className="w-full py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-gray-200"
                >
                  <Phone className="w-4 h-4 text-[#f59e0b]" />
                  <span>الخط الساخن: 19473</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {galleryModalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setGalleryModalImage(null)}
        >
          <button
            onClick={() => setGalleryModalImage(null)}
            className="absolute top-6 left-6 text-white hover:text-gray-300 p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={galleryModalImage}
            alt="صورة مكبرة"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default UnitDetails;
