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
        setActiveImage(getImageUrl(data.imageName));
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
        project: unit ? `${unit.title} (${unit.nameLocation})` : `وحدة ${unitId}`,
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
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#d61c23] border-t-transparent"></div>
        <p className="mt-2 text-sm text-gray-500">جاري تحميل تفاصيل الوحدة...</p>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">الوحدة غير متوفرة</h2>
        <Link to="/unit" className="text-[#d61c23] hover:underline font-bold">
          العودة لكافة الوحدات المتاحة
        </Link>
      </div>
    );
  }

  const allImages = [
    getImageUrl(unit.imageName),
    ...(unit.unitImages || []).map((img) => getImageUrl(img.imageName))
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Breadcrumb Header */}
      <div className="bg-[#26070a] text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-xs text-gray-300 mb-3">
            <Link to="/home" className="hover:text-white">الرئيسية</Link>
            <span>/</span>
            <Link to="/unit" className="hover:text-white">الوحدات السكنية</Link>
            <span>/</span>
            <span className="text-[#f59e0b] font-bold">{unit.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#f59e0b] bg-white/10 px-3 py-1 rounded-full">
                  {unit.project?.name || 'مشروع قنديل'}
                </span>
                {unit.codeUnit && (
                  <span className="text-xs font-mono font-bold bg-[#d61c23]/80 px-2.5 py-1 rounded-full text-white">
                    قطعة {unit.codeUnit}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
                {unit.title}
              </h1>
              <p className="text-gray-300 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#ea0600]" />
                <span>{unit.nameLocation || 'القاهرة الجديدة'}</span>
              </p>
            </div>

            <div className="text-right md:text-left">
              <span className="text-xs text-gray-300 block">{unit.typePrice || 'المقدم المطلوبة'}</span>
              <span className="text-2xl md:text-3xl font-black font-mono text-[#f59e0b]">
                {unit.price > 0 ? unit.price.toLocaleString('ar-EG') : 'اتصل للأسعار'}
              </span>
              <span className="text-xs text-white mr-1">جنيه</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery Section */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div
                className="relative h-[360px] sm:h-[460px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer group bg-slate-50 border border-gray-100 flex items-center justify-center p-3"
                onClick={() => setGalleryModalImage(activeImage)}
                title="اضغط للتكبير وعرض المخطط بالكامل"
              >
                <img
                  src={activeImage}
                  alt={unit.title}
                  className="max-w-full max-h-full object-contain mx-auto group-hover:scale-103 transition-transform duration-300"
                  onError={(e) => {
                    (e.target ).src =
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <span
                  className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full shadow ${
                    unit.status === 'Sold' ? 'bg-red-500 text-white' : 'bg-[#22c55e] text-white'
                  }`}
                >
                  {unit.status === 'Sold' ? 'تم البيع' : 'متاح للبيع'}
                </span>

                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition">
                  <Eye className="w-4 h-4 text-[#f59e0b]" />
                  <span>انقر لتكبير المسقط والمخطط</span>
                </div>
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        activeImage === img ? 'border-[#d61c23] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specs Grid */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-3">
                المواصفات الفنية للوحدة
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <Maximize2 className="w-6 h-6 text-[#d61c23] mx-auto mb-2" />
                  <span className="text-xs text-gray-400 block font-semibold">المساحة</span>
                  <span className="font-bold text-base text-gray-800">{unit.area} م²</span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <Bed className="w-6 h-6 text-[#d61c23] mx-auto mb-2" />
                  <span className="text-xs text-gray-400 block font-semibold">غرف النوم</span>
                  <span className="font-bold text-base text-gray-800">{unit.numberRoom} غرف</span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <Bath className="w-6 h-6 text-[#d61c23] mx-auto mb-2" />
                  <span className="text-xs text-gray-400 block font-semibold">الحمامات</span>
                  <span className="font-bold text-base text-gray-800">{unit.numberBathroom} حمام</span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <Calendar className="w-6 h-6 text-[#d61c23] mx-auto mb-2" />
                  <span className="text-xs text-gray-400 block font-semibold">سنة الاستلام</span>
                  <span className="font-bold text-base text-gray-800">{unit.yearOfBuild || '2027'}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <h3 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-3">
                تفاصيل ومميزات الوحدة
              </h3>
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: unit.description || `<p>${unit.title} بموقع متميز بالقاهرة الجديدة.</p>`
                }}
              />
            </div>

            {/* Video Walkthrough */}
            {unit.videoUrl && unit.videoUrl !== 'null' && (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#d61c23]" />
                  <span>فيديو توضيحي للوحدة</span>
                </h3>
                <div className="rounded-xl overflow-hidden aspect-video bg-black">
                  <iframe
                    src={unit.videoUrl}
                    title="فيديو الوحدة"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Inquiry Form */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg sticky top-24">
              <h3 className="text-lg font-black text-gray-900 mb-1">
                احجز موعد للمعاينة
              </h3>
              <p className="text-gray-500 text-xs mb-6">
                سجل بياناتك للتواصل المباشر مع استشاري المبيعات لمعاينة هذه الوحدة على أرض الواقع.
              </p>

              {submitted ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <h4 className="font-bold text-sm text-green-800">تم إرسال طلب المعاينة بنجاح!</h4>
                  <p className="text-xs text-green-700">
                    سيتواصل معك فريق مبيعات قنديل خلال 24 ساعة.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكريم *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسمك"
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
                      placeholder="mail@example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">ملاحظات أو أسئلة</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="أود معرفة تفاصيل الأقساط والمقدم..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-500 font-bold">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold py-3 rounded-lg text-sm shadow transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'جاري الإرسال...' : 'تأكيد طلب المعاينة'}</span>
                  </button>
                </form>
              )}

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-2.5">
                <a
                  href={`https://wa.me/201010099116?text=${encodeURIComponent(
                    `مرحباً، أود الاستفسار عن ${unit.title} كود ${unit.id}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-lg bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#128c7e] font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-[#25d366]/20"
                >
                  <i className="fa-brands fa-whatsapp text-sm text-[#25d366]"></i>
                  <span>تواصل واتساب مع المبيعات</span>
                </a>

                <a
                  href="tel:19473"
                  className="w-full py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-gray-200"
                >
                  <Phone className="w-4 h-4 text-[#f59e0b]" />
                  <span>الخط الساخن: 19473</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Lightbox */}
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
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default UnitDetails;
