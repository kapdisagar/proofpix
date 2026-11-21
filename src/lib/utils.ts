import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

  // Pattern 3: raw 25-45 char alphanumeric string with dashes/underscores
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Generates Windows Batch script content (.bat) that copies selected photos
 * into a "Selected_Photos" subfolder inside the photographer's local directory.
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
    `echo [ProofPix] Target destination: .\\Selected_Photos`,
    ``,
    `if not exist "Selected_Photos" (`,
    `    mkdir "Selected_Photos"`,
    `    echo [ProofPix] Created folder: Selected_Photos`,
    `)`,
    ``,
    `set /a found_count=0`,
    `set /a missing_count=0`,
    ``,
  ];

  selectedFiles.forEach(({ fileName, comment }, idx) => {
    const sanitizedName = fileName.trim().replace(/"/g, '');
    const commentNote = comment ? ` (Note: ${comment.replace(/"/g, '')})` : '';
    lines.push(`:: Photo #${idx + 1}: ${sanitizedName}${commentNote}`);
    lines.push(`if exist "${sanitizedName}" (`);
    lines.push(`    copy /Y "${sanitizedName}" "Selected_Photos\\${sanitizedName}" > nul`);
    lines.push(`    set /a found_count+=1`);
    lines.push(`) else (`);
    lines.push(`    echo [Missing] ${sanitizedName}`);
    lines.push(`    set /a missing_count+=1`);
    lines.push(`)`);
  });

  lines.push(``);
  lines.push(`echo ==============================================================================`);
  lines.push(`echo [ProofPix] Copy Complete!`);
  lines.push(`echo Successfully Copied: %found_count% of ${selectedFiles.length}`);
  lines.push(`if %missing_count% gtr 0 (`);
  lines.push(`    echo Missing Files: %missing_count% (Verify raw folder or file extension)`);
  lines.push(`)`);
  lines.push(`echo Files are ready inside the "Selected_Photos" folder.`);
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
 * Formats a WhatsApp summary link for client submission.
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
  // Clean phone number (e.g., 919876543210)
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const targetPhone = cleanPhone.startsWith('91') || cleanPhone.length > 10 ? cleanPhone : `91${cleanPhone}`;

  const message = [
    `✨ *Photo Selection Completed!* ✨`,
    ``,
    `📸 *Event:* ${eventName}`,
    `👤 *Client:* ${clientName}`,
    `❤️ *Total Selected Photos:* ${totalSelected}`,
    notesCount > 0 ? `💬 *Photos with Editing Notes:* ${notesCount}` : null,
    ``,
    `🔗 *View Gallery Selections:*`,
    galleryUrl,
    ``,
    `_Sent via ProofPix — The Zero-Storage Client Gallery_`
  ].filter(Boolean).join('\n');

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}
