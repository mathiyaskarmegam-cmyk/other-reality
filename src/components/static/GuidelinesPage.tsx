import React from 'react';
import { ShieldCheck, HeartOff, UserX, AlertOctagon, ArrowLeft, BookOpen } from 'lucide-react';

interface GuidelinesPageProps {
  onBack: () => void;
}

export const GuidelinesPage: React.FC<GuidelinesPageProps> = ({ onBack }) => {
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
          COMMUNITY TENETS
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-sanctuary-900 font-normal">
          Sanctuary Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-[#686256] leading-relaxed max-w-xl font-sans">
          The Other Reality exists to provide an unhurried, peaceful refuge for honest human resonance. To protect this quietude, we uphold clear standards.
        </p>
      </div>

      {/* Guidelines Grid */}
      <div className="space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
        
        {/* Tenet 1: Harassment & Bullying */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E2D9] space-y-2.5 shadow-subtle">
          <div className="flex items-center space-x-2.5 text-stone-900">
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
              <HeartOff className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-xl font-normal">1. Harassment & Bullying</h2>
          </div>
          <p>
            Do not target, demean, or harass any individual or group. Personal vendettas, malicious mockery, and persistent disparagement are antithetical to this sanctuary. Content designed to humiliate others will be removed without hesitation.
          </p>
        </div>

        {/* Tenet 2: Threats & Harm */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E2D9] space-y-2.5 shadow-subtle">
          <div className="flex items-center space-x-2.5 text-stone-900">
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-xl font-normal">2. Threats of Violence & Harm</h2>
          </div>
          <p>
            Direct threats of violence, incitement of physical harm, glorification of cruelty, or expressions promoting self-harm are strictly barred. If you are struggling with severe emotional distress, please seek professional support from dedicated crisis services.
          </p>
        </div>

        {/* Tenet 3: Impersonation & Identity Theft */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E2D9] space-y-2.5 shadow-subtle">
          <div className="flex items-center space-x-2.5 text-stone-900">
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
              <UserX className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-xl font-normal">3. Impersonation & Doxxing</h2>
          </div>
          <p>
            Do not pretend to be a specific real-world figure or falsely appropriate someone else's identity. Furthermore, posting another person’s private contact details, address, phone numbers, or real identity without their explicit consent (doxxing) will lead to immediate account suspension and content removal.
          </p>
        </div>

        {/* Tenet 4: Peaceful Resonance */}
        <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#E7E3D8] space-y-2.5">
          <div className="flex items-center space-x-2.5 text-stone-900">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-700 shadow-sm border border-[#DDD8CD]">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="font-serif text-xl font-normal">4. Quiet Resonance, Not Virality</h2>
          </div>
          <p>
            This platform deliberately refuses to provide like counters, follower tallies, comment threads, or algorithmic amplification. Please refrain from using experiences for commercial advertising, viral growth hacking, affiliate marketing, or solicitation.
          </p>
        </div>

      </div>

    </div>
  );
};

