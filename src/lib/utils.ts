import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes Indian phone numbers into international WhatsApp standard (91XXXXXXXXXX)
 * Handles:
 * - "+91 98765 43210" -> "919876543210"
 * - "09876543210" -> "919876543210"
 * - "9876543210" -> "919876543210"
 * - "+91-98765-43210" -> "919876543210"
 */
export function normalizeIndianPhone(phone: string): string {
  if (!phone) return '919876543210';
  let digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.startsWith('91') && digits.length === 12) {
    return digits;
  }
  return digits.length >= 10 ? digits : '919876543210';
}

/**
 * Extracts Google Drive Folder ID from any URL format or raw ID.
 * Supports:
 * - https://drive.google.com/drive/folders/1aBcD-EfgHiJkLmNoPqRsTuVwXyZ
 * - https://drive.google.com/drive/u/0/folders/1aBcD-EfgHiJkLmNoPqRsTuVwXyZ
 * - https://drive.google.com/open?id=1aBcD-EfgHiJkLmNoPqRsTuVwXyZ
 * - 1aBcD-EfgHiJkLmNoPqRsTuVwXyZ (raw ID)
 */
export function extractDriveFolderId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Pattern 1: /folders/([a-zA-Z0-9_-]+)
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return folderMatch[1];
  }

  // Pattern 2: id=([a-zA-Z0-9_-]+)
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return idMatch[1];
  }

  // Pattern 3: raw 25-50 char alphanumeric string with dashes/underscores
  if (/^[a-zA-Z0-9_-]{25,55}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Generates Windows Batch script content (.bat) that copies selected photos
 * into a "Selected_Photos" subfolder inside the photographer's local directory.
 * Safely handles filenames with spaces, parentheses, accents.
 */
export function generateWindowsBatchScript(
  projectName: string,
  selectedFiles: { fileName: string; comment?: string | null }[]
): string {
  const lines: string[] = [
    `@echo off`,
    `chcp 65001 > nul`,
    `:: ==============================================================================`,
    `:: ProofPix Windows Batch Selection Filter`,
    `:: Project: ${projectName}`,
    `:: Total Selected Photos: ${selectedFiles.length}`,
    `:: Date: ${new Date().toLocaleDateString('en-IN')}`,
    `:: ==============================================================================`,
    ``,
    `echo [ProofPix] Starting file copy for: "${projectName}"`,
    `echo [ProofPix] Destination folder: .\\Selected_Photos`,
    ``,
    `if not exist "Selected_Photos" (`,
    `    mkdir "Selected_Photos"`,
    `    echo [ProofPix] Created target directory: .\\Selected_Photos`,
    `)`,
    ``,
    `set /a found_count=0`,
    `set /a missing_count=0`,
    ``,
  ];

  selectedFiles.forEach(({ fileName, comment }, idx) => {
    // Sanitize quotes and dangerous characters
    const sanitizedName = fileName.trim().replace(/["`&|<>]/g, '');
    const commentNote = comment ? ` (Note: ${comment.replace(/["`&|<>]/g, '')})` : '';
    lines.push(`:: Photo #${idx + 1}: ${sanitizedName}${commentNote}`);
    lines.push(`if exist "${sanitizedName}" (`);
    lines.push(`    copy /Y "${sanitizedName}" "Selected_Photos\\${sanitizedName}" > nul`);
    lines.push(`    set /a found_count+=1`);
    lines.push(`) else (`);
    lines.push(`    echo [Missing] "${sanitizedName}"`);
    lines.push(`    set /a missing_count+=1`);
    lines.push(`)`);
  });

  lines.push(``);
  lines.push(`echo ==============================================================================`);
  lines.push(`echo [ProofPix] File Copy Process Finished!`);
  lines.push(`echo Successfully Copied: %found_count% of ${selectedFiles.length}`);
  lines.push(`if %missing_count% gtr 0 (`);
  lines.push(`    echo Missing Files: %missing_count% (Check file extensions or raw folder location)`);
  lines.push(`)`);
  lines.push(`echo Selected photos are ready in: .\\Selected_Photos`);
  lines.push(`echo ==============================================================================`);
  lines.push(`pause`);

  return lines.join('\r\n');
}

/**
 * Triggers a browser download of a text/script file.
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Formats a WhatsApp summary link for client submission to the photographer.
 */
export function generateWhatsAppLink({
  phone,
  eventName,
  clientName,
  totalSelected,
  galleryUrl,
  notesCount,
}: {
  phone: string;
  eventName: string;
  clientName: string;
  totalSelected: number;
  galleryUrl: string;
  notesCount: number;
}): string {
  const targetPhone = normalizeIndianPhone(phone);

  const message = [
    `✨ *Photo Selection Completed!* ✨`,
    ``,
    `📸 *Event:* ${eventName}`,
    `👤 *Client:* ${clientName}`,
    `❤️ *Total Selected Photos:* ${totalSelected}`,
    notesCount > 0 ? `💬 *Photos with Design Notes:* ${notesCount}` : null,
    ``,
    `🔗 *View Gallery Selections:*`,
    galleryUrl,
    ``,
    `_Sent via ProofPix — Zero-Storage Client Gallery_`
  ].filter(Boolean).join('\n');

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Formats a WhatsApp link for the photographer to send gallery invitation to the client.
 */
export function generateClientInviteWhatsAppLink({
  clientPhone,
  clientName,
  eventName,
  studioName,
  galleryUrl,
  accessPin,
}: {
  clientPhone: string;
  clientName: string;
  eventName: string;
  studioName: string;
  galleryUrl: string;
  accessPin?: string | null;
}): string {
  const targetPhone = normalizeIndianPhone(clientPhone);

  const message = [
    `Dear *${clientName}*,`,
    ``,
    `Warm greetings from *${studioName}*! 🎉`,
    `Your photos from *${eventName}* are ready for viewing and album selection.`,
    ``,
    `🔗 *Open Your Private Gallery:*`,
    galleryUrl,
    accessPin ? `🔐 *Access PIN:* ${accessPin}` : null,
    ``,
    `Please tap ❤️ on your favorite photos and add any notes for your album. Once completed, tap 'Submit Selection' in the gallery.`,
    ``,
    `Best regards,`,
    `*${studioName}*`
  ].filter(Boolean).join('\n');

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates an instant UPI payment intent link for mobile checkout (GPay, PhonePe, Paytm, BHIM).
 */
export function generateUpiPaymentUrl({
  upiId,
  studioName,
  eventName,
}: {
  upiId: string;
  studioName: string;
  eventName: string;
}): string {
  if (!upiId) return '';
  const cleanUpi = upiId.trim();
  const cleanName = encodeURIComponent(studioName.trim());
  const note = encodeURIComponent(`Photo Selection Balance - ${eventName.trim()}`);
  return `upi://pay?pa=${cleanUpi}&pn=${cleanName}&tn=${note}&cu=INR`;
}
