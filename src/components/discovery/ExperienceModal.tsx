import React, { useState } from 'react';
import { Experience } from '../../types';
import { getAvatarMotif } from '../../lib/avatars';
import { ReportModal } from './ReportModal';
import { X, Flag, Clock } from 'lucide-react';

interface ExperienceModalProps {
  experience: Experience;
  onClose: () => void;
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({ experience, onClose }) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const motif = getAvatarMotif(experience.author_avatar);

  // Calculate unhurried reading estimate (~180 words per minute)
  const wordCount = (experience.text_content || '').trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-black/55 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-float border border-[#E5E2D9] relative my-8">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header with Pseudonym & Meta */}
          <div className="flex items-center justify-between pb-6 border-b border-stone-100">
            <div className="flex items-center space-x-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm shadow-inner"
                style={{ backgroundColor: motif.bg, color: motif.color }}
              >
                {motif.symbol}
              </div>
              <div>
                <div className="text-sm font-medium text-stone-900">
                  {experience.author_nickname || 'pseudonymous_voice'}
                </div>
                <div className="text-[11px] text-stone-400 font-sans">
                  {new Date(experience.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setReportModalOpen(true)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 text-xs transition-colors"
                title="Report experience"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>
            </div>
          </div>

          {/* Experience Title */}
          {experience.title && (
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal leading-snug mt-6 mb-4">
              {experience.title}
            </h2>
          )}

          {/* Photograph if present */}
          {experience.image && (
            <div className="mt-6 mb-6 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={experience.image.image_url}
                alt={experience.image.caption || experience.title || 'Experience photograph'}
                className="w-full max-h-[480px] object-cover"
                loading="lazy"
              />
              {experience.image.caption && (
                <div className="p-3 bg-stone-50/80 border-t border-stone-200/80 text-center font-serif italic text-xs text-stone-600">
                  {experience.image.caption}
                </div>
              )}
            </div>
          )}

          {/* Full Prose Text */}
          {experience.text_content && (
            <div className="font-serif text-stone-800 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4 my-6 font-light selection:bg-amber-100">
              {experience.text_content}
            </div>
          )}

          {/* Footer Metadata */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {experience.text_content ? `~${readMinutes} min unhurried reading` : 'Visual impression'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>

        </div>
      </div>

      {reportModalOpen && (
        <ReportModal
          experience={experience}
          onClose={() => setReportModalOpen(false)}
        />
      )}
    </>
  );
};

