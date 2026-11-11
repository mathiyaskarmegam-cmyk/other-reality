import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AVATAR_MOTIFS, getAvatarMotif } from '../../lib/avatars';
import { User, ShieldCheck, Mail, LogOut, Trash2, CheckCircle2, AlertCircle, Save, Clock } from 'lucide-react';

interface AccountPageProps {
  onSignOutSuccess: () => void;
  onNavigateToGuidelines: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onSignOutSuccess, onNavigateToGuidelines }) => {
  const { user, profile, updateProfile, requestDeletion, signOut } = useAuth();

  const [nickname, setNickname] = useState<string>(profile?.nickname || '');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(profile?.avatar || 'wanderer');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  // Deletion request state
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteReason, setDeleteReason] = useState<string>('');
  const [isRequestingDeletion, setIsRequestingDeletion] = useState<boolean>(false);
  const [deletionRequested, setDeletionRequested] = useState<boolean>(false);

  const motif = getAvatarMotif(selectedAvatar);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    setIsUpdating(true);
    setUpdateMessage(null);
    try {
      await updateProfile({
        nickname: nickname.trim().toLowerCase().replace(/\s+/g, '_'),
        avatar: selectedAvatar,
      });
      setUpdateMessage('Pseudonymous identity updated successfully.');
      setTimeout(() => setUpdateMessage(null), 3000);
    } catch (err: any) {
      setUpdateMessage(err.message || 'Failed to update identity.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDeletionRequest = async () => {
    setIsRequestingDeletion(true);
    try {
      await requestDeletion(deleteReason.trim() || undefined);
      setDeletionRequested(true);
      setShowDeleteModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to submit account deletion request.');
    } finally {
      setIsRequestingDeletion(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      
      {/* Header */}
      <div className="space-y-1 border-b border-[#EAE7E0] pb-6">
        <div className="text-[11px] font-mono tracking-widest uppercase text-[#8C857B]">
          IDENTITY ARCHIVES
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-sanctuary-900 font-normal">
          Sanctuary Account
        </h1>
        <p className="text-xs text-stone-600 font-sans">
          Manage your public pseudonymous presence and private credential storage.
        </p>
      </div>

      {/* Private Authentication Credentials Box */}
      <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#E7E3D8] space-y-4">
        <div className="flex items-center space-x-2 text-stone-900">
          <ShieldCheck className="w-5 h-5 text-stone-700" />
          <h2 className="font-serif text-xl font-medium">Private Authentication Layer</h2>
        </div>

        <p className="text-xs text-[#6B655B] leading-relaxed">
          The email below is strictly confidential. It is used exclusively by Supabase Auth for security, session verification, and recovery. It is NEVER exposed to other participants or attached to public experiences.
        </p>

        <div className="p-4 rounded-2xl bg-white border border-[#E5E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <Mail className="w-4 h-4 text-stone-400" />
            <span className="font-mono text-xs text-stone-800">{user?.email || 'confidential@auth'}</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 w-fit">
            🔒 Private & Encrypted
          </span>
        </div>
      </div>

      {/* Public Pseudonym & Avatar Customization */}
      <form onSubmit={handleUpdate} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E2D9] shadow-subtle space-y-6">
        <div className="space-y-1">
          <h2 className="font-serif text-xl text-stone-900 font-medium">
            Public Pseudonymous Persona
          </h2>
          <p className="text-xs text-stone-500">
            Customize the public moniker and tranquil motif attached to your shared entries.
          </p>
        </div>

        {/* Pseudonym Input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-stone-700">Public Nickname</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            className="w-full text-xs p-3 rounded-xl bg-[#FAF8F5] border border-stone-200 focus:outline-none focus:border-stone-900 font-mono"
          />
          <div className="text-[11px] text-stone-400 font-serif italic">
            Displayed on discovery cards, public reading views, and quiet submissions.
          </div>
        </div>

        {/* Avatar Archetype Grid */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-stone-700 block">
            Avatar Motif Archetype
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AVATAR_MOTIFS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedAvatar(m.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedAvatar === m.id
                    ? 'border-stone-900 bg-stone-50 shadow-sm ring-1 ring-stone-900'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-inner"
                    style={{ backgroundColor: m.bg, color: m.color }}
                  >
                    {m.symbol}
                  </div>
                  <span className="text-xs font-medium text-stone-900">{m.name}</span>
                </div>
                <p className="text-[10px] text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                  {m.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {updateMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center space-x-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{updateMessage}</span>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center space-x-1.5 px-6 py-2.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-medium shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isUpdating ? 'Saving...' : 'Update Public Identity'}</span>
          </button>
        </div>
      </form>

      {/* Account Deletion Request Section complying with PRD */}
      <div className="bg-red-50/40 rounded-3xl p-6 sm:p-8 border border-red-200/80 space-y-4">
        <div className="flex items-center space-x-2 text-red-900">
          <Trash2 className="w-5 h-5 text-red-600" />
          <h2 className="font-serif text-xl font-medium">Sovereign Account Deletion</h2>
        </div>

        {deletionRequested ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
            <div className="flex items-center space-x-2 font-semibold text-xs">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Account Deletion Request Queued</span>
            </div>
            <p className="text-xs leading-relaxed">
              Your account deletion request has been formally received and logged in the backend. In compliance with the platform policy, our automated processes will handle the staged unlinking and removal of your records. You can sign out at any time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-stone-600 leading-relaxed">
              In accordance with our core product principles, you possess the right to permanently revoke your sanctuary account. Submitting a deletion request logs your formal intent in Supabase.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-5 py-2 rounded-full border border-red-300 text-red-700 hover:bg-red-50 text-xs font-medium transition-colors"
            >
              Request Account Deletion...
            </button>
          </div>
        )}
      </div>

      {/* Sign Out CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-[#EAE7E0]">
        <button
          onClick={onNavigateToGuidelines}
          className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-4"
        >
          Review Community Guidelines
        </button>

        <button
          type="button"
          onClick={async () => {
            await signOut();
            onSignOutSuccess();
          }}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-full border border-stone-200 hover:bg-stone-100 text-xs text-stone-700 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Confirmation Modal for Account Deletion Request */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-float border border-[#E5E2D9] space-y-4">
            <h3 className="font-serif text-2xl text-stone-900">
              Request Account Deletion
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Please note: Submitting this form records your formal deletion request in Supabase. Your private account and pseudonymous associations will be processed according to platform data policies.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-medium text-stone-700">
                Reason for departure (optional)
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Optional feedback before you leave the sanctuary..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-full border border-stone-200 text-xs text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletionRequest}
                disabled={isRequestingDeletion}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors disabled:opacity-50"
              >
                {isRequestingDeletion ? 'Submitting...' : 'Confirm Deletion Request'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

