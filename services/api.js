const API_BASE = '/api';

const UNIT_IMAGES = new Set([
  '074f7781-aeaf-4c9f-9f12-bf68d1387513.png',
  '1da4a258-e06b-46a7-aa6f-a0b062987397.png',
  '1ea11670-6595-4b49-8fd6-45e82595f765.png',
  '235fcf3e-f064-4c46-8445-f0a3bfda2a5b.png',
  '25fb876b-4284-49d1-8e08-117c73e3d96f.png',
  '27a401c7-0a2d-4f0c-94a7-c75045238cd6.png',
  '2c8b79a3-9371-48c9-87ff-f716cc811e47.png',
  '3274c4d1-0199-434a-a110-2d7d07ca1cc1.png',
  '36921c13-1d8d-4e27-9e35-f0a9462d0e18.png',
  '3759f855-35a8-49c2-9bf7-973a67086a18.png',
  '3893923b-6d90-4d77-bf11-3a7631cb2962.png',
  '3b421639-7141-46e0-850f-aa019e872d70.png',
  '488c3c46-4b64-4032-abff-92eb36c34ee4.png',
  '4dcb37c1-e2f2-4ab4-b62c-b88d90ead9d3.png',
  '509a77f3-122c-49dc-82b2-8f0f7cb0ab6c.png',
  '50b8333c-2f69-40ea-ae34-29f800f1cac6.png',
  '50ee77a8-f59a-4bcd-8dde-c5e40de5b84a.png',
  '56db1f59-3568-4e8e-89ad-a694d9b6a0dc.png',
  '59d629d0-d2a6-4590-b721-d9c68e34d2b6.png',
  '5def8743-c2e0-450d-a278-5c2fd5eaa10a.png',
  '5ef839f1-a792-4733-ac3b-1a84682894ed.png',
  '5f432068-1bcf-46be-a580-a343a97dd706.png',
  '60a53d1e-318b-45f4-8ebf-6b3f4ac390d1.png',
  '63868280-99f6-4890-817c-6ae425054176.png',
  '65c6cf24-244c-4aa6-a29b-189d643611c6.png',
  '67b84964-7fb1-40d7-95a3-5275343e1084.png',
  '68dc347d-f56b-4ce9-b70d-44bc940ba22c.png',
  '696d2aee-6ff4-4dc2-8c3b-fceff2a968fd.png',
  '6d4ccddf-2b19-4095-a3bd-54a4b72502c0.png',
  '6ecd7b52-ee59-414e-8f41-76c0735600f4.png',
  '75892982-b88f-414d-aeb5-784ec2624d1f.png',
  '8a0e631b-6eed-448c-aa56-e4a39ab8c1cc.png',
  '8d7cc3ed-8fac-4c48-a91e-d2d1518a8558.png',
  '8f02cda2-9029-400e-b5f1-cbb0091bb641.png',
  '91032605-78fd-4f3e-96b3-d1e4f3cc5182.png',
  '97b5a02c-d291-42a3-afc8-6e105cd39c8a.png',
  '9f98678b-8815-4a5b-aa91-4eb7c84ebe86.png',
  'a3ac4b65-4293-4c34-baac-86a7ba9986c8.png',
  'a7de5a99-7c8e-44fc-bff1-96d2693025fb.png',
  'ab2b17e3-bf01-4e94-b0bb-fc21eecbb029.png',
  'ba758861-0f9c-4aba-843b-c19dc8e35c2b.png',
  'bae1ce50-3a2c-45b2-a4d4-6f3056c180ae.png',
  'bcc32796-5fc9-4570-b703-2ef897a87384.png',
  'c502634b-cd2a-4d45-9888-86030611f6a1.png',
  'c7dd9d5c-a447-4dc2-b671-a486e16527af.png',
  'd0bf0549-79f0-4003-82cd-28527aa995c1.png',
  'd27dc70f-4b27-4ddf-a06c-ede73b3f7eb1.png',
  'e0cf44dd-9bc5-4209-929a-5dc1e0db38e9.png',
  'e2fa9bbc-bb7b-4788-976f-1998e0e35963.png',
  'e39301bb-37e8-4034-925a-75b1afb1fa9d.png',
  'e79a7a8c-1514-4100-b85d-49f1e9689b62.png',
  'ed7f189a-90c5-4dc5-bb2a-99be0b87794c.png',
  'f61a4575-9197-4bab-ab06-717cb09cf9e0.png',
  'fb5dfd3a-1a02-4339-9925-d3f774c87ace.png',
  'fef26d84-afcd-45a6-b71e-774fad377a87.png',
  'ff1de2c7-9fad-4f5e-b1cb-922bcc38e897.png',
  'ffe8cce5-3a63-4d6f-91cb-154626db275e.png',
]);

const PROJECT_IMAGES = new Set([
  '04190635-ddc7-4320-8352-55c6c0d01f8c.png',
  '1180a040-98e4-407a-9ca0-2cee43e4dc5c.png',
  '26103541-6b4d-4406-9c7e-1f99554fec26.png',
  '2a0162df-0443-42c4-942d-a63ddd53172f.png',
  '2a402f40-74f5-488a-82e4-59d27778dc78.png',
  '2e790c97-8431-4e6a-a3c4-88a10cd1df5a.png',
  '323fba8d-086a-432e-b171-5d43f006f870.png',
  '394e6397-3a0c-458f-8b5c-c6f1aaf33b91.png',
  '489f3823-ae09-45e6-a9e9-c5d9ad935263.png',
  '49d6904b-fbba-4505-820b-c51bf47d83d2.png',
  '5b8897e5-f550-4939-912c-20f29532eed4.png',
  '5daa7eda-f38c-459b-a130-711998e6f9c4.png',
  '5e034e85-f54d-4c3c-9c55-b831fa0abec9.png',
  '62f4a10c-d01d-464d-b2ab-3d4c226f8153.png',
  '68fa77a5-fd0d-484f-88da-2df989082e88.png',
  '6b31532e-ff62-411f-aaf4-8cbb88b5b6c7.png',
  '6d33d000-a5bf-4e50-83c2-827d096aeeeb.png',
  '8083208d-04f5-4ad4-b1fe-be70caecafc6.png',
  '80da9076-eab8-4b23-933b-27a2125b338d.png',
  '918dda1b-adf0-4ef9-957b-64adc69bedd8.png',
  '919aeb86-3307-4a77-a1d5-0b9b8e9a2e0a.png',
  '974ee453-85a7-4d47-9ff3-fb582dec8d3e.png',
  '9921ac91-0ef8-4e80-add7-b0149521419a.png',
  '9a2e6a5f-8bf4-4261-8ef7-4750b1a7883e.png',
  '9bc24b1e-474b-4362-904f-6d474ba44b94.png',
  'a36c9c44-2ccf-4eac-8d68-d81da8448b3b.png',
  'a4f9ec14-c2d9-4282-bf25-b3627da5ad29.png',
  'a97b48f0-51bd-45ed-95ff-c9f06ef59475.png',
  'aba49dcc-fb45-4a38-9159-995228c6e381.png',
  'aca9bf8a-569c-4b9e-8ae9-e3ec9af36a38.png',
  'ae5aa473-9e89-4885-854b-fb00ba27c05b.png',
  'b75c0807-4502-428e-897d-0b839a518f4c.png',
  'b7714108-133e-4cf7-bf58-38dd17947169.png',
  'ba782dbb-ddc2-455b-a9e4-139ea684b9f9.png',
  'bb7ed927-4f56-47c7-aca5-69cb0d282ff8.png',
  'bc665116-73c7-444d-9e95-f5bbdbd54f4a.png',
  'bf521d05-40d3-41ff-8837-4a41197cb6f0.png',
  'c70e89c5-1f82-40a6-bb22-fa89acb83e21.png',
  'c88b10d8-0801-4b33-a9f5-5f663fd6aa7c.png',
  'd245774b-d399-4710-a1aa-18f917802a49.png',
  'de8352a7-cb11-42ee-b34f-e7fdff176ff1.png',
  'e08fa878-af29-4491-a245-61549f91e21f.png',
  'e3fd7ce2-b3d7-4853-8970-c6d84427fe96.png',
  'e9864b34-4338-4595-a76f-6b04740bb740.png',
  'f73857fe-38bd-4af2-86c4-c1ce97ff61c0.png',
  'fcde8932-0380-4a2e-a1fa-15939ca08b34.png',
]);

const SLIDER_IMAGES = new Set([
  '39cecd18-7c18-4f0c-8a2e-f23f0f993896.png',
  'e47551a2-8091-439c-aca7-e32ca4629129.png',
]);

const WHYUS_IMAGES = new Set([
  '116724e6-b4f7-4e6a-9abb-7286e1bd6ca5.png',
  '4d75240c-4ffa-477a-a376-ea3fc6d4d5ad.png',
  '7b9ee6ec-da3f-4548-bf9f-e77f204ba500.png',
  'fb22a711-1636-41c8-9266-d6530d87f084.jpg',
  'fdfa0712-ca64-4938-bd07-21cc8ec03430.png',
]);

export function getImageUrl(imageName, entityType = '') {
  if (!imageName || imageName === 'null' || imageName === 'undefined' || imageName === '') {
    if (entityType === 'unit') {
      return '/uploads/4dcb37c1-e2f2-4ab4-b62c-b88d90ead9d3.png';
    }
    if (entityType === 'slider') {
      return '/uploads/e47551a2-8091-439c-aca7-e32ca4629129.png';
    }
    return '/uploads/9921ac91-0ef8-4e80-add7-b0149521419a.png';
  }

  if (imageName.startsWith('data:image/') || imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }
  if (imageName.startsWith('/')) {
    return imageName;
  }

  const cleanName = imageName.split('/').pop().split('?')[0];

  // All unit, project, slider, whyus and uploaded images are hosted under /uploads/
  return `/uploads/${cleanName}`;
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
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'فشل رفع الصورة');
    }
    return res.json();
  }
};
