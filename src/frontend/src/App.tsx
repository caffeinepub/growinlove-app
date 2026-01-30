import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './pages/Home';
import { Insights } from './pages/Insights';
import { LoveLanguages } from './pages/LoveLanguages';
import { Activities } from './pages/Activities';
import { Us } from './pages/Us';
import { BottomNav } from './components/BottomNav';
import { LoginButton } from './components/LoginButton';
import { ProfileSetup } from './components/ProfileSetup';
import { Bell } from 'lucide-react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';

export type TabId = 'home' | 'insights' | 'love-languages' | 'activities' | 'us';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleProfileSetupSuccess = () => {
    // Navigate to Us tab after successful profile setup
    setActiveTab('us');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'insights':
        return <Insights />;
      case 'love-languages':
        return <LoveLanguages />;
      case 'activities':
        return <Activities />;
      case 'us':
        return <Us />;
      default:
        return <Home />;
    }
  };

  // Show profile setup if user is authenticated but has no profile
  if (showProfileSetup) {
    return <ProfileSetup onSuccess={handleProfileSetupSuccess} />;
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top Bar */}
      <header className="flex-shrink-0 bg-card/50 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between px-6 py-4">
          <img 
            src="/assets/generated/growinlove-logo-transparent.dim_120x40.png" 
            alt="GrowInLove" 
            className="h-8 object-contain"
          />
          <div className="flex items-center gap-3">
            <button 
              className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="fade-in">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
