import { Profile, Project, Selection } from '@/types/database';

export const INITIAL_PROFILE: Profile = {
  id: 'photographer-demo-1',
  studio_name: 'The Royal Frames Studio',
  whatsapp_number: '919876543210',
  upi_id: 'royalstudio@oksbi',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    photographer_id: 'photographer-demo-1',
    slug: 'rohan-priya-udaipur',
    event_name: 'Rohan & Priya Royal Wedding',
    client_name: 'Priya Sharma',
    client_whatsapp: '919876543210',
    drive_folder_id: 'demo-folder-udaipur',
    max_selection: 100,
    watermark_text: 'The Royal Frames Studio',
    access_pin: '4829',
    is_paid: false,
    is_submitted: false,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    total_photos: 12,
    selections_count: 3
  },
  {
    id: 'proj-2',
    photographer_id: 'photographer-demo-1',
    slug: 'aarav-meera-sangeet',
    event_name: 'Aarav & Meera Palace Sangeet',
    client_name: 'Aarav Mehta',
    client_whatsapp: '919812345678',
    drive_folder_id: 'demo-folder-sangeet',
    max_selection: 75,
    watermark_text: 'The Royal Frames Studio',
    access_pin: '1234',
    is_paid: true,
    is_submitted: true,
    submitted_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    total_photos: 12,
    selections_count: 5
  }
];

export const INITIAL_SELECTIONS: Record<string, Selection[]> = {
  'proj-1': [
    {
      id: 'sel-1',
      project_id: 'proj-1',
      drive_file_id: 'demo-photo-1',
      file_name: 'DSC_0104_Bridal_Jharokha.jpg',
      comment: 'is photo ko album ke front page par rakhna',
      created_at: new Date().toISOString()
    },
    {
      id: 'sel-2',
      project_id: 'proj-1',
      drive_file_id: 'demo-photo-2',
      file_name: 'DSC_0142_Varmala_Ghat_Pheras.jpg',
      comment: 'Full 2-page panoramic spread',
      created_at: new Date().toISOString()
    },
    {
      id: 'sel-3',
      project_id: 'proj-1',
      drive_file_id: 'demo-photo-4',
      file_name: 'DSC_0215_Bridal_Lehenga_Details.jpg',
      comment: 'Retouch jewellery highlights',
      created_at: new Date().toISOString()
    }
  ],
  'proj-2': [
    {
      id: 'sel-201',
      project_id: 'proj-2',
      drive_file_id: 'demo-photo-3',
      file_name: 'DSC_0188_Sangeet_Celebration.jpg',
      comment: 'Include in highlight reel',
      created_at: new Date().toISOString()
    },
    {
      id: 'sel-202',
      project_id: 'proj-2',
      drive_file_id: 'demo-photo-6',
      file_name: 'DSC_0312_Mehendi_Candid_Smile.jpg',
      comment: 'Clean background lighting',
      created_at: new Date().toISOString()
    }
  ]
};

// Local storage key helpers
const STORAGE_KEY_PROJECTS = 'proofpix_demo_projects';
const STORAGE_KEY_SELECTIONS = 'proofpix_demo_selections';
const STORAGE_KEY_PROFILE = 'proofpix_demo_profile';

export function getLocalProfile(): Profile {
  if (typeof window === 'undefined') return INITIAL_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    return raw ? JSON.parse(raw) : INITIAL_PROFILE;
  } catch {
    return INITIAL_PROFILE;
  }
}

export function saveLocalProfile(profile: Profile) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
}

export function getLocalProjects(): Project[] {
  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROJECTS;
  }
}

export function saveLocalProjects(projects: Project[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
}

export function getLocalSelections(projectId: string): Selection[] {
  if (typeof window === 'undefined') return INITIAL_SELECTIONS[projectId] || [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SELECTIONS);
    const all = raw ? JSON.parse(raw) : INITIAL_SELECTIONS;
    return all[projectId] || [];
  } catch {
    return INITIAL_SELECTIONS[projectId] || [];
  }
}

export function saveLocalSelections(projectId: string, selections: Selection[]) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SELECTIONS);
    const all = raw ? JSON.parse(raw) : INITIAL_SELECTIONS;
    all[projectId] = selections;
    localStorage.setItem(STORAGE_KEY_SELECTIONS, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save selections:', e);
  }
}
