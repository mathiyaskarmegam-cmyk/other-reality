import React, { useState } from 'react';
import { isSupabaseConfigured, getSupabaseConfig } from '../../lib/supabase';
import { Database, CheckCircle2, AlertCircle, Copy, ExternalLink, X, ShieldCheck } from 'lucide-react';

export const BackendStatusPill: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isConnected = isSupabaseConfigured();
  const config = getSupabaseConfig();

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(`VITE_SUPABASE_URL=https://your-id.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono border transition-all cursor-pointer focus:outline-none bg-white hover:bg-stone-50"
        title="Click to view Supabase connection status & migration details"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
          }`}
        />
        <span className="text-stone-600 font-sans">
          {isConnected ? 'Supabase Live' : 'Supabase Ready to Connect'}
        </span>
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-float border border-[#E5E2D9] relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-medium text-sanctuary-900">
                  Supabase Integration Status
                </h3>
                <p className="text-xs text-stone-500">
                  {isConnected ? 'Active Cloud Connection' : 'Persistent Local Evaluation Mode'}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800">Connection State:</span>
                  <span
                    className={`inline-flex items-center space-x-1 font-medium ${
                      isConnected ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Connected to {config.url}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Pending environment variables</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-stone-200">
                  <span className="font-semibold text-stone-800">Architecture:</span>
                  <span>Supabase Auth, Database (PostgreSQL), RLS, Storage</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-stone-200">
                  <span className="font-semibold text-stone-800">SQL Migration:</span>
                  <span className="font-mono text-[11px] text-stone-600">
                    supabase/migrations/20261111000000_the_other_reality.sql
                  </span>
                </div>
              </div>

              {!isConnected && (
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-amber-900 space-y-2">
                  <p className="font-medium">
                    To connect your live Supabase project:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-800">
                    <li>Create a project on Supabase.</li>
                    <li>
                      Run the provided SQL migration in the Supabase SQL Editor.
                    </li>
                    <li>Create the storage bucket <code className="bg-white/80 px-1 py-0.5 rounded">experience-images</code>.</li>
                    <li>Add your keys to <code className="bg-white/80 px-1 py-0.5 rounded">.env</code>:</li>
                  </ol>
                  <div className="relative mt-2">
                    <pre className="bg-stone-900 text-stone-100 p-2.5 rounded-xl font-mono text-[10px] overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
                    </pre>
                    <button
                      onClick={handleCopyEnv}
                      className="absolute top-2 right-2 p-1 rounded bg-stone-700 hover:bg-stone-600 text-stone-200 text-[10px] flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-[#F7F5F0] border border-[#EAE7E0] text-[11px] text-stone-600">
                <div className="flex items-center space-x-1.5 font-medium text-stone-800 mb-1">
                  <ShieldCheck className="w-4 h-4 text-stone-700" />
                  <span>RLS Security Enforced</span>
                </div>
                Row Level Security strictly segregates private authentication email from public pseudonyms. Public feeds never expose private user accounts, and deletion operations require user ownership verification.
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-full bg-sanctuary-900 text-white text-xs font-medium hover:bg-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

