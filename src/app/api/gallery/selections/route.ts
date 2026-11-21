import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_SELECTIONS } from '@/lib/mockStore';
import { Selection } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

// Server-side session-backed selections store (persists across client refreshes and devices)
const sessionSelections = new Map<string, Selection[]>();

// Initialize with sample demo selections
Object.entries(INITIAL_SELECTIONS).forEach(([projId, sels]) => {
  sessionSelections.set(projId, [...sels]);
});

/**
 * GET: Retrieve selections for a given project ID
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
  }

  try {
    // 1. Try Supabase first if available
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('selections')
        .select('*')
        .eq('project_id', projectId);

      if (!error && data && data.length > 0) {
        sessionSelections.set(projectId, data);
        return NextResponse.json({ selections: data, count: data.length });
      }
    } catch {
      // Supabase unconfigured or offline, fall through to session store
    }

    // 2. Return session-backed selections
    const current = sessionSelections.get(projectId) || [];
    return NextResponse.json({
      selections: current,
      count: current.length,
    });
  } catch (error) {
    console.error('[API /api/gallery/selections GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch selections' }, { status: 500 });
  }
}

/**
 * POST: Add or update a selection (heart / comment)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, selection } = body;

    if (!projectId || !selection || !selection.drive_file_id) {
      return NextResponse.json(
        { error: 'Missing projectId or selection data' },
        { status: 400 }
      );
    }

    const current = sessionSelections.get(projectId) || [];
    const existingIndex = current.findIndex(
      (s) => s.drive_file_id === selection.drive_file_id
    );

    let updated: Selection[];
    if (existingIndex >= 0) {
      // Update existing
      updated = current.map((s, idx) =>
        idx === existingIndex ? { ...s, ...selection } : s
      );
    } else {
      // Add new
      const newSel: Selection = {
        id: selection.id || `sel-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        project_id: projectId,
        drive_file_id: selection.drive_file_id,
        file_name: selection.file_name,
        comment: selection.comment || null,
        created_at: selection.created_at || new Date().toISOString(),
      };
      updated = [...current, newSel];
    }

    sessionSelections.set(projectId, updated);

    // Sync to Supabase asynchronously
    try {
      const supabase = createClient();
      await supabase.from('selections').upsert(updated);
    } catch {
      // Silently fall through
    }

    return NextResponse.json({
      success: true,
      selections: updated,
      count: updated.length,
    });
  } catch (error) {
    console.error('[API /api/gallery/selections POST Error]:', error);
    return NextResponse.json({ error: 'Failed to save selection' }, { status: 500 });
  }
}

/**
 * DELETE: Remove a selection
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const driveFileId = searchParams.get('driveFileId');

    if (!projectId || !driveFileId) {
      return NextResponse.json(
        { error: 'Missing projectId or driveFileId' },
        { status: 400 }
      );
    }

    const current = sessionSelections.get(projectId) || [];
    const updated = current.filter((s) => s.drive_file_id !== driveFileId);
    sessionSelections.set(projectId, updated);

    // Sync to Supabase asynchronously
    try {
      const supabase = createClient();
      await supabase
        .from('selections')
        .delete()
        .eq('project_id', projectId)
        .eq('drive_file_id', driveFileId);
    } catch {
      // Silently fall through
    }

    return NextResponse.json({
      success: true,
      selections: updated,
      count: updated.length,
    });
  } catch (error) {
    console.error('[API /api/gallery/selections DELETE Error]:', error);
    return NextResponse.json({ error: 'Failed to delete selection' }, { status: 500 });
  }
}
