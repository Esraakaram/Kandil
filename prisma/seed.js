import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Database Seeding ---');

  let dataPath = path.resolve(process.cwd(), 'data/databaseData.json');
  if (!fs.existsSync(dataPath)) {
    dataPath = path.resolve(process.cwd(), 'src/data/databaseData.json');
  }
  if (!fs.existsSync(dataPath)) {
    dataPath = path.resolve(process.cwd(), 'full_db_dump.json');
  }
  if (!fs.existsSync(dataPath)) {
    throw new Error('databaseData.json file not found at: ' + dataPath);
  }

  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(raw);

  // 1. Clean existing records to avoid duplicates
  console.log('Clearing existing data...');
  await prisma.adminUser.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.commercialProject.deleteMany();
  await prisma.finishCategory.deleteMany();
  await prisma.media.deleteMany();
  await prisma.mediaCategory.deleteMany();
  await prisma.whyUs.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.coverImage.deleteMany();
  await prisma.slider.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.project.deleteMany();
  await prisma.area.deleteMany();
  await prisma.city.deleteMany();

  // 2. Seed Admin Users
  console.log('Seeding Admin Users...');
  await prisma.adminUser.createMany({
    data: [
      { username: 'admin', password: 'admin', role: 'SuperAdmin' },
      { username: 'kandil', password: 'kandil2024', role: 'SuperAdmin' }
    ]
  });

  // 3. Seed Cities & Areas
  console.log('Seeding Cities and Areas...');
  if (data.cities && Array.isArray(data.cities)) {
    for (const item of data.cities) {
      if (!item.city) continue;
      const city = await prisma.city.create({
        data: {
          id: item.city.id,
          name: item.city.name,
          imageName: item.city.imageName || null
        }
      });

      if (item.areas && Array.isArray(item.areas)) {
        for (const area of item.areas) {
          await prisma.area.create({
            data: {
              id: area.id,
              name: area.name,
              imageName: area.imageName || null,
              cityId: city.id
            }
          });
        }
      }
    }
  }

  // 4. Seed Projects
  console.log('Seeding Projects...');
  const projectDetailsMap = data.projectDetails || {};
  const processedProjectIds = new Set();

  for (const [idStr, detail] of Object.entries(projectDetailsMap)) {
    const id = Number(idStr);
    processedProjectIds.add(id);

    await prisma.project.create({
      data: {
        id,
        name: detail.title || `مشروع ${id}`,
        imageName: detail.mainImage || null,
        areaId: detail.areaId || null,
        areaName: detail.areaName || null,
        status: detail.status || null,
        deliveryDate: detail.deliveryDate || null,
        aboutProject: detail.aboutProject || '',
        videoURL: detail.videoURL || null,
        mainImage: detail.mainImage || null,
        locationImage: detail.locationImage || null,
        pdfFile: detail.pdfFile || null,
        isFinish: !!detail.isFinish,
        detailsCoverImage: detail.detailsCoverImage || null,
        locationProjects: detail.locationProjects ? JSON.stringify(detail.locationProjects) : null,
        advantageProjects: detail.advantageProjects ? JSON.stringify(detail.advantageProjects) : null,
        images: detail.images ? JSON.stringify(detail.images) : null
      }
    });
  }

  // In case there are extra projects in projectsWithArea not in projectDetails:
  if (data.projectsWithArea && Array.isArray(data.projectsWithArea)) {
    for (const group of data.projectsWithArea) {
      if (!group.viewProject) continue;
      for (const p of group.viewProject) {
        if (!processedProjectIds.has(p.id)) {
          processedProjectIds.add(p.id);
          await prisma.project.create({
            data: {
              id: p.id,
              name: p.name,
              imageName: p.imageName || null,
              areaId: p.areaId || group.id || null,
              areaName: p.areaName || group.areaName || null,
              status: p.status || null,
              deliveryDate: p.deliveryDate || null
            }
          });
        }
      }
    }
  }

  // 5. Seed Units
  console.log('Seeding Units...');
  const unitDetailsMap = data.unitDetails || {};
  const processedUnitIds = new Set();

  if (data.units && Array.isArray(data.units)) {
    for (const u of data.units) {
      processedUnitIds.add(u.id);
      const detail = unitDetailsMap[String(u.id)] || {};

      // Verify projectId exists in DB
      let validProjectId = u.projectId || detail.projectId || null;
      if (validProjectId && !processedProjectIds.has(validProjectId)) {
        validProjectId = null;
      }

      await prisma.unit.create({
        data: {
          id: u.id,
          title: u.title || detail.title || `وحدة ${u.id}`,
          description: detail.description || u.description || '',
          imageName: u.imageName || detail.imageName || null,
          status: u.status || detail.status || 'Available',
          isShown: u.isShown !== undefined ? u.isShown : true,
          codeUnit: u.codeUnit || detail.codeUnit || '',
          area: Number(u.area || detail.area || 0),
          numberBathroom: Number(u.numberBathroom || detail.numberBathroom || 0),
          numberRoom: Number(u.numberRoom || detail.numberRoom || 0),
          yearOfBuild: Number(u.yearOfBuild || detail.yearOfBuild || 2024),
          price: Number(u.price || detail.price || 0),
          videoUrl: detail.videoUrl || u.videoUrl || null,
          latitude: detail.latitude || u.latitude || null,
          longitude: detail.longitude || u.longitude || null,
          nameLocation: u.nameLocation || detail.nameLocation || '',
          typePrice: u.typePrice || detail.typePrice || 'كاش',
          projectId: validProjectId,
          detailsCoverImage: detail.detailsCoverImage || null,
          advantageUnits: detail.advantageUnits ? JSON.stringify(detail.advantageUnits) : null,
          serviceUnits: detail.serviceUnits ? JSON.stringify(detail.serviceUnits) : null,
          unitImages: detail.unitImages ? JSON.stringify(detail.unitImages) : null
        }
      });
    }
  }

  // Check any extra in unitDetails
  for (const [idStr, detail] of Object.entries(unitDetailsMap)) {
    const id = Number(idStr);
    if (!processedUnitIds.has(id)) {
      processedUnitIds.add(id);
      let validProjectId = detail.projectId || null;
      if (validProjectId && !processedProjectIds.has(validProjectId)) {
        validProjectId = null;
      }

      await prisma.unit.create({
        data: {
          id,
          title: detail.title || `وحدة ${id}`,
          description: detail.description || '',
          imageName: detail.imageName || null,
          status: detail.status || 'Available',
          isShown: detail.isShown !== undefined ? detail.isShown : true,
          codeUnit: detail.codeUnit || '',
          area: Number(detail.area || 0),
          numberBathroom: Number(detail.numberBathroom || 0),
          numberRoom: Number(detail.numberRoom || 0),
          yearOfBuild: Number(detail.yearOfBuild || 2024),
          price: Number(detail.price || 0),
          videoUrl: detail.videoUrl || null,
          latitude: detail.latitude || null,
          longitude: detail.longitude || null,
          nameLocation: detail.nameLocation || '',
          typePrice: detail.typePrice || 'كاش',
          projectId: validProjectId,
          detailsCoverImage: detail.detailsCoverImage || null,
          advantageUnits: detail.advantageUnits ? JSON.stringify(detail.advantageUnits) : null,
          serviceUnits: detail.serviceUnits ? JSON.stringify(detail.serviceUnits) : null,
          unitImages: detail.unitImages ? JSON.stringify(detail.unitImages) : null
        }
      });
    }
  }

  // 6. Seed Sliders
  console.log('Seeding Sliders...');
  if (data.sliders && Array.isArray(data.sliders)) {
    for (const s of data.sliders) {
      await prisma.slider.create({
        data: {
          id: s.id,
          mediaType: s.mediaType || 'image',
          mediaPath: s.mediaPath || '',
          title: s.title || null,
          subtitle: s.subtitle || null,
          link: s.link || null
        }
      });
    }
  }

  // 7. Seed CoverImages
  console.log('Seeding Cover Images...');
  if (data.coverImages && Array.isArray(data.coverImages)) {
    for (const c of data.coverImages) {
      await prisma.coverImage.create({
        data: {
          id: c.id,
          imageName: c.imageName,
          imageType: c.imageType || null,
          pageName: c.pageName
        }
      });
    }
  }

  // 8. Seed Social Links
  console.log('Seeding Social Links...');
  if (data.socialLinks && Array.isArray(data.socialLinks)) {
    for (const link of data.socialLinks) {
      await prisma.socialLink.create({
        data: {
          id: link.id,
          url: link.url,
          type: link.type,
          name: link.name || null
        }
      });
    }
  }

  // 9. Seed Why Us
  console.log('Seeding Why Us...');
  if (data.whyUs && Array.isArray(data.whyUs)) {
    for (const w of data.whyUs) {
      await prisma.whyUs.create({
        data: {
          id: w.id,
          title: w.title,
          description: w.description,
          quote: w.quote || null,
          fullDescription: w.fullDescription || null,
          imageUrl: w.imageUrl || null
        }
      });
    }
  }

  // 10. Seed Media Categories & Media
  console.log('Seeding Media Categories and Media...');
  if (data.mediaCategories && Array.isArray(data.mediaCategories)) {
    for (const mc of data.mediaCategories) {
      await prisma.mediaCategory.create({
        data: {
          id: mc.id,
          title: mc.title,
          imageName: mc.imageName || null
        }
      });
    }
  }

  if (data.media && Array.isArray(data.media)) {
    for (const m of data.media) {
      await prisma.media.create({
        data: {
          id: m.id,
          title: m.title,
          description: m.description,
          created: m.created || new Date().toISOString(),
          imageName: m.imageName || null,
          videoURl: m.videoURl || null,
          mediaId: m.mediaId
        }
      });
    }
  }

  // 11. Seed Finish Categories
  console.log('Seeding Finish Categories...');
  if (data.finishCategories && Array.isArray(data.finishCategories)) {
    for (const fc of data.finishCategories) {
      await prisma.finishCategory.create({
        data: {
          id: fc.id,
          title: fc.title,
          imageName: fc.imageName || null,
          description: fc.description || null,
          items: fc.items ? JSON.stringify(fc.items) : null
        }
      });
    }
  }

  // 12. Seed Commercial Projects
  console.log('Seeding Commercial Projects...');
  if (data.commercialProjects && Array.isArray(data.commercialProjects)) {
    for (const cp of data.commercialProjects) {
      await prisma.commercialProject.create({
        data: {
          id: cp.id,
          title: cp.title,
          areaName: cp.areaName || '',
          description: cp.description || '',
          imageName: cp.imageName || null,
          unitsCount: Number(cp.unitsCount || 0),
          type: cp.type || 'تجاري',
          priceStart: Number(cp.priceStart || 0)
        }
      });
    }
  }

  // 13. Seed Contacts
  console.log('Seeding Contacts...');
  const contactsList = (data.contacts && data.contacts.length > 0) ? data.contacts : [
    {
      id: 1,
      name: 'أحمد محمود سليمان',
      phone: '01012345678',
      email: 'ahmed.soliman@example.com',
      project: 'مشروع G 198 | النرجس الجديدة',
      message: 'أرغب في الاستفسار عن تفاصيل أنظمة السداد للوحدة 185م² وتاريخ الاستلام النهائي.',
      status: 'جديد',
      notes: 'طلب مكالمة هاتفية بعد الساعة 5 مساءً'
    },
    {
      id: 2,
      name: 'سارة خالد المنشاوي',
      phone: '01123456789',
      email: 'sara.khalid@example.com',
      project: 'مشروع B 245 | النورث هاوس',
      message: 'مهتمة بالدوبليكس بحديقة خاصة ومعرفة نسبة الخصم في حال الدفع الكاش.',
      status: 'تم التواصل',
      notes: 'تم إرسال البروشور وفيديو الموقع على واتساب'
    },
    {
      id: 3,
      name: 'م. تامر عبد العزيز',
      phone: '01223456780',
      email: 'eng.tamer@gmail.com',
      project: 'مشروع D 14 | بيت الوطن الحي الرابع',
      message: 'استفسار عن الشقق المتبقية بالدور الثاني ناصية صريحة.',
      status: 'جديد',
      notes: ''
    }
  ];

  for (const c of contactsList) {
    await prisma.contact.create({
      data: {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email || null,
        project: c.project || 'استفسار عام',
        message: c.message || '',
        createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
        status: c.status || 'جديد',
        notes: c.notes || null
      }
    });
  }

  console.log('✅ Database seeded successfully with all existing dashboard & site data!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
