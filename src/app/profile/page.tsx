'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Camera, ShieldCheck, User, Mail, Smartphone, Building, 
  IndianRupee, Globe, Instagram, Lock, CheckCircle2, QrCode, Crown, 
  ExternalLink, Sparkles, Save, Check, RefreshCw, AlertCircle, LogOut 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getLocalProfile, saveLocalProfile, getLocalSubscription, INITIAL_PROFILE } from '@/lib/mockStore';
import { Profile, Subscription } from '@/types/database';

const AVATAR_OPTIONS = [
  {
    id: 'opt-1',
    label: 'Studio Master',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'opt-2',
    label: 'Cinematographer',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'opt-3',
    label: 'Creative Director',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'opt-4',
    label: 'Royal Monogram',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'payments' | 'billing'>('general');

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studioName, setStudioName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [upiId, setUpiId] = useState('');
  const [razorpayLink, setRazorpayLink] = useState('');
  const [paypalLink, setPaypalLink] = useState('');
  const [driveApiKey, setDriveApiKey] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [instagram, setInstagram] = useState('');
  const [website, setWebsite] = useState('');
  const [watermark, setWatermark] = useState('');
  const [defaultPin, setDefaultPin] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');

  useEffect(() => {
    const loadedProfile = getLocalProfile();
    setProfile(loadedProfile);
    setSubscription(getLocalSubscription());

    setFullName(loadedProfile.full_name || 'Sagar Kapdi');
    setEmail(loadedProfile.email || 'sagar.kapdi@gmail.com');
    setStudioName(loadedProfile.studio_name || 'The Royal Frames Studio');
    setWhatsapp(loadedProfile.whatsapp_number || '919876543210');
    setUpiId(loadedProfile.upi_id || 'royalstudio@oksbi');
    setRazorpayLink(loadedProfile.razorpay_payment_link || 'https://rzp.io/l/royalstudio');
    setPaypalLink(loadedProfile.paypal_me_link || 'https://paypal.me/sagarkapdi');
    setDriveApiKey(loadedProfile.google_drive_api_key || '');
    setBio(loadedProfile.bio || 'Luxury Destination Wedding & Pre-wedding Cinematography.');
    setCity(loadedProfile.city || 'Udaipur & Mumbai, India');
    setInstagram(loadedProfile.instagram_handle || '@royalstudio.in');
    setWebsite(loadedProfile.website_url || 'https://royalstudio.in');
    setWatermark(loadedProfile.default_watermark || `${loadedProfile.studio_name} · Proof Copy`);
    setDefaultPin(loadedProfile.default_pin || '4829');
    setSelectedAvatar(loadedProfile.avatar_url || AVATAR_OPTIONS[0].url);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile: Profile = {
      ...profile,
      full_name: fullName.trim(),
      email: email.trim(),
      studio_name: studioName.trim(),
      whatsapp_number: whatsapp.trim(),
      upi_id: upiId.trim(),
      razorpay_payment_link: razorpayLink.trim() || null,
      paypal_me_link: paypalLink.trim() || null,
      google_drive_api_key: driveApiKey.trim() || null,
      bio: bio.trim(),
      city: city.trim(),
      instagram_handle: instagram.trim(),
      website_url: website.trim(),
      default_watermark: watermark.trim(),
      default_pin: defaultPin.trim(),
      avatar_url: selectedAvatar,
      updated_at: new Date().toISOString(),
    };

    saveLocalProfile(updatedProfile);
    setProfile(updatedProfile);
    setSavedSuccess(true);
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleSignOut = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'proofpix_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl text-gray-500 hover:text-black hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
            <div className="h-4 w-[1px] bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-gray-950">Studio Profile</span>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Business</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-full bg-black hover:bg-gray-800 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-xs animate-fadeIn">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Studio Profile & Branding changes saved successfully! Client galleries will reflect updated details.</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700">UPDATED</span>
          </div>
        )}

        {/* Profile Header Hero Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-50/60 to-transparent rounded-full pointer-events-none -mr-20 -mt-20" />
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-gray-100 shrink-0">
                <img
                  src={selectedAvatar}
                  alt={studioName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Active Studio Online">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-950">
                  {studioName}
                </h1>
                {profile.auth_provider === 'google' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-semibold text-blue-700">
                    <svg className="w-3 h-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Google Authenticated</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-mono">
                {fullName} · {email}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-600 pt-1">
                <span>📍 {city || 'India'}</span>
                <span>·</span>
                <span className="font-mono">WhatsApp: +{whatsapp}</span>
              </div>
            </div>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
            <div className="text-left md:text-right">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Membership</span>
              <span className="text-xs font-bold text-gray-900">
                {subscription?.plan_tier === 'ANNUAL_PASS' ? 'Annual Unlimited Pass' : 'Monthly Pro'}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="px-3.5 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'general'
                ? 'bg-black text-white font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Studio Identity & Google Account
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'branding'
                ? 'bg-black text-white font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Gallery Watermarks & PIN Security
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-black text-white font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            UPI Payments & QR Setup
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'billing'
                ? 'bg-black text-white font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Subscription & Cloud Storage
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* TAB 1: GENERAL & GOOGLE ACCOUNT */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Studio Logo Picker */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 md:col-span-2">
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">Studio Avatar & Brand Logo</h3>
                  <p className="text-xs text-gray-500">Pick a professional studio badge or Google profile picture displayed to clients.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {AVATAR_OPTIONS.map((av) => (
                    <div
                      key={av.id}
                      onClick={() => setSelectedAvatar(av.url)}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${
                        selectedAvatar === av.url
                          ? 'border-rose-600 bg-rose-50/30 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="w-14 h-14 rounded-full object-cover border border-white shadow-xs" />
                      <span className="text-[11px] font-semibold text-gray-800">{av.label}</span>
                      {selectedAvatar === av.url && (
                        <span className="text-[10px] bg-rose-600 text-white px-2 py-0.2 rounded-full font-bold">Selected</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal & Account Info */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="font-semibold text-sm text-gray-900">Photographer Details</h3>
                  <p className="text-xs text-gray-500">Your personal profile and account contact.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Photographer Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Google Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">City / Region</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Udaipur, Rajasthan & Mumbai"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Studio Brand & Social Info */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="font-semibold text-sm text-gray-900">Studio Brand & Social Presence</h3>
                  <p className="text-xs text-gray-500">Business name that appears on client galleries and receipts.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Studio / Brand Name</label>
                    <input
                      type="text"
                      required
                      value={studioName}
                      onChange={(e) => setStudioName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Instagram Handle</label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="@yourstudio"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Studio Bio / Specialty</label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BRANDING & WATERMARK */}
          {activeTab === 'branding' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="font-semibold text-sm text-gray-900">Default Watermark Text</h3>
                  <p className="text-xs text-gray-500">Embedded server-side on all unpaid client photo previews.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Watermark Overlay Text</label>
                    <input
                      type="text"
                      required
                      value={watermark}
                      onChange={(e) => setWatermark(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Default Client Gallery Access PIN</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={defaultPin}
                      onChange={(e) => setDefaultPin(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black font-mono"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">4 to 6 digit security code sent to couple or client.</p>
                  </div>
                </div>
              </div>

              {/* Watermark Live Preview Mockup */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
                <h3 className="font-semibold text-sm text-gray-900">Live Client Preview Mockup</h3>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900 shadow-inner flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
                    alt="Preview"
                    className="w-full h-full object-cover filter brightness-[0.9]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="transform -rotate-[28deg] bg-black/60 backdrop-blur-xs border border-white/30 text-white font-bold text-xs uppercase px-4 py-2 tracking-widest shadow-lg text-center">
                      {watermark || 'STUDIO WATERMARK'}
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/70 py-1 px-2 rounded text-[10px] text-white/80 font-mono text-center">
                    Server-Side SVG Vector Protection Active
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAYMENTS & UPI */}
          {activeTab === 'payments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="font-semibold text-sm text-gray-900">Direct Client Payout Settings</h3>
                  <p className="text-xs text-gray-500">Add your UPI ID, Razorpay Link, or PayPal link to collect client shoot payments directly into your account.</p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* UPI VPA */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Studio UPI ID (VPA)</label>
                    <div className="relative">
                      <IndianRupee className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okaxis or yourstudio@oksbi"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black font-mono font-semibold"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Supports Google Pay, PhonePe, Paytm, CRED & BHIM.</p>
                  </div>

                  {/* Razorpay Payment Link */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Studio Razorpay Payment Link / Page</label>
                    <div className="relative">
                      <ExternalLink className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={razorpayLink}
                        onChange={(e) => setRazorpayLink(e.target.value)}
                        placeholder="https://rzp.io/l/your-studio or https://pages.razorpay.com/..."
                        className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black font-mono"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Paste your Razorpay Payment Link. Clients can pay via Credit/Debit Cards, NetBanking & Wallets directly into your Razorpay account.</p>
                  </div>

                  {/* PayPal.me Link */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Studio PayPal.me Link (for NRI & Global Clients)</label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-indigo-600 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={paypalLink}
                        onChange={(e) => setPaypalLink(e.target.value)}
                        placeholder="https://paypal.me/yourusername or yourusername"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black font-mono"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">For destination weddings with NRI or international clients paying in USD/EUR/GBP.</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Studio WhatsApp Number (for payment alerts)</label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black font-mono"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Zero Platform Fees (0% Cut by ProofPix)</span>
                    </div>
                    <p>When clients pay via UPI, Razorpay, or PayPal, 100% of the funds go directly into your own bank / merchant account.</p>
                  </div>
                </div>
              </div>

              {/* Live Dynamic QR Code Card & Payment Methods Preview */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 text-center">
                <h3 className="font-semibold text-sm text-gray-900">Your Live Client Payment QR</h3>
                <p className="text-xs text-gray-500">Clients scan this inside their private gallery to clear balance.</p>
                
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 inline-block mx-auto">
                  <div className="w-40 h-40 bg-white rounded-xl border border-gray-300 p-2 flex items-center justify-center shadow-xs">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        `upi://pay?pa=${upiId || 'royalstudio@oksbi'}&pn=${encodeURIComponent(studioName)}&cu=INR`
                      )}`}
                      alt="Studio UPI QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-gray-900">{upiId || 'royalstudio@oksbi'}</div>
                <p className="text-[11px] text-gray-400">Scan with any UPI app · Real-time Dynamic Generation</p>

                {/* Direct Link Badges */}
                <div className="pt-3 border-t border-gray-100 flex flex-col gap-2 text-left">
                  <div className="text-[11px] font-semibold text-gray-700">Client Checkout Options Enabled:</div>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                      ✓ UPI QR (GPay, PhonePe, Paytm)
                    </span>
                    {razorpayLink && (
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                        ✓ Razorpay Link Active
                      </span>
                    )}
                    {paypalLink && (
                      <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium">
                        ✓ PayPal Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BILLING & SUBSCRIPTION */}
          {activeTab === 'billing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-rose-600 font-semibold">Active Plan</span>
                    <h3 className="font-serif text-2xl font-bold text-gray-950">
                      {subscription?.plan_tier === 'ANNUAL_PASS' ? 'Annual Unlimited Pass' : 'Monthly Pro'}
                    </h3>
                  </div>
                  <Crown className="w-6 h-6 text-amber-500" />
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span>Plan Status:</span>
                    <span className="font-semibold text-emerald-600 uppercase">Active ✅</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span>Client Gallery Limit:</span>
                    <span className="font-bold text-gray-900">Unlimited Galleries</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span>Storage Cost:</span>
                    <span className="font-bold text-emerald-600">₹0 (Google Drive Synced)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span>Valid Until:</span>
                    <span className="font-mono font-semibold text-gray-900">
                      {subscription?.expires_at ? new Date(subscription.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '365 Days Left'}
                    </span>
                  </div>
                </div>

                <Link
                  href="/#pricing"
                  className="w-full py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold text-xs text-center block transition-colors"
                >
                  Manage or Extend Subscription
                </Link>
              </div>

              {/* Zero-Storage Cloud Diagnostics */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <h3 className="font-semibold text-sm text-gray-900">Google Drive Zero-Storage Architecture</h3>
                  <p className="text-xs text-gray-500">Status of your high-performance cloud proxy.</p>
                </div>

                <div className="space-y-2.5 text-xs text-gray-700">
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Proxying & Caching at Edge: <strong>Active</strong></span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Server-Side Watermark Engine: <strong>SVG Vector Ready</strong></span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Razorpay Webhook Verification: <strong>HMAC SHA-256 Armed</strong></span>
                  </div>
                </div>

                {/* Optional Custom Google Drive API Key */}
                <div className="pt-3 border-t border-gray-100 space-y-1.5 text-left text-xs">
                  <label className="block text-gray-700 font-medium">Custom Google Drive API Key (Optional):</label>
                  <input
                    type="password"
                    value={driveApiKey}
                    onChange={(e) => setDriveApiKey(e.target.value)}
                    placeholder="AIzaSy... (leave blank to use ProofPix edge cloud)"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-gray-400">If provided, your client galleries fetch directly with your studio's Google Cloud quota.</p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Link
              href="/dashboard"
              className="text-xs text-gray-600 hover:text-black font-medium"
            >
              Cancel and Return
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Studio Profile</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
