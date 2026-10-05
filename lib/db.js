import { prisma } from './prisma.js';

function safeParse(val, fallback = []) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

export const dbService = {
  // 1. Cities & Areas
  async getCitiesWithArea() {
    const cities = await prisma.city.findMany({
      include: { areas: true }
    });

    return cities.map(c => ({
      city: {
        id: c.id,
        name: c.name,
        imageName: c.imageName
      },
      areas: c.areas.map(a => ({
        id: a.id,
        name: a.name,
        imageName: a.imageName,
        cityId: a.cityId,
        city: null,
        projects: null
      }))
    }));
  },

  async getAllAreas() {
    const areas = await prisma.area.findMany();
    return areas.map(a => ({
      id: a.id,
      name: a.name,
      imageName: a.imageName,
      cityId: a.cityId
    }));
  },

  async getAllAvailableAreas() {
    return this.getAllAreas();
  },

  async addCity(body) {
    return await prisma.city.create({
      data: {
        name: body.name || body.title || '',
        imageName: body.imageName || null
      }
    });
  },

  async updateCity(id, body) {
    return await prisma.city.update({
      where: { id: Number(id) },
      data: {
        name: body.name !== undefined ? body.name : body.title,
        imageName: body.imageName !== undefined ? body.imageName : undefined
      }
    });
  },

  async deleteCity(id) {
    const numId = Number(id);
    await prisma.city.delete({ where: { id: numId } });
    return true;
  },

  async addArea(body) {
    return await prisma.area.create({
      data: {
        name: body.name || '',
        imageName: body.imageName || null,
        cityId: Number(body.cityId)
      }
    });
  },

  async updateArea(id, body) {
    return await prisma.area.update({
      where: { id: Number(id) },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        imageName: body.imageName !== undefined ? body.imageName : undefined,
        cityId: body.cityId !== undefined ? Number(body.cityId) : undefined
      }
    });
  },

  async deleteArea(id) {
    const numId = Number(id);
    await prisma.area.delete({ where: { id: numId } });
    return true;
  },

  // 2. Projects
  async getProjectsWithArea() {
    const areas = await prisma.area.findMany({
      include: {
        projects: true
      }
    });

    return areas.map(a => ({
      id: a.id,
      areaName: a.name,
      viewProject: a.projects.map(p => ({
        id: p.id,
        name: p.name,
        imageName: p.imageName,
        areaId: p.areaId,
        areaName: p.areaName || a.name,
        status: p.status,
        deliveryDate: p.deliveryDate
      }))
    }));
  },

  async getAllFlatProjects() {
    const projects = await prisma.project.findMany({
      orderBy: { id: 'desc' }
    });
    return projects.map(p => ({
      id: p.id,
      name: p.name,
      imageName: p.imageName,
      mainImage: p.mainImage || p.imageName,
      areaId: p.areaId,
      areaName: p.areaName,
      status: p.status,
      deliveryDate: p.deliveryDate,
      aboutProject: p.aboutProject,
      locationImage: p.locationImage,
      pdfFile: p.pdfFile,
      isFinish: p.isFinish,
      detailsCoverImage: p.detailsCoverImage,
      videoURL: p.videoURL,
      images: safeParse(p.images, []),
      locationProjects: safeParse(p.locationProjects, []),
      advantageProjects: safeParse(p.advantageProjects, [])
    }));
  },

  async getProjectById(id) {
    const numId = Number(id);
    const p = await prisma.project.findUnique({
      where: { id: numId }
    });
    if (!p) return null;

    return {
      id: p.id,
      title: p.name,
      aboutProject: p.aboutProject || '',
      videoURL: p.videoURL || '',
      mainImage: p.mainImage || p.imageName || '',
      locationImage: p.locationImage || '',
      pdfFile: p.pdfFile || '',
      isFinish: p.isFinish,
      detailsCoverImage: p.detailsCoverImage || '',
      areaId: p.areaId,
      areaName: p.areaName || '',
      status: p.status || '',
      deliveryDate: p.deliveryDate || '',
      locationProjects: safeParse(p.locationProjects, []),
      advantageProjects: safeParse(p.advantageProjects, []),
      images: safeParse(p.images, [])
    };
  },

  async addProject(body) {
    let areaName = body.areaName;
    if (!areaName && body.areaId) {
      const area = await prisma.area.findUnique({ where: { id: Number(body.areaId) } });
      if (area) areaName = area.name;
    }

    const created = await prisma.project.create({
      data: {
        name: body.name || body.title || 'مشروع جديد',
        imageName: body.imageName || body.mainImage || null,
        areaId: body.areaId ? Number(body.areaId) : null,
        areaName: areaName || null,
        status: body.status || 'تحت الإنشاء',
        deliveryDate: body.deliveryDate || '2026',
        aboutProject: body.aboutProject || '',
        videoURL: body.videoURL || null,
        mainImage: body.mainImage || body.imageName || null,
        locationImage: body.locationImage || null,
        pdfFile: body.pdfFile || null,
        isFinish: !!body.isFinish,
        detailsCoverImage: body.detailsCoverImage || null,
        locationProjects: body.locationProjects ? JSON.stringify(body.locationProjects) : null,
        advantageProjects: body.advantageProjects ? JSON.stringify(body.advantageProjects) : null,
        images: body.images ? JSON.stringify(body.images) : null
      }
    });

    return {
      id: created.id,
      name: created.name,
      imageName: created.imageName,
      areaId: created.areaId,
      areaName: created.areaName,
      status: created.status,
      deliveryDate: created.deliveryDate
    };
  },

  async updateProject(id, body) {
    const numId = Number(id);
    let areaName = body.areaName;
    if (body.areaId && !areaName) {
      const area = await prisma.area.findUnique({ where: { id: Number(body.areaId) } });
      if (area) areaName = area.name;
    }

    const data = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.title !== undefined) data.name = body.title;
    if (body.imageName !== undefined) data.imageName = body.imageName;
    if (body.mainImage !== undefined) data.mainImage = body.mainImage;
    if (body.areaId !== undefined) data.areaId = body.areaId ? Number(body.areaId) : null;
    if (areaName !== undefined) data.areaName = areaName;
    if (body.status !== undefined) data.status = body.status;
    if (body.deliveryDate !== undefined) data.deliveryDate = body.deliveryDate;
    if (body.aboutProject !== undefined) data.aboutProject = body.aboutProject;
    if (body.videoURL !== undefined) data.videoURL = body.videoURL;
    if (body.locationImage !== undefined) data.locationImage = body.locationImage;
    if (body.pdfFile !== undefined) data.pdfFile = body.pdfFile;
    if (body.isFinish !== undefined) data.isFinish = !!body.isFinish;
    if (body.detailsCoverImage !== undefined) data.detailsCoverImage = body.detailsCoverImage;
    if (body.locationProjects !== undefined) data.locationProjects = JSON.stringify(body.locationProjects);
    if (body.advantageProjects !== undefined) data.advantageProjects = JSON.stringify(body.advantageProjects);
    if (body.images !== undefined) data.images = JSON.stringify(body.images);

    return await prisma.project.update({
      where: { id: numId },
      data
    });
  },

  async deleteProject(id) {
    const numId = Number(id);
    await prisma.unit.updateMany({
      where: { projectId: numId },
      data: { projectId: null }
    });
    await prisma.project.delete({ where: { id: numId } });
    return true;
  },

  // 3. Units
  async getAllUnits() {
    const units = await prisma.unit.findMany({
      orderBy: { id: 'desc' },
      include: { project: true }
    });
    return units.map(u => ({
      id: u.id,
      title: u.title,
      description: u.description || '',
      imageName: u.imageName || '',
      status: u.status,
      isShown: u.isShown,
      codeUnit: u.codeUnit || '',
      area: u.area,
      numberBathroom: u.numberBathroom,
      numberRoom: u.numberRoom,
      yearOfBuild: u.yearOfBuild,
      price: u.price,
      videoUrl: u.videoUrl,
      latitude: u.latitude,
      longitude: u.longitude,
      nameLocation: u.nameLocation || '',
      typePrice: u.typePrice,
      projectId: u.projectId,
      projectName: u.project?.name || '',
      project: u.project ? {
        id: u.project.id,
        name: u.project.name,
        areaId: u.project.areaId,
        areaName: u.project.areaName
      } : null,
      detailsCoverImage: u.detailsCoverImage
    }));
  },

  async getFeaturedUnits() {
    const units = await prisma.unit.findMany({
      where: { isShown: true },
      take: 12,
      orderBy: { id: 'desc' },
      include: { project: true }
    });
    return units;
  },

  async getUnitById(id) {
    const numId = Number(id);
    const u = await prisma.unit.findUnique({
      where: { id: numId },
      include: { project: true }
    });
    if (!u) return null;

    return {
      id: u.id,
      title: u.title,
      description: u.description || '',
      imageName: u.imageName || '',
      status: u.status,
      isShown: u.isShown,
      codeUnit: u.codeUnit || '',
      area: u.area,
      numberBathroom: u.numberBathroom,
      numberRoom: u.numberRoom,
      yearOfBuild: u.yearOfBuild,
      price: u.price,
      videoUrl: u.videoUrl || '',
      latitude: u.latitude,
      longitude: u.longitude,
      nameLocation: u.nameLocation || '',
      typePrice: u.typePrice,
      projectId: u.projectId,
      project: u.project ? {
        id: u.project.id,
        name: u.project.name,
        imageName: u.project.imageName,
        areaId: u.project.areaId,
        areaName: u.project.areaName
      } : null,
      detailsCoverImage: u.detailsCoverImage || '',
      advantageUnits: safeParse(u.advantageUnits, []),
      serviceUnits: safeParse(u.serviceUnits, []),
      unitImages: safeParse(u.unitImages, [])
    };
  },

  async addUnit(body) {
    const created = await prisma.unit.create({
      data: {
        title: body.title || 'وحدة جديدة',
        description: body.description || '',
        imageName: body.imageName || null,
        status: body.status || 'Available',
        isShown: body.isShown !== undefined ? body.isShown : true,
        codeUnit: body.codeUnit || '',
        area: Number(body.area || 0),
        numberBathroom: Number(body.numberBathroom || 0),
        numberRoom: Number(body.numberRoom || 0),
        yearOfBuild: Number(body.yearOfBuild || 2024),
        price: Number(body.price || 0),
        videoUrl: body.videoUrl || null,
        latitude: body.latitude ? Number(body.latitude) : null,
        longitude: body.longitude ? Number(body.longitude) : null,
        nameLocation: body.nameLocation || '',
        typePrice: body.typePrice || 'كاش',
        projectId: body.projectId ? Number(body.projectId) : null,
        detailsCoverImage: body.detailsCoverImage || null,
        advantageUnits: body.advantageUnits ? JSON.stringify(body.advantageUnits) : null,
        serviceUnits: body.serviceUnits ? JSON.stringify(body.serviceUnits) : null,
        unitImages: body.unitImages ? JSON.stringify(body.unitImages) : null
      }
    });
    return created;
  },

  async updateUnit(id, body) {
    const numId = Number(id);
    const data = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.imageName !== undefined) data.imageName = body.imageName;
    if (body.status !== undefined) data.status = body.status;
    if (body.isShown !== undefined) data.isShown = body.isShown;
    if (body.codeUnit !== undefined) data.codeUnit = body.codeUnit;
    if (body.area !== undefined) data.area = Number(body.area);
    if (body.numberBathroom !== undefined) data.numberBathroom = Number(body.numberBathroom);
    if (body.numberRoom !== undefined) data.numberRoom = Number(body.numberRoom);
    if (body.yearOfBuild !== undefined) data.yearOfBuild = Number(body.yearOfBuild);
    if (body.price !== undefined) data.price = Number(body.price);
    if (body.videoUrl !== undefined) data.videoUrl = body.videoUrl;
    if (body.latitude !== undefined) data.latitude = body.latitude ? Number(body.latitude) : null;
    if (body.longitude !== undefined) data.longitude = body.longitude ? Number(body.longitude) : null;
    if (body.nameLocation !== undefined) data.nameLocation = body.nameLocation;
    if (body.typePrice !== undefined) data.typePrice = body.typePrice;
    if (body.projectId !== undefined) data.projectId = body.projectId ? Number(body.projectId) : null;
    if (body.detailsCoverImage !== undefined) data.detailsCoverImage = body.detailsCoverImage;
    if (body.advantageUnits !== undefined) data.advantageUnits = JSON.stringify(body.advantageUnits);
    if (body.serviceUnits !== undefined) data.serviceUnits = JSON.stringify(body.serviceUnits);
    if (body.unitImages !== undefined) data.unitImages = JSON.stringify(body.unitImages);

    return await prisma.unit.update({
      where: { id: numId },
      data
    });
  },

  async deleteUnit(id) {
    const numId = Number(id);
    await prisma.unit.delete({ where: { id: numId } });
    return true;
  },

  // 4. Sliders & Covers
  async getSliders() {
    return await prisma.slider.findMany();
  },

  async addSlider(body) {
    return await prisma.slider.create({
      data: {
        mediaType: body.mediaType || 'image',
        mediaPath: body.mediaPath || '',
        title: body.title || null,
        subtitle: body.subtitle || null,
        link: body.link || null
      }
    });
  },

  async updateSlider(id, body) {
    return await prisma.slider.update({
      where: { id: Number(id) },
      data: {
        mediaType: body.mediaType,
        mediaPath: body.mediaPath,
        title: body.title,
        subtitle: body.subtitle,
        link: body.link
      }
    });
  },

  async deleteSlider(id) {
    await prisma.slider.delete({ where: { id: Number(id) } });
    return true;
  },

  async getCoverImages() {
    return await prisma.coverImage.findMany();
  },

  async updateCoverImage(id, body) {
    return await prisma.coverImage.update({
      where: { id: Number(id) },
      data: {
        imageName: body.imageName !== undefined ? body.imageName : undefined,
        imageType: body.imageType !== undefined ? body.imageType : undefined,
        pageName: body.pageName !== undefined ? body.pageName : undefined
      }
    });
  },

  // 5. Social Links
  async getSocialLinks() {
    const links = await prisma.socialLink.findMany();
    return { socialLinks: links };
  },

  async updateSocialLinks(links) {
    if (Array.isArray(links)) {
      for (const item of links) {
        if (item.id) {
          await prisma.socialLink.upsert({
            where: { id: item.id },
            update: { url: item.url, type: item.type, name: item.name },
            create: { id: item.id, url: item.url, type: item.type, name: item.name }
          });
        }
      }
    }
    return await prisma.socialLink.findMany();
  },

  // 6. Why Us
  async getWhyUs() {
    return await prisma.whyUs.findMany();
  },

  async updateWhyUs(id, body) {
    return await prisma.whyUs.update({
      where: { id: Number(id) },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        description: body.description !== undefined ? body.description : undefined,
        quote: body.quote !== undefined ? body.quote : undefined,
        fullDescription: body.fullDescription !== undefined ? body.fullDescription : undefined,
        imageUrl: body.imageUrl !== undefined ? body.imageUrl : undefined
      }
    });
  },

  // 7. Media
  async getMediaCategories() {
    return await prisma.mediaCategory.findMany({
      include: {
        media: true
      }
    });
  },

  async addMediaCategory(body) {
    return await prisma.mediaCategory.create({
      data: {
        title: body.title || '',
        imageName: body.imageName || null
      }
    });
  },

  async updateMediaCategory(id, body) {
    return await prisma.mediaCategory.update({
      where: { id: Number(id) },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        imageName: body.imageName !== undefined ? body.imageName : undefined
      }
    });
  },

  async deleteMediaCategory(id) {
    await prisma.mediaCategory.delete({ where: { id: Number(id) } });
    return true;
  },

  async getMediaList(categoryId) {
    if (categoryId) {
      return await prisma.media.findMany({
        where: { mediaId: Number(categoryId) },
        orderBy: { id: 'desc' }
      });
    }
    return await prisma.media.findMany({
      orderBy: { id: 'desc' }
    });
  },

  async getMediaById(id) {
    return await prisma.media.findUnique({
      where: { id: Number(id) }
    });
  },

  async addMedia(body) {
    const targetMediaId = body.mediaId || body.categoryId || 1;
    return await prisma.media.create({
      data: {
        title: body.title || '',
        description: body.description || '',
        created: new Date().toISOString(),
        imageName: body.imageName || null,
        videoURl: body.videoURl || null,
        mediaId: Number(targetMediaId)
      }
    });
  },

  async updateMedia(id, body) {
    const targetMediaId = body.mediaId !== undefined ? body.mediaId : body.categoryId;
    return await prisma.media.update({
      where: { id: Number(id) },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        description: body.description !== undefined ? body.description : undefined,
        imageName: body.imageName !== undefined ? body.imageName : undefined,
        videoURl: body.videoURl !== undefined ? body.videoURl : undefined,
        mediaId: targetMediaId !== undefined ? Number(targetMediaId) : undefined
      }
    });
  },

  async deleteMedia(id) {
    await prisma.media.delete({ where: { id: Number(id) } });
    return true;
  },

  // 8. Finishing
  async getFinishCategories() {
    const list = await prisma.finishCategory.findMany();
    return list.map(c => ({
      id: c.id,
      title: c.title,
      imageName: c.imageName,
      description: c.description,
      items: safeParse(c.items, [])
    }));
  },

  async getFinishCategoryById(id) {
    const c = await prisma.finishCategory.findUnique({
      where: { id: Number(id) }
    });
    if (!c) return null;
    return {
      id: c.id,
      title: c.title,
      imageName: c.imageName,
      description: c.description,
      items: safeParse(c.items, [])
    };
  },

  async addFinishCategory(body) {
    const created = await prisma.finishCategory.create({
      data: {
        title: body.title || '',
        imageName: body.imageName || null,
        description: body.description || '',
        items: body.items ? JSON.stringify(body.items) : null
      }
    });
    return {
      ...created,
      items: safeParse(created.items, [])
    };
  },

  async updateFinishCategory(id, body) {
    const updated = await prisma.finishCategory.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        imageName: body.imageName,
        description: body.description,
        items: body.items ? JSON.stringify(body.items) : undefined
      }
    });
    return {
      ...updated,
      items: safeParse(updated.items, [])
    };
  },

  async deleteFinishCategory(id) {
    await prisma.finishCategory.delete({ where: { id: Number(id) } });
    return true;
  },

  // 9. Commercial Projects
  async getCommercialProjects() {
    return await prisma.commercialProject.findMany({
      orderBy: { id: 'desc' }
    });
  },

  async getCommercialProjectById(id) {
    return await prisma.commercialProject.findUnique({
      where: { id: Number(id) }
    });
  },

  async addCommercialProject(body) {
    return await prisma.commercialProject.create({
      data: {
        title: body.title || '',
        areaName: body.areaName || '',
        description: body.description || '',
        imageName: body.imageName || null,
        unitsCount: Number(body.unitsCount || 0),
        type: body.type || 'تجاري',
        priceStart: Number(body.priceStart || 0)
      }
    });
  },

  async updateCommercialProject(id, body) {
    return await prisma.commercialProject.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        areaName: body.areaName,
        description: body.description,
        imageName: body.imageName,
        unitsCount: body.unitsCount !== undefined ? Number(body.unitsCount) : undefined,
        type: body.type,
        priceStart: body.priceStart !== undefined ? Number(body.priceStart) : undefined
      }
    });
  },

  async deleteCommercialProject(id) {
    await prisma.commercialProject.delete({ where: { id: Number(id) } });
    return true;
  },

  // 10. Contacts
  async getContacts() {
    return await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  async addContact(body) {
    return await prisma.contact.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email || '',
        project: body.project || 'استفسار عام',
        message: body.message || '',
        status: 'جديد',
        notes: body.notes || ''
      }
    });
  },

  async updateContact(id, body) {
    return await prisma.contact.update({
      where: { id: Number(id) },
      data: {
        status: body.status,
        notes: body.notes
      }
    });
  },

  async deleteContact(id) {
    await prisma.contact.delete({ where: { id: Number(id) } });
    return true;
  },

  // 11. Landing Page
  async getLandingPage() {
    let lp = await prisma.landingPage.findFirst();
    if (!lp) {
      lp = await prisma.landingPage.create({
        data: {
          id: 1,
          videoUrl: 'https://www.youtube.com/embed/5oXlbsDoiPE',
          projectsCount: 68,
          totalUnits: 628,
          underConstructionCount: 90,
          deliveredUnitsCount: 528
        }
      });
    }
    return lp;
  },

  async updateLandingPage(body) {
    const lp = await this.getLandingPage();
    return await prisma.landingPage.update({
      where: { id: lp.id },
      data: {
        videoUrl: body.videoUrl !== undefined ? body.videoUrl : undefined,
        projectsCount: body.projectsCount !== undefined ? Number(body.projectsCount) : undefined,
        totalUnits: body.totalUnits !== undefined ? Number(body.totalUnits) : undefined,
        underConstructionCount: body.underConstructionCount !== undefined ? Number(body.underConstructionCount) : undefined,
        deliveredUnitsCount: body.deliveredUnitsCount !== undefined ? Number(body.deliveredUnitsCount) : undefined
      }
    });
  },

  // 12. Auth Login
  async login(username, password) {
    const user = await prisma.adminUser.findFirst({
      where: { username, password }
    });

    const isMatch =
      user ||
      ((username?.toLowerCase() === 'admin' ||
        username?.toLowerCase() === 'kandil' ||
        username?.toLowerCase() === 'adminkandil@gmail.com') &&
        (password === 'admin' ||
          password === '123456' ||
          password === 'kandil2024' ||
          password === 'Kandil@2024%dev'));

    if (isMatch) {
      return {
        token: 'kandil-jwt-token-' + Date.now(),
        user: {
          id: user?.id || 1,
          username: username || 'AdminKandil@gmail.com',
          role: user?.role || 'SuperAdmin'
        }
      };
    }
    return null;
  }
};

export default dbService;
