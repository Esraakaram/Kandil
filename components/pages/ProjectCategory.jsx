'use client';

 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React, { useState, useEffect } from 'react';
import { Link } from '@/lib/navigation';
import { ArrowLeft, } from 'lucide-react';
import { api, getImageUrl } from '@/services/api';


export const ProjectCategory = () => {
  const [projectsWithArea, setProjectsWithArea] = useState([]);
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getProjectsWithArea(), api.getCoverImages()])
      .then(([projectsRes, coversRes]) => {
        setProjectsWithArea(projectsRes);
        const cover = coversRes.find((c) => c.pageName === 'مشروعات');
        if (cover) setCoverImage(getImageUrl(cover.imageName));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching projects with area:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* Banner */}
      <div className="relative h-60 md:h-72 bg-[#26070a] text-white overflow-hidden flex items-center">
        {coverImage && (
          <img
            src={coverImage}
            alt="مشروعات سكنية"
            className="absolute inset-0 w-full h-full object-cover filter brightness-50"
            onError={(e) => {
              (e.target ).style.display = 'none';
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <span className="text-[#f59e0b] font-bold text-xs uppercase tracking-wider block mb-2">
            القاهرة الجديدة والتجمع الخامس
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2">
            المشروعات السكنية
          </h1>
          <p className="text-gray-200 text-sm md:text-base max-w-xl">
            استكشف مشروعات قنديل المقسمة وفق أرقى المناطق الحيوية ذات العائد الاستثماري المرتفع.
          </p>
        </div>
      </div>

      {/* Areas Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsWithArea.map((area) => (
            <div
              key={area.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img
                    src={
                      _optionalChain([area, 'access', _ => _.viewProject, 'access', _2 => _2[0], 'optionalAccess', _3 => _3.imageName])
                        ? getImageUrl(area.viewProject[0].imageName)
                        : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={area.areaName}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    onError={(e) => {
                      (e.target ).src =
                        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                  
                  <span className="absolute bottom-3 right-3 text-xs bg-[#d61c23] text-white px-3 py-1 rounded-full font-bold shadow">
                    {area.viewProject.length} مشروعات منفذة
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-[#d61c23] transition-colors">
                    {area.areaName}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">
                    مواقع استراتيجية قريبة من محاور التسعين، محمد بن زايد، والدائري الأوسطي، مع بنية تحتية حديثة ومساحات خضراء واسعة.
                  </p>

                  <div className="space-y-1.5 mb-4">
                    {area.viewProject.slice(0, 3).map((p) => (
                      <div key={p.id} className="text-xs text-gray-600 flex items-center gap-1.5 line-clamp-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shrink-0"></span>
                        <span>{p.name}</span>
                      </div>
                    ))}
                    {area.viewProject.length > 3 && (
                      <span className="text-[11px] text-gray-400 font-semibold block pt-1">
                        + {area.viewProject.length - 3} مشاريع أخرى
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/projectcategory/${area.id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 hover:bg-[#d61c23] text-[#d61c23] hover:text-white font-bold text-sm border border-gray-200 hover:border-transparent transition-all"
                >
                  <span>عرض مشروعات المنطقة</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProjectCategory;
