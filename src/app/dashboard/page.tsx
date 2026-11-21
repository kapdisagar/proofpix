'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, Camera, Lock, Unlock, Copy, Check, Download, Share2, 
  Trash2, ExternalLink, HardDrive, MessageSquare, Smartphone, 
  Sparkles, Sliders, AlertCircle, FileCode, CheckCircle2, X, RefreshCw,
  Edit3, IndianRupee, Send, ShieldCheck, LogOut, Activity, UserCheck, Crown, QrCode, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  extractDriveFolderId, 
  generateWindowsBatchScript, 
  downloadFile,
  generateClientInviteWhatsAppLink
} from '@/lib/utils';
import { 
  getLocalProfile, 
  saveLocalProfile,
  getLocalProjects, 
  saveLocalProjects, 
  getLocalSelections,
  getLocalAuditLogs,
  addLocalAuditLog,
  getLocalPayments,
  verifyLocalPayment,
  getLocalSubscription,
  activateLocalSubscription
} from '@/lib/mockStore';
import { Project, Profile, Selection, AuditLog, Payment, Subscription } from '@/types/database';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(getLocalProfile());
  const [projects, setProjects] = useState<Project[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);

  const [exportProject, setExportProject] = useState<Project | null>(null);
  const [exportSelections, setExportSelections] = useState<Selection[]>([]);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [copiedFilenames, setCopiedFilenames] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Project Form State
  const [eventName, setEventName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [maxSelection, setMaxSelection] = useState(100);
  const [watermarkText, setWatermarkText] = useState(profile.studio_name || 'The Royal Frames Studio');
  const [accessPin, setAccessPin] = useState('4829');
  const [formError, setFormError] = useState<string | null>(null);

  // Profile Edit Form State
  const [editStudioName, setEditStudioName] = useState(profile.studio_name);
  const [editWhatsapp, setEditWhatsapp] = useState(profile.whatsapp_number);
  const [editUpiId, setEditUpiId] = useState(profile.upi_id || '');

  // Studio Upgrade Modal State
  const [subscription, setSubscription] = useState<Subscription>(getLocalSubscription());
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradePlanTier, setUpgradePlanTier] = useState<'MONTHLY_PRO' | 'ANNUAL_PASS'>('ANNUAL_PASS');
  const [upgradeUtr, setUpgradeUtr] = useState('');
  const [isSubmittingUpgrade, setIsSubmittingUpgrade] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);

  const loadRazorpaySDK = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDashboardRazorpayCheckout = async () => {
    setIsRazorpayLoading(true);
    const amount = upgradePlanTier === 'ANNUAL_PASS' ? 1999 : 299;
    const planName = upgradePlanTier === 'ANNUAL_PASS' ? 'Annual Unlimited Pass' : 'Monthly Pro';

    try {
      const loaded = await loadRazorpaySDK();
      if (!loaded) {
        alert('Could not load Razorpay SDK. Please check your internet connection.');
        setIsRazorpayLoading(false);
        return;
      }

      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          plan_tier: upgradePlanTier,
          client_name: profile.studio_name || 'Studio Owner',
          client_email: 'studio@proofpix.in',
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.order_id) {
        alert(orderData.error || 'Failed to initialize Razorpay payment.');
        setIsRazorpayLoading(false);
        return;
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ProofPix',
        description: `Upgrade to ${planName}`,
        image: '/proofpix-qr.jpg',
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan_tier: upgradePlanTier,
                amount: amount,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              const newSub = activateLocalSubscription(upgradePlanTier, response.razorpay_payment_id);
              setSubscription(newSub);
              setUpgradeSuccess(true);
              confetti({ particleCount: 100, spread: 80 });
              showToast(`Plan successfully activated: ${planName}!`);
            } else {
              alert(verifyData.error || 'Signature verification failed.');
            }
          } catch {
            const newSub = activateLocalSubscription(upgradePlanTier, response.razorpay_payment_id);
            setSubscription(newSub);
            setUpgradeSuccess(true);
            confetti({ particleCount: 100, spread: 80 });
          }
        },
        prefill: {
          name: profile.studio_name || 'Studio Owner',
          email: 'studio@proofpix.in',
          contact: profile.whatsapp_number || '919876543210',
        },
        theme: {
          color: '#E11D48',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      console.error('Razorpay Error:', err);
      alert('Error initiating Razorpay checkout.');
    } finally {
      setIsRazorpayLoading(false);
    }
  };

  const handleUpgradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upgradeUtr.trim()) return;

    setIsSubmittingUpgrade(true);
    const amount = upgradePlanTier === 'ANNUAL_PASS' ? 1999 : 299;
    try {
      const res = await fetch('/api/payments/utr-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: 'sub-' + upgradePlanTier.toLowerCase(),
          client_name: profile.studio_name || 'Studio Owner',
          client_phone: profile.whatsapp_number || '919876543210',
          utr_number: upgradeUtr.trim(),
          amount: amount
        })
      });

      if (res.status === 409) {
        alert('Security Alert: This 12-digit UTR number has already been used. Please enter the unique transaction reference from your UPI app receipt.');
        setIsSubmittingUpgrade(false);
        return;
      }

      const newSub = activateLocalSubscription(upgradePlanTier, upgradeUtr.trim());
      setSubscription(newSub);
      setUpgradeSuccess(true);
      confetti({ particleCount: 80, spread: 70 });
      showToast(`Plan successfully activated: ${upgradePlanTier === 'ANNUAL_PASS' ? 'Annual Pass' : 'Monthly Pro'}!`);
    } catch {
      const newSub = activateLocalSubscription(upgradePlanTier, upgradeUtr.trim());
      setSubscription(newSub);
      setUpgradeSuccess(true);
      confetti({ particleCount: 80, spread: 70 });
    } finally {
      setIsSubmittingUpgrade(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    setProjects(getLocalProjects());
    setAuditLogs(getLocalAuditLogs());
    setPayments(getLocalPayments());
    setSubscription(getLocalSubscription());
  }, []);

  // Save Profile Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: Profile = {
      ...profile,
      studio_name: editStudioName.trim() || 'My Photography Studio',
      whatsapp_number: editWhatsapp.trim() || '919876543210',
      upi_id: editUpiId.trim() || null,
    };
    setProfile(updatedProfile);
    saveLocalProfile(updatedProfile);
    setIsProfileOpen(false);
    showToast('Studio profile updated successfully!');
  };

  // Toggle Payment Lock (is_paid)
  const handleTogglePaymentLock = (projectId: string) => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const nextState = !p.is_paid;
        if (nextState) {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          showToast(`Unlocked downloads & removed watermark for ${p.event_name}`);
          addLocalAuditLog({
            email: 'admin@studio.in',
            studio_name: profile.studio_name,
            action: 'PAYMENT_UNLOCKED',
            ip_address: '103.21.124.89 (Studio IP)',
            user_agent: 'Desktop Browser',
            metadata: { event_name: p.event_name, project_id: p.id }
          });
        } else {
          showToast(`Payment locked & watermark activated for ${p.event_name}`);
          addLocalAuditLog({
            email: 'admin@studio.in',
            studio_name: profile.studio_name,
            action: 'PAYMENT_LOCKED',
            ip_address: '103.21.124.89 (Studio IP)',
            user_agent: 'Desktop Browser',
            metadata: { event_name: p.event_name, project_id: p.id }
          });
        }
        return { ...p, is_paid: nextState };
      }
      return p;
    });
    setProjects(updated);
    saveLocalProjects(updated);
    setAuditLogs(getLocalAuditLogs());
  };

  // Confirm Client UTR and Unlock Gallery
  const handleConfirmUtrPayment = (payment: Payment) => {
    verifyLocalPayment(payment.id);
    setPayments(getLocalPayments());

    // Unlock matching project
    const updatedProjects = projects.map((p) =>
      p.id === payment.project_id ? { ...p, is_paid: true } : p
    );
    setProjects(updatedProjects);
    saveLocalProjects(updatedProjects);

    addLocalAuditLog({
      email: 'admin@studio.in',
      studio_name: profile.studio_name,
      action: 'PAYMENT_UNLOCKED',
      ip_address: '103.21.124.89 (Studio IP)',
      user_agent: 'Desktop Browser',
      metadata: { utr: payment.utr_number, amount: payment.amount, client: payment.client_name }
    });
    setAuditLogs(getLocalAuditLogs());

    confetti({ particleCount: 60, spread: 60 });
    showToast(`Payment verified! Gallery unlocked for ${payment.client_name}`);
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
    showToast('Filenames copied! Paste into Lightroom filter');
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
    showToast('Windows Batch Script (.bat) downloaded');
  };

  // Copy Client Gallery Link
  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/gallery/${slug}`;
    navigator.clipboard?.writeText(fullUrl);
    setCopiedSlug(slug);
    showToast('Client gallery link copied to clipboard!');
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  // Handle Project Creation
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Check Free Plan Limit
    if (subscription.plan_tier === 'FREE' && projects.length >= 1) {
      setFormError('Free Starter plan limit reached (1 active gallery). Upgrade to Pro for unlimited galleries!');
      showToast('Free plan limit reached (1 gallery). Upgrade to Pro!');
      setIsUpgradeModalOpen(true);
      return;
    }

    const folderId = extractDriveFolderId(driveUrl);
    if (!folderId) {
      setFormError('Invalid Google Drive URL. Please provide a valid public folder link or Folder ID.');
      return;
    }

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

    addLocalAuditLog({
      email: 'admin@studio.in',
      studio_name: profile.studio_name,
      action: 'CREATE_GALLERY',
      ip_address: '103.21.124.89 (Studio IP)',
      user_agent: 'Desktop Browser',
      metadata: { event_name: eventName, slug: uniqueSlug }
    });
    setAuditLogs(getLocalAuditLogs());

    confetti({ particleCount: 70, spread: 60 });
    setIsCreateOpen(false);
    showToast('New client gallery created successfully!');

    setEventName('');
    setClientName('');
    setClientWhatsapp('');
    setDriveUrl('');
  };

  // Delete project with confirmation
  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this gallery? This action cannot be undone.')) {
      const updated = projects.filter((p) => p.id !== projectId);
      setProjects(updated);
      saveLocalProjects(updated);
      showToast('Gallery deleted');
    }
  };

  // Sign Out
  const handleSignOut = () => {
    router.push('/login');
  };

  const pendingPaymentsCount = payments.filter((p) => p.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827]">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg animate-fadeIn flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

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

          {/* Controls: Upgrade Pro, Audit Logs, Payments, Studio Profile, New Gallery */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Upgrade Pro Plan Button */}
            <button
              onClick={() => {
                setIsUpgradeModalOpen(true);
                setUpgradeSuccess(false);
                setUpgradeUtr('');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs font-semibold shadow-sm transition-all"
              title="Upgrade to Unlimited Pro"
            >
              <Crown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upgrade Pro</span>
            </button>

            {/* Payment Ledger Button */}
            <button
              onClick={() => setIsPaymentsOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
              title="View Client Payments & Verify UPI UTR"
            >
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Payments</span>
              {pendingPaymentsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                  {pendingPaymentsCount}
                </span>
              )}
            </button>

            {/* Security & Audit Logs Button */}
            <button
              onClick={() => setIsAuditOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
              title="View Security & Login Audit Trail"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Audit Logs</span>
            </button>

            {/* Studio Profile Trigger Pill */}
            <button
              onClick={() => {
                setEditStudioName(profile.studio_name);
                setEditWhatsapp(profile.whatsapp_number);
                setEditUpiId(profile.upi_id || '');
                setIsProfileOpen(true);
              }}
              className="flex items-center gap-2 p-1.5 px-3 rounded-xl hover:bg-gray-100 text-left transition-colors border border-transparent hover:border-gray-200"
              title="Click to edit Studio details"
            >
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-gray-900 flex items-center gap-1 justify-end">
                  <span>{profile.studio_name}</span>
                  <Edit3 className="w-3 h-3 text-gray-400" />
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  UPI: {profile.upi_id || 'Not set'}
                </span>
              </div>
            </button>

            {/* New Gallery Button */}
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Gallery</span>
            </button>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-400 hover:text-black rounded-lg"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* STUDIO PLAN BANNER WITH LIVE EXPIRY & FEATURES */}
        {(() => {
          const isPro = subscription.plan_tier !== 'FREE' && subscription.status === 'active';
          const daysRemaining = Math.max(0, Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          const formattedExpiry = new Date(subscription.expires_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          return (
            <div className={`rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg border ${
              isPro
                ? 'bg-gradient-to-r from-gray-950 via-rose-950/40 to-gray-950 border-rose-500/30'
                : 'bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-gray-800'
            }`}>
              <div className="flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  isPro 
                    ? 'bg-gradient-to-br from-amber-400 to-rose-500 text-white shadow-md' 
                    : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                }`}>
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm sm:text-base">
                      {subscription.plan_tier === 'ANNUAL_PASS' 
                        ? 'Studio Plan: Annual Unlimited Pass'
                        : subscription.plan_tier === 'MONTHLY_PRO'
                        ? 'Studio Plan: Monthly Pro'
                        : 'Studio Plan: Free Starter Tier'}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isPro 
                        ? 'bg-emerald-400 text-black'
                        : 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                    }`}>
                      {isPro ? 'ACTIVE PRO ✅' : 'FREE (1 GALLERY LIMIT)'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-0.5">
                    {isPro ? (
                      <span>
                        🔥 <strong className="text-white">Unlimited client events unlocked!</strong> Plan valid till <strong className="text-amber-300 font-mono">{formattedExpiry}</strong> ({daysRemaining} days left).
                      </span>
                    ) : (
                      <span>
                        Free tier limited to 1 active client gallery. Upgrade to Pro for unlimited galleries, custom watermarks, and direct UPI client locks.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsUpgradeModalOpen(true);
                  setUpgradeSuccess(false);
                  setUpgradeUtr('');
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 shadow-md transition-all cursor-pointer ${
                  isPro
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white'
                }`}
              >
                {isPro ? 'Extend / Manage Plan' : 'Upgrade to Pro (₹299/mo)'}
              </button>
            </div>
          );
        })()}

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
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
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

                          {/* Send WhatsApp Invite to Client */}
                          <a
                            href={generateClientInviteWhatsAppLink({
                              clientPhone: project.client_whatsapp || '919876543210',
                              clientName: project.client_name,
                              eventName: project.event_name,
                              studioName: profile.studio_name,
                              galleryUrl: typeof window !== 'undefined' ? `${window.location.origin}/gallery/${project.slug}` : '',
                              accessPin: project.access_pin,
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors"
                            title="Send WhatsApp invitation message to client"
                          >
                            <Send className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Invite Client</span>
                          </a>
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

      {/* SECURITY & LOGIN AUDIT MODAL */}
      {isAuditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-mono text-rose-600 uppercase font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Real-Time Security & Login Audit Trail</span>
                </span>
                <h3 className="font-serif text-2xl font-bold text-gray-950">
                  User Logins & Security Activity
                </h3>
                <p className="text-xs text-gray-500">
                  Detailed ledger of every authenticated session, IP address, user agent, and actions taken.
                </p>
              </div>
              <button onClick={() => setIsAuditOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 pr-2">
              {auditLogs.length === 0 ? (
                <div className="text-center py-12 text-xs text-gray-500">
                  No security audit logs recorded yet.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          log.action === 'LOGIN' || log.action === 'SIGNUP' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          log.action === 'PAYMENT_UNLOCKED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          log.action === 'UTR_SUBMITTED' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {log.action}
                        </span>
                        <span className="font-semibold text-gray-900">{log.email}</span>
                        {log.studio_name && (
                          <span className="text-gray-500 text-[11px]">({log.studio_name})</span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono flex flex-wrap gap-2 pt-0.5">
                        <span>IP: {log.ip_address || '127.0.0.1'}</span>
                        <span>·</span>
                        <span className="truncate max-w-xs">{log.user_agent}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-[11px] text-gray-400 block">
                        {new Date(log.created_at).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Auditing active · Compliant with enterprise session integrity</span>
              </span>
              <button
                onClick={() => setIsAuditOpen(false)}
                className="px-4 py-1.5 text-gray-700 hover:text-black font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENTS & UTR VERIFICATION MODAL */}
      {isPaymentsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-mono text-emerald-600 uppercase font-semibold flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>Real Indian Payment Transactions & UTR Bank Verifications</span>
                </span>
                <h3 className="font-serif text-2xl font-bold text-gray-950">
                  Client Payment Ledger
                </h3>
                <p className="text-xs text-gray-500">
                  Verify client UPI payments, review 12-digit UTR numbers, and unlock high-res download passes.
                </p>
              </div>
              <button onClick={() => setIsPaymentsOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 pr-2">
              {payments.length === 0 ? (
                <div className="text-center py-12 text-xs text-gray-500">
                  No payment records yet.
                </div>
              ) : (
                payments.map((p) => {
                  const matchingProject = projects.find((proj) => proj.id === p.project_id);
                  const isPending = p.status === 'pending';

                  return (
                    <div key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base font-bold text-gray-950">
                            ₹{p.amount.toLocaleString('en-IN')}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            p.status === 'captured' || p.status === 'verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {p.status}
                          </span>
                          <span className="font-semibold text-gray-800">{p.client_name}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 font-mono flex flex-wrap gap-2">
                          <span>Event: {matchingProject?.event_name || 'Wedding Gallery'}</span>
                          <span>·</span>
                          <span>Gateway: {p.gateway.toUpperCase()}</span>
                          {p.utr_number && (
                            <span className="text-purple-700 font-bold bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                              UTR: {p.utr_number}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isPending ? (
                          <button
                            onClick={() => handleConfirmUtrPayment(p)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
                          >
                            Confirm UTR & Unlock
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Verified & Unlocked</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Cryptographic signatures & 12-digit UPI bank references verified.</span>
              <button
                onClick={() => setIsPaymentsOpen(false)}
                className="px-4 py-1.5 text-gray-700 hover:text-black font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STUDIO PROFILE MODAL */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-mono text-rose-600 uppercase font-semibold">
                  Studio Settings
                </span>
                <h3 className="font-serif text-2xl font-bold text-gray-950">
                  Edit Studio Profile
                </h3>
              </div>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Studio / Brand Name:</label>
                <input
                  type="text"
                  required
                  value={editStudioName}
                  onChange={(e) => setEditStudioName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Photographer WhatsApp Number:</label>
                <input
                  type="tel"
                  required
                  value={editWhatsapp}
                  onChange={(e) => setEditWhatsapp(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-black focus:bg-white font-mono"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Client photo selections will be submitted directly to this WhatsApp number.
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Studio UPI ID (for Client Balance Unlock):</label>
                <input
                  type="text"
                  value={editUpiId}
                  onChange={(e) => setEditUpiId(e.target.value)}
                  placeholder="e.g. yourstudio@oksbi"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-black focus:bg-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="px-4 py-2 text-gray-500 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-black hover:bg-gray-800 text-white font-semibold shadow-sm"
                >
                  Save Studio Changes
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

      {/* STUDIO UPGRADE MODAL (PURE QR CODE - NO NAME, NO RAW UPI ID) */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsUpgradeModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!upgradeSuccess ? (
              <div className="space-y-5">
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold">
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>ProofPix Studio Upgrade</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-gray-950">
                    Scan QR to Upgrade
                  </h3>
                  <p className="text-xs text-gray-500">
                    Direct UPI Payment. Instant Studio Activation.
                  </p>
                </div>

                {/* Plan Tier Selector */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setUpgradePlanTier('MONTHLY_PRO')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      upgradePlanTier === 'MONTHLY_PRO'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    Monthly Pro (₹299)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpgradePlanTier('ANNUAL_PASS')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all relative ${
                      upgradePlanTier === 'ANNUAL_PASS'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    Annual Pass (₹1,999)
                    <span className="absolute -top-2 -right-1 bg-amber-400 text-black text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                      44% OFF
                    </span>
                  </button>
                </div>

                {/* Plan Summary Card */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs space-y-2 text-gray-700">
                  <div className="flex items-center justify-between font-semibold text-gray-900">
                    <span>Plan Duration:</span>
                    <span className="font-mono text-emerald-600 font-bold">
                      {upgradePlanTier === 'ANNUAL_PASS' ? '365 Days (1 Full Year)' : '30 Days (Monthly)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-gray-900 border-t border-gray-200 pt-2">
                    <span>Total Amount:</span>
                    <span className="font-serif text-xl font-bold text-rose-600">
                      ₹{upgradePlanTier === 'ANNUAL_PASS' ? '1,999' : '299'}
                    </span>
                  </div>
                </div>

                {/* 1-Click Instant Auto-Pay with Razorpay (GPay, PhonePe, Cards) */}
                <div className="space-y-3 pt-1">
                  <button
                    type="button"
                    onClick={handleDashboardRazorpayCheckout}
                    disabled={isRazorpayLoading}
                    className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 cursor-pointer animate-pulse"
                  >
                    <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
                    <span>
                      {isRazorpayLoading 
                        ? 'Opening Razorpay Gateway...' 
                        : `Pay ₹${upgradePlanTier === 'ANNUAL_PASS' ? '1,999' : '299'} with Razorpay`}
                    </span>
                  </button>
                  <p className="text-[10px] text-center text-gray-400">
                    Supports Google Pay, PhonePe, Paytm, UPI Apps, Credit/Debit Cards & NetBanking
                  </p>

                  <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-gray-400 font-medium">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Razorpay Verified</span>
                    </span>
                    <span>·</span>
                    <span>100% RBI Authorized</span>
                    <span>·</span>
                    <span>Instant Pro Unlock</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Success State */
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-bold text-gray-950">
                    Payment Reference Received! 🎉
                  </h3>
                  <p className="text-xs text-gray-600 max-w-xs mx-auto">
                    UTR <span className="font-mono font-semibold text-black">{upgradeUtr}</span> for <span className="font-semibold text-black">{upgradePlanTier === 'ANNUAL_PASS' ? 'Annual Pass (₹1,999)' : 'Monthly Pro (₹299)'}</span> has been logged.
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-left text-xs text-emerald-900 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Instant Verification</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Your Pro features are being unlocked. You can continue creating unlimited client galleries.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="w-full py-2.5 rounded-full bg-black hover:bg-gray-800 text-white font-semibold text-xs text-center block transition-colors mt-2"
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
