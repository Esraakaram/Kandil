'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/lib/navigation';
import { ShieldCheck, Award, CheckCircle2, Handshake, } from 'lucide-react';
import { api, getImageUrl } from '@/services/api';


export const WhyUs = () => {
  const [whyUsItems, setWhyUsItems] = useState([]);
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getWhyUs(), api.getCoverImages()])
      .then(([whyUsRes, coversRes]) => {
        setWhyUsItems(whyUsRes);
        const cover = coversRes.find((c) => c.pageName === 'لماذا قنديل');
        if (cover) setCoverImage(getImageUrl(cover.imageName));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching WhyUs:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 bg-[#26070a] text-white overflow-hidden flex items-center">
        {coverImage && (
          <img
            src={coverImage}
            alt="لماذا قنديل"
            className="absolute inset-0 w-full h-full object-cover filter brightness-50"
            onError={(e) => {
              (e.target ).style.display = 'none';
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <span className="text-[#f59e0b] font-bold text-xs md:text-sm uppercase tracking-wider block mb-2">
              منذ عام 2001
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3">
              لماذا قنديل للاستثمار العقاري؟
            </h1>
            <p className="text-gray-200 text-sm md:text-base">
              أكثر من اثنان وعشرون عاماً في صدارة التطوير العقاري وبناء المجتمعات السكنية الراقية.
            </p>
          </div>
        </div>
      </div>

      {/* Main Story & Vision */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[#d61c23] font-extrabold text-sm uppercase tracking-wider block">
              عن الشركة
            </span>
            <h2 className="text-3xl font-black text-gray-900 leading-tight">
              نبني الثقة قبل أن نبني الجدران
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              تأسست شركة قنديل للاستثمار العقاري وإدارة المشروعات في عام 2001 بخبرة تقارب 22 عاماً في مجال البناء والتشييد والمقاولات العامة بالمدن الجديدة في جمهورية مصر العربية.
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              اعتمدت الشركة منذ نشأتها على خطط استراتيجية ترتكز على تلبية تطلعات العملاء، واختيار أرقى المواقع في القاهرة الجديدة، مع تطبيق أعلى المعايير الهندسية والإنشائية الحديثة.
            </p>

            <div className="p-6 bg-[#d61c23]/5 border-r-4 border-[#d61c23] rounded-l-xl">
              <p className="text-[#d61c23] font-bold text-base italic leading-relaxed">
                "نعتمد على رؤية واضحة واستراتيجيات مبتكرة لتحقيق أهداف عملائنا بأعلى مستويات الجودة والاحترافية، لنكون الخيار الأول لمن يبحث عن مسكن راقٍ أو استثمار عقاري مضمون العائد."
              </p>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
              alt="مشروع قنديل"
              className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-[#f59e0b] text-[#26070a] p-6 rounded-2xl shadow-xl hidden sm:block">
              <span className="block font-black text-4xl font-mono">+22</span>
              <span className="font-extrabold text-sm">عاماً من الريادة العقارية</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              ركائزنا الأساسية
            </h2>
            <p className="text-gray-500 text-sm">
              مبادئ راسخة وضعتها الإدارة لتوجيه كافة مسارات العمل والإنشاء.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#d61c23]/10 text-[#d61c23] flex items-center justify-center mb-5">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">الثقة</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                نبني جسوراً من الشفافية والصدق المتبادل مع كل عميل يختار عائلة قنديل.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#d61c23]/10 text-[#d61c23] flex items-center justify-center mb-5">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">الجودة</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                استخدام أجود أنواع حديد التسليح والخرسانات الجاهزة والعوازل المائية والحرارية.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#d61c23]/10 text-[#d61c23] flex items-center justify-center mb-5">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">الالتزام</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                تسليم الوحدات السكنية في التواريخ المتفق عليها دون أي تأخير أو تغيير في المواصفات.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#d61c23]/10 text-[#d61c23] flex items-center justify-center mb-5">
                <Handshake className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">خدمة ما بعد البيع</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                متابعة دورية لكفاءة المباني ومرافقها ومساعدة الملاك في كافة الإجراءات القانونية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Video Tour */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
            جولة تعريفية داخل مشروعات قنديل
          </h2>
          <p className="text-gray-500 text-sm">
            شاهد على أرض الواقع معايير التشطيب الفندقي والتصميمات المعمارية الراقية.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl max-w-4xl mx-auto aspect-video bg-black">
          <iframe
            src="https://www.youtube.com/embed/5oXlbsDoiPE"
            title="فيديو شركة قنديل"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 text-center">
        <div className="bg-[#d61c23] text-white p-10 md:p-14 rounded-3xl shadow-xl">
          <h3 className="text-2xl md:text-3xl font-black mb-3">
            هل تبحث عن مستشارك العقاري الموثوق؟
          </h3>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto mb-8">
            فريق مبيعات قنديل متاح على مدار الساعة للإجابة على كافة استفساراتك وتقديم أفضل خطط السداد.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/callus"
              className="px-8 py-3.5 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#26070a] font-black text-sm shadow transition-all hover:scale-105"
            >
              تواصل معنا الآن
            </Link>
            <a
              href="tel:19473"
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#d61c23] font-bold text-sm border border-white/20 transition-all"
            >
              اتصل بالخط الساخن: 19473
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyUs;
