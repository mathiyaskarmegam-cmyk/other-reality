import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AVATAR_MOTIFS } from '../../lib/avatars';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, HeartOff, FileCheck2, ArrowRight, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  onSuccess: () => void;
  onNavigateToPrivacy: () => void;
  initialTab?: 'signin' | 'register' | 'recovery';
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onSuccess,
  onNavigateToPrivacy,
  initialTab = 'signin',
}) => {
  const { signIn, signUp, loginAsDemoUser } = useAuth();
  const [tab, setTab] = useState<'signin' | 'register' | 'recovery'>(initialTab);

  // Form fields
  const [email, setEmail] = useState<string>('silent_wanderer@domain.org');
  const [password, setPassword] = useState<string>('calmnessInWord2024');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>('silent_wanderer');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('wanderer');
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recoverySuccess, setRecoverySuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (tab === 'signin') {
        if (!email.trim() || !password) {
          throw new Error('Please provide your private identifier and password.');
        }
        await signIn({ email: email.trim(), password });
        onSuccess();
      } else if (tab === 'register') {
        if (!email.trim() || !password) {
          throw new Error('Please provide an email and password.');
        }
        if (!nickname.trim()) {
          throw new Error('Please choose a public pseudonym.');
        }
        await signUp({
          email: email.trim(),
          password,
          nickname: nickname.trim().toLowerCase().replace(/\s+/g, '_'),
          avatar: selectedAvatar,
        });
        onSuccess();
      } else if (tab === 'recovery') {
        if (!email.trim()) {
          throw new Error('Please provide your registered private email.');
        }
        setRecoverySuccess(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during sanctuary authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      
      {/* Top Banner matching Figma Screenshot */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#F4F1EA] text-[#6E675B] text-xs font-mono uppercase tracking-wider">
          <Lock className="w-3 h-3" />
          <span>SANCTUARY IDENTITY GATEWAY</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-sanctuary-900 font-normal leading-tight tracking-tight">
          A tranquil threshold to your inner thoughts
        </h1>

        <p className="text-xs sm:text-sm text-[#6E675B] leading-relaxed max-w-xl mx-auto font-sans">
          Enter with absolute peace of mind. Your private credentials never leave confidential storage, and your reflections live strictly under your chosen pseudonym.
        </p>
      </div>

      {/* Main Two-Column Grid matching Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Auth Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E2D9] shadow-subtle space-y-6">
          
          {/* Top Form Navigation Switcher */}
          <div className="flex rounded-xl bg-[#F4F1EA] p-1 text-xs font-medium text-stone-600">
            <button
              type="button"
              onClick={() => {
                setTab('signin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                tab === 'signin' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'hover:text-stone-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                tab === 'register' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'hover:text-stone-900'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('recovery');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                tab === 'recovery' ? 'bg-white text-stone-900 shadow-sm font-semibold' : 'hover:text-stone-900'
              }`}
            >
              Recovery
            </button>
          </div>

          {/* Form Header */}
          <div className="space-y-1">
            <div className="text-[11px] uppercase font-mono tracking-wider text-[#8C857B]">
              {tab === 'signin' && 'WELCOME BACK'}
              {tab === 'register' && 'ESTABLISH SANCTUARY'}
              {tab === 'recovery' && 'PASSWORD RECOVERY'}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-sanctuary-900 font-normal">
              {tab === 'signin' && 'Sign In to Your Sanctuary'}
              {tab === 'register' && 'Construct a Pseudonymous Presence'}
              {tab === 'recovery' && 'Recover Sanctuary Access'}
            </h2>
            <p className="text-xs text-[#7A7468] leading-relaxed">
              {tab === 'signin' && 'Enter your confidential identifier to unlock private notes and reflect pseudonymously.'}
              {tab === 'register' && 'We never reveal your email or legal name. Your public experiences will carry only your chosen pseudonym.'}
              {tab === 'recovery' && 'Enter your confidential email to receive an unhurried access restoration token.'}
            </p>
          </div>

          {recoverySuccess && tab === 'recovery' ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-emerald-950">Recovery Link Dispatched</h3>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-xs mx-auto">
                If an account matches <span className="font-mono">{email}</span>, a secure recovery email has been sent. Check your inbox without haste.
              </p>
              <button
                type="button"
                onClick={() => {
                  setTab('signin');
                  setRecoverySuccess(false);
                }}
                className="mt-2 text-xs font-medium text-emerald-900 underline underline-offset-4"
              >
                Return to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Private Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700">
                  Private Email or Identifier
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="silent_wanderer@domain.org"
                    className="w-full text-xs pl-10 pr-4 py-3 rounded-xl bg-[#F7F5F0] border border-[#E5E2D9] focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
                  />
                </div>
                <div className="text-[11px] text-[#8C857B] italic font-serif">
                  Strictly private. Never displayed next to your entries.
                </div>
              </div>

              {/* Password Input (SignIn & Register only) */}
              {tab !== 'recovery' && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-stone-700">Password</label>
                    {tab === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setTab('recovery')}
                        className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-2"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      className="w-full text-xs pl-10 pr-10 py-3 rounded-xl bg-[#F7F5F0] border border-[#E5E2D9] focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Register specific: Public Pseudonym and Avatar Motif Selection */}
              {tab === 'register' && (
                <>
                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-medium text-stone-700">
                      Public Pseudonym (Unique handle)
                    </label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      required
                      placeholder="e.g. misty_morning, gentle_echo"
                      className="w-full text-xs px-3.5 py-3 rounded-xl bg-[#F7F5F0] border border-[#E5E2D9] focus:outline-none focus:border-stone-900 focus:bg-white font-mono"
                    />
                    <div className="text-[11px] text-[#8C857B] italic font-serif">
                      This is the only name shown on your shared experiences.
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-medium text-stone-700 block">
                      Choose Your Avatar Motif
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {AVATAR_MOTIFS.map((motif) => (
                        <button
                          key={motif.id}
                          type="button"
                          onClick={() => setSelectedAvatar(motif.id)}
                          className={`p-2 rounded-xl border text-center transition-all ${
                            selectedAvatar === motif.id
                              ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="text-lg">{motif.symbol}</div>
                          <div className="text-[10px] font-medium text-stone-800 truncate mt-0.5">
                            {motif.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Remember session checkbox (for signin) */}
              {tab === 'signin' && (
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-stone-300 text-stone-900 focus:ring-0 accent-stone-900 w-4 h-4"
                  />
                  <label htmlFor="remember" className="text-xs text-stone-600 select-none">
                    Remember unhurried session on this device
                  </label>
                </div>
              )}

              {/* Error feedback */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center space-x-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-medium shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>
                    {isLoading
                      ? 'Authenticating...'
                      : tab === 'signin'
                      ? 'Enter Sanctuary'
                      : tab === 'register'
                      ? 'Establish Pseudonymous Sanctuary'
                      : 'Send Recovery Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {tab === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      loginAsDemoUser('silent_wanderer');
                      onSuccess();
                    }}
                    className="w-full py-2.5 px-4 rounded-full border border-stone-200 hover:border-stone-400 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-all flex items-center justify-center space-x-1.5"
                  >
                    <span>⚡ Quick Demo Sign-In as silent_wanderer</span>
                  </button>
                )}
              </div>

              {/* Bottom Switch Note */}
              <div className="text-center pt-2">
                {tab === 'signin' ? (
                  <p className="text-xs text-stone-500">
                    New to this quiet refuge?{' '}
                    <button
                      type="button"
                      onClick={() => setTab('register')}
                      className="font-medium text-stone-900 hover:underline underline-offset-4"
                    >
                      Construct a pseudonymous presence
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-stone-500">
                    Already hold a sanctuary identity?{' '}
                    <button
                      type="button"
                      onClick={() => setTab('signin')}
                      className="font-medium text-stone-900 hover:underline underline-offset-4"
                    >
                      Return to Sign In
                    </button>
                  </p>
                )}
              </div>

            </form>
          )}

        </div>

        {/* Right Column: Information & Philosophy Manifesto (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Card 1: Public Pseudonymity Manifesto matching screenshot */}
          <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 border border-[#E7E3D8] space-y-4">
            <div className="flex items-center space-x-2.5 text-stone-900">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-700 border border-[#DDD8CD] shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-medium">Public Pseudonymity</h3>
            </div>

            <p className="text-xs text-[#6B655B] leading-relaxed">
              We separate private credentials from public identity by design. Here is what that means in practice:
            </p>

            <div className="space-y-3.5 pt-1 text-xs">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-900">Hidden Private Email</div>
                  <div className="text-[#6B655B] text-[11px] leading-relaxed">
                    Never viewable by other members, web scrapers, or public directories.
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <HeartOff className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-900">Zero Social Metrics</div>
                  <div className="text-[#6B655B] text-[11px] leading-relaxed">
                    No follower counts, vanity badges, trending indicators, or algorithmic scoring.
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FileCheck2 className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-900">Sovereign Data Rights</div>
                  <div className="text-[#6B655B] text-[11px] leading-relaxed">
                    Permanently burn your reflections or pseudonymous identity at any moment without delay.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Sanctuary Philosophy Image matching screenshot */}
          <div className="rounded-3xl overflow-hidden border border-[#E5E2D9] relative shadow-sm group">
            <img
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
              alt="Sanctuary desk with notebook and tea"
              className="w-full h-44 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
              <div className="text-[10px] font-mono tracking-widest uppercase text-stone-300">
                THE SANCTUARY PHILOSOPHY
              </div>
              <p className="font-serif italic text-sm text-stone-100 mt-1">
                "Where vulnerability meets deep quietude."
              </p>
            </div>
          </div>

          {/* Card 3: Ethics Statement Link matching screenshot */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E2D9] flex items-center justify-between text-xs">
            <div className="flex items-start space-x-3">
              <HelpCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-stone-900">Questions on our protocol?</div>
                <div className="text-stone-500 text-[11px]">
                  Review our transparent ethics statement
                </div>
              </div>
            </div>

            <button
              onClick={onNavigateToPrivacy}
              className="text-stone-900 font-medium hover:underline underline-offset-4 text-xs shrink-0"
            >
              Privacy Guide
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

