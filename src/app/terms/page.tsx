import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-6">
          <Link href="/" className="text-xs font-semibold text-rose-600 hover:text-rose-700">
            ← Back to ProofPix
          </Link>
          <h1 className="font-serif text-3xl font-bold text-gray-950 mt-3">Terms & Conditions</h1>
          <p className="text-xs text-gray-500 mt-1">Last Updated: November 2026</p>
        </div>

        <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
          <p>
            Welcome to ProofPix. By subscribing to or using our web-based client proofing gallery services, you agree to comply with and be bound by the following Terms & Conditions.
          </p>

          <h2 className="font-bold text-sm text-gray-900 pt-2">1. Service Description</h2>
          <p>
            ProofPix is a software-as-a-service (SaaS) platform that allows professional photographers and visual studios to curate, water-mark, and share client photo galleries hosted on public Google Drive folders without storing raw assets on ProofPix servers.
          </p>

          <h2 className="font-bold text-sm text-gray-900 pt-2">2. User Accounts & Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your studio account credentials and are responsible for all activities that occur under your account. You agree not to upload, link, or display any defamatory, offensive, or infringing media.
          </p>

          <h2 className="font-bold text-sm text-gray-900 pt-2">3. Subscription & Payments</h2>
          <p>
            ProofPix offers Monthly Pro (₹299/mo) and Annual Pass (₹1,999/yr) plans. All subscription fees are processed securely via RBI-authorized payment aggregators (including Razorpay) and direct UPI channels. Payments are billed in advance on a recurring or one-time pass basis as selected at checkout.
          </p>

          <h2 className="font-bold text-sm text-gray-900 pt-2">4. Intellectual Property</h2>
          <p>
            All media, photographs, and client selections remain the 100% intellectual property of the respective photographer and their clients. ProofPix claims zero ownership or licensing rights over user photographs.
          </p>

          <h2 className="font-bold text-sm text-gray-900 pt-2">5. Governing Law & Jurisdiction</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India, including the Information Technology Act, 2000, and the Digital Personal Data Protection (DPDP) Act, 2023. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, India.
          </p>

          <h2 className="font-bold text-sm text-gray-900 pt-2">6. Grievance Redressal Officer</h2>
          <p>
            In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the contact details of the Grievance Officer are:
          </p>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] font-mono space-y-0.5">
            <div><strong>Name:</strong> Sagar Kapdi (Compliance & Grievance Officer)</div>
            <div><strong>Company:</strong> ProofPix Technologies Private Limited</div>
            <div><strong>Email:</strong> grievance@proofpix.in</div>
            <div><strong>Address:</strong> Block B, Tech Innovation Hub, Indiranagar, Bengaluru, Karnataka 560038, India</div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-500">
            <div>Questions regarding our Terms? Contact <strong className="text-gray-900">support@proofpix.in</strong></div>
            <div className="flex gap-3">
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              <Link href="/refund-policy" className="hover:underline">Refund Policy</Link>
              <Link href="/shipping" className="hover:underline">Shipping Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
