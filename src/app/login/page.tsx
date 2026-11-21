'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, Sparkles, ArrowRight, Lock, Mail, Smartphone, Building, IndianRupee } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { saveLocalProfile, INITIAL_PROFILE } from '@/lib/mockStore';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studioName, setStudioName] = useState('The Royal Frames Studio');
  const [whatsapp, setWhatsapp] = useState('919876543210');
  const [upiId, setUpiId] = useState('royalstudio@oksbi');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              studio_name: studioName,
              whatsapp_number: whatsapp,
              upi_id: upiId,
            },
          },
        });

        if (error) {
          // If Supabase is unconfigured or returns an error, gracefully persist local profile and proceed
          console.warn('Supabase auth fallback:', error.message);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.warn('Supabase auth fallback:', error.message);
        }
      }

      // Save active studio profile locally for demo session
      saveLocalProfile({
        id: 'photographer-active',
        studio_name: studioName || 'The Royal Frames Studio',
        whatsapp_number: whatsapp || '919876543210',
        upi_id: upiId || 'royalstudio@oksbi',
      });

      router.push('/dashboard');
    } catch (err: any) {
      console.warn('Auth exception, continuing to dashboard:', err);
      saveLocalProfile({
        id: 'photographer-active',
        studio_name: studioName || 'The Royal Frames Studio',
        whatsapp_number: whatsapp || '919876543210',
        upi_id: upiId || 'royalstudio@oksbi',
      });
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    saveLocalProfile(INITIAL_PROFILE);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-serif text-xl font-bold group-hover:scale-105 transition-transform shadow-sm">
            P
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-gray-950">ProofPix</span>
        </Link>
        <h2 className="font-serif text-2xl font-bold text-gray-900 tracking-tight">
          {isSignUp ? 'Create Your Studio Account' : 'Sign In to Studio Dashboard'}
        </h2>
        <p className="text-xs text-gray-500">
          Turn your Google Drive into a high-converting client gallery.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-200 sm:rounded-2xl sm:px-10 space-y-6">
          {/* Quick Demo Access Pill */}
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-rose-700 font-bold uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>Instant Evaluation</span>
              </span>
              <span className="text-[10px] bg-rose-200/60 text-rose-800 px-2 py-0.5 rounded-full font-semibold">
                No Password Needed
              </span>
            </div>
            <p className="text-xs text-rose-900 leading-snug">
              Want to test the Photographer Dashboard immediately with pre-loaded royal wedding galleries?
            </p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full mt-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>1-Click Studio Demo Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400 font-mono text-[10px]">Or continue with credentials</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs">
                {errorMsg}
              </div>
            )}

            {isSignUp && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Studio / Brand Name</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={studioName}
                      onChange={(e) => setStudioName(e.target.value)}
                      placeholder="e.g. The Royal Frames Studio"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-black focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Studio WhatsApp Number (for Client Summaries)</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="e.g. 919876543210"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-black focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Studio UPI ID (for Balance Payment Unlock)</label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourstudio@oksbi"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-black focus:bg-white"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="photographer@studio.com"
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-black focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-black focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-gray-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : isSignUp ? 'Create Studio Account' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-rose-600 hover:underline font-medium"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create Studio Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
