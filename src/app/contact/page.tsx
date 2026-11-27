'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, 
  ShieldCheck, AlertCircle, Building2, HelpCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [studioName, setStudioName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('TECHNICAL_SUPPORT');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState<{ id: string; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          studio_name: studioName,
          email,
          phone,
          category,
          message,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTicketResult({ id: data.ticket_id, message: data.message });
        confetti({ particleCount: 60, spread: 50 });
        setName('');
        setStudioName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setErrorMessage(data.error || 'Failed to submit inquiry. Please try again.');
      }
    } catch {
      setErrorMessage('Network error while submitting inquiry. Please email support@proofpix.in directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header Bar */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Link href="/" className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1">
              ← Back to ProofPix
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950">
              Get in Touch with ProofPix
            </h1>
            <p className="text-xs text-gray-500 max-w-xl leading-relaxed">
              Have questions about Google Drive zero-storage integration, custom watermark setup, or billing? Our dedicated photographer support team is on standby 24/7.
            </p>
          </div>
          <div className="flex sm:flex-col gap-2 shrink-0">
            <a
              href="https://wa.me/919876543210?text=Hi%20ProofPix%20Team,%20I%20have%20an%20inquiry%20regarding%20client%20galleries"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Live Desk</span>
            </a>
            <span className="text-[11px] text-gray-400 text-center font-mono">Avg Reply: ~15 mins</span>
          </div>
        </div>

        {/* Grid: Contact Info Cards & Live Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Official Business Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-5">
              <h2 className="font-semibold text-sm text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-rose-600" />
                <span>Commercial Business Information</span>
              </h2>

              <div className="space-y-4 text-xs">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email Support</div>
                    <a href="mailto:support@proofpix.in" className="text-rose-600 hover:underline font-mono">
                      support@proofpix.in
                    </a>
                    <div className="text-[11px] text-gray-400">Direct studio ticketing queue</div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">VIP WhatsApp Desk</div>
                    <div className="text-gray-700 font-mono">+91 98765 43210</div>
                    <div className="text-[11px] text-gray-400">Quick assistance during live wedding shoots</div>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Operating Hours</div>
                    <div className="text-gray-700">Monday – Saturday: 9:00 AM – 8:00 PM IST</div>
                    <div className="text-[11px] text-gray-400">Emergency weekend coverage for active shoots</div>
                  </div>
                </div>

                {/* Headquarters */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Registered Corporate Office</div>
                    <div className="text-gray-700 leading-snug">
                      ProofPix Technologies Private Limited<br />
                      Block B, Tech Innovation Hub, Indiranagar<br />
                      Bengaluru, Karnataka 560038, India
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grievance Redressal Box */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-gray-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Grievance Redressal Officer</span>
              </div>
              <p className="text-gray-500 text-[11px]">
                Under Rule 3(2) of the Information Technology Rules, 2021 & DPDP Act 2023:
              </p>
              <div className="pt-1 text-[11px] text-gray-700 space-y-0.5 font-mono">
                <div><strong>Officer:</strong> Sagar Kapdi (Compliance Officer)</div>
                <div><strong>Email:</strong> grievance@proofpix.in</div>
                <div><strong>Response SLA:</strong> Acknowledged within 24 hours</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Support Ticket Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="font-serif text-xl font-bold text-gray-950">Send an Inquiry or Support Ticket</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Fill in your details below and our technical leads will reach out directly.
                </p>
              </div>

              {ticketResult ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
                      Ticket Generated: {ticketResult.id}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-emerald-950 mt-1">
                      Inquiry Received Successfully!
                    </h3>
                    <p className="text-xs text-emerald-800 mt-1">
                      {ticketResult.message}
                    </p>
                  </div>
                  <button
                    onClick={() => setTicketResult(null)}
                    className="px-5 py-2 rounded-full bg-black hover:bg-gray-800 text-white font-semibold text-xs transition-all cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {errorMessage && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sagar Kapdi"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Studio / Brand Name</label>
                      <input
                        type="text"
                        value={studioName}
                        onChange={(e) => setStudioName(e.target.value)}
                        placeholder="e.g. The Royal Frames"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="studio@gmail.com"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">WhatsApp / Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Inquiry Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black"
                    >
                      <option value="TECHNICAL_SUPPORT">Technical Support & Google Drive Sync</option>
                      <option value="BILLING_PAYMENT">Billing, Razorpay & Invoicing Assistance</option>
                      <option value="FEATURE_REQUEST">Feature Request / Custom Integration</option>
                      <option value="ENTERPRISE_STUDIO">Multi-User Studio / Enterprise Inquiries</option>
                      <option value="GENERAL_INQUIRY">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">How can we help you? *</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your question or issue in detail..."
                      className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:bg-white focus:border-black resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting Ticket...' : 'Send Inquiry & Create Ticket'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Footer */}
        <div className="pt-6 border-t border-gray-200 text-center text-xs text-gray-500 space-y-1">
          <div>ProofPix Technologies India · Zero-Storage Client Galleries for Photographers</div>
          <div className="flex justify-center gap-4 text-[11px]">
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <span>·</span>
            <Link href="/refund-policy" className="hover:underline">Refund Policy</Link>
            <span>·</span>
            <Link href="/shipping" className="hover:underline">Shipping & Delivery</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
