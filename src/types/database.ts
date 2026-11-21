export interface Profile {
  id: string;
  studio_name: string;
  whatsapp_number: string;
  upi_id?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  photographer_id: string;
  slug: string;
  event_name: string;
  client_name: string;
  client_whatsapp?: string | null;
  drive_folder_id: string;
  max_selection: number;
  watermark_text: string;
  access_pin?: string | null;
  is_paid: boolean;
  is_submitted: boolean;
  submitted_at?: string | null;
  created_at?: string;
  updated_at?: string;
  // Computed / joined fields
  profiles?: Profile;
  total_photos?: number;
  selections_count?: number;
}

export interface Selection {
  id: string;
  project_id: string;
  drive_file_id: string;
  file_name: string;
  comment?: string | null;
  created_at?: string;
}

export interface AuditLog {
  id: string;
  user_id?: string | null;
  email: string;
  studio_name?: string | null;
  action: 'LOGIN' | 'SIGNUP' | 'LOGOUT' | 'CREATE_GALLERY' | 'PAYMENT_UNLOCKED' | 'PAYMENT_LOCKED' | 'UTR_SUBMITTED' | 'SUBMIT_SELECTION';
  ip_address?: string | null;
  user_agent?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Payment {
  id: string;
  project_id: string;
  photographer_id?: string | null;
  client_name: string;
  client_phone?: string | null;
  amount: number;
  currency: string;
  gateway: 'razorpay' | 'upi_direct' | 'cashfree';
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  utr_number?: string | null;
  status: 'pending' | 'verified' | 'captured' | 'failed';
  verified_at?: string | null;
  created_at: string;
}

export interface DrivePhoto {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink: string;
  webContentLink?: string;
  webViewLink?: string;
  size?: string;
  imageMediaMetadata?: {
    width?: number;
    height?: number;
    rotation?: number;
    cameraMake?: string;
    cameraModel?: string;
    exposureTime?: number;
    aperture?: number;
    focalLength?: number;
    isoSpeed?: number;
  };
}

export interface DriveResponse {
  files: DrivePhoto[];
  nextPageToken?: string | null;
}
