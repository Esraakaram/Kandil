const API_BASE = '/api';

export function getImageUrl(imageName) {
  if (!imageName || imageName === 'null' || imageName === 'undefined' || imageName === '') {
    return '/assets/Images/sliders/e47551a2-8091-439c-aca7-e32ca4629129.png';
  }
  if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }
  if (imageName.startsWith('/')) {
    return imageName;
  }
  if (
    imageName === 'e47551a2-8091-439c-aca7-e32ca4629129.png' ||
    imageName === '39cecd18-7c18-4f0c-8a2e-f23f0f993896.png'
  ) {
    return `/assets/Images/sliders/${imageName}`;
  }
  if (
    imageName === '116724e6-b4f7-4e6a-9abb-7286e1bd6ca5.png' ||
    imageName === '4d75240c-4ffa-477a-a376-ea3fc6d4d5ad.png' ||
    imageName === '7b9ee6ec-da3f-4548-bf9f-e77f204ba500.png' ||
    imageName === 'fb22a711-1636-41c8-9266-d6530d87f084.jpg' ||
    imageName === 'fdfa0712-ca64-4938-bd07-21cc8ec03430.png'
  ) {
    return `/assets/Images/whyus/${imageName}`;
  }
  // Try live API upload host
  return `https://api.kandil-realestate.com/Uploads/${imageName}`;
}

export const api = {
  async getCitiesWithArea() {
    const res = await fetch(`${API_BASE}/Cities/GetCityWithArea`);
    return res.json();
  },

  async getProjectsWithArea() {
    const res = await fetch(`${API_BASE}/Projects/GetProjectsWithArea`);
    return res.json();
  },

  async getProjectById(id) {
    const res = await fetch(`${API_BASE}/Projects/${id}`);
    if (!res.ok) throw new Error('Project not found');
    return res.json();
  },

  async getPortfolioProjects() {
    const res = await fetch(`${API_BASE}/projects/portfolio`);
    if (!res.ok) return [];
    return res.json();
  },

  async getAllUnits() {
    const res = await fetch(`${API_BASE}/Units/GetAllUnits`);
    return res.json();
  },

  async getFeaturedUnits() {
    const res = await fetch(`${API_BASE}/Units/GetUnits`);
    return res.json();
  },

  async getUnitById(id) {
    const res = await fetch(`${API_BASE}/Units/GetDetailUnits/${id}`);
    if (!res.ok) {
      // fallback to regular unit
      const fallback = await fetch(`${API_BASE}/Units/${id}`);
      if (!fallback.ok) throw new Error('Unit not found');
      return fallback.json();
    }
    return res.json();
  },

  async getSliders() {
    const res = await fetch(`${API_BASE}/Sliders`);
    return res.json();
  },

  async getCoverImages() {
    const res = await fetch(`${API_BASE}/CoverImage`);
    return res.json();
  },

  async getSocialLinks() {
    const res = await fetch(`${API_BASE}/sociallinks`);
    return res.json();
  },

  async getWhyUs() {
    const res = await fetch(`${API_BASE}/WhyUs`);
    return res.json();
  },

  async getMediaCategories() {
    const res = await fetch(`${API_BASE}/MediaCategory`);
    return res.json();
  },

  async getMedia(categoryId) {
    const url = categoryId ? `${API_BASE}/Media?categoryId=${categoryId}` : `${API_BASE}/Media`;
    const res = await fetch(url);
    return res.json();
  },

  async getMediaById(id) {
    const res = await fetch(`${API_BASE}/Media/${id}`);
    if (!res.ok) throw new Error('Article not found');
    return res.json();
  },

  async getFinishCategories() {
    const res = await fetch(`${API_BASE}/FinishCategory`);
    return res.json();
  },

  async getFinishCategoryById(id) {
    const res = await fetch(`${API_BASE}/FinishCategory/${id}`);
    if (!res.ok) throw new Error('Category not found');
    return res.json();
  },

  async getCommercialProjects() {
    const res = await fetch(`${API_BASE}/comprojects`);
    return res.json();
  },

  async getCommercialProjectById(id) {
    const res = await fetch(`${API_BASE}/comprojects/${id}`);
    if (!res.ok) throw new Error('Commercial project not found');
    return res.json();
  },

  async createContact(data) {
    const res = await fetch(`${API_BASE}/Contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit contact');
    }
    return res.json();
  },

  async getContacts() {
    const res = await fetch(`${API_BASE}/Contact`);
    return res.json();
  },

  async deleteContact(id) {
    const res = await fetch(`${API_BASE}/Contact/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async login(username, password) {
    const res = await fetch(`${API_BASE}/UsersAuth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  async getLandingPage() {
    const res = await fetch(`${API_BASE}/LandingPage`);
    if (!res.ok) return null;
    return res.json();
  },

  async updateLandingPage(data) {
    const res = await fetch(`${API_BASE}/admin/landingpage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('فشل رفع الصورة');
    return res.json();
  }
};
