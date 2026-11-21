import React from 'react';
import Link from 'next/link';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="border-b border-gray-100 pb-6">
          <Link href="/" className="text-xs font-semibold text-rose-600 hover:text-rose-700">
            ← Back to ProofPix
          </Link>
          <h1 className="font-serif text-3xl font-bold text-gray-950 mt-3">Cancellation & Refund Policy</h1>
          <p className="text-xs text-gray-500 mt-1">Last Updated: November 2026</p>
        </div>

        <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
          <p>
            At ProofPix, we strive to deliver the highest quality client photo proofing software for photographers. We want you to be completely satisfied with our service.
          </p>

          <h2 className="font-bold text-sm text-gray-900 pt-2">1. 7-Day Money-Back Guarantee</h2>
          <p>
            If you are not satisfied with ProofPix Pro or Annual Pass for any technical reason, you can request a 100% full refund within <strong>7 days</strong> of your initial subscription purchase.
          </p>

          <h2 className="font-bold text-sm text-gray-900 pt-2">2. Subscription Cancellation</h2>
          <p>
            You can cancel your subscription at any time from your studio dashboard or by contacting support. Once cancelled, your Pro features will remain active until the end of your current paid billing period (30 days or 365 days), and no further charges will apply.
          </p>

          <h2 className="font-bold text-sm text-gray-900 pt-2">3. How to Request a Refund</h2>
          <p>
            To request a refund, please send an email to <strong className="text-gray-900">support@proofpix.in</strong> or WhatsApp us with your registered studio email, payment transaction ID, and reason for refund.
          </p>

          <h2 className="font-bold text-sm text-gray-900 pt-2">4. Refund Processing Time</h2>
          <p>
            Once approved, refunds are processed within <strong>5 to 7 working days</strong> and will be credited back to your original payment method (Bank Account, UPI, or Credit/Debit Card) via Razorpay.
          </p>
        </div>
      </div>
    </div>
  );
}
