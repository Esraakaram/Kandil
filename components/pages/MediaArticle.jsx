'use client';

import React, { useState, useEffect } from 'react';
import { useParams, Link } from '@/lib/navigation';
import { Calendar, } from 'lucide-react';
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

export const MediaArticle = () => {
  const { DetailId } = useParams();

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!DetailId) return;

    Promise.all([
      api.getMediaById(DetailId),
      api.getMedia()
    ])
      .then(([artRes, allRes]) => {
        setArticle(artRes);
        setRelated(allRes.filter((a) => a.id !== Number(DetailId)).slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching article:', err);
        setLoading(false);
      });
  }, [DetailId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#d61c23] border-t-transparent"></div>
        <p className="mt-2 text-sm text-gray-500">جاري تحميل المقال...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">المقال غير متوفر</h2>
        <Link to="/mediaCategories" className="text-[#d61c23] hover:underline font-bold">
          العودة للمركز الإعلامي
        </Link>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(article.videoURl);

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/home" className="hover:text-gray-700">الرئيسية</Link>
        <span>/</span>
        <Link to="/mediaCategories" className="hover:text-gray-700">المركز الإعلامي</Link>
        <span>/</span>
        <span className="text-[#d61c23] font-bold line-clamp-1">{article.title}</span>
      </div>

      {/* Article Title */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-snug">
          {article.title}
        </h1>

        <div className="flex items-center justify-between py-3 border-y border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#d61c23]" />
            <span>نُشر بتاريخ: {new Date(article.created).toLocaleDateString('ar-EG')}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-400">مشاركة:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-[#1877f2]"
              title="مشاركة على فيسبوك"
            >
              <i className="fa-brands fa-facebook text-base"></i>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-[#25d366]"
              title="مشاركة على واتساب"
            >
              <i className="fa-brands fa-whatsapp text-base"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Media Player or Featured Image */}
      {article.videoURl ? (
        /* Video Article: Render Video Player directly, cover image only belongs to external cards */
        <div className="rounded-2xl overflow-hidden aspect-video bg-black shadow-xl border border-gray-200">
          <iframe
            src={embedUrl}
            title={article.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : article.imageName ? (
        /* Text Article: Render Featured Image */
        <div className="rounded-2xl overflow-hidden shadow-lg h-72 sm:h-96 bg-gray-100">
          <img
            src={getImageUrl(article.imageName)}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target ).src =
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';
            }}
          />
        </div>
      ) : null}

      {/* Article HTML Content */}
      <div
        className="prose prose-base max-w-none text-gray-700 leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: article.description }}
      />

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="pt-12 border-t border-gray-100">
          <h3 className="text-xl font-black text-gray-900 mb-6">مقالات وأخبار ذات صلة</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/mediaCategories/${item.mediaId}/media/${item.id}`}
                className="group block space-y-2"
              >
                <div className="h-32 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={getImageUrl(item.imageName)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="font-bold text-xs text-gray-800 group-hover:text-[#d61c23] line-clamp-2">
                  {item.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default MediaArticle;
