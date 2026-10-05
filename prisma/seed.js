import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting TiDB / MySQL Database Seeding ---');

  const seedPath = path.resolve(process.cwd(), 'prisma/seed_data.json');
  if (!fs.existsSync(seedPath)) {
    throw new Error('seed_data.json file not found at: ' + seedPath);
  }

  const raw = fs.readFileSync(seedPath, 'utf-8');
  const data = JSON.parse(raw);

  console.log('Clearing existing data if any...');
  try {
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
    await prisma.adminUser.deleteMany();
    await prisma.landingPage.deleteMany();
  } catch (e) {
    console.log('Note: Tables might be empty, continuing...');
  }

  // 1. Admin Users
  console.log('Seeding Admin Users...');
  await prisma.adminUser.createMany({
    data: [
      { username: 'admin', password: 'admin', role: 'SuperAdmin' },
      { username: 'AdminKandil@gmail.com', password: 'Kandil@2024%dev', role: 'SuperAdmin' },
      { username: 'kandil', password: 'kandil2024', role: 'SuperAdmin' }
    ]
  });

  // 2. Cities
  console.log(`Seeding ${data.cities.length} Cities...`);
  for (const c of data.cities) {
    await prisma.city.create({
      data: {
        id: c.id,
        name: c.name,
        imageName: c.imageName
      }
    });
  }

  // 3. Areas
  console.log(`Seeding ${data.areas.length} Areas...`);
  for (const a of data.areas) {
    await prisma.area.create({
      data: {
        id: a.id,
        name: a.name,
        imageName: a.imageName,
        cityId: a.cityId
      }
    });
  }

  // 4. Projects
  console.log(`Seeding ${data.projects.length} Projects...`);
  for (const p of data.projects) {
    await prisma.project.create({
      data: {
        id: p.id,
        name: p.name,
        imageName: p.imageName,
        areaId: p.areaId,
        areaName: p.areaName,
        status: p.status,
        deliveryDate: p.deliveryDate,
        aboutProject: p.aboutProject,
        videoURL: p.videoURL,
        mainImage: p.mainImage,
        locationImage: p.locationImage,
        pdfFile: p.pdfFile,
        isFinish: !!p.isFinish,
        detailsCoverImage: p.detailsCoverImage,
        locationProjects: p.locationProjects,
        advantageProjects: p.advantageProjects,
        images: p.images
      }
    });
  }

  // 5. Units
  console.log(`Seeding ${data.units.length} Units...`);
  for (const u of data.units) {
    await prisma.unit.create({
      data: {
        id: u.id,
        title: u.title,
        description: u.description,
        imageName: u.imageName,
        status: u.status,
        isShown: u.isShown !== undefined ? u.isShown : true,
        codeUnit: u.codeUnit,
        area: u.area,
        numberBathroom: u.numberBathroom,
        numberRoom: u.numberRoom,
        yearOfBuild: u.yearOfBuild,
        price: u.price,
        videoUrl: u.videoUrl,
        latitude: u.latitude,
        longitude: u.longitude,
        nameLocation: u.nameLocation,
        typePrice: u.typePrice,
        projectId: u.projectId,
        detailsCoverImage: u.detailsCoverImage,
        advantageUnits: u.advantageUnits,
        serviceUnits: u.serviceUnits,
        unitImages: u.unitImages
      }
    });
  }

  // 6. Sliders
  console.log(`Seeding ${data.sliders.length} Sliders...`);
  for (const s of data.sliders) {
    await prisma.slider.create({
      data: {
        id: s.id,
        mediaType: s.mediaType,
        mediaPath: s.mediaPath,
        title: s.title,
        subtitle: s.subtitle,
        link: s.link
      }
    });
  }

  // 7. Cover Images
  if (data.coverImages) {
    console.log(`Seeding ${data.coverImages.length} Cover Images...`);
    for (const ci of data.coverImages) {
      await prisma.coverImage.create({
        data: {
          id: ci.id,
          imageName: ci.imageName,
          imageType: ci.imageType,
          pageName: ci.pageName
        }
      });
    }
  }

  // 8. Social Links
  if (data.socialLinks) {
    console.log(`Seeding ${data.socialLinks.length} Social Links...`);
    for (const sl of data.socialLinks) {
      await prisma.socialLink.create({
        data: {
          id: sl.id,
          url: sl.url,
          type: sl.type,
          name: sl.name
        }
      });
    }
  }

  // 9. Why Us
  if (data.whyUs) {
    console.log(`Seeding ${data.whyUs.length} Why Us items...`);
    for (const w of data.whyUs) {
      await prisma.whyUs.create({
        data: {
          id: w.id,
          title: w.title,
          description: w.description,
          quote: w.quote,
          fullDescription: w.fullDescription,
          imageUrl: w.imageUrl
        }
      });
    }
  }

  // 10. Media Categories & Media
  if (data.mediaCategories) {
    console.log(`Seeding ${data.mediaCategories.length} Media Categories...`);
    for (const mc of data.mediaCategories) {
      await prisma.mediaCategory.create({
        data: {
          id: mc.id,
          title: mc.title,
          imageName: mc.imageName
        }
      });
    }
  }

  if (data.media) {
    console.log(`Seeding ${data.media.length} Media articles...`);
    for (const m of data.media) {
      await prisma.media.create({
        data: {
          id: m.id,
          title: m.title,
          description: m.description,
          created: m.created,
          imageName: m.imageName,
          videoURl: m.videoURl,
          mediaId: m.mediaId
        }
      });
    }
  }

  // 11. Finish Categories
  if (data.finishCategories) {
    console.log(`Seeding ${data.finishCategories.length} Finish Categories...`);
    for (const fc of data.finishCategories) {
      await prisma.finishCategory.create({
        data: {
          id: fc.id,
          title: fc.title,
          imageName: fc.imageName,
          description: fc.description,
          items: fc.items
        }
      });
    }
  }

  // 12. Commercial Projects
  if (data.commercialProjects) {
    console.log(`Seeding ${data.commercialProjects.length} Commercial Projects...`);
    for (const cp of data.commercialProjects) {
      await prisma.commercialProject.create({
        data: {
          id: cp.id,
          title: cp.title,
          areaName: cp.areaName,
          description: cp.description,
          imageName: cp.imageName,
          unitsCount: cp.unitsCount,
          type: cp.type,
          priceStart: cp.priceStart
        }
      });
    }
  }

  // 13. Landing Page
  console.log('Seeding Landing Page settings...');
  await prisma.landingPage.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      videoUrl: 'https://www.youtube.com/embed/5oXlbsDoiPE',
      projectsCount: 68,
      totalUnits: 628,
      underConstructionCount: 90,
      deliveredUnitsCount: 528
    }
  });

  console.log('--- TiDB Seeding Finished Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
