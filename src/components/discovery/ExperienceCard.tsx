import React, { useState } from 'react';
import { Experience } from '../../types';
import { getAvatarMotif } from '../../lib/avatars';
import { ReportModal } from './ReportModal';
import { Flag, ArrowRight, Clock } from 'lucide-react';

interface ExperienceCardProps {
  experience: Experience;
  onSelect: (experience: Experience) => void;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onSelect }) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const motif = getAvatarMotif(experience.author_avatar);

  // Relative time format
  const getRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  const wordCount = (experience.text_content || '').trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 180));
  const isShortThought = wordCount < 35 && !experience.image && !experience.title;

  return (
    <>
      <article className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E4DC] hover:border-[#D6D2C8] transition-all duration-200 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        
        {/* Author Tag & Report Trigger */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#F4F1EA] text-[#635D52] text-xs font-mono font-medium">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: motif.color }}
              />
              <span>{experience.author_nickname || 'pseudonymous_voice'}</span>
            </span>
            <span className="text-xs text-[#9E978C] font-sans">
              • {getRelativeTime(experience.created_at)}
            </span>
          </div>

          <button
            onClick={() => setReportModalOpen(true)}
            className="text-[#B5AFA5] hover:text-[#7A7468] p-1 rounded-full hover:bg-stone-50 transition-colors"
            title="Report this entry"
            aria-label="Report"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Type 1: Short Thought / Quiet Confession */}
        {isShortThought && (
          <div className="py-2 cursor-pointer" onClick={() => onSelect(experience)}>
            <blockquote className="font-serif text-xl sm:text-2xl text-stone-900 leading-snug font-normal">
              {experience.text_content}
            </blockquote>
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#ECE8E0] text-[11px] text-[#78716C] font-sans">
              A quiet confession / unburdened thought
            </div>
          </div>
        )}

        {/* Content Type 2: Text-only (prose / essay) */}
        {!isShortThought && experience.experience_type === 'text_only' && (
          <div className="space-y-4">
            {experience.title && (
              <h2
                onClick={() => onSelect(experience)}
                className="font-serif text-xl sm:text-2xl text-stone-900 font-normal leading-snug hover:text-stone-700 cursor-pointer transition-colors"
              >
                {experience.title}
              </h2>
            )}

            {experience.text_content && (
              <div
                onClick={() => onSelect(experience)}
                className="font-serif text-stone-700 text-sm sm:text-base leading-relaxed line-clamp-4 cursor-pointer"
              >
                {experience.text_content}
              </div>
            )}

            <div className="pt-3 flex items-center justify-between text-xs border-t border-[#F2EFE8]">
              <button
                onClick={() => onSelect(experience)}
                className="text-stone-900 hover:text-black font-medium inline-flex items-center space-x-1 hover:underline underline-offset-4"
              >
                <span>Read in full quiet prose</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center space-x-1 text-[#9E978C]">
                <Clock className="w-3.5 h-3.5" />
                <span>~{readMinutes} min passage</span>
              </div>
            </div>
          </div>
        )}

        {/* Content Type 3: Photo-only */}
        {experience.experience_type === 'photo_only' && experience.image && (
          <div className="space-y-3">
            <div
              className="rounded-2xl overflow-hidden bg-stone-100 border border-[#ECE8E0] cursor-pointer"
              onClick={() => onSelect(experience)}
            >
              <img
                src={experience.image.image_url}
                alt={experience.image.caption || 'Photographic reflection'}
                className="w-full max-h-[500px] object-cover hover:scale-[1.01] transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {experience.image.caption ? (
              <p
                onClick={() => onSelect(experience)}
                className="font-serif italic text-sm text-[#5C564C] text-center pt-1 cursor-pointer"
              >
                {experience.image.caption}
              </p>
            ) : (
              <div className="flex justify-between items-center text-xs text-[#9E978C] pt-1">
                <span className="font-serif italic text-[11px]">
                  Visual story captured without accompanying text.
                </span>
                <button
                  onClick={() => onSelect(experience)}
                  className="hover:text-stone-800 font-sans"
                >
                  View full photograph →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Content Type 4: Text and Photograph */}
        {experience.experience_type === 'text_and_photo' && (
          <div className="space-y-4">
            {experience.title && (
              <h2
                onClick={() => onSelect(experience)}
                className="font-serif text-xl sm:text-2xl text-stone-900 font-normal leading-snug hover:text-stone-700 cursor-pointer transition-colors"
              >
                {experience.title}
              </h2>
            )}

            {experience.image && (
              <div
                className="rounded-2xl overflow-hidden bg-stone-100 border border-[#ECE8E0] cursor-pointer"
                onClick={() => onSelect(experience)}
              >
                <img
                  src={experience.image.image_url}
                  alt={experience.image.caption || experience.title || 'Experience photograph'}
                  className="w-full max-h-[440px] object-cover hover:scale-[1.01] transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            )}

            {experience.text_content && (
              <p
                onClick={() => onSelect(experience)}
                className="font-serif text-stone-700 text-sm sm:text-base leading-relaxed line-clamp-3 cursor-pointer"
              >
                {experience.text_content}
              </p>
            )}

            <div className="pt-3 flex items-center justify-between text-xs border-t border-[#F2EFE8]">
              <button
                onClick={() => onSelect(experience)}
                className="text-stone-900 hover:text-black font-medium inline-flex items-center space-x-1 hover:underline underline-offset-4"
              >
                <span>Read full reflection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center space-x-1 text-[#9E978C]">
                <Clock className="w-3.5 h-3.5" />
                <span>~{readMinutes} min passage</span>
              </div>
            </div>
          </div>
        )}

      </article>

      {reportModalOpen && (
        <ReportModal
          experience={experience}
          onClose={() => setReportModalOpen(false)}
        />
      )}
    </>
  );
};

