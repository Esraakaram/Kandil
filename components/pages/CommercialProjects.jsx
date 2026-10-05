'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/lib/navigation';
import { Building2, Phone, MapPin, CheckCircle } from 'lucide-react';
import { api } from '@/services/api';


export const CommercialProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCommercialProjects()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching commercial projects:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="bg-[#26070a] text-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <span className="text-[#f59e0b] font-bold text-xs uppercase tracking-wider block mb-2">
            استثمار تجاري وإداري وطبي بعوائد مجزية
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2">
            المشروعات التجارية والخدمية
          </h1>
          <p className="text-gray-300 text-sm max-w-xl">
            موالات ومقرات إدارية ومراكز طبية متطورة بمواقع استراتيجية على محاور التسعين ومحمد بن زايد.
          </p>
        </div>
      </div>

      {/* Projects List */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={proj.imageName}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 right-4 bg-[#d61c23] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {proj.type}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#d61c23] font-semibold">
                    <MapPin className="w-4 h-4 text-[#f59e0b]" />
                    <span>{proj.areaName}</span>
                  </div>

                  <h3 className="font-black text-2xl text-gray-900 group-hover:text-[#d61c23] transition-colors">
                    {proj.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="pt-2 flex items-center gap-6 text-xs text-gray-500 font-semibold border-t border-gray-100">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4 text-[#d61c23]" />
                      {proj.unitsCount} وحدة تجارية وإدارية
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                      تسهيلات حتى 6 سنوات
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <Link
                  to="/callus"
                  className="flex-1 py-3 text-center bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  طلب تفاصيل الوحدات والأسعار
                </Link>
                <a
                  href="tel:19473"
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl flex items-center justify-center transition-colors"
                  title="اتصل بنا"
                >
                  <Phone className="w-4 h-4 text-[#d61c23]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CommercialProjects;
