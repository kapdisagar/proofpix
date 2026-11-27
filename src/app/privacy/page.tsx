import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-6">
          <Link href="/" className="text-xs font-semibold text-rose-600 hover:text-rose-700">
            ← Back to ProofPix
          </Link>
          <h1 className="font-serif text-3xl font-bold text-gray-950 mt-3">Privacy Policy</h1>
          <p className="text-xs text-gray-500 mt-1">Last Updated: November 2026</p>
        </div>

        <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
          <p>
            At ProofPix, accessible from https://proofpix-six.vercel.app, one of our main priorities is the privacy of our visitors and registered studio photographers.
          </p>

          <h2 className="font-bold text-sm text-gray-900 pt-2">1. Information We Collect</h2>
          <p>
            When you register for an account or create a gallery, we may collect your name, email address, studio name, and contact details. For transaction verification, we collect bank reference (UTR) numbers and Razorpay payment identifiers.
          </p>

          <h2 className="font-bold text-sm text-gray-900 pt-2">2. Zero Server Photo Storage</h2>
          <p>
            ProofPix does NOT store, download, or retain your raw client photographs on our servers. Images stream directly from your authorized Google Drive folder to your client's web browser using high-speed thumbnail caching.
          </p>

          <h2 className="font-bold text-sm text-gray-900 pt-2">3. Payment Security & Data</h2>
          <p>
            We do not store credit card, debit card, or banking passwords on our servers. All online transactions are handled through Razorpay's PCI-DSS Level 1 compliant secure payment gateway.
          </p>

          <h2 className="font-bold text-sm text-gray-900 pt-2">4. Log Files & Audit Data</h2>
          <p>
            ProofPix follows standard log file procedures. The information gathered includes internet protocol (IP) addresses, browser type, and timestamps to prevent fraudulent unlocks and unauthorized account tampering.
          </p>

          <h2 className="font-bold text-sm text-gray-900 pt-2">5. User Rights & Data Portability (DPDP Act, 2023)</h2>
          <p>
            Under the Digital Personal Data Protection Act, 2023, you have the right to access, correct, export, or request deletion of your personal studio data and audit records at any time from your studio profile or by writing to our compliance officer.
          </p>

          <h2 className="font-bold text-sm text-gray-900 pt-2">6. Grievance Officer & Contact</h2>
          <p>
            If you have questions regarding this Privacy Policy or data processing, contact our Grievance Officer at <strong className="text-gray-900">grievance@proofpix.in</strong> or <strong className="text-gray-900">privacy@proofpix.in</strong>. Registered Office: ProofPix Technologies Private Limited, Indiranagar, Bengaluru, Karnataka 560038, India.
          </p>

          <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-500">
            <div>ProofPix Data Protection Desk</div>
            <div className="flex gap-3">
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
              <Link href="/refund-policy" className="hover:underline">Refund Policy</Link>
              <Link href="/shipping" className="hover:underline">Shipping Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
