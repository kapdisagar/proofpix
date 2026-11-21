'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[ProofPix Uncaught Error Boundary]:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 p-8 shadow-xl space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-rose-600">
            System Resilience Recovery
          </span>
          <h2 className="font-serif text-2xl font-bold text-gray-950">
            Something unexpected occurred
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            ProofPix prevented an application crash. You can reload this view or return safely to the home page.
          </p>
        </div>

        {error?.digest && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-[11px] font-mono text-gray-600">
            Reference ID: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
