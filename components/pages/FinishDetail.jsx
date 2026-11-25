'use client';

import React, { useState, useEffect } from 'react';
import { useParams, Link } from '@/lib/navigation';
import {
  ArrowRight,
  Play,
  CheckCircle2,
  MapPin,
  Send,
  Phone,
  Sparkles,
  Share2,
  Eye,
  X,
  Layers,
  ShieldCheck,
  Check
} from 'lucide-react';
import { api, getImageUrl } from '@/services/api';

export const FinishDetail = () => {
  const { finishCategoryId, FinishItemDetail } = useParams();

  const [category, setCategory] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState('image'); // 'image' or 'video'
  const [selectedGalleryImg, setSelectedGalleryImg] = useState('');
  const [modalImg, setModalImg] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [socialData, setSocialData] = useState({ whatsapp: '201010099116', hotline: '19473' });

  useEffect(() => {
    window.scrollTo(0, 0);

    api.getSocialLinks()
      .then((res) => {
        if (res && res.socialLinks && Array.isArray(res.socialLinks)) {
          const wa = res.socialLinks.find((l) => l.type === 4)?.url;
          const phoneNum = res.socialLinks.find((l) => l.type === 6)?.url;
          if (wa) setSocialData((prev) => ({ ...prev, whatsapp: wa }));
          if (phoneNum) setSocialData((prev) => ({ ...prev, hotline: phoneNum }));
        }
      })
      .catch(() => {});

    api.getFinishCategories()
      .then((cats) => {
        if (Array.isArray(cats)) {
          const cat = cats.find(
            (c) => String(c.id) === String(finishCategoryId)
          ) || cats[0];

          if (cat) {
            setCategory(cat);
            if (Array.isArray(cat.items)) {
              const foundItem = cat.items.find(
                (i) => String(i.id) === String(FinishItemDetail)
              ) || cat.items[0];
              if (foundItem) {
                setItem(foundItem);
                const initImg = foundItem.images?.[0]
                  ? getImageUrl(foundItem.images[0])
                  : foundItem.image
                  ? getImageUrl(foundItem.image)
                  : '/uploads/e47551a2-8091-439c-aca7-e32ca4629129.png';
                setSelectedGalleryImg(initImg);
                if (foundItem.videoUrl) {
                  setActiveMedia('video');
                }
              }
            }
          }
        }
      })
      .catch((err) => console.error('Error fetching finish model details:', err))
      .finally(() => setLoading(false));
  }, [finishCategoryId, FinishItemDetail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setSubmitting(true);
    try {
      await api.createContact({
        name,
        phone,
        email: '',
        message: `طلب معاينة/استشارة تشطيب نموذج [${item?.title || 'نموذج تشطيب'}] - قسم [${category?.title || ''}]. تفاصيل العميل: ${message}`
      });
      setSubmitted(true);
      setName('');
      setPhone('');
      setMessage('');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً');
    } finally {
      setSubmitting(false);
    }
  };

  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : null;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 bg-gray-50/50">
        <div className="w-12 h-12 border-4 border-[#d61c23] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-gray-500">جاري تحميل تفاصيل نموذج التشطيب...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-[#d61c23] flex items-center justify-center mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">نموذج التشطيب غير متوفر</h2>
        <p className="text-xs text-gray-500 mb-6">قد تم نقل أو حذف هذا النموذج.</p>
        <Link
          to="/finishcategory"
          className="px-6 py-3 bg-[#d61c23] hover:bg-[#b7151b] text-white text-xs font-bold rounded-xl shadow"
        >
          العودة لكافة نماذج التشطيب
        </Link>
      </div>
    );
  }

  const allImages = Array.isArray(item.images) && item.images.length > 0
    ? item.images.map((img) => getImageUrl(img))
    : item.image
    ? [getImageUrl(item.image)]
    : ['/uploads/e47551a2-8091-439c-aca7-e32ca4629129.png'];

  const embedUrl = getYoutubeEmbed(item.videoUrl);

  return (
    <div className="space-y-12 pb-24 bg-gray-50/50">
      {/* Top Breadcrumb Bar */}
      <div className="bg-[#1f242e] text-white py-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Link to="/home" className="hover:text-white transition">الرئيسية</Link>
            <span>/</span>
            <Link to="/finishcategory" className="hover:text-white transition">خدمات التشطيب والديكور</Link>
            {category && (
              <>
                <span>/</span>
                <Link to={`/finishcategory/${category.id}`} className="hover:text-white transition">
                  {category.title}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-[#f59e0b] font-bold">{item.title}</span>
          </div>

          <Link
            to={category ? `/finishcategory/${category.id}` : '/finishcategory'}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-lg transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لقائمة النماذج</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Media & Details Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Model Title & Badges */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="bg-[#d61c23]/10 text-[#d61c23] px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{category?.title || 'نموذج تشطيب هندسي معتمد'}</span>
                </span>

                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>ضمان هندسي معتمد 100%</span>
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-snug">
                {item.title}
              </h1>

              {item.nameLocation && (
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <MapPin className="w-4 h-4 text-[#d61c23]" />
                  <span>الموقع / التنفيذ: {item.nameLocation}</span>
                </div>
              )}
            </div>

            {/* Main Interactive Showcase (Video & Images) */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              {/* Media Switcher Tabs if Video exists */}
              {item.videoUrl && (
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <button
                    type="button"
                    onClick={() => setActiveMedia('video')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                      activeMedia === 'video'
                        ? 'bg-[#d61c23] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>فيديو جولة النموذج</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMedia('image')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                      activeMedia === 'image'
                        ? 'bg-[#d61c23] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span>معرض الصور ({allImages.length})</span>
                  </button>
                </div>
              )}

              {/* Media Display Container */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video shadow-inner">
                {activeMedia === 'video' && embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  ></iframe>
                ) : activeMedia === 'video' && item.videoUrl ? (
                  <video
                    src={item.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  ></video>
                ) : (
                  <div
                    onClick={() => setModalImg(selectedGalleryImg)}
                    className="w-full h-full cursor-zoom-in relative group"
                  >
                    <img
                      src={selectedGalleryImg}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span className="bg-black/75 backdrop-blur text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg">
                        <Eye className="w-4 h-4" />
                        <span>تكبير الصورة</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnails Strip */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto py-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedGalleryImg(img);
                        setActiveMedia('image');
                      }}
                      className={`relative w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        selectedGalleryImg === img && activeMedia === 'image'
                          ? 'border-[#d61c23] ring-2 ring-[#d61c23]/30 scale-105'
                          : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description & Specifications */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-3 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#d61c23]" />
                  <span>مواصفات وتفاصيل التشطيب والديكور</span>
                </h3>
                <div className="text-gray-700 text-sm md:text-base leading-loose whitespace-pre-line">
                  {item.description || 'يقدم هذا النموذج حلول تشطيب وديكور متكاملة بأعلى معايير الجودة والتصميم المعماري الحديث، باستخدام خامات فاخرة وتوزيع إضاءة مدروس يمنح وحدتك رحابة وأناقة استثنائية.'}
                </div>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2.5 text-xs font-bold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>إشراف هندسي وتنفيذي كامل للمشروع</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>أجود الخامات المعتمدة محلياً ودولياً</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>التزام صارم بجدول التسليم والمواصفات</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>شهادة ضمان مكتوبة بعد إتمام الأعمال</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column: Form & Direct Actions */}
          <div className="space-y-6">
            {/* Consultation Form Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm sticky top-24 space-y-6">
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  طلب استشارة أو معاينة النموذج
                </h3>
                <p className="text-xs text-gray-500">
                  سيتواصل معك مهندس الديكور المختص لتقديم أفضل باقات التشطيب والتسعير.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-6 h-6 stroke-2" />
                  </div>
                  <h4 className="font-black text-base text-emerald-900">تم استلام طلبك بنجاح!</h4>
                  <p className="text-xs text-emerald-700">
                    سيتواصل معك فريق التشطيبات والديكور في أقرب وقت عبر الواتساب أو الهاتف.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-emerald-800 underline"
                  >
                    إرسال استفسار آخر
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكريم *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسمك"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف (واتساب) *</label>
                    <input
                      type="tel"
                      required
                      inputMode="numeric"
                      pattern="[0-9+]*"
                      value={phone}
                      onKeyDown={(e) => {
                        if (e.key.length === 1 && !/[0-9+]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                          e.preventDefault();
                        }
                      }}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9+]/g, '');
                      }}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                      onPaste={(e) => {
                        e.preventDefault();
                        const paste = (e.clipboardData || window.clipboardData).getData('text');
                        setPhone((prev) => (prev + paste.replace(/[^0-9+]/g, '')).slice(0, 20));
                      }}
                      placeholder="01xxxxxxxxx (أرقام فقط)"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">مساحة وحدتك أو ملاحظاتك</label>
                    <textarea
                      rows="3"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="مثال: شقة 180م بالتجمع الخامس أرغب في تشطيب الترا سوبر لوكس..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'جاري إرسال الطلب...' : 'إرسال طلب الاستشارة والمعاينة'}</span>
                  </button>
                </form>
              )}

              {/* Direct WhatsApp shortcut */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <a
                  href={`https://wa.me/${socialData.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `مرحباً، أود الاستفسار عن باقة وتفاصيل تشطيب نموذج [${item.title}]`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#128c7e] font-bold text-xs flex items-center justify-center gap-2 transition border border-[#25d366]/20 shadow-sm"
                >
                  <i className="fa-brands fa-whatsapp text-base text-[#25d366]"></i>
                  <span>تواصل واتساب مع مهندس الديكور</span>
                </a>

                <a
                  href={`tel:${socialData.hotline}`}
                  className="w-full py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 transition border border-gray-200"
                >
                  <Phone className="w-4 h-4 text-[#f59e0b]" />
                  <span>اتصل بالخط الساخن: {socialData.hotline}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {modalImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setModalImg(null)}
        >
          <button
            type="button"
            onClick={() => setModalImg(null)}
            className="absolute top-6 right-6 text-white bg-white/20 hover:bg-[#d61c23] p-2.5 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={modalImg}
            alt="تكبير صورة التشطيب"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default FinishDetail;
