import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-sm space-y-8">
        <div className="border-b border-gray-100 pb-6">
          <Link href="/" className="text-xs font-semibold text-rose-600 hover:text-rose-700">
            ← Back to ProofPix
          </Link>
          <h1 className="font-serif text-3xl font-bold text-gray-950 mt-3">Contact Us</h1>
          <p className="text-xs text-gray-500 mt-1">We are here to support your creative studio 24x7.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div className="font-semibold text-xs text-gray-900">Email Support</div>
            <div className="text-xs text-gray-600 font-mono">support@proofpix.in</div>
            <p className="text-[11px] text-gray-400">Response within 2-4 hours</p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="font-semibold text-xs text-gray-900">WhatsApp VIP Desk</div>
            <div className="text-xs text-gray-600 font-mono">+91 98765 43210</div>
            <p className="text-[11px] text-gray-400">Instant chat assistance</p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div className="font-semibold text-xs text-gray-900">Support Hours</div>
            <div className="text-xs text-gray-600">Monday to Saturday: 9:00 AM – 8:00 PM IST</div>
            <p className="text-[11px] text-gray-400">Sunday on-call for active weddings</p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="font-semibold text-xs text-gray-900">Headquarters</div>
            <div className="text-xs text-gray-600">ProofPix Technologies, India</div>
            <p className="text-[11px] text-gray-400">Serving Indian Photographers Nationwide</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>ProofPix · Cloud Client Galleries with Zero Server Storage</span>
          <Link href="/" className="font-semibold text-black hover:underline">
            Visit Homepage →
          </Link>
        </div>
      </div>
    </div>
  );
}
