'use client';

import React, { useState, useEffect } from 'react';
import { useParams, Link } from '@/lib/navigation';
import { Calendar, ArrowLeft, } from 'lucide-react';
import { api, getImageUrl } from '@/services/api';


export const MediaCenter = () => {
  const { mediaId } = useParams();

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(mediaId ? Number(mediaId) : 0);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync activeCategory if mediaId in URL changes
  useEffect(() => {
    if (mediaId !== undefined) {
      setActiveCategory(Number(mediaId));
    }
  }, [mediaId]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getMediaCategories(),
      api.getMedia(activeCategory > 0 ? activeCategory : undefined)
    ])
      .then(([catsRes, mediaRes]) => {
        setCategories(catsRes);
        setArticles(mediaRes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching media:', err);
        setLoading(false);
      });
  }, [activeCategory]);

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="bg-[#26070a] text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-[#f59e0b] font-bold text-xs uppercase tracking-wider block mb-2">
            متابعة حية للتطورات العمرانية
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2">
            المركز الإعلامي
          </h1>
          <p className="text-gray-300 text-sm max-w-xl">
            أحدث أخبار مشروعات شركة قنديل، المقالات التحليلية للسوق العقاري، والتقارير المصورة.
          </p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveCategory(0)}
            className={`px-5 py-2.5 rounded-full font-bold text-xs transition-all ${
              activeCategory === 0
                ? 'bg-[#d61c23] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            كافة الأخبار والمقالات
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-bold text-xs transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#d61c23] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Articles Grid or Empty State */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#d61c23] border-t-transparent"></div>
            <p className="mt-2 text-xs text-gray-500">جاري تحميل الأخبار والمقالات...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-50 text-[#d61c23] flex items-center justify-center">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-gray-800">لا توجد مقالات منشورة في هذا القسم حالياً</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              يتم العمل على نشر مقالات وتقارير جديدة قريباً، يمكنك تصفح باقي الأقسام أو العودة لكافة الأخبار.
            </p>
            <button
              onClick={() => setActiveCategory(0)}
              className="px-6 py-2.5 rounded-full bg-[#d61c23] hover:bg-[#b7151b] text-white text-xs font-bold transition shadow"
            >
              عرض كافة الأخبار والمقالات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(item.imageName)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target ).src =
                          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-[#d61c23]" />
                      <span>{new Date(item.created).toLocaleDateString('ar-EG')}</span>
                    </div>

                    <h3 className="font-black text-lg text-gray-900 mb-3 group-hover:text-[#d61c23] transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <div
                      className="text-gray-500 text-xs line-clamp-3 leading-relaxed mb-4"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to={`/mediaCategories/${item.mediaId}/media/${item.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gray-50 hover:bg-[#d61c23] text-[#d61c23] hover:text-white font-bold text-xs transition-all border border-gray-200 hover:border-transparent"
                  >
                    <span>قراءة المقال بالكامل</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MediaCenter;
