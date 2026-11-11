import React from 'react';
import { Experience } from '../../types';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  experience: Experience;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  experience,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-float border border-[#E5E2D9] relative space-y-4">
        
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
          <Trash2 className="w-5 h-5" />
        </div>

        <div className="space-y-1.5">
          <h3 className="font-serif text-2xl text-stone-900 font-medium">
            Permanently Remove Submission?
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            This action immediately purges this experience and its associated photograph from the public ledger. Your deletion rights are absolute and cannot be undone.
          </p>
        </div>

        {experience.title && (
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs font-serif text-stone-800 italic">
            "{experience.title}"
          </div>
        )}

        <div className="pt-3 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-full border border-stone-200 text-xs text-stone-600 hover:bg-stone-50 font-medium transition-colors"
          >
            Keep Submission
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-medium shadow-sm transition-colors flex items-center space-x-1.5 disabled:opacity-50"
          >
            {isDeleting ? (
              <span>Deleting...</span>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Deletion</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

