import React, { useState, useEffect } from 'react';
import { Experience } from '../../types';
import { supabaseApi } from '../../lib/supabase';
import { ExperienceCard } from './ExperienceCard';
import { ExperienceModal } from './ExperienceModal';
import { RefreshCw, Feather, AlertCircle } from 'lucide-react';

interface DiscoverFeedProps {
  onNavigateToShare: () => void;
}

export const DiscoverFeed: React.FC<DiscoverFeedProps> = ({ onNavigateToShare }) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'text' | 'photo'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  const fetchExperiences = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await supabaseApi.getDiscoverExperiences();
      setExperiences(data);
    } catch (err: any) {
      setError(err.message || 'Unable to retrieve entries from the ledger.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  // Filter experiences based on selected pill
  const filteredExperiences = experiences.filter((exp) => {
    if (filterType === 'text') return exp.experience_type === 'text_only';
    if (filterType === 'photo') return exp.experience_type === 'photo_only' || exp.experience_type === 'text_and_photo';
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      
      {/* Header Banner matching Figma Screenshot */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#78716C]">
            <span className="w-2 h-2 rounded-full bg-[#A8A29E]" />
            <span>Uncurated Chronology</span>
          </div>

          {/* Gentle refresh button */}
          <button
            onClick={fetchExperiences}
            disabled={isLoading}
            className="p-1.5 rounded-full hover:bg-[#EFECE5] text-[#8C857B] hover:text-stone-900 transition-colors"
            title="Refresh chronological stream"
            aria-label="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-sanctuary-900 font-normal leading-[1.18] tracking-tight">
          Shared thoughts, quiet reflections, and unhurried memories from pseudonymous voices.
        </h1>

        <p className="text-sm sm:text-base text-[#6B655B] font-sans leading-relaxed max-w-2xl">
          No rankings, no metrics, and no digital applause. Simply a peaceful ledger of everyday humans pausing long enough to write or notice.
        </p>

        {/* Quiet Filter Tabs */}
        <div className="pt-3 flex items-center space-x-2 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              filterType === 'all'
                ? 'bg-stone-900 text-white font-medium shadow-sm'
                : 'bg-[#F2EFE9] text-[#6B655B] hover:bg-[#EAE6DD]'
            }`}
          >
            All Entries ({experiences.length})
          </button>
          <button
            onClick={() => setFilterType('text')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              filterType === 'text'
                ? 'bg-stone-900 text-white font-medium shadow-sm'
                : 'bg-[#F2EFE9] text-[#6B655B] hover:bg-[#EAE6DD]'
            }`}
          >
            Written Prose
          </button>
          <button
            onClick={() => setFilterType('photo')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              filterType === 'photo'
                ? 'bg-stone-900 text-white font-medium shadow-sm'
                : 'bg-[#F2EFE9] text-[#6B655B] hover:bg-[#EAE6DD]'
            }`}
          >
            Visual Stories
          </button>
        </div>
      </div>

      {/* Main Stream Area */}
      <div className="space-y-8">
        {/* Loading State Skeleton */}
        {isLoading && (
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-8 border border-[#E7E4DC] space-y-4">
                <div className="h-4 w-32 bg-stone-100 rounded-full" />
                <div className="h-6 w-3/4 bg-stone-100 rounded-lg" />
                <div className="h-20 w-full bg-stone-50 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-white rounded-3xl p-8 border border-red-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-stone-900">Quietude Interrupted</h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchExperiences}
              className="px-4 py-2 rounded-full bg-stone-900 text-white text-xs font-medium hover:bg-black transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredExperiences.length === 0 && (
          <div className="bg-white rounded-3xl p-12 border border-[#E7E4DC] text-center space-y-4 shadow-subtle">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-stone-400 flex items-center justify-center mx-auto border border-stone-200">
              <Feather className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-stone-900">The Ledger is Silent</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              No entries currently match this filter. Take a moment to articulate a thought or photograph from your own day.
            </p>
            <div className="pt-2">
              <button
                onClick={onNavigateToShare}
                className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-medium hover:bg-black transition-colors"
              >
                Share First Experience
              </button>
            </div>
          </div>
        )}

        {/* List of Experience Cards */}
        {!isLoading && !error && filteredExperiences.length > 0 && (
          <div className="space-y-6">
            {filteredExperiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                onSelect={(selected) => setSelectedExperience(selected)}
              />
            ))}
          </div>
        )}

        {/* Bottom Stream Note matching screenshot */}
        {!isLoading && filteredExperiences.length > 0 && (
          <div className="text-center py-6 text-xs text-[#8C857B] font-serif italic">
            You have reached the gentle boundary of recent entries.
          </div>
        )}
      </div>

      {/* Full Experience Reading Modal */}
      {selectedExperience && (
        <ExperienceModal
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
        />
      )}
    </div>
  );
};

