'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/lib/navigation';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Handshake,
  Users,
  Building,
  Target,
  Sparkles,
  Phone,
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';
import { api, getImageUrl } from '@/services/api';

export const WhyUs = () => {
  const [whyUsItems, setWhyUsItems] = useState([]);
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getWhyUs(), api.getCoverImages()])
      .then(([whyUsRes, coversRes]) => {
        if (Array.isArray(whyUsRes)) {
          setWhyUsItems(whyUsRes);
        }
        if (Array.isArray(coversRes)) {
          const cover = coversRes.find((c) => c.pageName === 'لماذا قنديل');
          if (cover) setCoverImage(getImageUrl(cover.imageName));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching WhyUs:', err);
        setLoading(false);
      });
  }, []);

  // Board Leadership
  const boardMembers = [
    {
      title: 'رئيس مجلس الإدارة',
      name: 'م / أشرف بكر قنديل',
      image: '/assets/Images/whyus/fb22a711-1636-41c8-9266-d6530d87f084.jpg',
      points: [
        'خبرة أكثر من 28 عاماً في الهندسة والتشييد',
        'عضو مؤسس جمعية مطوري القاهرة الجديدة',
        'رئيس لجنة اللائحة وميثاق الشرف للمطورين'
      ],
      featured: true
    },
    {
      title: 'نائب رئيس مجلس الإدارة',
      name: 'أ / محمود حلمي محمد',
      image: null,
      points: [
        'عضو مجلس الإدارة',
        'مدير تسويق القطاع الداخلي والخارجي بشركة قنديل للإستثمار العقاري وإدارة المشروعات',
        'استراتيجيات تسويقية متقدمة لأكثر من 20 عاماً'
      ],
      featured: false
    },
    {
      title: 'نائب ثان رئيس مجلس الإدارة',
      name: 'أ / منه الله وحيد علي',
      image: null,
      points: [
        'العضو المنتدب لشركة قنديل للإستثمار العقاري',
        'مديرة المبيعات والتطوير التجاري',
        'محامٍ بالنقض (تخصص عقود عقارية واستثمارية)'
      ],
      featured: false
    }
  ];

  return (
    <div className="space-y-20 pb-20 bg-gray-50/50">
      {/* 1. Hero Banner */}
      <div className="relative min-h-[340px] md:min-h-[420px] bg-[#26070a] text-white overflow-hidden flex items-center">
        {coverImage ? (
          <img
            src={coverImage}
            alt="لماذا قنديل"
            className="absolute inset-0 w-full h-full object-cover filter brightness-40"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <img
            src="/assets/Images/whyus/116724e6-b4f7-4e6a-9abb-7286e1bd6ca5.png"
            alt="لماذا قنديل"
            className="absolute inset-0 w-full h-full object-cover filter brightness-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#26070a] via-[#26070a]/70 to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full py-16">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 bg-[#d61c23]/20 border border-[#d61c23]/40 text-[#f59e0b] px-4 py-1.5 rounded-full font-bold text-xs md:text-sm">
              <Sparkles className="w-4 h-4" />
              <span>خبرة تمتد لأكثر من 24 عاماً منذ 2001</span>
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              لماذا قنديل للإستثمار العقاري وإدارة المشروعات؟
            </h1>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              تاريخ عريق ورؤية حديثة في صدارة التطوير العقاري وبناء المجتمعات السكنية الراقية بالقاهرة الجديدة ومدينة الشروق.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Company Overview (Old Site PageSection 1) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-[#d61c23] font-black text-xs uppercase tracking-wider bg-red-50 px-3 py-1.5 rounded-lg">
              <Building className="w-4 h-4" />
              <span>نبذة عن الشركة ومسيرتها</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug">
              شركة قنديل للإستثمار العقاري وإدارة المشروعات
            </h2>

            <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              <p>
                تأسست <strong>شركة قنديل للإستثمار العقاري وإدارة المشروعات</strong> في عام <strong>2001</strong> بخبرة تزيد عن <strong>24 عاماً</strong> في مجال الاستثمار العقاري، حيث قامت بتسليم أكثر من <strong>40 مشروعاً في التجمع الخامس</strong> و<strong>28 مشروعاً في مدينة الشروق</strong> بتصميمات هندسية فريدة تجمع بين الكلاسيكية الفخمة والحداثة العصرية.
              </p>
              <p>
                تركز الشركة حالياً على التوسع في أرقى أحياء <strong>القاهرة الجديدة</strong>، خاصة في مناطق واعدة ذات مستقبل استثماري رفيع مثل: <strong>النرجس الجديدة</strong>، <strong>النورث هاوس</strong>، و<strong>بيت الوطن</strong>.
              </p>
              <p>
                وتتميز الشركة بكونها <strong>مالكة ومنفذة ومسوقة لمشاريعها</strong>، حيث نقوم بالتنفيذ الميداني الكامل باستخدام معداتنا وعمالتنا الخاصة، مما يضمن أعلى معايير الجودة والالتزام التام بالجداول الزمنية.
              </p>
              <p className="p-4 bg-red-50/70 border-r-4 border-[#d61c23] rounded-l-xl text-gray-800 font-medium">
                جميع مشاريع الشركة <strong>مقاومة للزلازل</strong> ومصممة وفق أحدث الأكواد الإنشائية المعتمدة، مما يعكس التزامنا الأبدي بمعايير الأمان والجودة العالمية.
              </p>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                <span className="block text-2xl sm:text-3xl font-black text-[#d61c23] font-mono">+24</span>
                <span className="text-xs font-bold text-gray-600">عاماً من الخبرة</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                <span className="block text-2xl sm:text-3xl font-black text-[#d61c23] font-mono">+68</span>
                <span className="text-xs font-bold text-gray-600">مشروعاً تم تسليمها</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                <span className="block text-2xl sm:text-3xl font-black text-[#d61c23] font-mono">100%</span>
                <span className="text-xs font-bold text-gray-600">تنفيذ بأيدينا</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
                <span className="block text-2xl sm:text-3xl font-black text-[#d61c23] font-mono">100%</span>
                <span className="text-xs font-bold text-gray-600">مقاومة للزلازل</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-white group">
              <img
                src="/assets/Images/whyus/116724e6-b4f7-4e6a-9abb-7286e1bd6ca5.png"
                alt="شركة قنديل للاستثمار العقاري"
                className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Board of Directors / Leadership (Old Site PageSection 2, 3, 4) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-[#d61c23] font-black text-xs uppercase tracking-wider bg-red-50 px-3 py-1.5 rounded-lg mb-2">
            <Users className="w-4 h-4" />
            <span>القيادة ورؤية المستقبل</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3">
            مجلس الإدارة
          </h2>
          <p className="text-gray-500 text-sm">
            كفاءات هندسية واستثمارية تقود مسيرة النجاح وبناء الثقة على مدار عقود.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {boardMembers.map((member, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 transition-all flex flex-col justify-between ${
                member.featured
                  ? 'bg-gradient-to-b from-[#26070a] to-[#3a0b10] text-white shadow-xl ring-2 ring-[#d61c23]/40'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 hover:shadow-md'
              }`}
            >
              <div>
                {/* Photo or Avatar */}
                <div className="mb-6 flex justify-center">
                  {member.image ? (
                    <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-4 border-[#d61c23] shadow-lg">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-36 h-36 rounded-2xl bg-gray-100 text-[#d61c23] border-4 border-gray-200 flex flex-col items-center justify-center font-black shadow-inner">
                      <Users className="w-12 h-12 mb-2 text-[#d61c23]" />
                      <span className="text-[11px] text-gray-500 font-bold">قيادة قنديل</span>
                    </div>
                  )}
                </div>

                <div className="text-center mb-6">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full inline-block mb-2 ${
                      member.featured
                        ? 'bg-[#d61c23] text-white'
                        : 'bg-red-50 text-[#d61c23]'
                    }`}
                  >
                    {member.title}
                  </span>
                  <h3
                    className={`text-xl font-black ${
                      member.featured ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {member.name}
                  </h3>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm">
                  {member.points.map((pt, pIdx) => (
                    <li
                      key={pIdx}
                      className={`flex items-start gap-2.5 ${
                        member.featured ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          member.featured ? 'text-[#f59e0b]' : 'text-[#d61c23]'
                        }`}
                      />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100/10 text-center">
                <span
                  className={`text-[11px] font-bold ${
                    member.featured ? 'text-gray-400' : 'text-gray-400'
                  }`}
                >
                  شركة قنديل للإستثمار العقاري
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Section: Finishing & Architectural Quality (Old Site PageSection 5) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-white group">
              <img
                src="/assets/Images/whyus/fdfa0712-ca64-4938-bd07-21cc8ec03430.png"
                alt="معايير التشطيب والجودة"
                className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 text-[#d61c23] font-black text-xs uppercase tracking-wider bg-red-50 px-3 py-1.5 rounded-lg">
              <Award className="w-4 h-4" />
              <span>الجودة والتشطيبات الفاخرة</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug">
              أعلى معايير الجودة وأحدث التصميمات المعمارية
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              في قنديل للاستثمار العقاري، نحرص على تقديم مشاريع تتميز بأعلى معايير الجودة، حيث نستخدم <strong>أفضل خامات البناء</strong> ونضمن <strong>أعلى مستويات التشطيب</strong>.
            </p>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              تتميز واجهاتنا الخارجية بتصميمات احترافية تجمع بين <strong>الأناقة الكلاسيكية والحديثة المعاصرة</strong> لتلبي كافة الأذواق والاحتياجات. بالإضافة إلى ذلك، نعتمد على خبراتنا التسويقية المتميزة لتقديم <strong>حلول استثمارية شاملة</strong> تضمن لعملائنا تحقيق أعلى العوائد والربحية، مما يجعلنا الشريك الأمثل لتحقيق النجاح في عالم الاستثمار العقاري.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <CheckCircle2 className="w-5 h-5 text-[#d61c23] shrink-0" />
                <span className="text-xs font-bold text-gray-800">أفضل خامات البناء والخرسانات</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <CheckCircle2 className="w-5 h-5 text-[#d61c23] shrink-0" />
                <span className="text-xs font-bold text-gray-800">واجهات مودرن وفندقية راقية</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <CheckCircle2 className="w-5 h-5 text-[#d61c23] shrink-0" />
                <span className="text-xs font-bold text-gray-800">حلول استثمارية وعوائد مضمونة</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <CheckCircle2 className="w-5 h-5 text-[#d61c23] shrink-0" />
                <span className="text-xs font-bold text-gray-800">تسليم فندقي متكامل ودقيق</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section: Strategic Vision (Old Site PageSection 6) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-[#d61c23] font-black text-xs uppercase tracking-wider bg-red-50 px-3 py-1.5 rounded-lg">
              <Target className="w-4 h-4" />
              <span>الرؤية المستقبلية والشراكة المجتمعية</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug">
              حلول عقارية متكاملة تعكس رؤية مصر المستقبلية
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              تسعى قنديل للاستثمار العقاري إلى تقديم <strong>حلول عقارية متكاملة وذات جودة عالية</strong> تُلبي احتياجات عملائنا وتُحقق تطلعاتهم. نلتزم بتطوير مشاريع مبتكرة تعكس رؤية مصر المستقبلية، مع التركيز على المدن الجديدة والمناطق ذات الإمكانات الواعدة.
            </p>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              نحرص على بناء <strong>شراكات قوية ومستدامة</strong> مع عملائنا وشركائنا، من خلال الالتزام بأعلى معايير الشفافية والجودة، والإسهام الفاعل في تنمية المجتمع وخدمة الصالح العام.
            </p>

            <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-r-4 border-[#d61c23] rounded-2xl">
              <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                "رؤيتنا لا تقتصر على تسليم وحدات سكنية فقط، بل تمتد لبناء بيئة حياة متكاملة ومستدامة تمنح عملاءنا راحة البال واستثماراً آمناً للأجيال القادمة."
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-white group">
              <img
                src="/assets/Images/whyus/4d75240c-4ffa-477a-a376-ea3fc6d4d5ad.png"
                alt="الرؤية المستقبلية"
                className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section: Expansion & Community Leadership (Old Site PageSection 7) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-white group">
              <img
                src="/assets/Images/whyus/7b9ee6ec-da3f-4548-bf9f-e77f204ba500.png"
                alt="الريادة والتوسع الجغرافي"
                className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 text-[#d61c23] font-black text-xs uppercase tracking-wider bg-red-50 px-3 py-1.5 rounded-lg">
              <Sparkles className="w-4 h-4" />
              <span>الريادة والتوسع الجغرافي</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug">
              ريادة السوق العقاري والتوسع في المدن الجديدة
            </h2>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              تسعى الشركة جاهدة لتحقيق الريادة والتميز في سوق العقارات المصري، معتمدة في ذلك على أسس راسخة من الالتزام بتنفيذ المشاريع بأعلى معايير الجودة، وكسب <strong>ثقة العملاء</strong> التي تعد الركيزة الأساسية لنجاحنا. ولا يمكن أن نصل إلى هذا المستوى من التميز دون الدعم والثقة الغالية التي يمنحنا إياها عملاؤنا، ونفخر بذلك.
            </p>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              كما نطمح إلى <strong>توسيع نطاق أعمالنا وزيادة انتشارنا الجغرافي</strong>، خاصة في المدن الجديدة، بما يعكس رؤيتنا الطموحة لتلبية احتياجات السوق العقاري المصري. ونحرص دائماً على أن تكون جهودنا موجهة نحو خدمة المجتمع والإسهام في تحقيق الصالح العام، انطلاقاً من إيماننا بدورنا الفاعل في تنمية المجتمع ودفع عجلة التطوير العقاري في مصر.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Pillars Section: 4 Core Pillars */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#d61c23] font-black text-xs uppercase tracking-wider block mb-2">
              ثوابتنا الراسخة
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3">
              الركائز الأساسية لشركة قنديل
            </h2>
            <p className="text-gray-500 text-sm">
              مبادئ مهنية وأخلاقية وضعناها كدستور عمل متكامل منذ أول يوم عمل لنا.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 hover:bg-white p-8 rounded-3xl shadow-sm hover:shadow-md border border-gray-100 text-center transition-all group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#d61c23]/10 text-[#d61c23] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">الثقة</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                نبني جسوراً متينة من الشفافية والصدق المتبادل، فالثقة هي أساس كل حجر نضعه.
              </p>
            </div>

            <div className="bg-gray-50 hover:bg-white p-8 rounded-3xl shadow-sm hover:shadow-md border border-gray-100 text-center transition-all group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#d61c23]/10 text-[#d61c23] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">الإلتزام</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                الالتزام بمواعيد التسليم الدقيقة وبنود التعاقد والمواصفات التشطيبية المعتمدة.
              </p>
            </div>

            <div className="bg-gray-50 hover:bg-white p-8 rounded-3xl shadow-sm hover:shadow-md border border-gray-100 text-center transition-all group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#d61c23]/10 text-[#d61c23] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">الجودة</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                استخدام أجود خامات البناء ومواصفات قياسية مضادة للزلازل وتشطيبات راقية تدوم.
              </p>
            </div>

            <div className="bg-gray-50 hover:bg-white p-8 rounded-3xl shadow-sm hover:shadow-md border border-gray-100 text-center transition-all group">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#d61c23]/10 text-[#d61c23] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Handshake className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">المصداقية</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                وضوح تام في كافة التعاملات وخدمة عملاء مستمرة ودعم قانوني وفني بعد الاستلام.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Corporate Video Tour */}
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

      {/* 9. Contact CTA */}
      <section className="max-w-7xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-r from-[#d61c23] to-[#991b1b] text-white p-10 md:p-14 rounded-3xl shadow-xl">
          <h3 className="text-2xl md:text-3xl font-black mb-3">
            هل تبحث عن مستشارك العقاري الموثوق في القاهرة الجديدة؟
          </h3>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-8">
            فريق استشاري قنديل متاح على مدار الساعة للإجابة على كافة استفساراتكم وتقديم أنسب خطط السداد والاستثمار.
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
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#d61c23] font-bold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>اتصل بالخط الساخن: 19473</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyUs;
