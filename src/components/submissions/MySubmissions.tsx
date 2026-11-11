import React, { useState, useEffect } from 'react';
import { Experience } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { supabaseApi } from '../../lib/supabase';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { ExperienceModal } from '../discovery/ExperienceModal';
import { Lock, Eye, Trash2, PenLine, Camera, Image as ImageIcon, ShieldCheck, RefreshCw, AlertCircle, PlusCircle } from 'lucide-react';

interface MySubmissionsProps {
  onNavigateToShare: () => void;
  onNavigateToAuth: () => void;
}

export const MySubmissions: React.FC<MySubmissionsProps> = ({ onNavigateToShare, onNavigateToAuth }) => {
  const { user, profile } = useAuth();
  const [submissions, setSubmissions] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal interactions
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [viewingTarget, setViewingTarget] = useState<Experience | null>(null);
  const [simulateErrorActive, setSimulateErrorActive] = useState<boolean>(false);

  const fetchSubmissions = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await supabaseApi.getMySubmissions(user.id);
      setSubmissions(data);
    } catch (err: any) {
      setError(err.message || 'Unable to retrieve your private archive.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [user]);

  const handleDelete = async () => {
    if (!deleteTarget || !user) return;

    setIsDeleting(true);
    setError(null);

    // Optional simulated error test check
    if (simulateErrorActive) {
      setTimeout(() => {
        setIsDeleting(false);
        setError('Simulated Deletion Error: Network failure while communicating with backend.');
        setDeleteTarget(null);
      }, 700);
      return;
    }

    try {
      await supabaseApi.deleteExperience(deleteTarget.id, user.id);
      setSubmissions((prev) => prev.filter((exp) => exp.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete submission from backend.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Format publication date string
  const getRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays < 1) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} month ago`;
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#F4F1EA] text-stone-500 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-3xl text-sanctuary-900">Private Submissions Archive</h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Sign in to your pseudonymous sanctuary to view, inspect, and manage your shared entries.
        </p>
        <button
          onClick={onNavigateToAuth}
          className="px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs font-medium hover:bg-black transition-colors"
        >
          Enter Sanctuary
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      
      {/* Archive Header Banner matching Figma Screenshot */}
      <div className="bg-[#FAF7F0] rounded-3xl p-6 sm:p-8 border border-[#ECE8DE] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-mono tracking-widest uppercase text-[#8C857B]">
              <Lock className="w-3.5 h-3.5" />
              <span>PRIVATE ARCHIVE</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-sanctuary-900 font-normal">
              My Submissions
            </h1>
          </div>

          {/* Active Count Pill */}
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-[#DDD8CD] text-xs font-medium text-stone-700 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Active ({submissions.length})</span>
            </span>

            <button
              onClick={fetchSubmissions}
              disabled={isLoading}
              className="p-1.5 rounded-full hover:bg-white text-stone-500 hover:text-stone-900 transition-colors"
              title="Refresh submissions"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#686256] leading-relaxed max-w-2xl font-sans">
          Only you can view and manage the experiences you have shared. You have complete autonomy to remove them at any time.
        </p>
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-800 text-xs flex items-center justify-between border border-red-200">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-xs font-medium underline underline-offset-2 hover:text-red-950"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Submissions List */}
      <div className="space-y-5">
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-[#E7E4DC] h-40" />
            ))}
          </div>
        )}

        {!isLoading && submissions.length === 0 && (
          <div className="bg-white rounded-3xl p-12 border border-[#E7E4DC] text-center space-y-4 shadow-subtle">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-stone-400 flex items-center justify-center mx-auto border border-stone-200">
              <PenLine className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-stone-900">No Submissions Yet</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              You haven't published any entries under this pseudonymous sanctuary. Share a thought or photograph when the mood strikes.
            </p>
            <div className="pt-2">
              <button
                onClick={onNavigateToShare}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-medium hover:bg-black transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Compose First Reflection</span>
              </button>
            </div>
          </div>
        )}

        {!isLoading &&
          submissions.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E7E4DC] hover:border-[#D6D2C8] transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Content Column */}
              <div className="space-y-2.5 flex-1">
                {/* Meta row: Published pill + Time + Type badge */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#78716C]">
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-medium text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Published</span>
                  </span>

                  <span className="text-[11px]">
                    🕒 Published {getRelativeTime(exp.created_at)}
                  </span>

                  <span>•</span>

                  <span className="inline-flex items-center space-x-1 text-[11px] font-sans">
                    {exp.experience_type === 'text_and_photo' && (
                      <>
                        <ImageIcon className="w-3 h-3 text-stone-500" />
                        <span>Text & Photo</span>
                      </>
                    )}
                    {exp.experience_type === 'text_only' && (
                      <>
                        <PenLine className="w-3 h-3 text-stone-500" />
                        <span>Text-only</span>
                      </>
                    )}
                    {exp.experience_type === 'photo_only' && (
                      <>
                        <Camera className="w-3 h-3 text-stone-500" />
                        <span>Photo-only</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal leading-snug">
                  {exp.title || (exp.experience_type === 'photo_only' ? 'Photographic Reflection' : 'Quiet Thought')}
                </h3>

                {/* Excerpt or visual story note */}
                {exp.text_content ? (
                  <p className="font-serif text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {exp.text_content}
                  </p>
                ) : (
                  <p className="font-serif italic text-xs text-stone-400">
                    (Visual story captured without accompanying text. Documenting silence at first dawn.)
                  </p>
                )}

                {/* Action Links */}
                <div className="pt-2 flex items-center space-x-3 text-xs">
                  <button
                    onClick={() =>
                      setViewingTarget({
                        ...exp,
                        author_nickname: profile?.nickname || 'silent_wanderer',
                        author_avatar: profile?.avatar || 'wanderer',
                      })
                    }
                    className="inline-flex items-center space-x-1.5 text-stone-700 hover:text-black font-medium transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View public presentation</span>
                  </button>

                  <span className="text-stone-300">•</span>

                  <button
                    onClick={() => setDeleteTarget(exp)}
                    className="inline-flex items-center space-x-1.5 text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete submission</span>
                  </button>
                </div>
              </div>

              {/* Right Thumbnail Column matching screenshot */}
              <div className="shrink-0">
                {exp.image ? (
                  <div
                    onClick={() =>
                      setViewingTarget({
                        ...exp,
                        author_nickname: profile?.nickname || 'silent_wanderer',
                        author_avatar: profile?.avatar || 'wanderer',
                      })
                    }
                    className="w-full sm:w-44 h-28 rounded-2xl overflow-hidden bg-stone-100 border border-[#E5E2D9] cursor-pointer"
                  >
                    <img
                      src={exp.image.image_url}
                      alt={exp.title || 'Submission image'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full sm:w-44 h-28 rounded-2xl bg-[#F6F4EF] border border-[#EAE6DE] flex flex-col items-center justify-center text-stone-400 space-y-1">
                    <PenLine className="w-5 h-5 text-stone-400" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
                      Pure Prose
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Complete Pseudonymous Safeguards Banner matching screenshot */}
      <div className="bg-[#F8F5EE] rounded-2xl p-5 border border-[#E8E4D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-700 shrink-0 shadow-sm border border-[#DDD8CD]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 text-xs">
            <div className="font-semibold text-stone-900">
              Complete Pseudonymous Safeguards
            </div>
            <p className="text-[#6D675C] max-w-xl leading-relaxed">
              Your records carry no tracking metrics, public counters, or persistent algorithmic links to your personal device.
            </p>
          </div>
        </div>

        {/* Toggle to verify error handling */}
        <button
          onClick={() => setSimulateErrorActive(!simulateErrorActive)}
          className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors ${
            simulateErrorActive
              ? 'bg-red-50 text-red-700 border-red-300 font-medium'
              : 'text-[#8C857B] border-[#DDD8CD] hover:bg-white'
          }`}
          title="Toggle to test deletion failure feedback"
        >
          {simulateErrorActive ? 'Simulate Error: ON' : 'Simulate Deletion Error'}
        </button>
      </div>

      {/* Modals */}
      {deleteTarget && (
        <DeleteConfirmationModal
          experience={deleteTarget}
          isDeleting={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {viewingTarget && (
        <ExperienceModal
          experience={viewingTarget}
          onClose={() => setViewingTarget(null)}
        />
      )}

    </div>
  );
};

