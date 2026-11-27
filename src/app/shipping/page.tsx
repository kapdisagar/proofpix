import React from 'react';
import Link from 'next/link';
import { Truck, CheckCircle2, Zap, Clock, ShieldCheck, Mail } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm space-y-8">
        {/* Header */}
        <div className="border-b border-gray-100 pb-6">
          <Link href="/" className="text-xs font-semibold text-rose-600 hover:text-rose-700">
            ← Back to ProofPix
          </Link>
          <div className="flex items-center gap-2 mt-3">
            <h1 className="font-serif text-3xl font-bold text-gray-950">Shipping & Delivery Policy</h1>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-semibold">
              Digital Service
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Last Updated: November 2026 · Compliant with RBI & Merchant Guidelines</p>
        </div>

        {/* Overview Banner */}
        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm text-gray-900">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>100% Instant Digital Fulfillment</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            ProofPix is a cloud-hosted software application (Software-as-a-Service). We do not manufacture, package, or physically ship any tangible goods. All services, subscriptions, and digital access passes are provisioned electronically immediately upon successful online payment confirmation.
          </p>
        </div>

        {/* Policy Details */}
        <div className="space-y-6 text-xs text-gray-700 leading-relaxed">
          <div>
            <h2 className="font-bold text-sm text-gray-900 mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>1. Delivery Timeline</span>
            </h2>
            <p>
              Subscription upgrades (Monthly Pro and Annual Unlimited Pass) are activated <strong>instantly (within 0 to 60 seconds)</strong> upon receipt of payment confirmation from Razorpay, UPI, or PayPal. Your studio dashboard is unlocked immediately, and an automated electronic receipt/invoice is generated in your account.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-sm text-gray-900 mb-1 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>2. Mode of Delivery & Access Details</span>
            </h2>
            <p>
              Access credentials and activation confirmations are delivered via:
            </p>
            <ul className="list-disc pl-5 mt-1.5 space-y-1 text-gray-600">
              <li>Instant in-app session upgrade on your verified ProofPix account dashboard.</li>
              <li>Official transaction confirmation sent to your registered studio email address.</li>
              <li>Optional WhatsApp confirmation alert sent to your studio contact number.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-sm text-gray-900 mb-1 flex items-center gap-2">
              <Truck className="w-4 h-4 text-rose-600" />
              <span>3. Shipping Charges</span>
            </h2>
            <p>
              Since ProofPix operates purely as an electronic digital platform, there are <strong>zero shipping, packaging, handling, or courier charges</strong>. The price displayed at checkout is the complete and final subscription fee.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-sm text-gray-900 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>4. Non-Receipt or Activation Assistance</span>
            </h2>
            <p>
              If your payment was debited but your Pro subscription has not activated within 5 minutes due to network latency, please reach out to our 24/7 Studio VIP Desk:
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
              <div><strong>Email:</strong> support@proofpix.in</div>
              <div><strong>WhatsApp Desk:</strong> +91 98765 43210</div>
              <div><strong>Operating Hours:</strong> Monday – Saturday: 9:00 AM – 8:00 PM IST</div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>ProofPix Technologies India · Cloud Photography SaaS</span>
          <Link href="/terms" className="font-semibold text-rose-600 hover:underline">
            Read Terms & Conditions →
          </Link>
        </div>
      </div>
    </div>
  );
}
