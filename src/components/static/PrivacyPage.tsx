import React from 'react';
import { ShieldCheck, Eye, Camera, AlertTriangle, FileText, ArrowLeft } from 'lucide-react';

interface PrivacyPageProps {
  onBack: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to sanctuary</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-2 border-b border-[#EAE7E0] pb-6">
        <div className="text-[11px] font-mono tracking-widest uppercase text-[#8C857B]">
          TRANSPARENT PROTOCOL
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-sanctuary-900 font-normal">
          Privacy Architecture & Ethics
        </h1>
        <p className="text-xs sm:text-sm text-[#686256] leading-relaxed max-w-xl font-sans">
          An honest, unclouded account of how pseudonymity operates at The Other Reality.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
        
        {/* Section 1: Private vs Public Identity */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E2D9] space-y-3 shadow-subtle">
          <div className="flex items-center space-x-2 text-stone-900">
            <ShieldCheck className="w-5 h-5 text-stone-700" />
            <h2 className="font-serif text-xl sm:text-2xl font-normal">
              1. Private Authentication vs. Public Pseudonymity
            </h2>
          </div>
          <p>
            When you register for The Other Reality, your private credentials (such as your email address and password) are handled securely through Supabase Authentication. These private records are isolated from the public ledger by Row Level Security (RLS) policies.
          </p>
          <p>
            When you publish an experience, only your chosen <strong className="text-stone-900 font-medium">public nickname</strong> and <strong className="text-stone-900 font-medium">avatar motif</strong> are displayed. Other members, visitors, and automated scrapers never see your email address or real-world name.
          </p>
        </section>

        {/* Section 2: Pseudonymity vs Anonymity */}
        <section className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#E7E3D8] space-y-3">
          <div className="flex items-center space-x-2 text-stone-900">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif text-xl sm:text-2xl font-normal">
              2. Pseudonymity Does Not Guarantee Absolute Anonymity
            </h2>
          </div>
          <p>
            We believe in complete transparency rather than deceptive marketing claims. Pseudonymity separates your public entries from your legal name within our interface. However, it does not constitute impenetrable military-grade anonymity.
          </p>
          <p>
            Network metadata, IP connections, or legal subpoenas may connect an account to a real-world origin under applicable law. We do not claim or promise untraceability.
          </p>
        </section>

        {/* Section 3: Photograph and Text Risks */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E2D9] space-y-3 shadow-subtle">
          <div className="flex items-center space-x-2 text-stone-900">
            <Camera className="w-5 h-5 text-stone-700" />
            <h2 className="font-serif text-xl sm:text-2xl font-normal">
              3. Unintentional Disclosure in Photographs & Prose
            </h2>
          </div>
          <p>
            Please exercise discernment when sharing personal imagery or stories. A photograph may inadvertently contain identifying landmarks, house numbers, reflective surfaces, personal belongings, or faces of non-consenting individuals.
          </p>
          <p>
            Similarly, highly specific anecdotes, place names, or unique relational details can allow people who know you in real life to recognize your voice. You remain sovereign over what you choose to put into ink.
          </p>
        </section>

        {/* Section 4: Data Rights & Deletion */}
        <section className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#E7E3D8] space-y-3">
          <div className="flex items-center space-x-2 text-stone-900">
            <FileText className="w-5 h-5 text-stone-700" />
            <h2 className="font-serif text-xl sm:text-2xl font-normal">
              4. Complete Autonomy & Deletion
            </h2>
          </div>
          <p>
            You have permanent autonomy over your submissions. You may delete any experience you have published at any time from your Private Archive, and our backend verifies your ownership before executing the removal.
          </p>
          <p>
            You may also submit a formal account deletion request from your Account Settings. We do not retain hidden zombie profiles or engage in algorithmic profiling.
          </p>
        </section>

      </div>

    </div>
  );
};

