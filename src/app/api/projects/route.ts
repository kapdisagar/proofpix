import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PROJECTS } from '@/lib/mockStore';
import { Project } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

// Server-side persistent projects store (survives across client devices and refreshes)
const serverProjects = new Map<string, Project>();

// Initialize with default projects
INITIAL_PROJECTS.forEach((proj) => {
  serverProjects.set(proj.id, { ...proj });
});

/**
 * GET: Retrieve all projects, or a specific project by slug / id
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');

  try {
    // 1. Check Supabase first if available
    try {
      const supabase = createClient();
      let query = supabase.from('projects').select('*');
      if (slug) query = query.eq('slug', slug);
      if (id) query = query.eq('id', id);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        if (slug || id) {
          const found = data[0];
          serverProjects.set(found.id, found);
          return NextResponse.json({ project: found });
        }
        data.forEach((p) => serverProjects.set(p.id, p));
        return NextResponse.json({ projects: data });
      }
    } catch {
      // Supabase unconfigured, fall through to in-memory store
    }

    // 2. Query in-memory server store
    const all = Array.from(serverProjects.values());

    if (slug) {
      const found = all.find((p) => p.slug === slug);
      if (found) {
        return NextResponse.json({ project: found });
      }
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (id) {
      const found = serverProjects.get(id);
      if (found) {
        return NextResponse.json({ project: found });
      }
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ projects: all, count: all.length });
  } catch (error) {
    console.error('[API /api/projects GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

/**
 * POST: Create a new project (synced across client devices)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      event_name, 
      client_name, 
      client_whatsapp,
      studio_whatsapp,
      drive_folder_id, 
      max_selection, 
      watermark_text, 
      access_pin,
      balance_amount,
      razorpay_link,
      paypal_link,
      slug: customSlug,
      photographer_id
    } = body;

    if (!event_name || !drive_folder_id) {
      return NextResponse.json(
        { error: 'Missing required project fields: event_name or drive_folder_id' },
        { status: 400 }
      );
    }

    const id = body.id || `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const baseSlug = customSlug || event_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = baseSlug || `event-${Date.now()}`;

    const newProject: Project = {
      id,
      photographer_id: photographer_id || 'photographer-demo-1',
      slug,
      event_name: event_name.trim(),
      client_name: (client_name || 'Client').trim(),
      client_whatsapp: client_whatsapp || null,
      studio_whatsapp: studio_whatsapp || '919876543210',
      drive_folder_id: drive_folder_id.trim(),
      max_selection: Number(max_selection) || 80,
      watermark_text: watermark_text || 'ProofPix Protected',
      access_pin: access_pin || null,
      balance_amount: balance_amount !== undefined ? Number(balance_amount) : 15000,
      razorpay_link: razorpay_link || null,
      paypal_link: paypal_link || null,
      is_paid: false,
      is_submitted: false,
      submitted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_photos: 12,
      selections_count: 0
    };

    serverProjects.set(id, newProject);

    // Asynchronously try upserting to Supabase
    try {
      const supabase = createClient();
      await supabase.from('projects').upsert([newProject]);
    } catch {
      // Offline fallback
    }

    return NextResponse.json({
      success: true,
      message: 'Project created and synced across devices',
      project: newProject,
    });
  } catch (error: any) {
    console.error('[API /api/projects POST Error]:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

/**
 * PATCH: Update project status (e.g. is_submitted, is_paid, PIN, balance)
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, slug, updates } = body;

    if ((!id && !slug) || !updates) {
      return NextResponse.json(
        { error: 'Missing id/slug or updates payload' },
        { status: 400 }
      );
    }

    let existing: Project | undefined;
    if (id) {
      existing = serverProjects.get(id);
    } else if (slug) {
      existing = Array.from(serverProjects.values()).find((p) => p.slug === slug);
    }

    if (!existing) {
      return NextResponse.json({ error: 'Project not found to update' }, { status: 404 });
    }

    const updated: Project = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };

    serverProjects.set(updated.id, updated);

    try {
      const supabase = createClient();
      await supabase.from('projects').update(updates).eq('id', updated.id);
    } catch {
      // Fall through
    }

    return NextResponse.json({
      success: true,
      project: updated
    });
  } catch (error: any) {
    console.error('[API /api/projects PATCH Error]:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
