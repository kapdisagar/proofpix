import { Profile, Project, Selection, AuditLog, Payment, Subscription } from '@/types/database';

export const INITIAL_PROFILE: Profile = {
  id: 'photographer-demo-1',
  full_name: 'Sagar Kapdi',
  email: 'sagar.kapdi@gmail.com',
  studio_name: 'The Royal Frames Studio',
  whatsapp_number: '919876543210',
  upi_id: 'royalstudio@oksbi',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  auth_provider: 'google',
  google_id: 'google-oauth2-108291048291',
  bio: 'Luxury Destination Wedding & Pre-wedding Cinematography across Udaipur, Jaipur & Mumbai.',
  city: 'Udaipur, Rajasthan',
  instagram_handle: '@royalstudio.in',
  website_url: 'https://royalstudio.in',
  default_watermark: 'The Royal Frames Studio · Proof Copy',
  default_pin: '4829',
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

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    user_id: 'photographer-demo-1',
    email: 'admin@royalstudio.in',
    studio_name: 'The Royal Frames Studio',
    action: 'LOGIN',
    ip_address: '103.21.124.89 (Mumbai, India)',
    user_agent: 'Chrome 122 (Windows 11)',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    metadata: { method: 'Email/Password', status: 'SUCCESS' }
  },
  {
    id: 'audit-2',
    user_id: 'photographer-demo-1',
    email: 'admin@royalstudio.in',
    studio_name: 'The Royal Frames Studio',
    action: 'CREATE_GALLERY',
    ip_address: '103.21.124.89 (Mumbai, India)',
    user_agent: 'Chrome 122 (Windows 11)',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    metadata: { event_name: 'Rohan & Priya Royal Wedding', slug: 'rohan-priya-udaipur' }
  },
  {
    id: 'audit-3',
    user_id: 'photographer-demo-1',
    email: 'client@priyasharma.com',
    studio_name: 'The Royal Frames Studio',
    action: 'UTR_SUBMITTED',
    ip_address: '49.36.182.204 (Jaipur, India)',
    user_agent: 'Mobile Safari (iPhone 15 Pro)',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    metadata: { utr_number: '489210485912', amount: 5000, event: 'Rohan & Priya Wedding' }
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    project_id: 'proj-1',
    photographer_id: 'photographer-demo-1',
    client_name: 'Priya Sharma',
    client_phone: '919876543210',
    amount: 5000,
    currency: 'INR',
    gateway: 'upi_direct',
    utr_number: '489210485912',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'pay-2',
    project_id: 'proj-2',
    photographer_id: 'photographer-demo-1',
    client_name: 'Aarav Mehta',
    client_phone: '919812345678',
    amount: 7500,
    currency: 'INR',
    gateway: 'razorpay',
    razorpay_payment_id: 'pay_NqL384jK829a',
    status: 'captured',
    verified_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    created_at: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

// Local storage keys
const STORAGE_KEY_PROJECTS = 'proofpix_demo_projects';
const STORAGE_KEY_SELECTIONS = 'proofpix_demo_selections';
const STORAGE_KEY_PROFILE = 'proofpix_demo_profile';
const STORAGE_KEY_AUDIT = 'proofpix_audit_logs';
const STORAGE_KEY_PAYMENTS = 'proofpix_payments';

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

export function getLocalAuditLogs(): AuditLog[] {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUDIT);
    return raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function addLocalAuditLog(log: Omit<AuditLog, 'id' | 'created_at'>) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalAuditLogs();
    const newLog: AuditLog = {
      ...log,
      id: `audit-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newLog, ...existing];
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to log audit event:', e);
  }
}

export function getLocalPayments(): Payment[] {
  if (typeof window === 'undefined') return INITIAL_PAYMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PAYMENTS);
    return raw ? JSON.parse(raw) : INITIAL_PAYMENTS;
  } catch {
    return INITIAL_PAYMENTS;
  }
}

export function addLocalPayment(payment: Omit<Payment, 'id' | 'created_at'>) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalPayments();
    const newPayment: Payment = {
      ...payment,
      id: `pay-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newPayment, ...existing];
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save payment record:', e);
  }
}

export function verifyLocalPayment(paymentId: string) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalPayments();
    const updated = existing.map((p) =>
      p.id === paymentId ? { ...p, status: 'verified' as const, verified_at: new Date().toISOString() } : p
    );
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to verify payment:', e);
  }
}

const STORAGE_KEY_SUBSCRIPTION = 'proofpix_studio_subscription';

export const INITIAL_SUBSCRIPTION: Subscription = {
  id: 'sub-starter',
  photographer_id: 'photographer-demo-1',
  studio_name: 'The Royal Frames Studio',
  email: 'admin@studio.in',
  plan_tier: 'FREE',
  amount: 0,
  status: 'active',
  started_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  expires_at: new Date(Date.now() + 86400000 * 20).toISOString(),
  created_at: new Date(Date.now() - 86400000 * 10).toISOString()
};

export function getLocalSubscription(): Subscription {
  if (typeof window === 'undefined') return INITIAL_SUBSCRIPTION;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBSCRIPTION);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SUBSCRIPTION, JSON.stringify(INITIAL_SUBSCRIPTION));
      return INITIAL_SUBSCRIPTION;
    }
    const sub: Subscription = JSON.parse(raw);
    
    // Check if expired
    const isExpired = new Date(sub.expires_at).getTime() < Date.now();
    if (isExpired && sub.plan_tier !== 'FREE') {
      sub.status = 'expired';
    }
    return sub;
  } catch {
    return INITIAL_SUBSCRIPTION;
  }
}

export function saveLocalSubscription(sub: Subscription) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_SUBSCRIPTION, JSON.stringify(sub));
}

export function activateLocalSubscription(planTier: 'MONTHLY_PRO' | 'ANNUAL_PASS', utrNumber: string): Subscription {
  const now = new Date();
  const expires = new Date(now);
  if (planTier === 'ANNUAL_PASS') {
    expires.setDate(expires.getDate() + 365);
  } else {
    expires.setDate(expires.getDate() + 30);
  }

  const newSub: Subscription = {
    id: `sub-${Date.now()}`,
    photographer_id: 'photographer-demo-1',
    studio_name: 'The Royal Frames Studio',
    email: 'admin@studio.in',
    plan_tier: planTier,
    amount: planTier === 'ANNUAL_PASS' ? 1999 : 299,
    utr_number: utrNumber,
    status: 'active',
    started_at: now.toISOString(),
    expires_at: expires.toISOString(),
    created_at: now.toISOString()
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_SUBSCRIPTION, JSON.stringify(newSub));
  }

  // Record audit log
  addLocalAuditLog({
    email: 'admin@studio.in',
    studio_name: 'The Royal Frames Studio',
    action: 'PAYMENT_UNLOCKED',
    ip_address: '103.21.124.89 (Studio IP)',
    user_agent: 'Desktop Browser',
    metadata: {
      plan_tier: planTier,
      amount: newSub.amount,
      utr: utrNumber,
      expires_at: newSub.expires_at
    }
  });

  return newSub;
}
