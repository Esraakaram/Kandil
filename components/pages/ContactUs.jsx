'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { api } from '@/services/api';

export const ContactUs = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [project, setProject] = useState('مشروع عام');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Egyptian phone validation: exactly 11 digits
    const cleanedPhone = phone.trim().replace(/\D/g, '');
    if (cleanedPhone.length < 11) {
      setErrorMessage('يرجى إدخال رقم هاتف صحيح مكون من 11 رقماً (مثال: 01012345678)');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      await api.createContact({
        name,
        phone: cleanedPhone,
        email,
        project,
        message
      });
      setSubmitted(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setErrorMessage(err.message || 'حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة لاحقاً');
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
            يسعدنا تواصلكم دائماً
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2">
            اتصل بنا
          </h1>
          <p className="text-gray-300 text-sm max-w-xl">
            فريق مبيعات وخدمة عملاء قنديل على أتم استعداد للإجابة عن كافة استفساراتكم وتقديم المشورة العقارية المتخصصة.
          </p>
        </div>
      </div>

      {/* Main Grid: Info Cards + Form */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Info Cards Column */}
          <div className="space-y-4">
            {/* Headquarters Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#d61c23]/10 text-[#d61c23] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900 mb-1">المقر الرئيسي</h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  ٢١ مكرم عبيد - مدينة نصر - القاهرة - جمهورية مصر العربية
                </p>
              </div>
            </div>

            {/* Hotline Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/10 text-[#f59e0b] flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900 mb-1">الخط الساخن المباشر</h3>
                <a href="tel:19473" className="font-mono text-xl font-black text-[#d61c23] hover:underline block">
                  19473
                </a>
                <span className="text-[11px] text-gray-400">سعر المكالمة العادية</span>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#25d366]/10 text-[#25d366] flex items-center justify-center shrink-0">
                <i className="fa-brands fa-whatsapp text-2xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900 mb-1">واتساب المبيعات</h3>
                <a
                  href="https://wa.me/201010099116"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-sm font-bold text-gray-800 hover:text-[#25d366] block"
                >
                  +20 101 009 9116
                </a>
                <span className="text-[11px] text-gray-400">رد فوري على مدار الساعة</span>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#d61c23]/10 text-[#d61c23] flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900 mb-1">البريد الإلكتروني</h3>
                <a href="mailto:info@kandil-realestate.com" className="text-xs font-semibold text-gray-700 hover:text-[#d61c23] block">
                  info@kandil-realestate.com
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900 mb-1">مواعيد العمل</h3>
                <p className="text-gray-600 text-xs">
                  يومياً من السبت إلى الخميس: 10:00 صباحاً - 7:00 مساءً
                </p>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-xl space-y-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">
                  أرسل لنا رسالة أو استفسار
                </h2>
                <p className="text-gray-500 text-xs leading-relaxed">
                  املأ البيانات وسيقوم ممثل خدمة العملاء بالتواصل معك وتزويدك بكافة الكتيبات وتفاصيل الأسعار.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-green-900">تم إرسال رسالتك بنجاح!</h3>
                  <p className="text-sm text-green-700 max-w-md mx-auto">
                    شكراً لتواصلك مع شركة قنديل للاستثمار العقاري. سيتواصل معك أحد مستشارينا في أقرب فرصة.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">الاسم الكامل *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="أدخل اسمك الكريم"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">رقم الهاتف *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01xxxxxxxxx (11 رقم)"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">البريد الإلكتروني *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@mail.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">المشروع أو المنطقة المراد الاستفسار عنها</label>
                      <select
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      >
                        <option value="مشروع عام">استفسار عام</option>
                        <option value="مشروعات النرجس الجديدة">مشروعات النرجس الجديدة</option>
                        <option value="مشروعات بيت الوطن">مشروعات بيت الوطن</option>
                        <option value="مشروعات شمال الرحاب">مشروعات شمال الرحاب</option>
                        <option value="مشروعات النورث هاوس">مشروعات النورث هاوس</option>
                        <option value="مشروعات تجارية وإدارية">مشروعات تجارية وإدارية</option>
                        <option value="خدمات التشطيب والديكور">خدمات التشطيب والديكور</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">الرسالة أو تفاصيل الاستفسار *</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="اكتب هنا تفاصيل استفسارك أو طلبك..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-xs text-red-600 font-bold bg-red-50 p-3 rounded-lg border border-red-200">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'جاري الإرسال...' : 'إرسال الرسالة الآن'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Google Map of Nasr City Headquarters */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-md space-y-3">
          <div className="flex items-center gap-2 px-2">
            <MapPin className="w-5 h-5 text-[#d61c23]" />
            <h3 className="font-black text-gray-900 text-base">موقع المقر الرئيسي على الخريطة (٢١ مكرم عبيد)</h3>
          </div>
          <div className="rounded-2xl overflow-hidden h-80 sm:h-96 w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.197992769208!2d31.3468536!3d30.0601334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e74288b5847%3A0xe6736a49db71da1a!2zMjEg2YXZg9ix2YUg2LnYqNmK2K_YjCDYp9mE2YXZhti32YLYqSDYp9mE2LPYp9iv2LPYqdiMINmF2K_ZitmG2Kkg2YbYtdix2Iwg2YXYrdin2YHYuNipINin2YTZgtin2YfYsdip!5e0!3m2!1sar!2seg!4v1700000000000!5m2!1sar!2seg"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="مقر قنديل للاستثمار العقاري"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
