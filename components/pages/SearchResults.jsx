'use client';

import React, { useState, useEffect } from 'react';
import { useParams, Link } from '@/lib/navigation';

import { api, getImageUrl } from '@/services/api';


export const SearchResults = () => {
  const { CityId, AreaId } = useParams();

  const [matchingUnits, setMatchingUnits] = useState([]);
  const [matchingProjects, setMatchingProjects] = useState([]);
  const [areaName, setAreaName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAllUnits(),
      api.getProjectsWithArea()
    ])
      .then(([unitsRes, projectsRes]) => {
        // Find area
        const foundArea = projectsRes.find((a) => String(a.id) === AreaId);
        if (foundArea) {
          setAreaName(foundArea.areaName);
          setMatchingProjects(foundArea.viewProject || []);
          // Units matching area name
          const u = unitsRes.filter((unit) =>
            unit.nameLocation && unit.nameLocation.includes(foundArea.areaName)
          );
          setMatchingUnits(u.length > 0 ? u : unitsRes.slice(0, 6));
        } else {
          setMatchingUnits(unitsRes.slice(0, 9));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching search results:', err);
        setLoading(false);
      });
  }, [CityId, AreaId]);

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <div className="bg-[#26070a] text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-[#f59e0b] font-bold text-xs uppercase tracking-wider block mb-2">
            نتائج البحث المخصص
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2">
            {areaName ? `مشروعات ووحدات: ${areaName}` : 'نتائج البحث عن الوحدات'}
          </h1>
          <p className="text-gray-300 text-sm">
            تم العثور على {matchingUnits.length} وحدة و {matchingProjects.length} مشروع.
          </p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 space-y-10">
        {/* Projects Section */}
        {matchingProjects.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900">المشروعات في هذه المنطقة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/projectcategory/${AreaId}/project/${p.id}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(p.imageName)}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#d61c23] line-clamp-2">
                      {p.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Units Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-gray-900">الوحدات المتاحة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingUnits.map((unit) => (
              <div
                key={unit.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(unit.imageName)}
                      alt={unit.title}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full shadow ${
                        unit.status === 'Sold' ? 'bg-red-500 text-white' : 'bg-[#22c55e] text-white'
                      }`}
                    >
                      {unit.status === 'Sold' ? 'تم البيع' : 'متاح للبيع'}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-1">
                      {unit.title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-3">{unit.nameLocation}</p>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 text-gray-600 text-xs font-semibold">
                      <div className="text-center">{unit.area} م²</div>
                      <div className="text-center">{unit.numberRoom} غرف</div>
                      <div className="text-center">{unit.numberBathroom} حمام</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/unit/${unit.id}`}
                    className="w-full block text-center py-2.5 rounded-lg bg-[#d61c23] text-white hover:bg-[#b7151b] font-bold text-xs transition-colors"
                  >
                    عرض تفاصيل الوحدة
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchResults;
