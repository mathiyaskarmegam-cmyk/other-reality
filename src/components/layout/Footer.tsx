import React from 'react';
import { BackendStatusPill } from './BackendStatusPill';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAuth, isLoggedIn }) => {
  return (
    <footer className="border-t border-[#EAE7E0] bg-[#F7F5F0]/70 py-12 px-4 sm:px-6 transition-colors mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left Brand Details */}
        <div>
          <div className="font-serif text-xl tracking-tight text-sanctuary-900">
            The Other Reality
          </div>
          <p className="text-xs text-[#7A756D] mt-1 max-w-sm font-sans">
            A deliberate refuge for thoughtful, pseudonymous prose.
          </p>
        </div>

        {/* Navigation & Status Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-[#686256]">
          <button
            onClick={() => onNavigate('discover')}
            className="hover:text-sanctuary-900 transition-colors"
          >
            Discover
          </button>
          
          <button
            onClick={() => onNavigate('guidelines')}
            className="hover:text-sanctuary-900 transition-colors"
          >
            Guidelines
          </button>

          <button
            onClick={() => onNavigate('privacy')}
            className="hover:text-sanctuary-900 transition-colors"
          >
            Privacy
          </button>

          {isLoggedIn ? (
            <button
              onClick={() => onNavigate('account')}
              className="hover:text-sanctuary-900 transition-colors"
            >
              Account
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="hover:text-sanctuary-900 transition-colors"
            >
              Sign In
            </button>
          )}

          <div className="pl-2 border-l border-[#DDD8CD]">
            <BackendStatusPill />
          </div>
        </div>

      </div>
    </footer>
  );
};

