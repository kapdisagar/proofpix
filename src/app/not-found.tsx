import React from 'react';
import Link from 'next/link';
import { Camera, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 p-8 shadow-xl space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-800 flex items-center justify-center mx-auto">
          <Camera className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-rose-600">
            HTTP 404 · Page Not Found
          </span>
          <h2 className="font-serif text-2xl font-bold text-gray-950">
            Gallery or Page Not Found
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            The requested client gallery link may have expired, or the URL might be mistyped. Please check with your photographer.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="w-full py-3 px-4 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors inline-block"
          >
            <ArrowLeft className="w-4 h-4 inline mr-1" />
            <span>Return to ProofPix Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
