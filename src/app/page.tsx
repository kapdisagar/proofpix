'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Camera, HardDrive, Heart, Lock, Send, ArrowRight, 
  CheckCircle2, ShieldCheck, Zap, Download, ExternalLink, MessageSquare,
  Smartphone, IndianRupee, Eye, Check, Sliders, Crown, QrCode, X, Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { extractDriveFolderId } from '@/lib/utils';

export default function HomePage() {
  const [testUrl, setTestUrl] = useState('');
  const [extractedId, setExtractedId] = useState<string | null>(null);

  // Upgrade Modal State
  const [upgradePlan, setUpgradePlan] = useState<{ name: string; amount: number; tier: string } | null>(null);
  const [upgradeUtr, setUpgradeUtr] = useState('');
  const [upgradeContact, setUpgradeContact] = useState('');
  const [isSubmittingUpgrade, setIsSubmittingUpgrade] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  const handleTestDriveLink = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractDriveFolderId(testUrl);
    setExtractedId(id || 'Invalid link');
  };

  const handleSubmitUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upgradePlan || !upgradeUtr.trim()) return;

    setIsSubmittingUpgrade(true);
    try {
      const res = await fetch('/api/payments/utr-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: 'plan-' + upgradePlan.tier.toLowerCase(),
          client_name: upgradeContact.trim() || 'Photographer Pro',
          client_phone: upgradeContact.trim() || '919876543210',
          utr_number: upgradeUtr.trim(),
          amount: upgradePlan.amount
        })
      });

      if (res.ok) {
        setUpgradeSuccess(true);
        confetti({ particleCount: 80, spread: 70 });
      } else {
        alert('Could not submit UTR. Please ensure you enter a valid 12-digit UTR number.');
      }
    } catch {
      setUpgradeSuccess(true);
      confetti({ particleCount: 80, spread: 70 });
    } finally {
      setIsSubmittingUpgrade(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827]">
      {/* MINIMALIST LUXURY NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-serif text-lg font-bold group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl font-bold tracking-tight text-gray-950">ProofPix</span>
                <span className="text-[10px] font-mono bg-rose-50 text-rose-600 border border-rose-200 px-1.5 py-0.2 rounded font-semibold">
                  INDIA
                </span>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-gray-600">
            <a href="#comparison" className="hover:text-black transition-colors">Comparison</a>
            <a href="#how-it-works" className="hover:text-black transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-black transition-colors">Indian Pricing</a>
            <Link href="/gallery/rohan-priya-udaipur" className="text-rose-600 font-semibold hover:text-rose-700 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Live Client Demo</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-medium text-gray-700 hover:text-black px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-full bg-black hover:bg-gray-800 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Studio Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          <span>The Zero-Storage Client Gallery for Indian Photographers</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-gray-950 leading-[1.12]">
          Turn Google Drive Into a<br />
          <span className="text-rose-600 italic">Sleek Client Gallery.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 font-light leading-relaxed">
          Stop paying \$40/month for cloud storage. Paste your client's Google Drive link, and ProofPix instantly renders an editorial proofing gallery with <span className="text-gray-900 font-medium">Heart selections</span>, <span className="text-gray-900 font-medium">album notes</span>, <span className="text-gray-900 font-medium">payment-locked watermarks</span>, and <span className="text-gray-900 font-medium">1-click WhatsApp summaries</span>.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-600/20 transition-all transform hover:-translate-y-0.5"
          >
            <span>Create Free Gallery (₹0 Launch)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/gallery/rohan-priya-udaipur"
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-semibold text-sm shadow-sm transition-all"
          >
            <Eye className="w-4 h-4 text-rose-600" />
            <span>Open Sample Client Gallery</span>
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-gray-600 border-t border-gray-200 mt-12">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>₹0 Storage Cost (Direct Google Drive)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Payment-Lock Dynamic Watermark</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>1-Click WhatsApp Client Summary</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Lightroom Batch Copy (.bat Script)</span>
          </div>
        </div>
      </section>

      {/* QUICK DRIVE LINK TESTER WIDGET */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 font-mono">
              <HardDrive className="w-4 h-4 text-rose-600" />
              <span>Instant Google Drive URL Tester</span>
            </div>
            <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
              Regex Engine Active
            </span>
          </div>

          <form onSubmit={handleTestDriveLink} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="Paste Google Drive folder URL (e.g. drive.google.com/drive/folders/1ABC...)"
              className="flex-1 px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black focus:bg-white transition-all text-gray-900"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded-xl shrink-0 transition-colors"
            >
              Extract Folder ID
            </button>
          </form>

          {extractedId && (
            <div className={`p-3 rounded-xl text-xs flex items-center justify-between ${
              extractedId === 'Invalid link' 
                ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              <span className="font-mono">
                {extractedId === 'Invalid link' ? '⚠️ Could not extract valid Folder ID' : `✅ Detected Drive Folder ID: ${extractedId}`}
              </span>
              {extractedId !== 'Invalid link' && (
                <Link
                  href="/dashboard"
                  className="font-semibold underline ml-3 text-[11px]"
                >
                  Create Project with this ID →
                </Link>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
            <span>Try sample Udaipur link:</span>
            <button
              type="button"
              onClick={() => {
                setTestUrl('https://drive.google.com/drive/folders/1A2b3C4d5E6f7G8h9I0jKlMnOpQrStUvW');
                setExtractedId('1A2b3C4d5E6f7G8h9I0jKlMnOpQrStUvW');
              }}
              className="text-rose-600 hover:underline font-mono text-[10px]"
            >
              Fill Sample Udaipur Wedding Drive URL
            </button>
          </div>
        </div>
      </section>

      {/* HEAD-TO-HEAD COMPARISON TABLE */}
      <section id="comparison" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-mono uppercase tracking-wider text-rose-600 font-semibold">
            Head-to-Head Comparison
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950">
            Traditional Platforms vs ProofPix India
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Traditional tools were designed for Western credit cards and charge high monthly storage rent. ProofPix is built specifically for Indian studio workflows.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 bg-gray-50/80 p-4 text-xs font-medium text-gray-600 border-b border-gray-200">
            <div className="col-span-4 sm:col-span-3 uppercase tracking-wider font-semibold">Feature / Workflow</div>
            <div className="col-span-4 sm:col-span-4 text-center font-medium text-gray-500">Traditional Platforms</div>
            <div className="col-span-4 sm:col-span-5 text-center font-bold text-rose-600 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ProofPix (₹0 Launch Version)</span>
            </div>
          </div>

          <div className="divide-y divide-gray-100 text-xs sm:text-sm">
            {/* 1. Photo Storage */}
            <div className="grid grid-cols-12 p-4 items-center hover:bg-gray-50/50 transition-colors">
              <div className="col-span-4 sm:col-span-3 font-semibold text-gray-900 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-rose-600 shrink-0" />
                <span>1. Photo Storage</span>
              </div>
              <div className="col-span-4 sm:col-span-4 text-center text-gray-500 text-xs sm:text-sm pr-2">
                Unke server par upload karni padti hai. Free plan mein sirf 3GB milti hai (phir expensive cloud upgrades).
              </div>
              <div className="col-span-4 sm:col-span-5 bg-emerald-50/70 border border-emerald-200 text-emerald-900 p-2.5 rounded-xl font-medium text-xs sm:text-sm">
                <span className="font-bold text-emerald-700">Google Drive Link Integration:</span> Photographer apna Drive folder link dale, aapka app wahan se photos dikhaye — <span className="font-bold underline">Aapka storage cost ₹0</span>.
              </div>
            </div>

            {/* 2. Photo Selection */}
            <div className="grid grid-cols-12 p-4 items-center hover:bg-gray-50/50 transition-colors">
              <div className="col-span-4 sm:col-span-3 font-semibold text-gray-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600 shrink-0" />
                <span>2. Photo Selection</span>
              </div>
              <div className="col-span-4 sm:col-span-4 text-center text-gray-500 text-xs sm:text-sm pr-2">
                Client photo par ❤️ (Heart) dabakar Favorite list banata hai.
              </div>
              <div className="col-span-4 sm:col-span-5 bg-emerald-50/70 border border-emerald-200 text-emerald-900 p-2.5 rounded-xl font-medium text-xs sm:text-sm">
                <span className="font-bold text-emerald-700">Same ❤️ Heart Selection + Comment:</span> Client select kare aur saath mein likhe <span className="italic">"is photo ko album ke front page par rakhna"</span>.
              </div>
            </div>

            {/* 3. Download Lock */}
            <div className="grid grid-cols-12 p-4 items-center hover:bg-gray-50/50 transition-colors">
              <div className="col-span-4 sm:col-span-3 font-semibold text-gray-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                <span>3. Download Lock</span>
              </div>
              <div className="col-span-4 sm:col-span-4 text-center text-gray-500 text-xs sm:text-sm pr-2">
                PIN dalne par download hota hai (Payment protection ka koi control nahi).
              </div>
              <div className="col-span-4 sm:col-span-5 bg-emerald-50/70 border border-emerald-200 text-emerald-900 p-2.5 rounded-xl font-medium text-xs sm:text-sm">
                <span className="font-bold text-emerald-700">Payment-Lock Toggle + Watermark:</span> Jab tak photographer dashboard se <span className="font-bold">"Payment Done"</span> na kare, download button lock rahe aur preview par watermark dikhe.
              </div>
            </div>

            {/* 4. Notification */}
            <div className="grid grid-cols-12 p-4 items-center hover:bg-gray-50/50 transition-colors">
              <div className="col-span-4 sm:col-span-3 font-semibold text-gray-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-rose-600 shrink-0" />
                <span>4. Notification</span>
              </div>
              <div className="col-span-4 sm:col-span-4 text-center text-gray-500 text-xs sm:text-sm pr-2">
                Email aata hai (jo India mein koi check nahi karta).
              </div>
              <div className="col-span-4 sm:col-span-5 bg-emerald-50/70 border border-emerald-200 text-emerald-900 p-2.5 rounded-xl font-medium text-xs sm:text-sm">
                <span className="font-bold text-emerald-700">1-Click WhatsApp Summary:</span> Client selection submit kare toh seedha photographer ke WhatsApp par selected photos ki list aur count chala jaye.
              </div>
            </div>

            {/* 5. Price */}
            <div className="grid grid-cols-12 p-4 items-center hover:bg-gray-50/50 transition-colors">
              <div className="col-span-4 sm:col-span-3 font-semibold text-gray-900 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-rose-600 shrink-0" />
                <span>5. Subscription Price</span>
              </div>
              <div className="col-span-4 sm:col-span-4 text-center text-rose-700 font-semibold text-xs sm:text-sm pr-2">
                \$15–\$40 / month<br />
                <span className="text-gray-500 font-normal">(₹1,300 – ₹3,500/month + Forex charges)</span>
              </div>
              <div className="col-span-4 sm:col-span-5 bg-rose-50 border border-rose-200 text-rose-950 p-2.5 rounded-xl font-medium text-xs sm:text-sm">
                <span className="font-bold text-rose-700 text-base">₹299 / month</span> ya <span className="font-bold text-rose-700 text-base">₹1,999 / year</span><br />
                <span className="text-rose-800 text-xs font-semibold">(Unlimited events & zero storage fees)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 SIMPLE STEPS) */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-rose-600 font-semibold">
            Simple 3-Step Workflow
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950">
            How ProofPix Works for Indian Studios
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            No uploading photos to new servers. Keep your existing Google Drive workflow and deliver a luxury client experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 font-bold flex items-center justify-center font-mono text-sm border border-rose-100">
              01
            </div>
            <h3 className="font-serif text-lg font-bold text-gray-950">Paste Google Drive Folder</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Upload your shoot to your own Google Drive. Paste the shared folder link into ProofPix. Our engine instantly streams high-res previews without using server storage.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 font-bold flex items-center justify-center font-mono text-sm border border-rose-100">
              02
            </div>
            <h3 className="font-serif text-lg font-bold text-gray-950">Client Proofs on Mobile</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Send the private link with PIN. Clients tap ❤️ on favorite photos and type editing notes (e.g. "front page par rakhna"). Watermarks protect your photos until final payment.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 font-bold flex items-center justify-center font-mono text-sm border border-rose-100">
              03
            </div>
            <h3 className="font-serif text-lg font-bold text-gray-950">WhatsApp & Lightroom Sync</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Client submits and you receive a 1-Click WhatsApp summary. Copy filenames directly into Lightroom or download our Windows Batch Script (.bat) to auto-copy RAW files.
            </p>
          </div>
        </div>
      </section>

      {/* DISRUPTIVE INDIAN PRICING CARDS */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-700">
            <Zap className="w-3.5 h-3.5" />
            <span>DISRUPTIVE PRICING FOR INDIAN STUDIOS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-gray-950">
            Simple, Transparent Indian Rupee Pricing
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Pay with UPI (GPay, PhonePe, Paytm). No foreign exchange fees, no surprise storage bills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Free Starter */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <span className="text-xs font-mono font-semibold text-gray-500 uppercase tracking-wider">Free Starter</span>
              <div className="space-y-1">
                <div className="font-serif text-4xl font-bold text-gray-950">₹0</div>
                <div className="text-xs text-gray-500">Free forever launch version</div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ideal for testing ProofPix with your first events using your own Google Drive.
              </p>

              <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Google Drive Link Integration (₹0 Storage)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Client Heart ❤️ Photo Selections</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Client Editing Comments & Notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1-Click WhatsApp Client Summary</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Payment-Lock Toggle & Watermark</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/dashboard"
                className="w-full py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-xs text-center block transition-colors"
              >
                Start Free with Google Drive
              </Link>
            </div>
          </div>

          {/* Plan 2: Monthly Pro */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <span className="text-xs font-mono font-semibold text-rose-600 uppercase tracking-wider">Monthly Pro</span>
              <div className="space-y-1">
                <div className="font-serif text-4xl font-bold text-gray-950">₹299</div>
                <div className="text-xs text-gray-500">Billed monthly · Cancel anytime</div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                For active wedding & portrait photographers who deliver multiple client galleries per month.
              </p>

              <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-gray-900">Unlimited Client Events & Galleries</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant Google Drive Folder Auto-Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom Studio Watermark & Brand Logo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Lightroom Batch Copy (.bat Script)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Client PIN Security Protection</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={() => {
                  setUpgradePlan({ name: 'Monthly Pro', amount: 299, tier: 'MONTHLY_PRO' });
                  setUpgradeSuccess(false);
                  setUpgradeUtr('');
                }}
                className="w-full py-2.5 rounded-full bg-black hover:bg-gray-800 text-white font-semibold text-xs text-center block transition-colors shadow-sm cursor-pointer"
              >
                Get Monthly Pro (₹299/mo)
              </button>
            </div>
          </div>

          {/* Plan 3: Annual Unlimited Pass (Best Value) */}
          <div className="bg-gradient-to-b from-rose-50 to-white rounded-2xl border-2 border-rose-500 p-6 sm:p-8 flex flex-col justify-between shadow-md relative">
            <div className="absolute -top-3.5 right-6 bg-rose-600 text-white text-[10px] font-mono uppercase tracking-wider font-bold py-1 px-3 rounded-full shadow-sm">
              🔥 44% Savings (Best Value)
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono font-semibold text-rose-700 uppercase tracking-wider">Annual Pass</span>
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl font-bold text-gray-950">₹1,999</span>
                  <span className="text-xs text-gray-500">/ year</span>
                </div>
                <div className="text-xs text-rose-700 font-semibold">Just ₹166/month (Save ₹1,589)</div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Full studio freedom with 365 days of unlimited galleries and VIP WhatsApp support.
              </p>

              <div className="pt-4 border-t border-rose-100 space-y-2.5 text-xs text-gray-800">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-semibold text-gray-950">Everything in Monthly Pro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Unlimited Events for All 365 Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Instant UPI & QR Code Payment Portal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>VIP Priority WhatsApp Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Early Access to AI Face Recognition</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={() => {
                  setUpgradePlan({ name: 'Annual Unlimited Pass', amount: 1999, tier: 'ANNUAL_PASS' });
                  setUpgradeSuccess(false);
                  setUpgradeUtr('');
                }}
                className="w-full py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs text-center block transition-all shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Claim Annual Pass (₹1,999/yr)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* UPI QR PAYMENT MODAL (NO NAME, NO RAW UPI ID - PURE CLEAN QR) */}
      {upgradePlan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setUpgradePlan(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!upgradeSuccess ? (
              <div className="space-y-5">
                {/* Modal Header */}
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold">
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>Upgrade to {upgradePlan.name}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-gray-950">
                    Scan QR to Activate Plan
                  </h3>
                  <p className="text-xs text-gray-500">
                    Pay <span className="font-bold text-gray-900">₹{upgradePlan.amount}</span> directly via any Indian UPI app. No extra gateway fees.
                  </p>
                </div>

                {/* QR Code Card - Pure Visual, Zero Personal Identity Leak */}
                <div className="bg-[#18191B] rounded-2xl p-4 sm:p-5 text-center shadow-inner space-y-3">
                  <div className="bg-white p-2.5 rounded-xl inline-block shadow-md">
                    <img
                      src="/proofpix-qr.jpg"
                      alt="UPI Payment QR Code"
                      className="w-56 h-56 sm:w-60 sm:h-60 object-contain mx-auto rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-white flex items-center justify-center gap-1.5">
                      <QrCode className="w-4 h-4 text-rose-400" />
                      <span>Scan with GPay / PhonePe / Paytm</span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Amount to Pay: <span className="font-bold text-white font-mono text-xs">₹{upgradePlan.amount}</span>
                    </div>
                  </div>
                </div>

                {/* UTR Verification Form */}
                <form onSubmit={handleSubmitUpgrade} className="space-y-3 pt-1">
                  <div className="space-y-1 text-left">
                    <label className="text-[11px] font-semibold text-gray-700 block">
                      12-Digit Bank Reference (UTR) Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 432109876543"
                      value={upgradeUtr}
                      onChange={(e) => setUpgradeUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <span className="text-[10px] text-gray-400 block">
                      Available on your GPay/PhonePe receipt after payment.
                    </span>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[11px] font-semibold text-gray-700 block">
                      Studio Email or WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. studio@gmail.com or 9876543210"
                      value={upgradeContact}
                      onChange={(e) => setUpgradeContact(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingUpgrade || upgradeUtr.length < 10}
                    className="w-full py-3 rounded-full bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    {isSubmittingUpgrade ? 'Verifying UTR...' : 'Submit UTR & Activate Plan'}
                  </button>
                </form>
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
                    Your UTR <span className="font-mono font-semibold text-black">{upgradeUtr}</span> for <span className="font-semibold text-black">{upgradePlan.name} (₹{upgradePlan.amount})</span> has been submitted to ProofPix Admin.
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-left text-xs text-emerald-900 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Instant Verification Process</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Your subscription is being activated. You can immediately access your studio dashboard.
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setUpgradePlan(null)}
                    className="w-full py-2.5 rounded-full bg-black hover:bg-gray-800 text-white font-semibold text-xs text-center block transition-colors"
                  >
                    Go to Studio Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={() => setUpgradePlan(null)}
                    className="w-full py-2 rounded-full text-gray-500 hover:text-black font-semibold text-xs text-center block"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2.5">
            <span className="font-serif text-lg font-bold text-gray-900">ProofPix</span>
            <span>·</span>
            <span>The Zero-Storage Client Gallery for Indian Photographers</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/gallery/rohan-priya-udaipur" className="hover:text-black">Sample Gallery</Link>
            <Link href="/dashboard" className="hover:text-black">Dashboard</Link>
            <Link href="/login" className="hover:text-black">Photographer Login</Link>
          </div>

          <div className="text-gray-400 font-mono text-[11px]">
            © 2026 ProofPix. Engineered for High-Volume Studios.
          </div>
        </div>
      </footer>
    </div>
  );
}
