import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DiscoverFeed } from './components/discovery/DiscoverFeed';
import { ShareExperience } from './components/studio/ShareExperience';
import { MySubmissions } from './components/submissions/MySubmissions';
import { ModerationQueue } from './components/moderation/ModerationQueue';
import { AccountPage } from './components/account/AccountPage';
import { AuthPage } from './components/auth/AuthPage';
import { PrivacyPage } from './components/static/PrivacyPage';
import { GuidelinesPage } from './components/static/GuidelinesPage';

function SanctuaryApp() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('discover');
  const [authSubView, setAuthSubView] = useState<'auth' | 'privacy' | 'guidelines'>('auth');

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. GATEWAY: If user is not yet logged in, show Login / Sign Up first!
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-sanctuary-50 text-sanctuary-800">
        <header className="border-b border-[#EAE7E0] bg-sanctuary-50/90 backdrop-blur-md py-5 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setAuthSubView('auth')}
              className="text-left focus:outline-none group"
            >
              <div className="font-serif text-2xl tracking-tight text-sanctuary-900 group-hover:text-black transition-colors">
                The Other Reality
              </div>
              <div className="text-xs text-[#8C857B] tracking-wide font-sans">
                A sanctuary for quiet experiences
              </div>
            </button>

            <div className="flex items-center space-x-5 text-xs text-[#686256]">
              <button
                onClick={() => setAuthSubView('guidelines')}
                className="hover:text-stone-900 transition-colors"
              >
                Guidelines
              </button>
              <button
                onClick={() => setAuthSubView('privacy')}
                className="hover:text-stone-900 transition-colors"
              >
                Privacy
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {authSubView === 'privacy' && (
            <PrivacyPage onBack={() => setAuthSubView('auth')} />
          )}

          {authSubView === 'guidelines' && (
            <GuidelinesPage onBack={() => setAuthSubView('auth')} />
          )}

          {authSubView === 'auth' && (
            <AuthPage
              onSuccess={() => {
                setCurrentTab('discover');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToPrivacy={() => setAuthSubView('privacy')}
            />
          )}
        </main>

        <Footer
          onNavigate={(tab) => {
            if (tab === 'privacy') setAuthSubView('privacy');
            else if (tab === 'guidelines') setAuthSubView('guidelines');
            else setAuthSubView('auth');
          }}
          onOpenAuth={() => setAuthSubView('auth')}
          isLoggedIn={false}
        />
      </div>
    );
  }

  // 2. MAIN APPLICATION: Shown only after login or sign up
  return (
    <div className="min-h-screen flex flex-col bg-sanctuary-50 text-sanctuary-800">
      
      {/* Top Shared Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenAuth={() => handleNavigate('auth')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'discover' && (
          <DiscoverFeed onNavigateToShare={() => handleNavigate('share')} />
        )}

        {currentTab === 'share' && (
          <ShareExperience
            onPublishSuccess={() => handleNavigate('submissions')}
            onNavigateToAuth={() => handleNavigate('auth')}
          />
        )}

        {currentTab === 'submissions' && (
          <MySubmissions
            onNavigateToShare={() => handleNavigate('share')}
            onNavigateToAuth={() => handleNavigate('auth')}
          />
        )}

        {currentTab === 'moderation' && <ModerationQueue />}

        {currentTab === 'account' && (
          <AccountPage
            onSignOutSuccess={() => {
              setCurrentTab('discover');
              setAuthSubView('auth');
            }}
            onNavigateToGuidelines={() => handleNavigate('guidelines')}
          />
        )}

        {currentTab === 'privacy' && (
          <PrivacyPage onBack={() => handleNavigate('discover')} />
        )}

        {currentTab === 'guidelines' && (
          <GuidelinesPage onBack={() => handleNavigate('discover')} />
        )}
      </main>

      {/* Bottom Shared Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAuth={() => handleNavigate('auth')}
        isLoggedIn={true}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SanctuaryApp />
    </AuthProvider>
  );
}
