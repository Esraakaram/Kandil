'use client';

 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useState, useEffect } from 'react';
import { useParams } from '@/lib/navigation';
import { CheckCircle, Send, Play, X, ArrowLeft } from 'lucide-react';
import { api, getImageUrl } from '@/services/api';

const getEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

export const Finishing = () => {
  const params = useParams();
  const targetCatId = params?.finishCategoryId;
  const targetItemId = params?.FinishItemDetail;

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedFinishingItem, setSelectedFinishingItem] = useState(null);
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(true);

  // Consultation Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [packageChoice, setPackageChoice] = useState('تشطيب ألترا سوبر لوكس');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([api.getFinishCategories(), api.getCoverImages()])
      .then(([catsRes, coversRes]) => {
        setCategories(catsRes);
        
        let initialCat = catsRes[0] || null;
        if (targetCatId) {
          const matchedCat = catsRes.find((c) => String(c.id) === String(targetCatId));
          if (matchedCat) initialCat = matchedCat;
        }
        setSelectedCategory(initialCat);

        if (targetItemId && initialCat && Array.isArray(initialCat.items)) {
          const matchedItem = initialCat.items.find((i) => String(i.id) === String(targetItemId));
          if (matchedItem) setSelectedFinishingItem(matchedItem);
        }

        if (Array.isArray(coversRes)) {
          const cover = coversRes.find((c) => c.pageName && (c.pageName.includes('تشطيب') || c.pageName.includes('تشطبي')));
          if (cover && cover.imageName) {
            setCoverImage(getImageUrl(cover.imageName));
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching finishing:', err);
        setLoading(false);
      });
  }, [targetCatId, targetItemId]);

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitting(true);

    try {
      await api.createContact({
        name,
        phone,
        project: `طلب استشارة تشطيب: ${packageChoice}`,
        message: notes || 'طلب معاينة مهندس ديكور واستشارة في باقة التشطيب.'
      });
      setSubmitted(true);
      setName('');
      setPhone('');
      setNotes('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <div className="relative min-h-[220px] md:h-72 bg-[#26070a] text-white overflow-hidden flex items-center">
        {coverImage && (
          <img
            src={coverImage}
            alt="خدمات التشطيب والديكور"
            className="absolute inset-0 w-full h-full object-cover filter brightness-50"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full py-10">
          <span className="text-[#f59e0b] font-bold text-xs uppercase tracking-wider block mb-2">
            باقات تشطيب فندقية بمعايير عالمية
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2">
            خدمات التشطيب والديكور
          </h1>
          <p className="text-gray-300 text-sm max-w-xl">
            نحول وحدتك السكنية أو مقرك الإداري إلى تحفة معمارية مريحة مع ضمان الجودة والإشراف الهندسي المباشر.
          </p>
        </div>
      </div>

      {/* Main Categories Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${
                _optionalChain([selectedCategory, 'optionalAccess', _ => _.id]) === cat.id
                  ? 'bg-[#d61c23] text-white shadow-lg scale-103'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="space-y-10">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                {selectedCategory.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {selectedCategory.description}
              </p>
            </div>

            {/* Items in Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {selectedCategory.items.map((item) => {
                const imgSrc = item.imageName
                  ? getImageUrl(item.imageName)
                  : item.image
                  ? getImageUrl(item.image)
                  : '/uploads/e47551a2-8091-439c-aca7-e32ca4629129.png';
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedFinishingItem(item)}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between cursor-pointer hover:-translate-y-1"
                  >
                    <div>
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        <img
                          src={imgSrc}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = '/uploads/e47551a2-8091-439c-aca7-e32ca4629129.png';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        {item.videoUrl && (
                          <div className="absolute top-3 right-3 bg-[#d61c23] text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur">
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>فيديو متاح</span>
                          </div>
                        )}

                        {item.nameLocation && (
                          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur text-white text-xs px-2.5 py-1 rounded-lg">
                            {item.nameLocation}
                          </div>
                        )}
                      </div>

                      <div className="p-6 space-y-2">
                        <h3 className="font-black text-lg text-gray-900 group-hover:text-[#d61c23] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-[#d61c23] font-bold">
                        <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                        <span>مشمول بالضمان الهندسي المعتمد</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFinishingItem(item);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 group-hover:bg-[#d61c23] text-[#d61c23] group-hover:text-white font-bold text-xs border border-gray-200 group-hover:border-transparent transition-all shadow-sm"
                      >
                        <span>عرض التفاصيل والفيديو</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Item Detail Modal */}
      {selectedFinishingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedFinishingItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-20">
              <div>
                <span className="text-xs font-bold text-[#d61c23] block mb-1">
                  {selectedCategory?.title || 'خدمات التشطيب والديكور'}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-gray-900">
                  {selectedFinishingItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFinishingItem(null)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Video Player or Large Image */}
              {selectedFinishingItem.videoUrl ? (
                <div className="rounded-2xl overflow-hidden aspect-video bg-black shadow-xl border border-gray-200">
                  <iframe
                    src={getEmbedUrl(selectedFinishingItem.videoUrl)}
                    title={selectedFinishingItem.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden h-72 sm:h-96 bg-gray-100">
                  <img
                    src={
                      selectedFinishingItem.imageName
                        ? getImageUrl(selectedFinishingItem.imageName)
                        : selectedFinishingItem.image
                        ? getImageUrl(selectedFinishingItem.image)
                        : '/uploads/e47551a2-8091-439c-aca7-e32ca4629129.png'
                    }
                    alt={selectedFinishingItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Location / Meta */}
              {selectedFinishingItem.nameLocation && (
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                  <span className="text-[#d61c23]">الموقع / المشروع:</span>
                  <span>{selectedFinishingItem.nameLocation}</span>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-black text-gray-900">مواصفات ونبذة عن النموذج:</h4>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {selectedFinishingItem.description ||
                    'تم تنفيذ هذا النموذج بأرقى خامات التشطيب الفندقي تحت إشراف هندسي وتنفيذي مباشر، لضمان استغلال المساحات بأعلى جودة وعزل كامل.'}
                </p>
              </div>

              {/* Guarantee */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-emerald-900 block">ضمان شامل معتمد</span>
                  <span className="text-emerald-700">
                    كافة بنود التشطيب والأعمال الكهروميكانيكية مشمولة بضمان شركة قنديل والصيانة الدورية.
                  </span>
                </div>
              </div>

              {/* Action: Pre-fill consult form */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setPackageChoice(`تشطيب نموذج: ${selectedFinishingItem.title}`);
                    setSelectedFinishingItem(null);
                    document.getElementById('consult-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#d61c23] hover:bg-[#b7151b] text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>طلب استشارة أو معاينة لهذا النموذج</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFinishingItem(null)}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Request Form */}
      <section id="consult-section" className="max-w-4xl mx-auto px-4 scroll-mt-20">
        <div className="bg-gradient-to-br from-white to-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
              طلب استشارة وتكلفة تشطيب
            </h3>
            <p className="text-gray-500 text-sm">
              اترك بياناتك وسيتواصل معك مهندس الديكور المختص لتحديد موعد المعاينة وتقديم مقايسة أسعار تقديرية.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xl">
                ✓
              </div>
              <h4 className="font-bold text-base text-green-800">تم إرسال طلب استشارة التشطيب بنجاح!</h4>
              <p className="text-xs text-green-700">سيتواصل معك مهندسنا التنفيذي قريباً.</p>
            </div>
          ) : (
            <form onSubmit={handleConsultSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">الاسم بالكامل *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسمك"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف (واتساب) *</label>
                  <input
                    type="tel"
                    required
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                    placeholder="01xxxxxxxxx"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">باقة التشطيب المفضلة</label>
                <select
                  value={packageChoice}
                  onChange={(e) => setPackageChoice(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                >
                  <option value="تشطيب ألترا سوبر لوكس">تشطيب ألترا سوبر لوكس</option>
                  <option value="تشطيب فاخر VIP سمارت هوم">تشطيب فاخر VIP سمارت هوم</option>
                  <option value="تشطيب تجاري وإداري للمقرات">تشطيب تجاري وإداري للمقرات</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">مساحة الوحدة وملاحظاتك</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="المساحة التقريبية (مثلاً 180 م²)، الحي أو المنطقة، وأي طلبات خاصة..."
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold py-3.5 rounded-xl text-sm shadow transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'جاري الإرسال...' : 'إرسال طلب الاستشارة المجانية'}</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Finishing;
