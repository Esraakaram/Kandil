import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const pathParts = resolvedParams.route || [];
    const fullPath = pathParts.join('/').toLowerCase();
    const { searchParams } = new URL(req.url);

    // 1. Cities & Areas
    if (fullPath === 'cities/getcitywitharea') {
      const data = await dbService.getCitiesWithArea();
      return NextResponse.json(data);
    }
    if (fullPath === 'areas/allareas' || fullPath === 'areas/allavailableareas') {
      const data = await dbService.getAllAreas();
      return NextResponse.json(data);
    }

    // 2. Projects
    if (fullPath === 'projects/getprojectswitharea') {
      const data = await dbService.getProjectsWithArea();
      return NextResponse.json(data);
    }
    if (fullPath === 'admin/projects') {
      const data = await dbService.getAllFlatProjects();
      return NextResponse.json(data);
    }
    if (pathParts.length === 2 && pathParts[0].toLowerCase() === 'projects') {
      const project = await dbService.getProjectById(pathParts[1]);
      if (!project) return NextResponse.json({ message: 'Project not found' }, { status: 404 });
      return NextResponse.json(project);
    }

    // 3. Units
    if (fullPath === 'units/getallunits') {
      const data = await dbService.getAllUnits();
      return NextResponse.json(data);
    }
    if (fullPath === 'units/getunits') {
      const data = await dbService.getFeaturedUnits();
      return NextResponse.json(data);
    }
    if (pathParts.length === 3 && pathParts[0].toLowerCase() === 'units' && pathParts[1].toLowerCase() === 'getdetailunits') {
      const unit = await dbService.getUnitById(pathParts[2]);
      if (!unit) return NextResponse.json({ message: 'Unit not found' }, { status: 404 });
      return NextResponse.json(unit);
    }
    if (pathParts.length === 2 && pathParts[0].toLowerCase() === 'units') {
      const unit = await dbService.getUnitById(pathParts[1]);
      if (!unit) return NextResponse.json({ message: 'Unit not found' }, { status: 404 });
      return NextResponse.json(unit);
    }

    // 4. Sliders & Covers
    if (fullPath === 'sliders') {
      const data = await dbService.getSliders();
      return NextResponse.json(data);
    }
    if (fullPath === 'coverimage') {
      const data = await dbService.getCoverImages();
      return NextResponse.json(data);
    }

    // 5. Social Links
    if (fullPath === 'sociallinks') {
      const data = await dbService.getSocialLinks();
      return NextResponse.json(data);
    }

    // 6. Why Us
    if (fullPath === 'whyus') {
      const data = await dbService.getWhyUs();
      return NextResponse.json(data);
    }

    // 7. Media
    if (fullPath === 'mediacategory') {
      const data = await dbService.getMediaCategories();
      return NextResponse.json(data);
    }
    if (fullPath === 'media') {
      const categoryId = searchParams.get('categoryId');
      const data = await dbService.getMediaList(categoryId);
      return NextResponse.json(data);
    }
    if (pathParts.length === 2 && pathParts[0].toLowerCase() === 'media') {
      const item = await dbService.getMediaById(pathParts[1]);
      if (!item) return NextResponse.json({ message: 'Media not found' }, { status: 404 });
      return NextResponse.json(item);
    }

    // 8. Finishing
    if (fullPath === 'finishcategory') {
      const data = await dbService.getFinishCategories();
      return NextResponse.json(data);
    }
    if (pathParts.length === 2 && pathParts[0].toLowerCase() === 'finishcategory') {
      const item = await dbService.getFinishCategoryById(pathParts[1]);
      if (!item) return NextResponse.json({ message: 'Category not found' }, { status: 404 });
      return NextResponse.json(item);
    }

    // 9. Commercial Projects
    if (fullPath === 'comprojects') {
      const data = await dbService.getCommercialProjects();
      return NextResponse.json(data);
    }
    if (pathParts.length === 2 && pathParts[0].toLowerCase() === 'comprojects') {
      const item = await dbService.getCommercialProjectById(pathParts[1]);
      if (!item) return NextResponse.json({ message: 'Commercial project not found' }, { status: 404 });
      return NextResponse.json(item);
    }

    // 10. Contact
    if (fullPath === 'contact') {
      const data = await dbService.getContacts();
      return NextResponse.json(data);
    }

    // 11. Landing Page
    if (fullPath === 'landingpage') {
      const data = await dbService.getLandingPage();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Endpoint not found', path: fullPath }, { status: 404 });
  } catch (error) {
    console.error('API GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const resolvedParams = await params;
    const pathParts = resolvedParams.route || [];
    const fullPath = pathParts.join('/').toLowerCase();
    const body = await req.json().catch(() => ({}));

    // Admin CRUD
    if (fullPath === 'admin/projects') {
      const created = await dbService.addProject(body);
      return NextResponse.json(created, { status: 201 });
    }
    if (fullPath === 'admin/units') {
      const created = await dbService.addUnit(body);
      return NextResponse.json(created, { status: 201 });
    }
    if (fullPath === 'admin/sliders') {
      const created = await dbService.addSlider(body);
      return NextResponse.json(created, { status: 201 });
    }
    if (fullPath === 'admin/media') {
      const created = await dbService.addMedia(body);
      return NextResponse.json(created, { status: 201 });
    }
    if (fullPath === 'admin/finishcategories') {
      const created = await dbService.addFinishCategory(body);
      return NextResponse.json(created, { status: 201 });
    }
    if (fullPath === 'admin/comprojects') {
      const created = await dbService.addCommercialProject(body);
      return NextResponse.json(created, { status: 201 });
    }
    if (fullPath === 'admin/cities') {
      const created = await dbService.addCity(body);
      return NextResponse.json(created, { status: 201 });
    }
    if (fullPath === 'admin/areas') {
      const created = await dbService.addArea(body);
      return NextResponse.json(created, { status: 201 });
    }
    if (fullPath === 'admin/mediacategories') {
      const created = await dbService.addMediaCategory(body);
      return NextResponse.json(created, { status: 201 });
    }
    if (fullPath === 'admin/landingpage' || fullPath === 'landingpage') {
      const updated = await dbService.updateLandingPage(body);
      return NextResponse.json(updated);
    }

    // Contact
    if (fullPath === 'contact') {
      if (!body.name || !body.phone) {
        return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
      }
      const created = await dbService.addContact(body);
      return NextResponse.json({ success: true, message: 'تم إرسال رسالتك بنجاح', data: created }, { status: 201 });
    }

    // Auth Login
    if (fullPath === 'usersauth/login') {
      const auth = await dbService.login(body.username || body.userName, body.password);
      if (!auth) {
        return NextResponse.json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, { status: 401 });
      }
      return NextResponse.json(auth);
    }

    return NextResponse.json({ error: 'Endpoint not found', path: fullPath }, { status: 404 });
  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const resolvedParams = await params;
    const pathParts = resolvedParams.route || [];
    const body = await req.json().catch(() => ({}));

    if (pathParts.length >= 2 && pathParts[0].toLowerCase() === 'admin') {
      const resource = pathParts[1].toLowerCase();
      const id = pathParts[2];

      if (resource === 'sociallinks') {
        const links = await dbService.updateSocialLinks(body);
        return NextResponse.json({ success: true, socialLinks: links });
      }
      if (resource === 'landingpage') {
        const updated = await dbService.updateLandingPage(body);
        return NextResponse.json(updated);
      }
      if (resource === 'projects' && id) {
        const updated = await dbService.updateProject(id, body);
        return NextResponse.json(updated);
      }
      if (resource === 'units' && id) {
        const updated = await dbService.updateUnit(id, body);
        return NextResponse.json(updated);
      }
      if (resource === 'sliders' && id) {
        const updated = await dbService.updateSlider(id, body);
        return NextResponse.json(updated);
      }
      if (resource === 'media' && id) {
        const updated = await dbService.updateMedia(id, body);
        return NextResponse.json(updated);
      }
      if (resource === 'finishcategories' && id) {
        const updated = await dbService.updateFinishCategory(id, body);
        return NextResponse.json(updated);
      }
      if (resource === 'comprojects' && id) {
        const updated = await dbService.updateCommercialProject(id, body);
        return NextResponse.json(updated);
      }
      if (resource === 'cities' && id) {
        const updated = await dbService.updateCity(id, body);
        return NextResponse.json(updated);
      }
      if (resource === 'areas' && id) {
        const updated = await dbService.updateArea(id, body);
        return NextResponse.json(updated);
      }
      if (resource === 'coverimages' && id) {
        const updated = await dbService.updateCoverImage(id, body);
        return NextResponse.json(updated);
      }
      if (resource === 'whyus' && id) {
        const updated = await dbService.updateWhyUs(id, body);
        return NextResponse.json(updated);
      }
      if (resource === 'mediacategories' && id) {
        const updated = await dbService.updateMediaCategory(id, body);
        return NextResponse.json(updated);
      }
    }

    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
  } catch (error) {
    console.error('API PUT Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const resolvedParams = await params;
    const pathParts = resolvedParams.route || [];
    const body = await req.json().catch(() => ({}));

    if (pathParts.length === 2 && pathParts[0].toLowerCase() === 'contact') {
      const updated = await dbService.updateContact(pathParts[1], body);
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
  } catch (error) {
    console.error('API PATCH Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params;
    const pathParts = resolvedParams.route || [];

    if (pathParts.length === 2 && pathParts[0].toLowerCase() === 'contact') {
      const success = await dbService.deleteContact(pathParts[1]);
      return NextResponse.json({ success });
    }

    if (pathParts.length === 3 && pathParts[0].toLowerCase() === 'admin') {
      const resource = pathParts[1].toLowerCase();
      const id = pathParts[2];

      if (resource === 'projects') {
        const success = await dbService.deleteProject(id);
        return NextResponse.json({ success });
      }
      if (resource === 'units') {
        const success = await dbService.deleteUnit(id);
        return NextResponse.json({ success });
      }
      if (resource === 'sliders') {
        const success = await dbService.deleteSlider(id);
        return NextResponse.json({ success });
      }
      if (resource === 'media') {
        const success = await dbService.deleteMedia(id);
        return NextResponse.json({ success });
      }
      if (resource === 'finishcategories') {
        const success = await dbService.deleteFinishCategory(id);
        return NextResponse.json({ success });
      }
      if (resource === 'comprojects') {
        const success = await dbService.deleteCommercialProject(id);
        return NextResponse.json({ success });
      }
      if (resource === 'cities') {
        const success = await dbService.deleteCity(id);
        return NextResponse.json({ success });
      }
      if (resource === 'areas') {
        const success = await dbService.deleteArea(id);
        return NextResponse.json({ success });
      }
      if (resource === 'mediacategories') {
        const success = await dbService.deleteMediaCategory(id);
        return NextResponse.json({ success });
      }
    }

    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
  } catch (error) {
    console.error('API DELETE Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
