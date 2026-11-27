'use client';

import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export default function WhatsAppSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    'Hi ProofPix Support Desk, I am interested in zero-storage client galleries for my photography studio.'
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5 print:hidden">
      {/* Floating Chat Tooltip Bubble */}
      {isOpen && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl p-4 max-w-xs text-xs space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-gray-900 text-xs">ProofPix Studio VIP Desk</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-black p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            Need help setting up your first Google Drive client gallery or have pricing questions? Chat with our team live!
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      )}

      {/* Main Floating Button */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-gray-200 shadow-md text-[11px] font-semibold text-gray-800 hover:text-black hover:border-gray-300 transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Need Help? Chat with us</span>
          </button>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Contact ProofPix Support on WhatsApp"
          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black flex items-center justify-center shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-105 cursor-pointer relative group"
        >
          <MessageSquare className="w-6 h-6 fill-current" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 border-2 border-white rounded-full flex items-center justify-center text-[9px] text-white font-bold">
            1
          </span>
        </button>
      </div>
    </div>
  );
}
