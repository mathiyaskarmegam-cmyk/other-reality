import React, { useState } from 'react';
import { Experience } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { supabaseApi } from '../../lib/supabase';
import { Flag, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  experience: Experience;
  onClose: () => void;
}

const REPORT_REASONS = [
  { id: 'harassment', label: 'Harassment or personal targeting' },
  { id: 'threats', label: 'Threats of violence or self-harm' },
  { id: 'privacy', label: 'Non-consensual personal info or face reveal' },
  { id: 'hate', label: 'Hate speech or discriminatory content' },
  { id: 'spam', label: 'Commercial promotion or bot activity' },
  { id: 'other', label: 'Other violation of sanctuary guidelines' },
];

export const ReportModal: React.FC<ReportModalProps> = ({ experience, onClose }) => {
  const { user } = useAuth();
  const [selectedReason, setSelectedReason] = useState<string>(REPORT_REASONS[0].id);
  const [details, setDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage('You must be signed in to submit a report.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await supabaseApi.submitReport({
        experienceId: experience.id,
        reportingUserId: user.id,
        reason: selectedReason,
        details: details.trim() || undefined,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-float border border-[#E5E2D9] relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-sanctuary-900">Report Received</h3>
            <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto">
              Thank you for upholding our tranquil refuge. A moderator will quietly review this entry. Reports never trigger automated public metrics.
            </p>
            <div className="pt-3">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-sanctuary-900 text-white text-xs font-medium hover:bg-black transition-colors"
              >
                Return to Sanctuary
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2.5 text-stone-900">
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
                <Flag className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-xl font-medium">Report Experience</h3>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              Help preserve the peaceful sanctity of The Other Reality. Please specify how this entry violates our community tenets:
            </p>

            {/* Reasons List */}
            <div className="space-y-2 pt-1">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r.id}
                  className={`flex items-center space-x-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                    selectedReason === r.id
                      ? 'border-stone-900 bg-stone-50 text-stone-900 font-medium'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.id}
                    checked={selectedReason === r.id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-stone-900"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>

            {/* Additional details */}
            <div className="space-y-1">
              <label htmlFor="details" className="text-xs font-medium text-stone-700">
                Additional context (optional)
              </label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Share any pertinent notes for the moderation queue..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 resize-none font-sans"
              />
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center space-x-2 border border-red-200">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-stone-200 text-xs text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-medium hover:bg-black transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

