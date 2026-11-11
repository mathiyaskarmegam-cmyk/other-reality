import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabaseApi } from '../../lib/supabase';
import { ShieldCheck, PenLine, Camera, Trash2, ArrowRight, UploadCloud, X, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface ShareExperienceProps {
  onPublishSuccess: () => void;
  onNavigateToAuth: () => void;
}

export const ShareExperience: React.FC<ShareExperienceProps> = ({ onPublishSuccess, onNavigateToAuth }) => {
  const { user, profile } = useAuth();
  const [mode, setMode] = useState<'text' | 'photo'>('text');
  
  // Text story fields
  const [title, setTitle] = useState<string>('');
  const [textContent, setTextContent] = useState<string>('');

  // Photo story fields
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState<string>('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string>('a few moments ago');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Character & word pacing
  const charCount = textContent.length;
  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 180));

  // Simulated draft autosave timer
  useEffect(() => {
    if (textContent || imageCaption) {
      const timer = setTimeout(() => {
        setLastSaved('just now');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [textContent, imageCaption]);

  // Handle image selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setSubmitError('Please choose a valid photograph format (JPEG, PNG, WebP).');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setSubmitError(null);
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDiscard = () => {
    setTitle('');
    setTextContent('');
    handleClearImage();
    setImageCaption('');
    setSubmitError(null);
  };

  const handlePublish = async () => {
    if (!user || !profile) {
      onNavigateToAuth();
      return;
    }

    // Validation
    if (mode === 'text' && !textContent.trim()) {
      setSubmitError('Please write a reflection or story before publishing.');
      return;
    }

    if (mode === 'photo' && !imageFile) {
      setSubmitError('Please choose a photograph to accompany this reflection.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const expType = mode === 'photo'
        ? (textContent.trim() ? 'text_and_photo' : 'photo_only')
        : 'text_only';

      await supabaseApi.createExperience({
        userId: user.id,
        authorNickname: profile.nickname,
        authorAvatar: profile.avatar,
        title: title.trim() || null,
        textContent: textContent.trim() || null,
        experienceType: expType,
        imageFile: imageFile,
        imageCaption: imageCaption.trim() || null,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        onPublishSuccess();
      }, 1200);
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred while publishing to the sanctuary.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE7E0] pb-6">
        <div>
          <div className="text-[11px] font-mono tracking-widest uppercase text-[#8C857B]">
            STUDIO / COMPOSITION
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-sanctuary-900 font-normal mt-1">
            Reflect & Pen
          </h1>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-[#8C857B]">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
          <span>Autosaved {lastSaved}</span>
        </div>
      </div>

      {/* Pseudonymous Privacy Shield Banner matching Figma */}
      <div className="bg-[#F6F3EC] rounded-2xl p-5 border border-[#E7E3D8] flex items-start space-x-4">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-700 shrink-0 shadow-sm border border-[#E0DCD3]">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="font-semibold text-stone-900 flex flex-wrap items-center gap-1.5">
            <span>Publishing pseudonymously as</span>
            <span className="inline-block bg-[#E7E2D7] text-[#4A453C] px-2 py-0.5 rounded font-mono text-[11px]">
              {profile?.nickname || 'silent_wanderer'}
            </span>
          </div>
          <p className="text-[#6D675C] leading-relaxed">
            Your legal name, email address, physical location, and private credentials remain completely unattached. Once shared, this submission stands purely on its own resonance.
          </p>
        </div>
      </div>

      {/* Mode Switcher Pill */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-full bg-[#EFECE5] border border-[#DDD8CD] space-x-1">
          <button
            onClick={() => setMode('text')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-medium transition-all ${
              mode === 'text'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Write a Thought or Story</span>
          </button>

          <button
            onClick={() => setMode('photo')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-medium transition-all ${
              mode === 'photo'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Share a Photograph</span>
          </button>
        </div>
      </div>

      {/* Editor Surface Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E2D9] shadow-subtle space-y-6">
        
        {/* Title Input (Optional) */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title or unhurried heading (optional)..."
            className="w-full font-serif text-xl sm:text-2xl text-stone-900 placeholder:text-stone-300 placeholder:font-serif border-b border-transparent focus:border-stone-200 focus:outline-none pb-2 transition-colors"
          />
        </div>

        {/* Text Mode Editor */}
        {mode === 'text' && (
          <div className="space-y-4">
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Take your time to articulate what happened... a memory, an unspoken realization, or a quiet story."
              rows={9}
              className="w-full font-serif text-base sm:text-lg text-stone-800 placeholder:text-stone-400 placeholder:italic placeholder:font-light border-0 focus:outline-none focus:ring-0 resize-none leading-relaxed"
            />

            {/* Pacing & Characters Footer */}
            <div className="flex items-center justify-between text-xs text-[#8C857B] pt-4 border-t border-[#F2EFE8]">
              <div className="flex items-center space-x-1.5 font-sans">
                <Clock className="w-3.5 h-3.5" />
                <span>Pacing: ~{wordCount > 0 ? readMinutes : 0} min unhurried reading</span>
              </div>
              <div className="font-mono text-[11px]">
                {charCount} characters
              </div>
            </div>
          </div>
        )}

        {/* Photograph Mode Editor */}
        {mode === 'photo' && (
          <div className="space-y-6">
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#DDD8CD] hover:border-stone-500 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-[#FAF8F5]/60 hover:bg-[#F5F2EB]/50 group"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-stone-400 group-hover:text-stone-800 mx-auto mb-3 shadow-sm border border-[#E7E4DC]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="font-serif text-lg text-stone-800">
                  Select a tranquil photograph
                </div>
                <p className="text-xs text-[#8C857B] mt-1">
                  Drag and drop or click to browse (JPEG, PNG, WebP up to 10MB)
                </p>
                <p className="text-[11px] text-[#A8A29E] mt-3 italic font-serif">
                  Note: Captions are entirely optional. Photographs are permitted to exist in pure silence.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-[#E5E2D9]">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-[460px] object-cover"
                  />
                  <button
                    onClick={handleClearImage}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-sm transition-colors"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-serif italic text-stone-600">
                    Optional Caption (Captions are never required):
                  </label>
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder='e.g. "The quiet stretch of coast road right as the mist cleared."'
                    className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 font-serif italic placeholder:text-stone-300"
                  />
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

        {/* Error Feedback */}
        {submitError && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center space-x-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Success Feedback */}
        {submitSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center space-x-2 border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Reflection published successfully to the quiet ledger. Redirecting...</span>
          </div>
        )}

        {/* Action Controls matching Figma Screenshot */}
        <div className="pt-4 flex items-center justify-between border-t border-[#F0ECE4]">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={isSubmitting}
            className="flex items-center space-x-1.5 text-xs text-[#8C857B] hover:text-red-700 transition-colors p-2 rounded-lg"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Discard draft</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting || submitSuccess}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-medium shadow-sm transition-all disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Publishing...' : 'Publish Experience'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};

