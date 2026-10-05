'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/lib/navigation';
import { Maximize2, Bed, Bath, } from 'lucide-react';
import { api, getImageUrl } from '@/services/api';


export const PaidUnits = () => {
  const [soldUnits, setSoldUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllUnits()
      .then((unitsRes) => {
        const sold = unitsRes.filter((u) => u.status === 'Sold');
        setSoldUnits(sold);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching sold units:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="bg-[#26070a] text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-[#f59e0b] font-bold text-xs uppercase tracking-wider block mb-2">
            سابقة الأعمال والتسليمات
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2">
            الوحدات المباعة والمسلمة
          </h1>
          <p className="text-gray-300 text-sm max-w-xl">
            سجل حافل بالنجاحات والمشروعات السكنية التي تم تسليمها لعملائنا الكرام وفق أعلى معايير الجودة.
          </p>
        </div>
      </div>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {soldUnits.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img
                    src={getImageUrl(unit.imageName)}
                    alt={unit.title}
                    className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      (e.target ).src =
                        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    تم البيع والتسليم ✓
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-base text-gray-900 mb-2 line-clamp-1">
                    {unit.title}
                  </h3>
                  <p className="text-gray-500 text-xs mb-4">{unit.nameLocation || 'القاهرة الجديدة'}</p>

                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-gray-100 text-gray-600 text-xs font-semibold">
                    <div className="flex items-center gap-1 justify-center">
                      <Maximize2 className="w-3.5 h-3.5 text-[#d61c23]" />
                      <span>{unit.area} م²</span>
                    </div>
                    <div className="flex items-center gap-1 justify-center">
                      <Bed className="w-3.5 h-3.5 text-[#d61c23]" />
                      <span>{unit.numberRoom} غرف</span>
                    </div>
                    <div className="flex items-center gap-1 justify-center">
                      <Bath className="w-3.5 h-3.5 text-[#d61c23]" />
                      <span>{unit.numberBathroom} حمام</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/unit/${unit.id}`}
                  className="w-full block text-center py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-lg transition-colors border border-gray-200"
                >
                  معاينة مواصفات الوحدة
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PaidUnits;
