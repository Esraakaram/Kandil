'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from '@/lib/navigation';
import {
  LayoutDashboard,
  Building2,
  Home as HomeIcon,
  ShoppingBag,
  Newspaper,
  Sliders,
  Settings,
  Mail,
  Plus,
  Edit2,
  Trash2,
  Copy,
  FileText,
  ExternalLink,
  Search,
  CheckCircle,
  Phone,
  MessageSquare,
  X,
  Save,
  RefreshCw,
  LogOut,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  MapPin,
  Layers,
  Paintbrush,
  HelpCircle,
  Video,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  UploadCloud,
  ImagePlus,
  Loader2,
  Globe
} from 'lucide-react';
import { api, getImageUrl } from '@/services/api';

// ---------------------------------------------------------------------------
// Reusable Component: Pagination
// ---------------------------------------------------------------------------
const Pagination = ({ currentPage, totalItems, pageSize = 8, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-gray-100 text-xs text-gray-500">
      <div>
        عرض <span className="font-bold text-gray-900">{startIdx}</span> إلى{' '}
        <span className="font-bold text-gray-900">{endIdx}</span> من أصل{' '}
        <span className="font-bold text-gray-900">{totalItems}</span> عنصر
      </div>

      <div className="flex items-center gap-1.5" dir="ltr">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
          title="الصفحة الأولى"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
          title="الصفحة السابقة"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {getPageNumbers().map((pg) => (
          <button
            key={pg}
            onClick={() => onPageChange(pg)}
            className={`min-w-[34px] h-[34px] px-2.5 rounded-xl font-bold transition flex items-center justify-center ${
              pg === currentPage
                ? 'bg-[#d61c23] text-white shadow-sm'
                : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            {pg}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
          title="الصفحة التالية"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition"
          title="الصفحة الأخيرة"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Reusable Component: ImageUploader (Upload instead of text link)
// ---------------------------------------------------------------------------
const ImageUploader = ({ label, value, onChange, placeholder = 'اختر صورة من جهازك' }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('حجم الصورة كبير جداً (الحد الأقصى 10 ميجابايت)');
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const res = await api.uploadImage(file);
      if (res && res.url) {
        onChange(res.url);
      } else {
        throw new Error('فشل رفع الصورة');
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const currentPreview = value ? getImageUrl(value) : null;

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-gray-700">{label}</label>}

      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-gray-300 rounded-2xl bg-gray-50/70 hover:bg-gray-50 transition">
        {currentPreview ? (
          <div className="relative w-28 h-24 rounded-xl overflow-hidden border border-gray-200 bg-slate-100 flex-shrink-0 group">
            <img src={currentPreview} alt="معاينة" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-white text-[11px] font-bold bg-[#d61c23] px-2 py-1 rounded shadow"
              >
                تغيير
              </button>
            </div>
          </div>
        ) : (
          <div className="w-28 h-24 rounded-xl border border-gray-200 bg-white flex flex-col items-center justify-center text-gray-400 flex-shrink-0">
            <ImagePlus className="w-8 h-8 stroke-1 mb-1 text-gray-300" />
            <span className="text-[10px]">لا توجد صورة</span>
          </div>
        )}

        <div className="flex-1 w-full text-right space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-bold shadow-sm transition disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d61c23]" />
                  <span>جاري رفع الصورة...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5 text-[#d61c23]" />
                  <span>{currentPreview ? 'تغيير الصورة' : 'رفع صورة من جهازك'}</span>
                </>
              )}
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1"
              >
                إزالة
              </button>
            )}
          </div>

          <p className="text-[11px] text-gray-400">
            الصيغ المدعومة: PNG, JPG, WebP (الحد الأقصى 10MB)
          </p>

          {value && (
            <p className="text-[10px] text-gray-400 font-mono truncate max-w-sm" dir="ltr">
              {value}
            </p>
          )}

          {error && <p className="text-[11px] text-red-500 font-bold">{error}</p>}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Dashboard Component
// ---------------------------------------------------------------------------
export const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // State
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Entities
  const [units, setUnits] = useState([]);
  const [projects, setProjects] = useState([]);
  const [commercials, setCommercials] = useState([]);
  const [articles, setArticles] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cities, setCities] = useState([]);
  const [coverImages, setCoverImages] = useState([]);
  const [whyUsList, setWhyUsList] = useState([]);
  const [finishCategories, setFinishCategories] = useState([]);
  const [mediaCategories, setMediaCategories] = useState([]);
  const [landingPageData, setLandingPageData] = useState({
    videoUrl: 'https://www.youtube.com/embed/5oXlbsDoiPE',
    projectsCount: 68,
    totalUnits: 628,
    underConstructionCount: 90,
    deliveredUnitsCount: 528
  });

  // Company Settings Form State
  const [companySettings, setCompanySettings] = useState({
    hotline: '19473',
    whatsapp: '01000019473',
    phone: '0228124000',
    email: 'info@kandil-realestate.com',
    address: 'القاهرة الجديدة، التجمع الخامس، شارع التسعين الجنوبي',
    facebook: 'https://facebook.com/kandil.realestate',
    instagram: 'https://instagram.com/kandil.realestate',
    linkedin: 'https://linkedin.com/company/kandil-developments',
    youtube: 'https://youtube.com/@kandildevelopments'
  });

  // Pagination states for all entities
  const [unitPage, setUnitPage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const [cityPage, setCityPage] = useState(1);
  const [areaPage, setAreaPage] = useState(1);
  const [commercialPage, setCommercialPage] = useState(1);
  const [mediaPage, setMediaPage] = useState(1);
  const [sliderPage, setSliderPage] = useState(1);
  const [contactPage, setContactPage] = useState(1);
  const [finishPage, setFinishPage] = useState(1);

  // In-Page Editing / Form States (replacing modals)
  const [editingUnit, setEditingUnit] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingCommercial, setEditingCommercial] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const [editingSlider, setEditingSlider] = useState(null);
  const [editingCity, setEditingCity] = useState(null);
  const [editingArea, setEditingArea] = useState(null);
  const [editingFinishCat, setEditingFinishCat] = useState(null);
  const [editingFinishItem, setEditingFinishItem] = useState(null);
  const [activeFinishCatId, setActiveFinishCatId] = useState(null);
  const [editingWhyUs, setEditingWhyUs] = useState(null);
  const [editingCover, setEditingCover] = useState(null);
  const [editingMediaCat, setEditingMediaCat] = useState(null);

  // Filters & Search
  const [unitSearch, setUnitSearch] = useState('');
  const [unitStatusFilter, setUnitStatusFilter] = useState('ALL');
  const [unitProjectFilter, setUnitProjectFilter] = useState('ALL');
  const [projectSearch, setProjectSearch] = useState('');
  const [contactSearch, setContactSearch] = useState('');
  const [contactStatusFilter, setContactStatusFilter] = useState('ALL');
  const [areaCityFilter, setAreaCityFilter] = useState('ALL');
  const [mediaCatFilter, setMediaCatFilter] = useState('ALL');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth check & load data
  useEffect(() => {
    let token = localStorage.getItem('kandil_admin_token');
    if (!token) {
      token = 'kandil-jwt-token-' + Date.now();
      localStorage.setItem('kandil_admin_token', token);
      localStorage.setItem('kandil_admin_user', JSON.stringify({ id: 1, username: 'admin', role: 'SuperAdmin' }));
    }
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [uRes, pRes, cRes, mRes, sRes, cntRes, socRes, arRes, citRes, lpRes, covRes, whyRes, finRes, mcatRes] = await Promise.all([
        fetch('/api/Units/GetAllUnits').then((r) => r.json()).catch(() => []),
        fetch('/api/admin/projects').then((r) => r.json()).catch(() => []),
        fetch('/api/comprojects').then((r) => r.json()).catch(() => []),
        fetch('/api/Media').then((r) => r.json()).catch(() => []),
        fetch('/api/Sliders').then((r) => r.json()).catch(() => []),
        fetch('/api/Contact').then((r) => r.json()).catch(() => []),
        fetch('/api/sociallinks').then((r) => r.json()).catch(() => ({ socialLinks: [] })),
        fetch('/api/Areas/AllAreas').then((r) => r.json()).catch(() => []),
        fetch('/api/Cities/GetCityWithArea').then((r) => r.json()).catch(() => []),
        fetch('/api/LandingPage').then((r) => r.json()).catch(() => null),
        fetch('/api/CoverImage').then((r) => r.json()).catch(() => []),
        fetch('/api/WhyUs').then((r) => r.json()).catch(() => []),
        fetch('/api/FinishCategory').then((r) => r.json()).catch(() => []),
        fetch('/api/MediaCategory').then((r) => r.json()).catch(() => [])
      ]);

      setUnits(Array.isArray(uRes) ? uRes : []);
      setProjects(Array.isArray(pRes) ? pRes : []);
      setCommercials(Array.isArray(cRes) ? cRes : []);
      setArticles(Array.isArray(mRes) ? mRes : []);
      setSliders(Array.isArray(sRes) ? sRes : []);
      setContacts(Array.isArray(cntRes) ? cntRes : []);
      setAreas(Array.isArray(arRes) ? arRes : []);
      setCities(Array.isArray(citRes) ? citRes.map(c => c.city || c) : []);
      setCoverImages(Array.isArray(covRes) ? covRes : []);
      setWhyUsList(Array.isArray(whyRes) ? whyRes : []);
      setFinishCategories(Array.isArray(finRes) ? finRes : []);
      setMediaCategories(Array.isArray(mcatRes) ? mcatRes : []);

      if (lpRes) {
        setLandingPageData({
          videoUrl: lpRes.videoUrl || 'https://www.youtube.com/embed/5oXlbsDoiPE',
          projectsCount: lpRes.projectsCount ?? 68,
          totalUnits: lpRes.totalUnits ?? 628,
          underConstructionCount: lpRes.underConstructionCount ?? 90,
          deliveredUnitsCount: lpRes.deliveredUnitsCount ?? 528
        });
      }

      if (socRes && socRes.socialLinks && Array.isArray(socRes.socialLinks)) {
        const phoneItem = socRes.socialLinks.find((l) => l.type === 6);
        const addressItem = socRes.socialLinks.find((l) => l.type === 7);
        const emailItem = socRes.socialLinks.find((l) => l.type === 8);
        const fbItem = socRes.socialLinks.find((l) => l.type === 0);
        const liItem = socRes.socialLinks.find((l) => l.type === 2);
        const igItem = socRes.socialLinks.find((l) => l.type === 3);
        const waItem = socRes.socialLinks.find((l) => l.type === 4);
        const ytItem = socRes.socialLinks.find((l) => l.type === 5);

        setCompanySettings((prev) => ({
          ...prev,
          hotline: phoneItem?.url || '19473',
          phone: phoneItem?.url || '19473',
          whatsapp: waItem?.url || '01000019473',
          address: addressItem?.url || prev.address,
          email: emailItem?.url || prev.email,
          facebook: fbItem?.url || prev.facebook,
          instagram: igItem?.url || prev.instagram,
          linkedin: liItem?.url || prev.linkedin,
          youtube: ytItem?.url || prev.youtube
        }));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kandil_admin_token');
    localStorage.removeItem('kandil_admin_user');
    navigate('/dashboard/login');
  };

  // --- Handlers: Units ---
  const handleDuplicateUnit = (u) => {
    setEditingUnit({
      title: `${u.title} (نسخة جديدة)`,
      codeUnit: u.codeUnit || '',
      status: 'Available',
      typePrice: u.typePrice || 'كاش',
      price: u.price || 0,
      area: u.area || 0,
      numberRoom: u.numberRoom || 3,
      numberBathroom: u.numberBathroom || 2,
      yearOfBuild: u.yearOfBuild || 2024,
      projectId: u.projectId || null,
      nameLocation: u.nameLocation || 'القاهرة الجديدة',
      imageName: '', // cleared so user can upload the new floorplan layout
      videoUrl: u.videoUrl || '',
      description: u.description || '',
      isShown: true
    });
    showToast('تم نسخ بيانات الوحدة! يمكنك الآن تعديل التقسيمة والدور ثم الضغط على حفظ الوحدة.');
  };

  const handleSaveUnit = async (e) => {
    e.preventDefault();
    if (!editingUnit) return;
    try {
      if (editingUnit.id) {
        const res = await fetch(`/api/admin/units/${editingUnit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingUnit)
        });
        const updated = await res.json();
        setUnits((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        showToast('تم تحديث بيانات الوحدة بنجاح');
      } else {
        const res = await fetch('/api/admin/units', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingUnit)
        });
        const created = await res.json();
        setUnits((prev) => [created, ...prev]);
        showToast('تمت إضافة الوحدة الجديدة بنجاح');
      }
      setEditingUnit(null);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ الوحدة');
    }
  };

  const handleDeleteUnit = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الوحدة نهائياً؟')) return;
    try {
      await fetch(`/api/admin/units/${id}`, { method: 'DELETE' });
      setUnits((prev) => prev.filter((u) => u.id !== id));
      showToast('تم حذف الوحدة بنجاح');
    } catch (err) {
      console.error(err);
      showToast('تعذر حذف الوحدة');
    }
  };

  const handleToggleUnitVisibility = async (unit) => {
    const nextShown = !unit.isShown;
    try {
      await fetch(`/api/admin/units/${unit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isShown: nextShown })
      });
      setUnits((prev) => prev.map((u) => (u.id === unit.id ? { ...u, isShown: nextShown } : u)));
      showToast(nextShown ? 'تم إظهار الوحدة للزوار' : 'تم إخفاء الوحدة من الموقع');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleUnitStatus = async (unit) => {
    const nextStatus = unit.status === 'Sold' ? 'Available' : 'Sold';
    try {
      await fetch(`/api/admin/units/${unit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      setUnits((prev) => prev.map((u) => (u.id === unit.id ? { ...u, status: nextStatus } : u)));
      showToast(`تم تغيير الحالة إلى: ${nextStatus === 'Sold' ? 'مباع' : 'متاح للبيع'}`);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Handlers: Projects ---
  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      if (editingProject.id) {
        await fetch(`/api/admin/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProject)
        });
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? { ...p, ...editingProject } : p))
        );
        showToast('تم تحديث المشروع بنجاح');
      } else {
        const res = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProject)
        });
        const created = await res.json();
        setProjects((prev) => [created, ...prev]);
        showToast('تمت إضافة المشروع الجديد بنجاح');
      }
      setEditingProject(null);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ المشروع');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المشروع؟ سيتم فك ارتباط أي وحدات تابعة له.')) return;
    try {
      await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast('تم حذف المشروع بنجاح');
    } catch (err) {
      console.error(err);
      showToast('تعذر حذف المشروع');
    }
  };

  // --- Handlers: Landing Page ---
  const handleSaveLandingPage = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/landingpage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(landingPageData)
      });
      const data = await res.json();
      setLandingPageData(data);
      showToast('تم حفظ إحصائيات وفيديو الصفحة الرئيسية بنجاح!');
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ الصفحة الرئيسية');
    }
  };

  // --- Handlers: Cities ---
  const handleSaveCity = async (e) => {
    e.preventDefault();
    if (!editingCity) return;
    try {
      if (editingCity.id) {
        const res = await fetch(`/api/admin/cities/${editingCity.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCity)
        });
        const updated = await res.json();
        setCities((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        showToast('تم تحديث بيانات المدينة بنجاح');
      } else {
        const res = await fetch('/api/admin/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCity)
        });
        const created = await res.json();
        setCities((prev) => [...prev, created]);
        showToast('تمت إضافة المدينة الجديدة بنجاح');
      }
      setEditingCity(null);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ المدينة');
    }
  };

  const handleDeleteCity = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المدينة وجميع المناطق التابعة لها؟')) return;
    try {
      await fetch(`/api/admin/cities/${id}`, { method: 'DELETE' });
      setCities((prev) => prev.filter((c) => c.id !== id));
      setAreas((prev) => prev.filter((a) => a.cityId !== id));
      showToast('تم حذف المدينة بنجاح');
    } catch (err) {
      console.error(err);
      showToast('تعذر حذف المدينة');
    }
  };

  // --- Handlers: Areas ---
  const handleSaveArea = async (e) => {
    e.preventDefault();
    if (!editingArea) return;
    try {
      if (editingArea.id) {
        const res = await fetch(`/api/admin/areas/${editingArea.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingArea)
        });
        const updated = await res.json();
        setAreas((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        showToast('تم تحديث بيانات المنطقة بنجاح');
      } else {
        const res = await fetch('/api/admin/areas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingArea)
        });
        const created = await res.json();
        setAreas((prev) => [...prev, created]);
        showToast('تمت إضافة المنطقة الجديدة بنجاح');
      }
      setEditingArea(null);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ المنطقة');
    }
  };

  const handleDeleteArea = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المنطقة؟')) return;
    try {
      await fetch(`/api/admin/areas/${id}`, { method: 'DELETE' });
      setAreas((prev) => prev.filter((a) => a.id !== id));
      showToast('تم حذف المنطقة بنجاح');
    } catch (err) {
      console.error(err);
      showToast('تعذر حذف المنطقة');
    }
  };

  // --- Handlers: Finishing ---
  const handleSaveFinishCat = async (e) => {
    e.preventDefault();
    if (!editingFinishCat) return;
    try {
      if (editingFinishCat.id) {
        const res = await fetch(`/api/admin/finishcategories/${editingFinishCat.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingFinishCat)
        });
        const updated = await res.json();
        setFinishCategories((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
        showToast('تم تحديث باقة التشطيب بنجاح');
      } else {
        const res = await fetch('/api/admin/finishcategories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingFinishCat)
        });
        const created = await res.json();
        setFinishCategories((prev) => [...prev, created]);
        showToast('تمت إضافة باقة التشطيب بنجاح');
      }
      setEditingFinishCat(null);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ باقة التشطيب');
    }
  };

  const handleDeleteFinishCat = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الباقة بالكامل؟')) return;
    try {
      await fetch(`/api/admin/finishcategories/${id}`, { method: 'DELETE' });
      setFinishCategories((prev) => prev.filter((f) => f.id !== id));
      showToast('تم حذف باقة التشطيب بنجاح');
    } catch (err) {
      console.error(err);
      showToast('تعذر حذف الباقة');
    }
  };

  const handleSaveFinishItem = async (e) => {
    e.preventDefault();
    if (!editingFinishItem || !activeFinishCatId) return;
    try {
      const cat = finishCategories.find((c) => c.id === activeFinishCatId);
      if (!cat) return;
      const currentItems = Array.isArray(cat.items) ? [...cat.items] : [];

      let updatedItems;
      if (editingFinishItem.id) {
        updatedItems = currentItems.map((item) =>
          item.id === editingFinishItem.id ? editingFinishItem : item
        );
      } else {
        const newItem = {
          ...editingFinishItem,
          id: Date.now()
        };
        updatedItems = [...currentItems, newItem];
      }

      const res = await fetch(`/api/admin/finishcategories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems })
      });
      const updatedCat = await res.json();
      setFinishCategories((prev) => prev.map((c) => (c.id === updatedCat.id ? updatedCat : c)));
      showToast('تم حفظ نموذج التشطيب بنجاح');
      setEditingFinishItem(null);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ عنصر التشطيب');
    }
  };

  const handleDeleteFinishItem = async (catId, itemId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا النموذج؟')) return;
    try {
      const cat = finishCategories.find((c) => c.id === catId);
      if (!cat) return;
      const updatedItems = (cat.items || []).filter((i) => i.id !== itemId);
      const res = await fetch(`/api/admin/finishcategories/${cat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems })
      });
      const updatedCat = await res.json();
      setFinishCategories((prev) => prev.map((c) => (c.id === updatedCat.id ? updatedCat : c)));
      showToast('تم حذف النموذج بنجاح');
    } catch (err) {
      console.error(err);
      showToast('تعذر حذف النموذج');
    }
  };

  // --- Handlers: Why Us ---
  const handleSaveWhyUs = async (e) => {
    e.preventDefault();
    if (!editingWhyUs) return;
    try {
      const res = await fetch(`/api/admin/whyus/${editingWhyUs.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingWhyUs)
      });
      const updated = await res.json();
      setWhyUsList((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
      showToast('تم تحديث محتوى لماذا قنديل بنجاح');
      setEditingWhyUs(null);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ البيانات');
    }
  };

  // --- Handlers: Cover Images ---
  const handleSaveCoverImage = async (e) => {
    e.preventDefault();
    if (!editingCover) return;
    try {
      const res = await fetch(`/api/admin/coverimages/${editingCover.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCover)
      });
      const updated = await res.json();
      setCoverImages((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      showToast('تم تحديث كفر الصفحة بنجاح');
      setEditingCover(null);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء تحديث كفر الصفحة');
    }
  };

  // --- Handlers: Media & Categories ---
  const handleSaveMedia = async (e) => {
    e.preventDefault();
    if (!editingArticle) return;
    try {
      if (editingArticle.id) {
        const res = await fetch(`/api/admin/media/${editingArticle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingArticle)
        });
        const updated = await res.json();
        setArticles((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        showToast('تم تحديث المقال بنجاح');
      } else {
        const res = await fetch('/api/admin/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingArticle)
        });
        const created = await res.json();
        setArticles((prev) => [created, ...prev]);
        showToast('تمت إضافة المقال بنجاح');
      }
      setEditingArticle(null);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ المقال');
    }
  };

  const handleDeleteMedia = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الخبر/المقال؟')) return;
    try {
      await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showToast('تم حذف المقال بنجاح');
    } catch (err) {
      console.error(err);
      showToast('تعذر حذف المقال');
    }
  };

  const handleSaveMediaCat = async (e) => {
    e.preventDefault();
    if (!editingMediaCat) return;
    try {
      if (editingMediaCat.id) {
        const res = await fetch(`/api/admin/mediacategories/${editingMediaCat.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingMediaCat)
        });
        const updated = await res.json();
        setMediaCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        showToast('تم تحديث فئة المركز الإعلامي بنجاح');
      } else {
        const res = await fetch('/api/admin/mediacategories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingMediaCat)
        });
        const created = await res.json();
        setMediaCategories((prev) => [...prev, created]);
        showToast('تمت إضافة فئة المركز الإعلامي بنجاح');
      }
      setEditingMediaCat(null);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ فئة الميديا');
    }
  };

  const handleDeleteMediaCat = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الفئة وجميع المقالات التابعة لها؟')) return;
    try {
      await fetch(`/api/admin/mediacategories/${id}`, { method: 'DELETE' });
      setMediaCategories((prev) => prev.filter((c) => c.id !== id));
      setArticles((prev) => prev.filter((a) => a.mediaId !== id));
      showToast('تم حذف الفئة بنجاح');
    } catch (err) {
      console.error(err);
      showToast('تعذر حذف الفئة');
    }
  };

  // --- Handlers: Commercial ---
  const handleSaveCommercial = async (e) => {
    e.preventDefault();
    if (!editingCommercial) return;
    try {
      if (editingCommercial.id) {
        const res = await fetch(`/api/admin/comprojects/${editingCommercial.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCommercial)
        });
        const updated = await res.json();
        setCommercials((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        showToast('تم تحديث المشروع التجاري بنجاح');
      } else {
        const res = await fetch('/api/admin/comprojects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCommercial)
        });
        const created = await res.json();
        setCommercials((prev) => [created, ...prev]);
        showToast('تمت إضافة المشروع التجاري بنجاح');
      }
      setEditingCommercial(null);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ المشروع التجاري');
    }
  };

  const handleDeleteCommercial = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المشروع التجاري؟')) return;
    try {
      await fetch(`/api/admin/comprojects/${id}`, { method: 'DELETE' });
      setCommercials((prev) => prev.filter((c) => c.id !== id));
      showToast('تم حذف المشروع التجاري بنجاح');
    } catch (err) {
      console.error(err);
      showToast('تعذر حذف المشروع');
    }
  };

  // --- Handlers: Sliders ---
  const handleSaveSlider = async (e) => {
    e.preventDefault();
    if (!editingSlider) return;
    try {
      if (editingSlider.id) {
        const res = await fetch(`/api/admin/sliders/${editingSlider.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingSlider)
        });
        const updated = await res.json();
        setSliders((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        showToast('تم تحديث شريحة السلايدر بنجاح');
      } else {
        const res = await fetch('/api/admin/sliders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingSlider)
        });
        const created = await res.json();
        setSliders((prev) => [...prev, created]);
        showToast('تمت إضافة شريحة السلايدر بنجاح');
      }
      setEditingSlider(null);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ السلايدر');
    }
  };

  const handleDeleteSlider = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف شريحة السلايدر؟')) return;
    try {
      await fetch(`/api/admin/sliders/${id}`, { method: 'DELETE' });
      setSliders((prev) => prev.filter((s) => s.id !== id));
      showToast('تم حذف الشريحة بنجاح');
    } catch (err) {
      console.error(err);
      showToast('تعذر حذف السلايدر');
    }
  };

  // --- Handlers: Contacts ---
  const handleUpdateContactStatus = async (id, nextStatus) => {
    try {
      await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c)));
      showToast(`تم تحديث حالة الطلب إلى: ${nextStatus}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب نهائياً؟')) return;
    try {
      await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      setContacts((prev) => prev.filter((c) => c.id !== id));
      showToast('تم حذف الطلب بنجاح');
    } catch (err) {
      console.error(err);
      showToast('تعذر حذف الطلب');
    }
  };

  // --- Handlers: Company Settings ---
  const handleSaveCompanySettings = async (e) => {
    e.preventDefault();
    try {
      const linksPayload = [
        { id: 1, type: 0, url: companySettings.facebook, name: 'Facebook' },
        { id: 2, type: 2, url: companySettings.linkedin, name: 'LinkedIn' },
        { id: 3, type: 3, url: companySettings.instagram, name: 'Instagram' },
        { id: 4, type: 4, url: companySettings.whatsapp, name: 'WhatsApp' },
        { id: 5, type: 5, url: companySettings.youtube, name: 'YouTube' },
        { id: 6, type: 6, url: companySettings.hotline, name: 'Phone' },
        { id: 7, type: 7, url: companySettings.address, name: 'Address' },
        { id: 8, type: 8, url: companySettings.email, name: 'Email' }
      ];

      await fetch('/api/admin/sociallinks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linksPayload)
      });
      showToast('تم حفظ إعدادات الشركة بنجاح');
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ الإعدادات');
    }
  };

  // Filtered lists
  const filteredUnits = units.filter((u) => {
    const matchesSearch =
      u.title?.toLowerCase().includes(unitSearch.toLowerCase()) ||
      u.codeUnit?.toLowerCase().includes(unitSearch.toLowerCase()) ||
      u.nameLocation?.toLowerCase().includes(unitSearch.toLowerCase());
    const matchesStatus = unitStatusFilter === 'ALL' || u.status === unitStatusFilter;
    const matchesProject = unitProjectFilter === 'ALL' || String(u.projectId) === String(unitProjectFilter);
    return matchesSearch && matchesStatus && matchesProject;
  });

  const filteredProjects = projects.filter((p) => {
    return (
      p.name?.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.areaName?.toLowerCase().includes(projectSearch.toLowerCase())
    );
  });

  const filteredAreas = areas.filter((a) => {
    return areaCityFilter === 'ALL' || String(a.cityId) === String(areaCityFilter);
  });

  const filteredArticles = articles.filter((a) => {
    return mediaCatFilter === 'ALL' || String(a.mediaId) === String(mediaCatFilter);
  });

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.phone?.includes(contactSearch) ||
      c.project?.toLowerCase().includes(contactSearch.toLowerCase());
    const matchesStatus = contactStatusFilter === 'ALL' || c.status === contactStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Paginated items
  const PAGE_SIZES = {
    units: 9,
    projects: 6,
    cities: 6,
    areas: 8,
    commercial: 6,
    media: 6,
    sliders: 4,
    contacts: 8,
    finishing: 4
  };

  const paginatedUnits = filteredUnits.slice((unitPage - 1) * PAGE_SIZES.units, unitPage * PAGE_SIZES.units);
  const paginatedProjects = filteredProjects.slice((projectPage - 1) * PAGE_SIZES.projects, projectPage * PAGE_SIZES.projects);
  const paginatedCities = cities.slice((cityPage - 1) * PAGE_SIZES.cities, cityPage * PAGE_SIZES.cities);
  const paginatedAreas = filteredAreas.slice((areaPage - 1) * PAGE_SIZES.areas, areaPage * PAGE_SIZES.areas);
  const paginatedCommercials = commercials.slice((commercialPage - 1) * PAGE_SIZES.commercial, commercialPage * PAGE_SIZES.commercial);
  const paginatedArticles = filteredArticles.slice((mediaPage - 1) * PAGE_SIZES.media, mediaPage * PAGE_SIZES.media);
  const paginatedSliders = sliders.slice((sliderPage - 1) * PAGE_SIZES.sliders, sliderPage * PAGE_SIZES.sliders);
  const paginatedContacts = filteredContacts.slice((contactPage - 1) * PAGE_SIZES.contacts, contactPage * PAGE_SIZES.contacts);
  const paginatedFinishCategories = finishCategories.slice((finishPage - 1) * PAGE_SIZES.finishing, finishPage * PAGE_SIZES.finishing);

  const totalSoldUnits = units.filter((u) => u.status === 'Sold').length;
  const totalAvailableUnits = units.filter((u) => u.status === 'Available').length;
  const newContactsCount = contacts.filter((c) => c.status === 'جديد').length;

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row text-right bg-slate-50" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FIXED SIDEBAR (Zero outer scroll, independent navigation) */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-72 h-auto md:h-screen flex-shrink-0 bg-slate-900 text-slate-300 flex flex-col justify-between border-l border-slate-800 select-none z-30">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header (Fixed) */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#d61c23] to-[#f59e0b] flex items-center justify-center text-white font-black shadow-lg">
                ق
              </div>
              <div>
                <h2 className="text-sm font-black text-white tracking-wide">قنديل العقارية</h2>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  لوحة التحكم المتكاملة 2026
                </span>
              </div>
            </div>
            <Link
              to="/"
              target="_blank"
              title="زيارة الموقع العام"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Links (Scrolls independently within sidebar only) */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-medium custom-scrollbar">
            <div className="px-3 py-1 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              الرئيسية والإحصائيات
            </div>

            <button
              onClick={() => {
                setActiveTab('overview');
                setEditingUnit(null);
                setEditingProject(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#d61c23] text-white font-bold shadow-md shadow-[#d61c23]/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>نظرة عامة وإحصائيات</span>
              </div>
            </button>

            <button
              onClick={() => {
                setActiveTab('landingPage');
                setEditingUnit(null);
                setEditingProject(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'landingPage'
                  ? 'bg-[#d61c23] text-white font-bold shadow-md shadow-[#d61c23]/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>إحصائيات وفيديو الرئيسية</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                حي
              </span>
            </button>

            <div className="pt-2.5 px-3 py-1 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              المشروعات والوحدات
            </div>

            <button
              onClick={() => {
                setActiveTab('cities');
                setEditingCity(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'cities'
                  ? 'bg-[#d61c23] text-white font-bold shadow-md shadow-[#d61c23]/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4" />
                <span>المدن والمحافظات</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                {cities.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('areas');
                setEditingArea(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'areas'
                  ? 'bg-[#d61c23] text-white font-bold shadow-md shadow-[#d61c23]/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>المناطق والأحياء</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                {areas.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('projects');
                setEditingProject(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'projects'
                  ? 'bg-[#d61c23] text-white font-bold shadow-md shadow-[#d61c23]/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4" />
                <span>المشروعات السكنية</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('units');
                setEditingUnit(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'units'
                  ? 'bg-[#d61c23] text-white font-bold shadow-md shadow-[#d61c23]/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HomeIcon className="w-4 h-4" />
                <span>الوحدات العقارية</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                {units.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('commercial');
                setEditingCommercial(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'commercial'
                  ? 'bg-[#d61c23] text-white font-bold shadow-md shadow-[#d61c23]/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <span>المشروعات التجارية</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                {commercials.length}
              </span>
            </button>

            <div className="pt-2.5 px-3 py-1 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              المحتوى والتشطيبات
            </div>

            <button
              onClick={() => {
                setActiveTab('finishing');
                setEditingFinishCat(null);
                setEditingFinishItem(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'finishing'
                  ? 'bg-[#d61c23] text-white font-bold shadow-md shadow-[#d61c23]/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Paintbrush className="w-4 h-4 text-emerald-400" />
                <span>أقسام ونماذج التشطيب</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                {finishCategories.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('media');
                setEditingArticle(null);
                setEditingMediaCat(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'media'
                  ? 'bg-[#d61c23] text-white font-bold shadow-md shadow-[#d61c23]/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Newspaper className="w-4 h-4" />
                <span>المركز الإعلامي والمقالات</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                {articles.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('whyUs');
                setEditingWhyUs(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'whyUs'
                  ? 'bg-[#d61c23] text-white font-bold shadow-md shadow-[#d61c23]/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-300" />
                <span>تعديل لماذا قنديل</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                {whyUsList.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('sliders');
                setEditingSlider(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'sliders'
                  ? 'bg-[#d61c23] text-white font-bold shadow-md shadow-[#d61c23]/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4" />
                <span>سلايدر الرئيسية</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                {sliders.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('coverImages');
                setEditingCover(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'coverImages'
                  ? 'bg-[#d61c23] text-white font-bold shadow-md shadow-[#d61c23]/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>كفرات وبنرات الصفحات</span>
              </div>
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                {coverImages.length}
              </span>
            </button>

            <div className="pt-2.5 px-3 py-1 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              خدمة العملاء والاتصال
            </div>

            <button
              onClick={() => {
                setActiveTab('contacts');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'contacts'
                  ? 'bg-[#d61c23] text-white font-bold shadow-md shadow-[#d61c23]/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4" />
                <span>طلبات ورسائل العملاء</span>
              </div>
              {newContactsCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500 text-white font-bold animate-pulse">
                  {newContactsCount} جديد
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#d61c23] text-white font-bold shadow-md shadow-[#d61c23]/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>روابط وإعدادات التواصل</span>
              </div>
            </button>
          </nav>

          {/* Footer Actions (Fixed) */}
          <div className="p-3 border-t border-slate-800 flex-shrink-0">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white leading-tight">Admin Kandil</p>
                  <span className="text-[10px] text-slate-400">مدير النظام</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="تسجيل الخروج"
                className="text-slate-400 hover:text-red-400 p-1.5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA (Own smooth scroll, fully independent) */}
      {/* ========================================================================= */}
      <main className="flex-1 h-screen overflow-y-auto p-6 md:p-10 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span>لوحة التحكم</span>
                <ChevronRight className="w-3 h-3 rotate-180 text-gray-400" />
                <span className="font-bold text-gray-800">
                  {activeTab === 'overview' && 'نظرة عامة وإحصائيات'}
                  {activeTab === 'landingPage' && 'إحصائيات وفيديو الصفحة الرئيسية'}
                  {activeTab === 'cities' && 'المدن والمحافظات'}
                  {activeTab === 'areas' && 'المناطق والأحياء'}
                  {activeTab === 'projects' && 'المشروعات السكنية'}
                  {activeTab === 'units' && 'الوحدات العقارية'}
                  {activeTab === 'commercial' && 'المشروعات التجارية'}
                  {activeTab === 'finishing' && 'أقسام ونماذج التشطيبات'}
                  {activeTab === 'media' && 'المركز الإعلامي والمقالات'}
                  {activeTab === 'whyUs' && 'محتوى صفحة لماذا قنديل'}
                  {activeTab === 'sliders' && 'سلايدر الرئيسية'}
                  {activeTab === 'coverImages' && 'كفرات وبنرات الصفحات'}
                  {activeTab === 'contacts' && 'طلبات ورسائل العملاء'}
                  {activeTab === 'settings' && 'إعدادات الشركة وروابط التواصل'}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900">
                {activeTab === 'overview' && 'نظرة عامة على النظام'}
                {activeTab === 'landingPage' && 'التحكم في فيديو وإحصائيات الرئيسية'}
                {activeTab === 'cities' && (editingCity ? 'نموذج المدينة' : 'المدن والمحافظات')}
                {activeTab === 'areas' && (editingArea ? 'نموذج المنطقة' : 'المناطق والأحياء')}
                {activeTab === 'projects' && (editingProject ? 'نموذج المشروع السكني' : 'المشروعات السكنية')}
                {activeTab === 'units' && (editingUnit ? 'نموذج الوحدة العقارية' : 'الوحدات العقارية')}
                {activeTab === 'commercial' && (editingCommercial ? 'نموذج المشروع التجاري' : 'المشروعات التجارية')}
                {activeTab === 'finishing' && (editingFinishCat || editingFinishItem ? 'نموذج التشطيب' : 'أقسام ونماذج التشطيبات')}
                {activeTab === 'media' && (editingArticle || editingMediaCat ? 'نموذج المركز الإعلامي' : 'المركز الإعلامي والمقالات')}
                {activeTab === 'whyUs' && (editingWhyUs ? 'نموذج لماذا قنديل' : 'محتوى لماذا قنديل')}
                {activeTab === 'sliders' && (editingSlider ? 'نموذج شريحة السلايدر' : 'سلايدر الصفحة الرئيسية')}
                {activeTab === 'coverImages' && (editingCover ? 'تعديل كفر الصفحة' : 'كفرات وبنرات الصفحات (7 صفحات)')}
                {activeTab === 'contacts' && 'استفسارات وطلبات العملاء'}
                {activeTab === 'settings' && 'إعدادات الشركة وبيانات التواصل'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadAllData}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-bold transition shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#d61c23]' : ''}`} />
                <span>تحديث البيانات</span>
              </button>
              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>معاينة الموقع</span>
              </Link>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-500">إجمالي الوحدات المعروضة</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <HomeIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">{units.length}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-emerald-600 font-bold">{totalAvailableUnits} متاح</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-amber-600 font-bold">{totalSoldUnits} مباع</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-500">المشروعات السكنية</span>
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-[#d61c23] flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">{projects.length}</div>
                  <div className="text-xs text-gray-500">
                    موزعة على {areas.length} منطقة في {cities.length} مدن
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-500">إحصائيات الصفحة الرئيسية</span>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">+{landingPageData.totalUnits}</div>
                  <div className="text-xs text-gray-500">
                    {landingPageData.projectsCount} مشروع • {landingPageData.deliveredUnitsCount} مسلّمة
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-500">طلبات ورسائل العملاء</span>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">{contacts.length}</div>
                  <div className="text-xs text-purple-600 font-bold">
                    {newContactsCount} طلبات جديدة بحاجة للمتابعة
                  </div>
                </div>
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 mb-4">اختصارات سريعة</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('units');
                      setEditingUnit({
                        title: '',
                        codeUnit: '',
                        status: 'Available',
                        typePrice: 'كاش',
                        price: 0,
                        area: 0,
                        numberRoom: 3,
                        numberBathroom: 2,
                        yearOfBuild: 2024,
                        projectId: projects?.[0]?.id || null,
                        nameLocation: 'القاهرة الجديدة',
                        imageName: '',
                        description: '',
                        isShown: true
                      });
                    }}
                    className="p-4 rounded-xl border border-gray-100 hover:border-[#d61c23] hover:bg-red-50/30 transition text-center flex flex-col items-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-red-100 text-[#d61c23] flex items-center justify-center group-hover:scale-110 transition">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">إضافة وحدة</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('projects');
                      setEditingProject({
                        name: '',
                        imageName: '',
                        mainImage: '',
                        areaId: areas?.[0]?.id || 1,
                        status: 'تحت الإنشاء',
                        deliveryDate: '2026',
                        aboutProject: '',
                        videoURL: '',
                        pdfFile: '',
                        locationImage: '',
                        isFinish: false,
                        detailsCoverImage: '',
                        images: [],
                        locationProjects: [
                          { time: '5', nameOfStreet: 'مسجد فاطمة الشربتلي' },
                          { time: '3', nameOfStreet: 'المنطقة الخدمية' },
                          { time: '5', nameOfStreet: 'الجامعة الألمانية' }
                        ]
                      });
                    }}
                    className="p-4 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50/30 transition text-center flex flex-col items-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">إضافة مشروع</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('landingPage')}
                    className="p-4 rounded-xl border border-gray-100 hover:border-amber-500 hover:bg-amber-50/30 transition text-center flex flex-col items-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">إحصائيات الرئيسية</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('cities')}
                    className="p-4 rounded-xl border border-gray-100 hover:border-emerald-500 hover:bg-emerald-50/30 transition text-center flex flex-col items-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
                      <Globe className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">إدارة المدن</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('finishing')}
                    className="p-4 rounded-xl border border-gray-100 hover:border-purple-500 hover:bg-purple-50/30 transition text-center flex flex-col items-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition">
                      <Paintbrush className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">خدمات التشطيب</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('coverImages')}
                    className="p-4 rounded-xl border border-gray-100 hover:border-cyan-500 hover:bg-cyan-50/30 transition text-center flex flex-col items-center gap-2 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">كفرات الصفحات</span>
                  </button>
                </div>
              </div>

              {/* Inquiries table preview */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-black text-gray-900">أحدث رسائل واستفسارات العملاء</h3>
                    <p className="text-xs text-gray-400">آخر الطلبات المستلمة من النماذج بالموقع</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('contacts')}
                    className="text-xs font-bold text-[#d61c23] hover:underline"
                  >
                    عرض الكل ({contacts.length})
                  </button>
                </div>

                {contacts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs">لا توجد رسائل حالياً</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400">
                          <th className="pb-3 font-bold">العميل</th>
                          <th className="pb-3 font-bold">الهاتف</th>
                          <th className="pb-3 font-bold">المشروع المستفسر عنه</th>
                          <th className="pb-3 font-bold">التاريخ</th>
                          <th className="pb-3 font-bold">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {contacts.slice(0, 5).map((c) => (
                          <tr key={c.id} className="hover:bg-gray-50/50">
                            <td className="py-3 font-bold text-gray-800">{c.name}</td>
                            <td className="py-3 font-mono text-gray-600" dir="ltr">{c.phone}</td>
                            <td className="py-3 text-gray-600">{c.project || 'عام'}</td>
                            <td className="py-3 text-gray-400">
                              {new Date(c.createdAt).toLocaleDateString('ar-EG')}
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  c.status === 'جديد'
                                    ? 'bg-red-50 text-red-600'
                                    : c.status === 'تم التواصل'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-amber-50 text-amber-600'
                                }`}
                              >
                                {c.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: LANDING PAGE MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'landingPage' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm max-w-4xl space-y-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-1">
                  التحكم في محتوى الصفحة الرئيسية (Landing Page)
                </h2>
                <p className="text-xs text-gray-500">
                  تعديل رابط الفيديو والعدادات الإحصائية في الصفحة الرئيسية مباشرة
                </p>
              </div>

              <form onSubmit={handleSaveLandingPage} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700">
                    رابط فيديو يوتيوب التعريفي (YouTube Embed URL):
                  </label>
                  <input
                    type="text"
                    required
                    value={landingPageData.videoUrl}
                    onChange={(e) =>
                      setLandingPageData({ ...landingPageData, videoUrl: e.target.value })
                    }
                    placeholder="https://www.youtube.com/embed/5oXlbsDoiPE"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    dir="ltr"
                  />
                  <p className="text-[11px] text-gray-400">
                    ملاحظة: الرابط يجب أن يكون بصيغة embed مثل https://www.youtube.com/embed/VIDEO_ID
                  </p>

                  {landingPageData.videoUrl && (
                    <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 aspect-video max-w-md bg-black">
                      <iframe
                        src={landingPageData.videoUrl}
                        title="معاينة الفيديو"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <h3 className="text-sm font-black text-gray-900 mb-3">
                    عدادات الإحصائيات (الإنجازات بالأرقام):
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        عدد المشروعات (Projects Count):
                      </label>
                      <input
                        type="number"
                        required
                        value={landingPageData.projectsCount}
                        onChange={(e) =>
                          setLandingPageData({
                            ...landingPageData,
                            projectsCount: Number(e.target.value)
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        إجمالي الوحدات (Total Units):
                      </label>
                      <input
                        type="number"
                        required
                        value={landingPageData.totalUnits}
                        onChange={(e) =>
                          setLandingPageData({
                            ...landingPageData,
                            totalUnits: Number(e.target.value)
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        وحدات تحت الإنشاء (Under Construction):
                      </label>
                      <input
                        type="number"
                        required
                        value={landingPageData.underConstructionCount}
                        onChange={(e) =>
                          setLandingPageData({
                            ...landingPageData,
                            underConstructionCount: Number(e.target.value)
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        وحدات تم تسليمها (Delivered Units):
                      </label>
                      <input
                        type="number"
                        required
                        value={landingPageData.deliveredUnitsCount}
                        onChange={(e) =>
                          setLandingPageData({
                            ...landingPageData,
                            deliveredUnitsCount: Number(e.target.value)
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ التعديلات وتحديث الصفحة الرئيسية</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CITIES MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'cities' && (
            <div className="space-y-6">
              {editingCity ? (
                /* IN-PAGE FORM: CITIES */
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingCity(null)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>العودة لقائمة المدن</span>
                    </button>
                    <h3 className="text-base font-black text-gray-900">
                      {editingCity.id ? 'تعديل بيانات المدينة' : 'إضافة مدينة جديدة'}
                    </h3>
                  </div>

                  <form onSubmit={handleSaveCity} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">اسم المدينة</label>
                      <input
                        type="text"
                        required
                        value={editingCity.name}
                        onChange={(e) => setEditingCity({ ...editingCity, name: e.target.value })}
                        placeholder="مثال: القاهرة الجديدة أو الشروق"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <ImageUploader
                      label="صورة المدينة (رفع ملف)"
                      value={editingCity.imageName || ''}
                      onChange={(url) => setEditingCity({ ...editingCity, imageName: url })}
                    />

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setEditingCity(null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-[#d61c23] hover:bg-[#b7151b] text-white text-xs font-bold shadow"
                      >
                        حفظ المدينة
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* LIST VIEW: CITIES */
                <>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-gray-900">المدن والمحافظات</h2>
                      <p className="text-xs text-gray-500">إدارة المدن الرئيسية المتاح بها المشروعات</p>
                    </div>
                    <button
                      onClick={() => setEditingCity({ name: '', imageName: '' })}
                      className="flex items-center gap-2 bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة مدينة جديدة</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedCities.map((city) => {
                      const cityAreas = areas.filter((a) => a.cityId === city.id);
                      return (
                        <div
                          key={city.id}
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
                        >
                          <div className="relative h-44 bg-slate-100">
                            <img
                              src={getImageUrl(city.imageName)}
                              alt={city.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold">
                              {cityAreas.length} مناطق تابعة
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-base font-black text-gray-900 mb-1">{city.name}</h3>
                              <p className="text-xs text-gray-400 mb-3">كود المدينة: #{city.id}</p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <button
                                onClick={() => setEditingCity(city)}
                                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-bold"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>تعديل</span>
                              </button>
                              <button
                                onClick={() => handleDeleteCity(city.id)}
                                className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-xs font-bold"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Pagination
                    currentPage={cityPage}
                    totalItems={cities.length}
                    pageSize={PAGE_SIZES.cities}
                    onPageChange={setCityPage}
                  />
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: AREAS MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'areas' && (
            <div className="space-y-6">
              {editingArea ? (
                /* IN-PAGE FORM: AREAS */
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingArea(null)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>العودة لقائمة المناطق</span>
                    </button>
                    <h3 className="text-base font-black text-gray-900">
                      {editingArea.id ? 'تعديل بيانات المنطقة' : 'إضافة منطقة جديدة'}
                    </h3>
                  </div>

                  <form onSubmit={handleSaveArea} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">اسم المنطقة</label>
                      <input
                        type="text"
                        required
                        value={editingArea.name}
                        onChange={(e) => setEditingArea({ ...editingArea, name: e.target.value })}
                        placeholder="مثال: النرجس الجديدة أو بيت الوطن"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">المدينة التابعة لها</label>
                      <select
                        value={editingArea.cityId}
                        onChange={(e) => setEditingArea({ ...editingArea, cityId: Number(e.target.value) })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      >
                        {cities.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <ImageUploader
                      label="صورة المنطقة (رفع ملف)"
                      value={editingArea.imageName || ''}
                      onChange={(url) => setEditingArea({ ...editingArea, imageName: url })}
                    />

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setEditingArea(null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-[#d61c23] hover:bg-[#b7151b] text-white text-xs font-bold shadow"
                      >
                        حفظ المنطقة
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* LIST VIEW: AREAS */
                <>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-gray-900">المناطق والأحياء</h2>
                      <p className="text-xs text-gray-500">إدارة المناطق السكنية وتوزيعها على المدن</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={areaCityFilter}
                        onChange={(e) => {
                          setAreaCityFilter(e.target.value);
                          setAreaPage(1);
                        }}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none"
                      >
                        <option value="ALL">جميع المدن ({areas.length})</option>
                        {cities.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() =>
                          setEditingArea({
                            name: '',
                            cityId: cities?.[0]?.id || 1,
                            imageName: ''
                          })
                        }
                        className="flex items-center gap-2 bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إضافة منطقة جديدة</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {paginatedAreas.map((area) => {
                      const parentCity = cities.find((c) => c.id === area.cityId);
                      const areaProjects = projects.filter((p) => p.areaId === area.id);
                      return (
                        <div
                          key={area.id}
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
                        >
                          <div className="relative h-36 bg-slate-100">
                            <img
                              src={getImageUrl(area.imageName)}
                              alt={area.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              {parentCity?.name || 'مدينة'}
                            </div>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-sm font-black text-gray-900 mb-1 leading-snug">
                                {area.name}
                              </h3>
                              <p className="text-[11px] text-gray-400 mb-3">
                                {areaProjects.length} مشروع مسجل في هذه المنطقة
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <button
                                onClick={() => setEditingArea(area)}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-bold"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>تعديل</span>
                              </button>
                              <button
                                onClick={() => handleDeleteArea(area.id)}
                                className="flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-bold"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Pagination
                    currentPage={areaPage}
                    totalItems={filteredAreas.length}
                    pageSize={PAGE_SIZES.areas}
                    onPageChange={setAreaPage}
                  />
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: PROJECTS MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {editingProject ? (
                /* IN-PAGE FORM: PROJECTS */
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm max-w-3xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>العودة لقائمة المشاريع</span>
                    </button>
                    <h3 className="text-base font-black text-gray-900">
                      {editingProject.id ? 'تعديل بيانات المشروع السكني' : 'إضافة مشروع سكني جديد'}
                    </h3>
                  </div>

                  <form onSubmit={handleSaveProject} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">اسم المشروع</label>
                        <input
                          type="text"
                          required
                          value={editingProject.name || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, name: e.target.value })
                          }
                          placeholder="مثال: مشروع 125 النرجس الجديدة"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">المنطقة</label>
                        <select
                          value={editingProject.areaId || ''}
                          onChange={(e) => {
                            const selArea = areas.find((a) => String(a.id) === e.target.value);
                            setEditingProject({
                              ...editingProject,
                              areaId: e.target.value ? Number(e.target.value) : null,
                              areaName: selArea?.name || ''
                            });
                          }}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        >
                          {areas.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">حالة المشروع</label>
                        <select
                          value={editingProject.status || 'تحت الإنشاء'}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, status: e.target.value })
                          }
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        >
                          <option value="تحت الإنشاء">تحت الإنشاء</option>
                          <option value="متاح">متاح</option>
                          <option value="تم التسليم">تم التسليم</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">موعد التسليم</label>
                        <input
                          type="text"
                          value={editingProject.deliveryDate || '2026'}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, deliveryDate: e.target.value })
                          }
                          placeholder="مثال: 2026 أو استلام فوري"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">رابط الفيديو (YouTube)</label>
                        <input
                          type="text"
                          value={editingProject.videoURL || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, videoURL: e.target.value })
                          }
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                          dir="ltr"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <ImageUploader
                          label="الصورة الرئيسية للمشروع (رفع ملف)"
                          value={editingProject.imageName || editingProject.mainImage || ''}
                          onChange={(url) =>
                            setEditingProject({
                              ...editingProject,
                              imageName: url,
                              mainImage: url
                            })
                          }
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <ImageUploader
                          label="كفر صفحة تفاصيل المشروع (رفع ملف)"
                          value={editingProject.detailsCoverImage || ''}
                          onChange={(url) =>
                            setEditingProject({ ...editingProject, detailsCoverImage: url })
                          }
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">عن المشروع (About Project)</label>
                        <textarea
                          rows="4"
                          value={editingProject.aboutProject || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, aboutProject: e.target.value })
                          }
                          placeholder="نبذة شاملة عن المشروع والموقع والمزايا..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        ></textarea>
                      </div>

                      <div className="sm:col-span-2 flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <input
                          type="checkbox"
                          id="isFinishProj"
                          checked={!!editingProject.isFinish}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, isFinish: e.target.checked })
                          }
                          className="w-4 h-4 text-[#d61c23] rounded"
                        />
                        <label htmlFor="isFinishProj" className="text-xs font-bold text-gray-800 cursor-pointer">
                          عرض المشروع في سابقة الأعمال (Completed Projects / isFinish)
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-[#d61c23] hover:bg-[#b7151b] text-white text-xs font-bold shadow"
                      >
                        حفظ المشروع
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* LIST VIEW: PROJECTS */
                <>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                      <input
                        type="text"
                        placeholder="ابحث باسم المشروع أو المنطقة..."
                        value={projectSearch}
                        onChange={(e) => {
                          setProjectSearch(e.target.value);
                          setProjectPage(1);
                        }}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>

                    <button
                      onClick={() =>
                        setEditingProject({
                          name: '',
                          imageName: '',
                          areaId: areas?.[0]?.id || 1,
                          status: 'تحت الإنشاء',
                          deliveryDate: '2026',
                          aboutProject: '',
                          videoURL: '',
                          pdfFile: '',
                          isFinish: false,
                          detailsCoverImage: ''
                        })
                      }
                      className="flex items-center gap-2 bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة مشروع جديد</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedProjects.map((p) => {
                      const projectUnits = units.filter((u) => u.projectId === p.id);
                      return (
                        <div
                          key={p.id}
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
                        >
                          <div className="relative h-48 bg-slate-100">
                            <img
                              src={getImageUrl(p.imageName || p.mainImage)}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              <span className="bg-slate-900/80 backdrop-blur text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                                {p.status || 'تحت الإنشاء'}
                              </span>
                              {p.isFinish && (
                                <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-[10px] font-bold">
                                  سابقة أعمال
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="text-xs text-[#d61c23] font-bold mb-1">
                                {p.areaName || 'القاهرة الجديدة'}
                              </div>
                              <h3 className="text-base font-black text-gray-900 mb-2 leading-tight">
                                {p.name}
                              </h3>
                              <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                                {p.aboutProject?.replace(/<[^>]*>/g, '') || 'مشروع سكني متكامل من قنديل للتطوير العقاري.'}
                              </p>
                            </div>

                            <div className="space-y-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>وحدات المشروع:</span>
                                <button
                                  onClick={() => {
                                    setUnitProjectFilter(String(p.id));
                                    setActiveTab('units');
                                  }}
                                  className="font-bold text-[#d61c23] hover:underline"
                                >
                                  {projectUnits.length} وحدة (عرض الوحدات)
                                </button>
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <button
                                  onClick={() => setEditingProject({
                                    ...p,
                                    images: Array.isArray(p.images) ? p.images : [],
                                    locationProjects: Array.isArray(p.locationProjects) && p.locationProjects.length > 0 ? p.locationProjects : [
                                      { time: '5', nameOfStreet: 'مسجد فاطمة الشربتلي' },
                                      { time: '3', nameOfStreet: 'المنطقة الخدمية' },
                                      { time: '5', nameOfStreet: 'الجامعة الألمانية' }
                                    ]
                                  })}
                                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-bold"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  <span>تعديل</span>
                                </button>

                                <Link
                                  to={`/projectcategory/1/project/${p.id}`}
                                  target="_blank"
                                  className="text-gray-400 hover:text-gray-700 text-xs flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>صفحة المشروع</span>
                                </Link>

                                <button
                                  onClick={() => handleDeleteProject(p.id)}
                                  className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-xs font-bold"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>حذف</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Pagination
                    currentPage={projectPage}
                    totalItems={filteredProjects.length}
                    pageSize={PAGE_SIZES.projects}
                    onPageChange={setProjectPage}
                  />
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: UNITS MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'units' && (
            <div className="space-y-6">
              {editingUnit ? (
                /* IN-PAGE FORM: UNITS */
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm max-w-3xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingUnit(null)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>العودة لقائمة الوحدات</span>
                    </button>
                    <h3 className="text-base font-black text-gray-900">
                      {editingUnit.id ? 'تعديل بيانات الوحدة العقارية' : 'إضافة وحدة عقارية جديدة'}
                    </h3>
                  </div>

                  <form onSubmit={handleSaveUnit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">عنوان الوحدة</label>
                        <input
                          type="text"
                          required
                          value={editingUnit.title}
                          onChange={(e) => setEditingUnit({ ...editingUnit, title: e.target.value })}
                          placeholder="مثال: شقة للبيع بمساحة 180م بالنرجس الجديدة"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">كود الوحدة (Unit Code)</label>
                        <input
                          type="text"
                          value={editingUnit.codeUnit || ''}
                          onChange={(e) => setEditingUnit({ ...editingUnit, codeUnit: e.target.value })}
                          placeholder="مثال: D104-N"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">المشروع التابع</label>
                        <select
                          value={editingUnit.projectId || ''}
                          onChange={(e) =>
                            setEditingUnit({
                              ...editingUnit,
                              projectId: e.target.value ? Number(e.target.value) : null
                            })
                          }
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        >
                          <option value="">بدون مشروع محدد</option>
                          {projects.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">السعر (ج.م)</label>
                        <input
                          type="number"
                          required
                          value={editingUnit.price}
                          onChange={(e) =>
                            setEditingUnit({ ...editingUnit, price: Number(e.target.value) })
                          }
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">نوع السعر / الدفع</label>
                        <select
                          value={editingUnit.typePrice || 'كاش'}
                          onChange={(e) =>
                            setEditingUnit({ ...editingUnit, typePrice: e.target.value })
                          }
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        >
                          <option value="كاش">كاش</option>
                          <option value="تقسيط">تقسيط</option>
                          <option value="مقدم">مقدم</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">المساحة (م²)</label>
                        <input
                          type="number"
                          required
                          value={editingUnit.area}
                          onChange={(e) =>
                            setEditingUnit({ ...editingUnit, area: Number(e.target.value) })
                          }
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">الحالة</label>
                        <select
                          value={editingUnit.status || 'Available'}
                          onChange={(e) => setEditingUnit({ ...editingUnit, status: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        >
                          <option value="Available">متاح للبيع</option>
                          <option value="Sold">تم البيع</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">عدد الغرف</label>
                        <input
                          type="number"
                          value={editingUnit.numberRoom}
                          onChange={(e) =>
                            setEditingUnit({ ...editingUnit, numberRoom: Number(e.target.value) })
                          }
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">عدد الحمامات</label>
                        <input
                          type="number"
                          value={editingUnit.numberBathroom}
                          onChange={(e) =>
                            setEditingUnit({
                              ...editingUnit,
                              numberBathroom: Number(e.target.value)
                            })
                          }
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">سنة البناء</label>
                        <input
                          type="number"
                          value={editingUnit.yearOfBuild || 2024}
                          onChange={(e) =>
                            setEditingUnit({ ...editingUnit, yearOfBuild: Number(e.target.value) })
                          }
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">اسم الموقع / الحي</label>
                        <input
                          type="text"
                          value={editingUnit.nameLocation || ''}
                          onChange={(e) =>
                            setEditingUnit({ ...editingUnit, nameLocation: e.target.value })
                          }
                          placeholder="مثال: التجمع الخامس، النرجس الجديدة"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <ImageUploader
                          label="الصورة الرئيسية للوحدة (رفع ملف)"
                          value={editingUnit.imageName || ''}
                          onChange={(url) => setEditingUnit({ ...editingUnit, imageName: url })}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">رابط الفيديو (YouTube)</label>
                        <input
                          type="text"
                          value={editingUnit.videoUrl || ''}
                          onChange={(e) => setEditingUnit({ ...editingUnit, videoUrl: e.target.value })}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                          dir="ltr"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">وصف وتفاصيل الوحدة</label>
                        <textarea
                          rows="3"
                          value={editingUnit.description || ''}
                          onChange={(e) =>
                            setEditingUnit({ ...editingUnit, description: e.target.value })
                          }
                          placeholder="اكتب وصفاً جذاباً للوحدة ومزاياها..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        ></textarea>
                      </div>

                      <div className="sm:col-span-2 flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <input
                          type="checkbox"
                          id="isShownUnit"
                          checked={editingUnit.isShown !== false}
                          onChange={(e) => setEditingUnit({ ...editingUnit, isShown: e.target.checked })}
                          className="w-4 h-4 text-[#d61c23] rounded"
                        />
                        <label htmlFor="isShownUnit" className="text-xs font-bold text-gray-800 cursor-pointer">
                          إظهار الوحدة للزوار في الموقع العام (isShown)
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setEditingUnit(null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-[#d61c23] hover:bg-[#b7151b] text-white text-xs font-bold shadow"
                      >
                        حفظ الوحدة
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* LIST VIEW: UNITS */
                <>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="ابحث بالكود، الاسم، أو العنوان..."
                          value={unitSearch}
                          onChange={(e) => {
                            setUnitSearch(e.target.value);
                            setUnitPage(1);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        />
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                      </div>

                      <select
                        value={unitStatusFilter}
                        onChange={(e) => {
                          setUnitStatusFilter(e.target.value);
                          setUnitPage(1);
                        }}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none"
                      >
                        <option value="ALL">جميع الحالات</option>
                        <option value="Available">متاح للبيع</option>
                        <option value="Sold">تم البيع</option>
                      </select>

                      <select
                        value={unitProjectFilter}
                        onChange={(e) => {
                          setUnitProjectFilter(e.target.value);
                          setUnitPage(1);
                        }}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none"
                      >
                        <option value="ALL">جميع المشروعات ({units.length})</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>

                      {unitProjectFilter !== 'ALL' && (
                        <button
                          onClick={() => {
                            setUnitProjectFilter('ALL');
                            setUnitPage(1);
                          }}
                          className="text-xs text-red-600 font-bold hover:underline"
                        >
                          إلغاء فلتر المشروع
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setEditingUnit({
                          title: '',
                          codeUnit: '',
                          status: 'Available',
                          typePrice: 'كاش',
                          price: 0,
                          area: 0,
                          numberRoom: 3,
                          numberBathroom: 2,
                          yearOfBuild: 2024,
                          projectId: unitProjectFilter !== 'ALL' ? Number(unitProjectFilter) : (projects?.[0]?.id || null),
                          nameLocation: 'القاهرة الجديدة',
                          imageName: '',
                          description: '',
                          isShown: true
                        })
                      }
                      className="flex items-center gap-2 bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة وحدة جديدة</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedUnits.map((u) => {
                      const parentProject = projects.find((p) => p.id === u.projectId);
                      return (
                        <div
                          key={u.id}
                          className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden flex flex-col justify-between ${
                            !u.isShown ? 'opacity-70 border-dashed border-gray-300' : 'border-gray-100'
                          }`}
                        >
                          <div className="relative h-44 bg-slate-100">
                            <img
                              src={getImageUrl(u.imageName)}
                              alt={u.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm ${
                                  u.status === 'Available'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-red-600 text-white'
                                }`}
                              >
                                {u.status === 'Available' ? 'متاح' : 'تم البيع'}
                              </span>
                              <span className="bg-slate-900/80 backdrop-blur text-white px-2.5 py-1 rounded-full text-[10px] font-mono">
                                {u.codeUnit || `#${u.id}`}
                              </span>
                            </div>

                            <div className="absolute bottom-3 left-3">
                              <button
                                onClick={() => handleToggleUnitVisibility(u)}
                                title={u.isShown ? 'الوحدة معروضة للزوار - اضغط للإخفاء' : 'الوحدة مخفية - اضغط للإظهار'}
                                className={`p-1.5 rounded-lg shadow backdrop-blur transition ${
                                  u.isShown ? 'bg-white/90 text-emerald-600' : 'bg-red-600 text-white'
                                }`}
                              >
                                {u.isShown ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="text-[11px] text-[#d61c23] font-bold mb-1">
                                {parentProject?.name || u.nameLocation || 'مشروع سكني'}
                              </div>
                              <h3 className="text-base font-black text-gray-900 mb-2 leading-tight">
                                {u.title}
                              </h3>

                              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                <span>{u.area} م²</span>
                                <span>•</span>
                                <span>{u.numberRoom} غرف</span>
                                <span>•</span>
                                <span>{u.numberBathroom} حمام</span>
                              </div>

                              <div className="text-base font-black text-emerald-600 mb-4 font-mono">
                                {Number(u.price).toLocaleString('ar-EG')} ج.م{' '}
                                <span className="text-xs text-gray-400 font-normal">({u.typePrice || 'كاش'})</span>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                              <button
                                onClick={() => handleToggleUnitStatus(u)}
                                className="text-[11px] font-bold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-2.5 py-1"
                              >
                                {u.status === 'Available' ? 'تحديد كمباع' : 'إتاحة للبيع'}
                              </button>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDuplicateUnit(u)}
                                  className="text-emerald-600 hover:text-emerald-700 p-1"
                                  title="تكرار / نسخ بيانات الوحدة (Duplicate)"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingUnit(u)}
                                  className="text-blue-600 hover:text-blue-700 p-1"
                                  title="تعديل"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <Link
                                  to={`/unit/${u.id}`}
                                  target="_blank"
                                  className="text-gray-400 hover:text-gray-700 p-1"
                                  title="معاينة"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleDeleteUnit(u.id)}
                                  className="text-red-600 hover:text-red-700 p-1"
                                  title="حذف"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Pagination
                    currentPage={unitPage}
                    totalItems={filteredUnits.length}
                    pageSize={PAGE_SIZES.units}
                    onPageChange={setUnitPage}
                  />
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: FINISHING MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'finishing' && (
            <div className="space-y-6">
              {editingFinishCat ? (
                /* IN-PAGE FORM: FINISHING CATEGORY */
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingFinishCat(null)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>العودة لقائمة باقات التشطيب</span>
                    </button>
                    <h3 className="text-base font-black text-gray-900">
                      {editingFinishCat.id ? 'تعديل باقة التشطيب' : 'إضافة باقة تشطيب جديدة'}
                    </h3>
                  </div>

                  <form onSubmit={handleSaveFinishCat} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">اسم الباقة</label>
                      <input
                        type="text"
                        required
                        value={editingFinishCat.title}
                        onChange={(e) =>
                          setEditingFinishCat({ ...editingFinishCat, title: e.target.value })
                        }
                        placeholder="مثال: باقة ألترا سوبر لوكس"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <ImageUploader
                      label="صورة باقة التشطيب (رفع ملف)"
                      value={editingFinishCat.imageName || ''}
                      onChange={(url) => setEditingFinishCat({ ...editingFinishCat, imageName: url })}
                    />

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">وصف الباقة</label>
                      <textarea
                        rows="3"
                        value={editingFinishCat.description || ''}
                        onChange={(e) =>
                          setEditingFinishCat({ ...editingFinishCat, description: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      ></textarea>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setEditingFinishCat(null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-[#d61c23] hover:bg-[#b7151b] text-white text-xs font-bold shadow"
                      >
                        حفظ الباقة
                      </button>
                    </div>
                  </form>
                </div>
              ) : editingFinishItem ? (
                /* IN-PAGE FORM: FINISHING ITEM */
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingFinishItem(null)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>العودة لقائمة النماذج</span>
                    </button>
                    <h3 className="text-base font-black text-gray-900">
                      {editingFinishItem.id ? 'تعديل نموذج التشطيب' : 'إضافة نموذج تشطيب جديد'}
                    </h3>
                  </div>

                  <form onSubmit={handleSaveFinishItem} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">اسم النموذج / العنصر</label>
                      <input
                        type="text"
                        required
                        value={editingFinishItem.title}
                        onChange={(e) =>
                          setEditingFinishItem({ ...editingFinishItem, title: e.target.value })
                        }
                        placeholder="مثال: أرضيات بورسلين ورخام إسباني"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">اسم الموقع</label>
                      <input
                        type="text"
                        value={editingFinishItem.nameLocation || ''}
                        onChange={(e) =>
                          setEditingFinishItem({ ...editingFinishItem, nameLocation: e.target.value })
                        }
                        placeholder="مثال: التجمع الخامس"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <ImageUploader
                      label="صورة النموذج (رفع ملف)"
                      value={editingFinishItem.imageName || ''}
                      onChange={(url) => setEditingFinishItem({ ...editingFinishItem, imageName: url })}
                    />

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">رابط الفيديو (YouTube)</label>
                      <input
                        type="text"
                        value={editingFinishItem.videoUrl || ''}
                        onChange={(e) =>
                          setEditingFinishItem({ ...editingFinishItem, videoUrl: e.target.value })
                        }
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">الوصف</label>
                      <textarea
                        rows="3"
                        value={editingFinishItem.description || ''}
                        onChange={(e) =>
                          setEditingFinishItem({ ...editingFinishItem, description: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      ></textarea>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setEditingFinishItem(null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-[#d61c23] hover:bg-[#b7151b] text-white text-xs font-bold shadow"
                      >
                        حفظ النموذج
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* LIST VIEW: FINISHING */
                <>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-gray-900">أقسام وباقات التشطيب</h2>
                      <p className="text-xs text-gray-500">إدارة فئات التشطيبات والنماذج المعروضة للعملاء</p>
                    </div>

                    <button
                      onClick={() =>
                        setEditingFinishCat({ title: '', imageName: '', description: '', items: [] })
                      }
                      className="flex items-center gap-2 bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة باقة تشطيب جديدة</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {paginatedFinishCategories.map((cat) => {
                      const items = Array.isArray(cat.items) ? cat.items : [];
                      return (
                        <div
                          key={cat.id}
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                              <img
                                src={getImageUrl(cat.imageName)}
                                alt={cat.title}
                                className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                              />
                              <div>
                                <h3 className="text-lg font-black text-gray-900">{cat.title}</h3>
                                <p className="text-xs text-gray-500 max-w-xl">{cat.description}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setActiveFinishCatId(cat.id);
                                  setEditingFinishItem({
                                    title: '',
                                    description: '',
                                    nameLocation: 'القاهرة الجديدة',
                                    videoUrl: '',
                                    imageName: ''
                                  });
                                }}
                                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>إضافة نموذج</span>
                              </button>
                              <button
                                onClick={() => setEditingFinishCat(cat)}
                                className="text-blue-600 hover:text-blue-700 p-1.5"
                                title="تعديل الفئة"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFinishCat(cat.id)}
                                className="text-red-600 hover:text-red-700 p-1.5"
                                title="حذف الفئة"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                              النماذج المندرجة تحت هذه الباقة ({items.length}):
                            </h4>
                            {items.length === 0 ? (
                              <div className="p-6 text-center text-xs text-gray-400 bg-gray-50 rounded-xl">
                                لا توجد نماذج مضافة بعد. اضغط "إضافة نموذج" بالأعلى.
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {items.map((it) => (
                                  <div
                                    key={it.id}
                                    className="bg-gray-50 rounded-xl p-3 border border-gray-200/70 flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={getImageUrl(it.imageName)}
                                        alt={it.title}
                                        className="w-12 h-12 rounded-lg object-cover"
                                      />
                                      <div>
                                        <p className="text-xs font-bold text-gray-900 leading-tight">
                                          {it.title}
                                        </p>
                                        <span className="text-[10px] text-gray-400">
                                          {it.nameLocation || 'القاهرة الجديدة'}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => {
                                          setActiveFinishCatId(cat.id);
                                          setEditingFinishItem(it);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 p-1"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteFinishItem(cat.id, it.id)}
                                        className="text-red-600 hover:text-red-800 p-1"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Pagination
                    currentPage={finishPage}
                    totalItems={finishCategories.length}
                    pageSize={PAGE_SIZES.finishing}
                    onPageChange={setFinishPage}
                  />
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: WHY US MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'whyUs' && (
            <div className="space-y-6">
              {editingWhyUs ? (
                /* IN-PAGE FORM: WHY US */
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingWhyUs(null)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>العودة لأقسام لماذا قنديل</span>
                    </button>
                    <h3 className="text-base font-black text-gray-900">
                      تعديل قسم لماذا قنديل #{editingWhyUs.id}
                    </h3>
                  </div>

                  <form onSubmit={handleSaveWhyUs} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">العنوان</label>
                      <input
                        type="text"
                        required
                        value={editingWhyUs.title}
                        onChange={(e) => setEditingWhyUs({ ...editingWhyUs, title: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">الوصف</label>
                      <textarea
                        rows="3"
                        value={editingWhyUs.description || ''}
                        onChange={(e) =>
                          setEditingWhyUs({ ...editingWhyUs, description: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">الاقتباس (Quote)</label>
                      <input
                        type="text"
                        value={editingWhyUs.quote || ''}
                        onChange={(e) => setEditingWhyUs({ ...editingWhyUs, quote: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <ImageUploader
                      label="الصورة (رفع ملف)"
                      value={editingWhyUs.imageUrl || ''}
                      onChange={(url) => setEditingWhyUs({ ...editingWhyUs, imageUrl: url })}
                    />

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setEditingWhyUs(null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-[#d61c23] hover:bg-[#b7151b] text-white text-xs font-bold shadow"
                      >
                        حفظ التعديل
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* LIST VIEW: WHY US */
                <>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">إدارة محتوى "لماذا قنديل"</h2>
                    <p className="text-xs text-gray-500">
                      تعديل الرؤية، الرسالة، المميزات، والاقتباسات المعروضة في صفحة لماذا قنديل
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {whyUsList.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#d61c23] text-xs font-bold">
                              قسم #{item.id}
                            </span>
                            <button
                              onClick={() => setEditingWhyUs(item)}
                              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>تعديل هذا القسم</span>
                            </button>
                          </div>

                          <h3 className="text-base font-black text-gray-900 mb-2">{item.title}</h3>
                          <div
                            className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: item.description || '' }}
                          />
                          {item.quote && item.quote !== 'undefined' && (
                            <blockquote className="border-r-2 border-[#d61c23] pr-3 text-xs italic text-gray-500 mb-3">
                              "{item.quote}"
                            </blockquote>
                          )}
                        </div>

                        {item.imageUrl && (
                          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                            <img
                              src={getImageUrl(item.imageUrl)}
                              alt={item.title}
                              className="w-16 h-12 rounded-lg object-cover border border-gray-200"
                            />
                            <span className="text-[11px] text-gray-400 font-mono truncate">
                              {item.imageUrl}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 9: COVER IMAGES MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'coverImages' && (
            <div className="space-y-6">
              {editingCover ? (
                /* IN-PAGE FORM: COVER IMAGE */
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm max-w-xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingCover(null)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>العودة لكفرات الصفحات</span>
                    </button>
                    <h3 className="text-base font-black text-gray-900">
                      تعديل كفر صفحة: {editingCover.pageName}
                    </h3>
                  </div>

                  <form onSubmit={handleSaveCoverImage} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">نوع الميديا</label>
                      <select
                        value={editingCover.imageType || 'img'}
                        onChange={(e) => setEditingCover({ ...editingCover, imageType: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      >
                        <option value="img">صورة (Image)</option>
                        <option value="video">فيديو (Video)</option>
                      </select>
                    </div>

                    <ImageUploader
                      label="ملف صورة الكفر (رفع ملف)"
                      value={editingCover.imageName || ''}
                      onChange={(url) => setEditingCover({ ...editingCover, imageName: url })}
                    />

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setEditingCover(null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-[#d61c23] hover:bg-[#b7151b] text-white text-xs font-bold shadow"
                      >
                        حفظ الكفر
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* LIST VIEW: COVER IMAGES */
                <>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">كفرات وبنرات الصفحات (7 صفحات)</h2>
                    <p className="text-xs text-gray-500">
                      إدارة صورة أو فيديو الهيدر الرئيسي لكل صفحة من صفحات الموقع السبع
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coverImages.map((cov) => (
                      <div
                        key={cov.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative h-44 bg-slate-900">
                          <img
                            src={getImageUrl(cov.imageName)}
                            alt={cov.pageName}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold">
                            {cov.pageName}
                          </div>
                          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-mono">
                            {cov.imageType === 'video' ? 'فيديو' : 'صورة'}
                          </div>
                        </div>

                        <div className="p-4 flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-gray-800">{cov.pageName}</h4>
                            <p className="text-[10px] text-gray-400 font-mono truncate max-w-[180px]">
                              {cov.imageName}
                            </p>
                          </div>

                          <button
                            onClick={() => setEditingCover(cov)}
                            className="flex items-center gap-1 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>تعديل</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 10: MEDIA & ARTICLES */}
          {/* ========================================================================= */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {editingArticle ? (
                /* IN-PAGE FORM: ARTICLE */
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingArticle(null)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>العودة لقائمة المقالات</span>
                    </button>
                    <h3 className="text-base font-black text-gray-900">
                      {editingArticle.id ? 'تعديل مقال/خبر' : 'إضافة مقال جديد'}
                    </h3>
                  </div>

                  <form onSubmit={handleSaveMedia} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">عنوان المقال</label>
                      <input
                        type="text"
                        required
                        value={editingArticle.title}
                        onChange={(e) =>
                          setEditingArticle({ ...editingArticle, title: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">الفئة</label>
                      <select
                        value={editingArticle.mediaId}
                        onChange={(e) =>
                          setEditingArticle({ ...editingArticle, mediaId: Number(e.target.value) })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      >
                        {mediaCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <ImageUploader
                      label="الصورة الرئيسية للمقال (رفع ملف)"
                      value={editingArticle.imageName || ''}
                      onChange={(url) => setEditingArticle({ ...editingArticle, imageName: url })}
                    />

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">رابط الفيديو (اختياري)</label>
                      <input
                        type="text"
                        value={editingArticle.videoURl || ''}
                        onChange={(e) =>
                          setEditingArticle({ ...editingArticle, videoURl: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">محتوى المقال</label>
                      <textarea
                        rows="4"
                        value={editingArticle.description || ''}
                        onChange={(e) =>
                          setEditingArticle({ ...editingArticle, description: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      ></textarea>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setEditingArticle(null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-[#d61c23] hover:bg-[#b7151b] text-white text-xs font-bold shadow"
                      >
                        حفظ المقال
                      </button>
                    </div>
                  </form>
                </div>
              ) : editingMediaCat ? (
                /* IN-PAGE FORM: MEDIA CATEGORY */
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm max-w-xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingMediaCat(null)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>العودة لقائمة المقالات</span>
                    </button>
                    <h3 className="text-base font-black text-gray-900">
                      {editingMediaCat.id ? 'تعديل فئة المركز الإعلامي' : 'إضافة فئة إعلامية جديدة'}
                    </h3>
                  </div>

                  <form onSubmit={handleSaveMediaCat} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">اسم الفئة</label>
                      <input
                        type="text"
                        required
                        value={editingMediaCat.title}
                        onChange={(e) =>
                          setEditingMediaCat({ ...editingMediaCat, title: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <ImageUploader
                      label="صورة الفئة (رفع ملف)"
                      value={editingMediaCat.imageName || ''}
                      onChange={(url) => setEditingMediaCat({ ...editingMediaCat, imageName: url })}
                    />

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setEditingMediaCat(null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-[#d61c23] hover:bg-[#b7151b] text-white text-xs font-bold shadow"
                      >
                        حفظ الفئة
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* LIST VIEW: MEDIA */
                <>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <select
                        value={mediaCatFilter}
                        onChange={(e) => {
                          setMediaCatFilter(e.target.value);
                          setMediaPage(1);
                        }}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none"
                      >
                        <option value="ALL">جميع فئات الميديا ({articles.length})</option>
                        {mediaCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => setEditingMediaCat({ title: '', imageName: '' })}
                        className="text-xs text-blue-600 font-bold border border-blue-200 px-3 py-2 rounded-xl hover:bg-blue-50"
                      >
                        + إدارة الفئات
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        setEditingArticle({
                          title: '',
                          description: '',
                          mediaId: mediaCategories?.[0]?.id || 1,
                          imageName: '',
                          videoURl: ''
                        })
                      }
                      className="flex items-center gap-2 bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة خبر/مقال جديد</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedArticles.map((art) => {
                      const cat = mediaCategories.find((c) => c.id === art.mediaId);
                      return (
                        <div
                          key={art.id}
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
                        >
                          <div className="relative h-44 bg-slate-100">
                            <img
                              src={getImageUrl(art.imageName)}
                              alt={art.title}
                              className="w-full h-full object-cover"
                            />
                            {cat && (
                              <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                                {cat.title}
                              </div>
                            )}
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] text-gray-400 block mb-1">
                                {art.created ? new Date(art.created).toLocaleDateString('ar-EG') : 'حديثاً'}
                              </span>
                              <h3 className="text-sm font-black text-gray-900 mb-2 leading-snug">
                                {art.title}
                              </h3>
                              <div
                                className="text-xs text-gray-500 line-clamp-3 mb-4"
                                dangerouslySetInnerHTML={{ __html: art.description || '' }}
                              />
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <button
                                onClick={() => setEditingArticle(art)}
                                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-bold"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>تعديل</span>
                              </button>
                              <button
                                onClick={() => handleDeleteMedia(art.id)}
                                className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-xs font-bold"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Pagination
                    currentPage={mediaPage}
                    totalItems={filteredArticles.length}
                    pageSize={PAGE_SIZES.media}
                    onPageChange={setMediaPage}
                  />
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 11: COMMERCIAL PROJECTS */}
          {/* ========================================================================= */}
          {activeTab === 'commercial' && (
            <div className="space-y-6">
              {editingCommercial ? (
                /* IN-PAGE FORM: COMMERCIAL */
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingCommercial(null)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>العودة لقائمة المشاريع التجارية</span>
                    </button>
                    <h3 className="text-base font-black text-gray-900">
                      {editingCommercial.id ? 'تعديل مشروع تجاري' : 'إضافة مشروع تجاري جديد'}
                    </h3>
                  </div>

                  <form onSubmit={handleSaveCommercial} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">اسم المشروع التجاري</label>
                      <input
                        type="text"
                        required
                        value={editingCommercial.title}
                        onChange={(e) =>
                          setEditingCommercial({ ...editingCommercial, title: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">المنطقة</label>
                      <input
                        type="text"
                        value={editingCommercial.areaName}
                        onChange={(e) =>
                          setEditingCommercial({ ...editingCommercial, areaName: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <ImageUploader
                      label="صورة المشروع التجاري (رفع ملف)"
                      value={editingCommercial.imageName || ''}
                      onChange={(url) => setEditingCommercial({ ...editingCommercial, imageName: url })}
                    />

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">الوصف</label>
                      <textarea
                        rows="3"
                        value={editingCommercial.description}
                        onChange={(e) =>
                          setEditingCommercial({ ...editingCommercial, description: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      ></textarea>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setEditingCommercial(null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-[#d61c23] hover:bg-[#b7151b] text-white text-xs font-bold shadow"
                      >
                        حفظ المشروع التجاري
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* LIST VIEW: COMMERCIAL */
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-gray-900">المشروعات التجارية والإدارية</h2>
                      <p className="text-xs text-gray-500">إدارة المولات والمقرات الإدارية والطبية</p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingCommercial({
                          title: '',
                          areaName: 'القاهرة الجديدة',
                          description: '',
                          imageName: '',
                          unitsCount: 10,
                          type: 'تجاري',
                          priceStart: 0
                        })
                      }
                      className="flex items-center gap-2 bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة مشروع تجاري</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedCommercials.map((c) => (
                      <div
                        key={c.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative h-48 bg-slate-100">
                          <img
                            src={getImageUrl(c.imageName)}
                            alt={c.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                            {c.type || 'تجاري'}
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="text-xs text-[#d61c23] font-bold mb-1">{c.areaName}</div>
                            <h3 className="text-base font-black text-gray-900 mb-2">{c.title}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-4">{c.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <button
                              onClick={() => setEditingCommercial(c)}
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-bold"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>تعديل</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCommercial(c.id)}
                              className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-xs font-bold"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Pagination
                    currentPage={commercialPage}
                    totalItems={commercials.length}
                    pageSize={PAGE_SIZES.commercial}
                    onPageChange={setCommercialPage}
                  />
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 12: SLIDERS */}
          {/* ========================================================================= */}
          {activeTab === 'sliders' && (
            <div className="space-y-6">
              {editingSlider ? (
                /* IN-PAGE FORM: SLIDERS */
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm max-w-xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setEditingSlider(null)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>العودة لقائمة السلايدر</span>
                    </button>
                    <h3 className="text-base font-black text-gray-900">
                      {editingSlider.id ? 'تعديل شريحة السلايدر' : 'إضافة شريحة سلايدر جديدة'}
                    </h3>
                  </div>

                  <form onSubmit={handleSaveSlider} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">نوع الميديا</label>
                      <select
                        value={editingSlider.mediaType || 'image'}
                        onChange={(e) =>
                          setEditingSlider({ ...editingSlider, mediaType: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      >
                        <option value="image">صورة</option>
                        <option value="video">فيديو</option>
                      </select>
                    </div>

                    <ImageUploader
                      label="ملف الميديا للسلايدر (رفع صورة)"
                      value={editingSlider.mediaPath || ''}
                      onChange={(url) => setEditingSlider({ ...editingSlider, mediaPath: url })}
                    />

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">العنوان الرئيسي</label>
                      <input
                        type="text"
                        value={editingSlider.title || ''}
                        onChange={(e) =>
                          setEditingSlider({ ...editingSlider, title: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">الوصف الفرعي</label>
                      <input
                        type="text"
                        value={editingSlider.subtitle || ''}
                        onChange={(e) =>
                          setEditingSlider({ ...editingSlider, subtitle: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setEditingSlider(null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-[#d61c23] hover:bg-[#b7151b] text-white text-xs font-bold shadow"
                      >
                        حفظ الشريحة
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* LIST VIEW: SLIDERS */
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-gray-900">سلايدر الصفحة الرئيسية</h2>
                      <p className="text-xs text-gray-500">إدارة البنرات والصور المتحركة في هيدر الموقع</p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingSlider({
                          mediaType: 'image',
                          mediaPath: '',
                          title: '',
                          subtitle: '',
                          link: ''
                        })
                      }
                      className="flex items-center gap-2 bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة شريحة سلايدر</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paginatedSliders.map((s, idx) => (
                      <div
                        key={s.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative h-56 bg-slate-900">
                          <img
                            src={getImageUrl(s.mediaPath)}
                            alt={s.title || 'سلايدر'}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold">
                            شريحة رقم #{idx + 1}
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-base font-black text-gray-900 mb-1">
                              {s.title || 'بدون عنوان'}
                            </h3>
                            <p className="text-xs text-gray-500 mb-2">{s.subtitle || 'لا يوجد وصف فرعي'}</p>
                            <p className="text-[11px] text-gray-400 font-mono truncate">{s.mediaPath}</p>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                            <button
                              onClick={() => setEditingSlider(s)}
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-bold"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>تعديل</span>
                            </button>
                            <button
                              onClick={() => handleDeleteSlider(s.id)}
                              className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-xs font-bold"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Pagination
                    currentPage={sliderPage}
                    totalItems={sliders.length}
                    pageSize={PAGE_SIZES.sliders}
                    onPageChange={setSliderPage}
                  />
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 13: CONTACTS */}
          {/* ========================================================================= */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="ابحث بالاسم، الهاتف، أو المشروع..."
                      value={contactSearch}
                      onChange={(e) => {
                        setContactSearch(e.target.value);
                        setContactPage(1);
                      }}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  </div>

                  <select
                    value={contactStatusFilter}
                    onChange={(e) => {
                      setContactStatusFilter(e.target.value);
                      setContactPage(1);
                    }}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none"
                  >
                    <option value="ALL">جميع الحالات</option>
                    <option value="جديد">جديد</option>
                    <option value="قيد المتابعة">قيد المتابعة</option>
                    <option value="تم التواصل">تم التواصل</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="p-4 font-bold text-gray-700">العميل</th>
                        <th className="p-4 font-bold text-gray-700">الهاتف</th>
                        <th className="p-4 font-bold text-gray-700">البريد</th>
                        <th className="p-4 font-bold text-gray-700">المشروع المستفسر عنه</th>
                        <th className="p-4 font-bold text-gray-700">نص الرسالة</th>
                        <th className="p-4 font-bold text-gray-700">التاريخ</th>
                        <th className="p-4 font-bold text-gray-700">الحالة</th>
                        <th className="p-4 font-bold text-gray-700">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paginatedContacts.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className="p-4 font-bold text-gray-900">{c.name}</td>
                          <td className="p-4 font-mono" dir="ltr">
                            <a
                              href={`https://wa.me/2${c.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              className="text-emerald-600 font-bold hover:underline"
                            >
                              {c.phone}
                            </a>
                          </td>
                          <td className="p-4 text-gray-500 font-mono">{c.email || '-'}</td>
                          <td className="p-4 text-gray-800 font-bold">{c.project || 'استفسار عام'}</td>
                          <td className="p-4 text-gray-600 max-w-xs truncate" title={c.message}>
                            {c.message || 'لا توجد تفاصيل إضافية'}
                          </td>
                          <td className="p-4 text-gray-400 whitespace-nowrap">
                            {new Date(c.createdAt).toLocaleDateString('ar-EG')}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <select
                              value={c.status || 'جديد'}
                              onChange={(e) => handleUpdateContactStatus(c.id, e.target.value)}
                              className={`px-2.5 py-1 rounded-full text-xs font-bold border focus:outline-none ${
                                c.status === 'جديد'
                                  ? 'bg-red-50 text-red-600 border-red-200'
                                  : c.status === 'تم التواصل'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                  : 'bg-amber-50 text-amber-600 border-amber-200'
                              }`}
                            >
                              <option value="جديد">جديد</option>
                              <option value="قيد المتابعة">قيد المتابعة</option>
                              <option value="تم التواصل">تم التواصل</option>
                            </select>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteContact(c.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Pagination
                currentPage={contactPage}
                totalItems={filteredContacts.length}
                pageSize={PAGE_SIZES.contacts}
                onPageChange={setContactPage}
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 14: COMPANY SETTINGS & SOCIAL LINKS */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm max-w-3xl space-y-6">
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-1">
                  إعدادات الشركة وبيانات الاتصال والسوشيال ميديا
                </h2>
                <p className="text-xs text-gray-500">
                  هذه البيانات تظهر في الهيدر، الفوتر، وصفحة اتصل بنا
                </p>
              </div>

              <form onSubmit={handleSaveCompanySettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">الخط الساخن</label>
                    <input
                      type="text"
                      value={companySettings.hotline}
                      onChange={(e) =>
                        setCompanySettings({ ...companySettings, hotline: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">رقم الواتساب</label>
                    <input
                      type="text"
                      value={companySettings.whatsapp}
                      onChange={(e) =>
                        setCompanySettings({ ...companySettings, whatsapp: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={companySettings.email}
                      onChange={(e) =>
                        setCompanySettings({ ...companySettings, email: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">العنوان الرئيسي</label>
                    <input
                      type="text"
                      value={companySettings.address}
                      onChange={(e) =>
                        setCompanySettings({ ...companySettings, address: e.target.value })
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-xs font-black text-gray-900 mb-3">روابط منصات التواصل:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">فيسبوك</label>
                      <input
                        type="text"
                        value={companySettings.facebook}
                        onChange={(e) =>
                          setCompanySettings({ ...companySettings, facebook: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">انستجرام</label>
                      <input
                        type="text"
                        value={companySettings.instagram}
                        onChange={(e) =>
                          setCompanySettings({ ...companySettings, instagram: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">لينكد إن</label>
                      <input
                        type="text"
                        value={companySettings.linkedin}
                        onChange={(e) =>
                          setCompanySettings({ ...companySettings, linkedin: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">يوتيوب</label>
                      <input
                        type="text"
                        value={companySettings.youtube}
                        onChange={(e) =>
                          setCompanySettings({ ...companySettings, youtube: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#d61c23]"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[#d61c23] hover:bg-[#b7151b] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ التعديلات</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-12 pt-4 border-t border-gray-200/60 text-center text-xs text-gray-400">
          شركة قنديل للاستثمار والتطوير العقاري © {new Date().getFullYear()} — جميع الحقوق محفوظة
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
