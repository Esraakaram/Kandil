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
      name: a.name,
      imageName: a.imageName,
      cityId: a.cityId,
      viewProject: a.projects.map(p => ({
        id: p.id,
        name: p.name,
        title: p.name,
        imageName: p.imageName || p.mainImage,
        mainImage: p.mainImage || p.imageName,
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

  async getPortfolioProjects() {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { isFinish: true },
          { status: { in: ['تم البيع', 'منجز', 'مكتمل', 'تم التسليم', 'Sold'] } }
        ]
      },
      include: {
        units: true
      },
      orderBy: { id: 'desc' }
    });

    return projects.map(p => ({
      id: p.id,
      name: p.name,
      title: p.name,
      imageName: p.imageName,
      mainImage: p.mainImage || p.imageName,
      areaId: p.areaId,
      areaName: p.areaName,
      status: p.status || 'تم البيع والتسليم',
      deliveryDate: p.deliveryDate,
      aboutProject: p.aboutProject,
      locationImage: p.locationImage,
      pdfFile: p.pdfFile,
      isFinish: p.isFinish,
      detailsCoverImage: p.detailsCoverImage,
      videoURL: p.videoURL,
      images: safeParse(p.images, []),
      advantageProjects: safeParse(p.advantageProjects, []),
      units: p.units.map(u => ({
        id: u.id,
        title: u.title,
        area: u.area,
        numberRoom: u.numberRoom,
        numberBathroom: u.numberBathroom,
        price: u.price,
        typePrice: u.typePrice,
        imageName: u.imageName,
        status: u.status || 'Sold',
        yearOfBuild: u.yearOfBuild
      }))
    }));
  },

  async getProjectById(id) {
    const numId = Number(id);
    const p = await prisma.project.findUnique({
      where: { id: numId }
    });
    if (!p) return null;

    let parsedImages = safeParse(p.images, []);
    let pdfFile = p.pdfFile || '';
    if (parsedImages && typeof parsedImages === 'object' && !Array.isArray(parsedImages)) {
      if (parsedImages.pdfFile) pdfFile = parsedImages.pdfFile;
      parsedImages = Array.isArray(parsedImages.images) ? parsedImages.images : [];
    }

    return {
      id: p.id,
      title: p.name,
      aboutProject: p.aboutProject || '',
      videoURL: p.videoURL || '',
      mainImage: p.mainImage || p.imageName || '',
      locationImage: p.locationImage || '',
      pdfFile,
      isFinish: p.isFinish,
      detailsCoverImage: p.detailsCoverImage || '',
      areaId: p.areaId,
      areaName: p.areaName || '',
      status: p.status || '',
      deliveryDate: p.deliveryDate || '',
      locationProjects: safeParse(p.locationProjects, []),
      advantageProjects: safeParse(p.advantageProjects, []),
      images: parsedImages
    };
  },

  async addProject(body) {
    let areaName = body.areaName;
    if (!areaName && body.areaId) {
      const area = await prisma.area.findUnique({ where: { id: Number(body.areaId) } });
      if (area) areaName = area.name;
    }

    let rawImages = body.images ? safeParse(body.images, []) : [];
    if (!Array.isArray(rawImages)) rawImages = rawImages?.images || [];
    let pdfFileToStore = body.pdfFile || null;
    let imagesPayload = rawImages;

    // If PDF is base64 / large, store it in images (LONGTEXT: 4GB) to prevent overflow in pdfFile (TEXT: 64KB)
    if (body.pdfFile && body.pdfFile.length > 50000) {
      imagesPayload = { images: rawImages, pdfFile: body.pdfFile };
      pdfFileToStore = 'pdf:attached';
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
        pdfFile: pdfFileToStore,
        isFinish: !!body.isFinish,
        detailsCoverImage: body.detailsCoverImage || null,
        locationProjects: body.locationProjects ? JSON.stringify(body.locationProjects) : null,
        advantageProjects: body.advantageProjects ? JSON.stringify(body.advantageProjects) : null,
        images: JSON.stringify(imagesPayload)
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
    if (body.imageName !== undefined) {
      data.imageName = body.imageName;
      if (body.mainImage === undefined) data.mainImage = body.imageName;
    }
    if (body.mainImage !== undefined) {
      data.mainImage = body.mainImage;
      if (body.imageName === undefined) data.imageName = body.mainImage;
    }
    if (body.areaId !== undefined) data.areaId = body.areaId ? Number(body.areaId) : null;
    if (areaName !== undefined) data.areaName = areaName;
    if (body.status !== undefined) data.status = body.status;
    if (body.deliveryDate !== undefined) data.deliveryDate = body.deliveryDate;
    if (body.aboutProject !== undefined) data.aboutProject = body.aboutProject;
    if (body.videoURL !== undefined) data.videoURL = body.videoURL;
    if (body.locationImage !== undefined) data.locationImage = body.locationImage;
    if (body.isFinish !== undefined) data.isFinish = !!body.isFinish;
    if (body.detailsCoverImage !== undefined) data.detailsCoverImage = body.detailsCoverImage;
    if (body.locationProjects !== undefined) data.locationProjects = JSON.stringify(body.locationProjects);
    if (body.advantageProjects !== undefined) data.advantageProjects = JSON.stringify(body.advantageProjects);

    // Safely store large pdfFile in images (LONGTEXT)
    if (body.images !== undefined || body.pdfFile !== undefined) {
      let currentImages = [];
      let currentPdf = body.pdfFile || '';

      if (body.images !== undefined) {
        const parsed = safeParse(body.images, []);
        if (Array.isArray(parsed)) {
          currentImages = parsed;
        } else if (parsed && typeof parsed === 'object') {
          currentImages = Array.isArray(parsed.images) ? parsed.images : [];
          if (!currentPdf && parsed.pdfFile) currentPdf = parsed.pdfFile;
        }
      } else {
        const existingProj = await prisma.project.findUnique({
          where: { id: numId },
          select: { images: true, pdfFile: true }
        });
        if (existingProj?.images) {
          const parsed = safeParse(existingProj.images, []);
          if (Array.isArray(parsed)) {
            currentImages = parsed;
          } else if (parsed && typeof parsed === 'object') {
            currentImages = Array.isArray(parsed.images) ? parsed.images : [];
          }
        }
        if (!currentPdf && existingProj?.pdfFile && existingProj.pdfFile !== 'pdf:attached') {
          currentPdf = existingProj.pdfFile;
        }
      }

      if (currentPdf && currentPdf.length > 50000) {
        data.images = JSON.stringify({ images: currentImages, pdfFile: currentPdf });
        data.pdfFile = 'pdf:attached';
      } else {
        data.images = JSON.stringify(currentImages);
        if (body.pdfFile !== undefined) data.pdfFile = body.pdfFile || null;
      }
    }

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
  async getUnitsCount() {
    return await prisma.unit.count();
  },

  async getAllUnits() {
    const units = await prisma.unit.findMany({
      orderBy: { id: 'desc' },
      include: { project: true }
    });
    return units.map(u => {
      let pdfFile = '';
      if (u.unitImages) {
        const parsedUI = safeParse(u.unitImages, null);
        if (parsedUI && typeof parsedUI === 'object' && parsedUI.pdfFile) {
          pdfFile = parsedUI.pdfFile;
        }
      }
      if (!pdfFile && u.serviceUnits) {
        const parsed = safeParse(u.serviceUnits, null);
        if (parsed && typeof parsed === 'object' && parsed.pdfFile) {
          pdfFile = parsed.pdfFile;
        }
      }
      if (!pdfFile && u.project?.pdfFile) {
        pdfFile = u.project.pdfFile;
      }

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
          imageName: u.project.imageName,
          pdfFile: u.project.pdfFile,
          areaId: u.project.areaId,
          areaName: u.project.areaName
        } : null,
        detailsCoverImage: u.detailsCoverImage,
        pdfFile
      };
    });
  },

  async getPaginatedUnits(query = {}) {
    const pageNum = Math.max(1, Number(query.page) || 1);
    const take = Math.max(1, Number(query.limit) || 9);
    const skip = (pageNum - 1) * take;

    const where = {};
    if (query.status && query.status !== 'all') {
      if (query.status === 'Sold') where.status = 'Sold';
      if (query.status === 'Available') where.status = { not: 'Sold' };
    }
    if (query.rooms && query.rooms !== 'all') {
      where.numberRoom = Number(query.rooms);
    }
    if (query.bathrooms && query.bathrooms !== 'all') {
      where.numberBathroom = Number(query.bathrooms);
    }
    if (query.maxPrice && Number(query.maxPrice) > 0 && Number(query.maxPrice) < 15000000) {
      where.price = { lte: Number(query.maxPrice) };
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { nameLocation: { contains: query.search } },
        { codeUnit: { contains: query.search } }
      ];
    }
    if (query.area) {
      where.nameLocation = { contains: query.area };
    }

    let orderBy = { id: 'desc' };
    if (query.sort === 'price-asc') orderBy = { price: 'asc' };
    if (query.sort === 'price-desc') orderBy = { price: 'desc' };
    if (query.sort === 'area-asc') orderBy = { area: 'asc' };
    if (query.sort === 'area-desc') orderBy = { area: 'desc' };

    const [totalCount, units] = await Promise.all([
      prisma.unit.count({ where }),
      prisma.unit.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { project: true }
      })
    ]);

    const formattedUnits = units.map(u => {
      let pdfFile = '';
      if (u.unitImages) {
        const parsedUI = safeParse(u.unitImages, null);
        if (parsedUI && typeof parsedUI === 'object' && parsedUI.pdfFile) {
          pdfFile = parsedUI.pdfFile;
        }
      }
      if (!pdfFile && u.serviceUnits) {
        const parsed = safeParse(u.serviceUnits, null);
        if (parsed && typeof parsed === 'object' && parsed.pdfFile) {
          pdfFile = parsed.pdfFile;
        }
      }
      if (!pdfFile && u.project?.pdfFile) {
        pdfFile = u.project.pdfFile;
      }

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
          imageName: u.project.imageName,
          pdfFile: u.project.pdfFile,
          areaId: u.project.areaId,
          areaName: u.project.areaName
        } : null,
        detailsCoverImage: u.detailsCoverImage,
        pdfFile
      };
    });

    return {
      units: formattedUnits,
      totalCount,
      page: pageNum,
      limit: take,
      totalPages: Math.ceil(totalCount / take)
    };
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

    let parsedServices = safeParse(u.serviceUnits, []);
    if (!Array.isArray(parsedServices)) parsedServices = parsedServices?.items || [];
    
    let pdfFile = '';
    let parsedUnitImages = safeParse(u.unitImages, []);
    if (parsedUnitImages && typeof parsedUnitImages === 'object' && !Array.isArray(parsedUnitImages)) {
      if (parsedUnitImages.pdfFile) pdfFile = parsedUnitImages.pdfFile;
      parsedUnitImages = Array.isArray(parsedUnitImages.images) ? parsedUnitImages.images : [];
    }

    if (!pdfFile && u.serviceUnits) {
      const srvObj = safeParse(u.serviceUnits, null);
      if (srvObj && typeof srvObj === 'object' && srvObj.pdfFile) {
        pdfFile = srvObj.pdfFile;
      }
    }

    if (!pdfFile && u.project?.pdfFile) {
      pdfFile = u.project.pdfFile;
    }

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
        pdfFile: u.project.pdfFile,
        areaId: u.project.areaId,
        areaName: u.project.areaName
      } : null,
      detailsCoverImage: u.detailsCoverImage || '',
      advantageUnits: safeParse(u.advantageUnits, []),
      serviceUnits: parsedServices,
      unitImages: parsedUnitImages,
      pdfFile
    };
  },

  async addUnit(body) {
    let serviceUnitsData = body.serviceUnits ? safeParse(body.serviceUnits, []) : [];
    if (!Array.isArray(serviceUnitsData)) serviceUnitsData = serviceUnitsData?.items || [];

    // Safely store pdfFile in unitImages (which is LONGTEXT: 4GB) to prevent column overflow in serviceUnits (TEXT: 64KB)
    let rawUnitImages = body.unitImages ? safeParse(body.unitImages, []) : [];
    if (!Array.isArray(rawUnitImages)) rawUnitImages = rawUnitImages?.images || [];
    const unitImagesPayload = {
      images: rawUnitImages,
      pdfFile: body.pdfFile || ''
    };

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
        serviceUnits: JSON.stringify(serviceUnitsData),
        unitImages: JSON.stringify(unitImagesPayload)
      },
      include: { project: true }
    });
    return {
      ...created,
      pdfFile: body.pdfFile || '',
      projectName: created.project?.name || ''
    };
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
    
    if (body.serviceUnits !== undefined) {
      let rawServices = safeParse(body.serviceUnits, []);
      if (!Array.isArray(rawServices)) rawServices = rawServices?.items || [];
      data.serviceUnits = JSON.stringify(rawServices);
    }

    // Safely store pdfFile in unitImages (LONGTEXT: 4GB)
    if (body.unitImages !== undefined || body.pdfFile !== undefined) {
      let currentImages = [];
      let currentPdf = body.pdfFile || '';

      if (body.unitImages !== undefined) {
        const parsed = safeParse(body.unitImages, []);
        if (Array.isArray(parsed)) {
          currentImages = parsed;
        } else if (parsed && typeof parsed === 'object') {
          currentImages = Array.isArray(parsed.images) ? parsed.images : [];
          if (!currentPdf && parsed.pdfFile) currentPdf = parsed.pdfFile;
        }
      } else {
        // Fetch existing unitImages to preserve them
        const existingUnit = await prisma.unit.findUnique({
          where: { id: numId },
          select: { unitImages: true }
        });
        if (existingUnit?.unitImages) {
          const parsed = safeParse(existingUnit.unitImages, []);
          if (Array.isArray(parsed)) {
            currentImages = parsed;
          } else if (parsed && typeof parsed === 'object') {
            currentImages = Array.isArray(parsed.images) ? parsed.images : [];
          }
        }
      }

      data.unitImages = JSON.stringify({ images: currentImages, pdfFile: currentPdf });
    }

    const updated = await prisma.unit.update({
      where: { id: numId },
      data,
      include: { project: true }
    });
    return {
      ...updated,
      pdfFile: body.pdfFile || '',
      projectName: updated.project?.name || ''
    };
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
        if (item.type !== undefined) {
          const typeNum = Number(item.type);
          const urlVal = item.url !== undefined ? String(item.url) : '';
          const nameVal = item.name ? String(item.name) : '';

          const matching = await prisma.socialLink.findMany({ where: { type: typeNum } });
          if (matching.length > 0) {
            await prisma.socialLink.update({
              where: { id: matching[0].id },
              data: {
                url: urlVal,
                name: nameVal || matching[0].name || ''
              }
            });
            if (matching.length > 1) {
              const dupIds = matching.slice(1).map((m) => m.id);
              await prisma.socialLink.deleteMany({
                where: { id: { in: dupIds } }
              });
            }
          } else {
            await prisma.socialLink.create({
              data: {
                url: urlVal,
                type: typeNum,
                name: nameVal
              }
            });
          }
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
    const cleanUsername = username?.trim().toLowerCase();
    const cleanPassword = password?.trim();

    // Exclusively allow adminkandil@gmail.com and Kandil@2024%dev
    if (cleanUsername !== 'adminkandil@gmail.com' || cleanPassword !== 'Kandil@2024%dev') {
      return null;
    }

    const user = await prisma.adminUser.findFirst({
      where: {
        username: 'adminkandil@gmail.com',
        password: 'Kandil@2024%dev'
      }
    });

    return {
      token: 'kandil-jwt-token-' + Date.now(),
      user: {
        id: user?.id || 1,
        username: 'adminkandil@gmail.com',
        role: user?.role || 'SuperAdmin'
      }
    };
  }
};

export default dbService;
