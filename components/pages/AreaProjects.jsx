'use client';

import React, { useState, useEffect } from 'react';
import { useParams, Link } from '@/lib/navigation';
import { ArrowLeft, } from 'lucide-react';
import { api, getImageUrl } from '@/services/api';


export const AreaProjects = () => {
  const { categoryId } = useParams();
  const [areaData, setAreaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProjectsWithArea()
      .then((projectsRes) => {
        const found = projectsRes.find((a) => String(a.id) === categoryId);
        setAreaData(found || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching area projects:', err);
        setLoading(false);
      });
  }, [categoryId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#d61c23] border-t-transparent"></div>
        <p className="mt-2 text-sm text-gray-500">جاري تحميل مشروعات المنطقة...</p>
      </div>
    );
  }

  if (!areaData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">المنطقة غير موجودة</h2>
        <Link to="/projectcategory" className="text-[#d61c23] hover:underline font-bold">
          العودة لكافة المناطق
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="bg-[#26070a] text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Link to="/home" className="hover:text-white">الرئيسية</Link>
            <span>/</span>
            <Link to="/projectcategory" className="hover:text-white">المشروعات السكنية</Link>
            <span>/</span>
            <span className="text-[#f59e0b] font-bold">{areaData.areaName}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            مشروعات {areaData.areaName}
          </h1>
          <p className="text-gray-300 text-sm">
            إجمالي {areaData.viewProject.length} مشروعات منفذة وقيد التنفيذ بأعلى المعايير المعمارية.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {areaData.viewProject.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-60 overflow-hidden bg-gray-100">
                  <img
                    src={getImageUrl(project.imageName)}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target ).src =
                        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  <span className="absolute bottom-3 right-3 text-xs bg-[#d61c23] text-white px-3 py-1 rounded-full font-bold shadow">
                    مشروع سكني فاخر
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-black text-lg text-gray-900 mb-2 group-hover:text-[#d61c23] transition-colors line-clamp-2">
                    {project.name}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">
                    واجهات معمارية كلاسيكية ومودرن فاخرة، وتصميمات داخلية تضمن الاستغلال الأمثل لكافة المساحات.
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/projectcategory/${categoryId}/project/${project.id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold text-sm shadow transition-all"
                >
                  <span>تفاصيل ومواصفات المشروع</span>
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

export default AreaProjects;
