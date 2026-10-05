'use client';

 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useState, useEffect } from 'react';

import { CheckCircle, Send, } from 'lucide-react';
import { api } from '@/services/api';


export const Finishing = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Consultation Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [packageChoice, setPackageChoice] = useState('تشطيب ألترا سوبر لوكس');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getFinishCategories()
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setSelectedCategory(data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching finishing:', err);
        setLoading(false);
      });
  }, []);

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
      <div className="bg-[#26070a] text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
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
              {selectedCategory.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-6 space-y-2">
                    <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
                  </div>

                  <div className="px-6 pb-6">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#d61c23] font-bold">
                      <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                      <span>مشمول بالضمان الهندسي</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Consultation Request Form */}
      <section className="max-w-4xl mx-auto px-4">
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
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
