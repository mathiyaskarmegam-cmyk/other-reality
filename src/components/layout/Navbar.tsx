import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAvatarMotif } from '../../lib/avatars';
import { ChevronDown, ShieldAlert, LogOut, User, Compass, PenTool, Archive, Settings, Sparkles } from 'lucide-react';
import { DEMO_PROFILES } from '../../lib/seedData';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenAuth }) => {
  const { user, profile, isModerator, signOut, loginAsDemoUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const motif = getAvatarMotif(profile?.avatar);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-sanctuary-50/90 backdrop-blur-md border-b border-[#EAE7E0] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <button
          onClick={() => onNavigate('discover')}
          className="text-left group focus:outline-none"
        >
          <div className="font-serif text-2xl tracking-tight text-sanctuary-900 group-hover:text-black transition-colors">
            The Other Reality
          </div>
          <div className="text-xs text-[#8C857B] tracking-wide font-sans">
            A sanctuary for quiet experiences
          </div>
        </button>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <button
            onClick={() => onNavigate('discover')}
            className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-all ${
              currentTab === 'discover'
                ? 'text-sanctuary-900 underline underline-offset-8 decoration-2 decoration-sanctuary-900'
                : 'text-[#686256] hover:text-sanctuary-900 hover:bg-[#F2EFE9]'
            }`}
          >
            Discover
          </button>

          <button
            onClick={() => onNavigate('share')}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all border ${
              currentTab === 'share'
                ? 'bg-[#EAE6DD] text-sanctuary-900 border-[#DDD8CD] shadow-sm'
                : 'bg-[#F5F2EB]/60 text-sanctuary-800 border-[#E5E1D7] hover:bg-[#EAE6DD] hover:border-[#DDD8CD]'
            }`}
          >
            Share Experience
          </button>

          <button
            onClick={() => onNavigate('submissions')}
            className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-all ${
              currentTab === 'submissions'
                ? 'text-sanctuary-900 underline underline-offset-8 decoration-2 decoration-sanctuary-900'
                : 'text-[#686256] hover:text-sanctuary-900 hover:bg-[#F2EFE9]'
            }`}
          >
            My Submissions
          </button>

          {/* Staff Moderation Queue Pill (visible only to moderators) */}
          {isModerator && (
            <button
              onClick={() => onNavigate('moderation')}
              className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all border ${
                currentTab === 'moderation'
                  ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-sm'
                  : 'bg-[#ECE8E0] text-[#555047] border-[#DDD8CE] hover:bg-amber-50 hover:text-amber-900 hover:border-amber-200'
              }`}
              title="Restricted Staff Queue for moderation operations"
            >
              <span className="bg-[#DDD8CD] text-[#4A453C] px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider">
                STAFF QUEUE
              </span>
              <span>Moderation</span>
            </button>
          )}
        </nav>

        {/* Right Action / Pseudonym Account Dropdown */}
        <div className="flex items-center space-x-3">
          {profile ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full bg-white border border-[#E2DED6] hover:border-[#D1CCC2] hover:shadow-sm transition-all focus:outline-none"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium shadow-inner"
                  style={{ backgroundColor: motif.bg, color: motif.color }}
                >
                  {motif.symbol}
                </div>
                <span className="text-sm font-medium text-sanctuary-900 max-w-[130px] truncate">
                  {profile.nickname}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-sanctuary-500" />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-float border border-[#E5E2D9] py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-[#F0ECE4]">
                    <div className="text-[11px] uppercase tracking-wider text-[#8A847A] font-semibold">
                      Pseudonymous Identity
                    </div>
                    <div className="font-serif text-base text-sanctuary-900 font-medium truncate mt-0.5">
                      {profile.nickname}
                    </div>
                    <div className="text-xs text-sanctuary-500 mt-0.5">
                      {motif.name} archetype
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onNavigate('account');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FAF8F5] flex items-center space-x-2.5 text-sanctuary-800"
                    >
                      <Settings className="w-4 h-4 text-[#8A847A]" />
                      <span>Account & Sanctuary Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onNavigate('submissions');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FAF8F5] flex items-center space-x-2.5 text-sanctuary-800"
                    >
                      <Archive className="w-4 h-4 text-[#8A847A]" />
                      <span>Private Submissions Archive</span>
                    </button>

                    {isModerator && (
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onNavigate('moderation');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-amber-50 flex items-center space-x-2.5 text-amber-900"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-700" />
                        <span>Staff Moderation Queue</span>
                      </button>
                    )}
                  </div>

                  {/* Switch Demo Identities (convenience for evaluation) */}
                  <div className="border-t border-[#F0ECE4] pt-2 pb-1">
                    <div className="px-4 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#8A847A] flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Switch Identity (Quick Demo)</span>
                    </div>
                    <div className="px-2 py-1 space-y-0.5">
                      {DEMO_PROFILES.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            loginAsDemoUser(p.nickname);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                            profile.nickname === p.nickname
                              ? 'bg-[#F2EFE9] text-sanctuary-900 font-semibold'
                              : 'hover:bg-[#FAF8F5] text-sanctuary-700'
                          }`}
                        >
                          <span>{p.nickname}</span>
                          {p.is_moderator && (
                            <span className="text-[10px] bg-[#DDD8CD] px-1 rounded text-[#4A453C]">
                              Staff
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[#F0ECE4] pt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-700 flex items-center space-x-2.5"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 rounded-full bg-sanctuary-900 hover:bg-black text-white text-sm font-medium shadow-sm transition-all"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Icon for Small Screens */}
          <div className="flex md:hidden">
            <button
              onClick={() => onNavigate(currentTab === 'discover' ? 'share' : 'discover')}
              className="p-2 rounded-full text-sanctuary-700 hover:bg-[#F2EFE9]"
              aria-label="Navigation"
            >
              <Compass className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around py-2 px-3 border-t border-[#EAE7E0] bg-sanctuary-50 text-xs">
        <button
          onClick={() => onNavigate('discover')}
          className={`py-1 px-2.5 rounded-full ${
            currentTab === 'discover' ? 'bg-[#EAE6DD] font-semibold text-sanctuary-900' : 'text-sanctuary-600'
          }`}
        >
          Discover
        </button>
        <button
          onClick={() => onNavigate('share')}
          className={`py-1 px-2.5 rounded-full ${
            currentTab === 'share' ? 'bg-[#EAE6DD] font-semibold text-sanctuary-900' : 'text-sanctuary-600'
          }`}
        >
          Share
        </button>
        <button
          onClick={() => onNavigate('submissions')}
          className={`py-1 px-2.5 rounded-full ${
            currentTab === 'submissions' ? 'bg-[#EAE6DD] font-semibold text-sanctuary-900' : 'text-sanctuary-600'
          }`}
        >
          Submissions
        </button>
        {isModerator && (
          <button
            onClick={() => onNavigate('moderation')}
            className={`py-1 px-2.5 rounded-full ${
              currentTab === 'moderation' ? 'bg-amber-100 font-semibold text-amber-900' : 'text-amber-800'
            }`}
          >
            Staff
          </button>
        )}
      </div>
    </header>
  );
};

