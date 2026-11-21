'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, Camera, Lock, Unlock, Copy, Check, Download, Share2, 
  Trash2, ExternalLink, HardDrive, MessageSquare, Smartphone, 
  Sparkles, Sliders, AlertCircle, FileCode, CheckCircle2, X, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Project, Profile, Selection } from '@/types/database';
import { 
  extractDriveFolderId, 
  generateWindowsBatchScript, 
  downloadFile 
} from '@/lib/utils';
import { 
  getLocalProfile, 
  getLocalProjects, 
  saveLocalProjects, 
  getLocalSelections 
} from '@/lib/mockStore';

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile>(getLocalProfile());
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [exportProject, setExportProject] = useState<Project | null>(null);
  const [exportSelections, setExportSelections] = useState<Selection[]>([]);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [copiedFilenames, setCopiedFilenames] = useState(false);

  // New Project Form State
  const [eventName, setEventName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [maxSelection, setMaxSelection] = useState(100);
  const [watermarkText, setWatermarkText] = useState(profile.studio_name || 'The Royal Frames Studio');
  const [accessPin, setAccessPin] = useState('4829');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const loaded = getLocalProjects();
    setProjects(loaded);
  }, []);

  // Toggle Payment Lock (is_paid)
  const handleTogglePaymentLock = (projectId: string) => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const nextState = !p.is_paid;
        if (nextState) {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }
        return { ...p, is_paid: nextState };
      }
      return p;
    });
    setProjects(updated);
    saveLocalProjects(updated);
  };

  // Open Export Modal for Project
  const handleOpenExport = (project: Project) => {
    const sels = getLocalSelections(project.id);
    setExportProject(project);
    setExportSelections(sels);
    setCopiedFilenames(false);
  };

  // Copy Comma-Separated Filenames for Lightroom
  const handleCopyFilenames = () => {
    if (exportSelections.length === 0) return;
    const names = exportSelections.map((s) => s.file_name).join(', ');
    navigator.clipboard?.writeText(names);
    setCopiedFilenames(true);
    setTimeout(() => setCopiedFilenames(false), 2500);
  };

  // Download Windows Batch Script (.bat)
  const handleDownloadBatchScript = () => {
    if (!exportProject || exportSelections.length === 0) return;
    const scriptContent = generateWindowsBatchScript(
      exportProject.event_name,
      exportSelections.map((s) => ({ fileName: s.file_name, comment: s.comment }))
    );
    const sanitizedFilename = `ProofPix_Copy_${exportProject.slug}.bat`;
    downloadFile(scriptContent, sanitizedFilename, 'application/x-bat');
    confetti({ particleCount: 40, spread: 50 });
  };

  // Copy Client Gallery Link
  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/gallery/${slug}`;
    navigator.clipboard?.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  // Handle Project Creation
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const folderId = extractDriveFolderId(driveUrl);
    if (!folderId) {
      setFormError('Invalid Google Drive URL. Please provide a valid public folder link or Folder ID.');
      return;
    }

    // Generate unique slug
    const baseSlug = eventName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const uniqueSlug = `${baseSlug || 'wedding'}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      photographer_id: profile.id,
      slug: uniqueSlug,
      event_name: eventName,
      client_name: clientName,
      client_whatsapp: clientWhatsapp,
      drive_folder_id: folderId,
      max_selection: Number(maxSelection) || 100,
      watermark_text: watermarkText || profile.studio_name,
      access_pin: accessPin.trim() || null,
      is_paid: false,
      is_submitted: false,
      created_at: new Date().toISOString(),
      total_photos: 12,
      selections_count: 0,
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    saveLocalProjects(updated);

    confetti({ particleCount: 70, spread: 60 });
    setIsCreateOpen(false);

    // Reset Form
    setEventName('');
    setClientName('');
    setClientWhatsapp('');
    setDriveUrl('');
  };

  // Delete project
  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this gallery?')) {
      const updated = projects.filter((p) => p.id !== projectId);
      setProjects(updated);
      saveLocalProjects(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827]">
      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-serif text-lg font-bold">
              P
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-gray-950">ProofPix</span>
              <span className="text-[10px] font-mono text-gray-400 ml-2">STUDIO OS</span>
            </div>
          </Link>

          {/* Studio Profile Pill */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-gray-900">{profile.studio_name}</span>
              <span className="text-[10px] text-gray-500 font-mono">UPI: {profile.upi_id || 'Not set'}</span>
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Gallery</span>
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">Active Galleries</span>
            <div className="font-serif text-2xl font-bold text-gray-950">{projects.length}</div>
            <p className="text-[10px] text-emerald-600 font-medium">₹0 storage cost</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">Selections Submitted</span>
            <div className="font-serif text-2xl font-bold text-emerald-600">
              {projects.filter((p) => p.is_submitted).length}
            </div>
            <p className="text-[10px] text-gray-500">Ready for editing</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">Payments Locked</span>
            <div className="font-serif text-2xl font-bold text-amber-600">
              {projects.filter((p) => !p.is_paid).length}
            </div>
            <p className="text-[10px] text-amber-700 font-medium">Watermark active</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
            <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">Unlocked / Paid</span>
            <div className="font-serif text-2xl font-bold text-rose-600">
              {projects.filter((p) => p.is_paid).length}
            </div>
            <p className="text-[10px] text-gray-500">Downloads enabled</p>
          </div>
        </div>

        {/* PROJECT LIST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-gray-950">
              Client Proofing Projects
            </h2>
            <span className="text-xs text-gray-500">
              Showing {projects.length} galleries
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8 space-y-4">
              <Camera className="w-10 h-10 text-gray-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900 text-sm">No client galleries created yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Click below to connect your first Google Drive folder and send a link to your client.
                </p>
              </div>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-5 py-2.5 rounded-full bg-rose-600 text-white font-semibold text-xs shadow-sm hover:bg-rose-700"
              >
                Create First Gallery (₹0)
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.map((project) => {
                const currentSelections = getLocalSelections(project.id);
                const count = currentSelections.length;

                return (
                  <div
                    key={project.id}
                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-gray-300 transition-all flex flex-col justify-between space-y-5"
                  >
                    {/* Top row: Event Title + Status Badges */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                            Client: {project.client_name}
                          </span>
                          <h3 className="font-serif text-lg font-bold text-gray-950 leading-snug">
                            {project.event_name}
                          </h3>
                        </div>

                        {/* Status Pills */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          {project.is_submitted ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Submitted</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                              <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
                              <span>Proofing in Progress</span>
                            </span>
                          )}

                          {project.access_pin && (
                            <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              PIN: {project.access_pin}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Selection Progress Bar */}
                      <div className="pt-2 space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">
                            Selected: <strong className="text-gray-900">{count}</strong> / {project.max_selection} photos
                          </span>
                          <span className="font-mono text-[11px] text-gray-400">
                            {Math.round((count / project.max_selection) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              count > 0 ? 'bg-rose-500' : 'bg-gray-300'
                            }`}
                            style={{ width: `${Math.min((count / project.max_selection) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Middle: Google Drive & Watermark Meta */}
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-500 flex items-center gap-1.5">
                          <HardDrive className="w-3.5 h-3.5 text-gray-400" />
                          <span>Drive Folder:</span>
                        </span>
                        <span className="font-mono text-gray-700 truncate max-w-[180px]">
                          {project.drive_folder_id}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-500">Watermark Text:</span>
                        <span className="text-gray-800 font-medium truncate max-w-[180px]">
                          "{project.watermark_text}"
                        </span>
                      </div>
                    </div>

                    {/* Bottom: Payment Lock Switch & Action Buttons */}
                    <div className="space-y-3 pt-1 border-t border-gray-100">
                      {/* Payment Lock Toggle */}
                      <div className="flex items-center justify-between bg-gray-50/70 p-2.5 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2">
                          {project.is_paid ? (
                            <Unlock className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-amber-600" />
                          )}
                          <div>
                            <span className="text-xs font-semibold block text-gray-900">
                              {project.is_paid ? 'Payment Cleared' : 'Payment Locked'}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {project.is_paid ? 'Watermark OFF · Downloads Active' : 'Watermark ON · Downloads Blocked'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleTogglePaymentLock(project.id)}
                          className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors font-mono ${
                            project.is_paid
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-amber-500 text-black hover:bg-amber-400'
                          }`}
                        >
                          {project.is_paid ? 'Unlocked (Paid)' : 'Mark Payment Done'}
                        </button>
                      </div>

                      {/* Action buttons row */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2">
                          {/* Export Selection Modal Trigger */}
                          <button
                            onClick={() => handleOpenExport(project)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
                            title="Export selected filenames for Lightroom & download .bat file"
                          >
                            <FileCode className="w-3.5 h-3.5 text-rose-600" />
                            <span>Export ({count})</span>
                          </button>

                          {/* Copy Link Button */}
                          <button
                            onClick={() => handleCopyLink(project.slug)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
                          >
                            {copiedSlug === project.slug ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600 font-semibold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-gray-500" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Open Gallery in New Tab */}
                          <Link
                            href={`/gallery/${project.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100"
                            title="Open client gallery view"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Delete Gallery */}
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete gallery"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* CREATE NEW PROJECT MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-mono text-rose-600 uppercase font-semibold">
                  Zero Storage Architecture (₹0)
                </span>
                <h3 className="font-serif text-2xl font-bold text-gray-950">
                  Create Client Gallery
                </h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Event / Shoot Name:</label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. Rohan & Priya Royal Udaipur Wedding"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Client Name:</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-black focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Client WhatsApp Number:</label>
                  <input
                    type="tel"
                    value={clientWhatsapp}
                    onChange={(e) => setClientWhatsapp(e.target.value)}
                    placeholder="e.g. 919876543210"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-black focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-gray-700 font-medium">Google Drive Folder Link:</label>
                  <button
                    type="button"
                    onClick={() => setDriveUrl('https://drive.google.com/drive/folders/1A2b3C4d5E6f7G8h9I0jKlMnOpQrStUvW')}
                    className="text-[10px] text-rose-600 hover:underline"
                  >
                    Paste Sample Link
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/1ABC..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-black focus:bg-white font-mono text-[11px]"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Folder must have "Anyone with the link can view" access.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Max Selection Limit:</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={maxSelection}
                    onChange={(e) => setMaxSelection(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-black focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Client Access PIN (Optional):</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={accessPin}
                    onChange={(e) => setAccessPin(e.target.value)}
                    placeholder="e.g. 4829"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-black focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Watermark Text:</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Studio Name watermark"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-gray-500 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm transition-all"
                >
                  Generate Gallery Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPORT SELECTION MODAL / DRAWER */}
      {exportProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-rose-600 uppercase font-semibold">
                  Lightroom & Editing Export
                </span>
                <h3 className="font-serif text-2xl font-bold text-gray-950">
                  {exportProject.event_name}
                </h3>
                <p className="text-xs text-gray-500">
                  Total {exportSelections.length} photos selected by {exportProject.client_name}
                </p>
              </div>
              <button
                onClick={() => setExportProject(null)}
                className="text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <button
                onClick={handleCopyFilenames}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black hover:bg-gray-800 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                {copiedFilenames ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFilenames ? 'Copied to Clipboard!' : 'Copy Filenames (Lightroom Filter)'}</span>
              </button>

              <button
                onClick={handleDownloadBatchScript}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Windows Batch Script (.bat)</span>
              </button>
            </div>

            {/* List of files with client comments */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 pr-2">
              {exportSelections.length === 0 ? (
                <div className="text-center py-12 text-xs text-gray-500">
                  Client has not selected any photos yet.
                </div>
              ) : (
                exportSelections.map((item, idx) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-gray-400 w-6 text-right">{idx + 1}.</span>
                      <span className="font-mono font-semibold text-gray-900">{item.file_name}</span>
                    </div>

                    {item.comment ? (
                      <span className="text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md font-medium max-w-xs truncate">
                        💬 "{item.comment}"
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">No notes</span>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Tip: Paste filenames into Lightroom's Text Filter with "Contains".</span>
              <button
                onClick={() => setExportProject(null)}
                className="px-4 py-1.5 text-gray-700 hover:text-black font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
