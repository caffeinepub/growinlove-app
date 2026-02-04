import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './pages/Home';
import { Insights } from './pages/Insights';
import { LoveLanguages } from './pages/LoveLanguages';
import { Activities } from './pages/Activities';
import { Us } from './pages/Us';
import { Memories } from './pages/Memories';
import { BottomNav } from './components/BottomNav';
import { LoginButton } from './components/LoginButton';
import { ProfileSetup } from './components/ProfileSetup';
import { Toaster } from '@/components/ui/sonner';
import { Bell, Loader2 } from 'lucide-react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';

export type TabId = 'home' | 'insights' | 'love-languages' | 'activities' | 'us' | 'memories';

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
  const { data: userProfile, isLoading: profileLoading, isFetched, refetch } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  // Show loading screen while initializing or loading profile
  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-peach/10">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show ProfileSetup modal if authenticated but no profile exists
  const showProfileSetup = isAuthenticated && isFetched && userProfile === null;

  const handleProfileSetupSuccess = async () => {
    // Refetch profile to ensure it's loaded
    await refetch();
    // Navigate to Us tab after successful profile setup
    setActiveTab('us');
  };

  // Phase 3: Navigation callback for Home → Insights
  const handleNavigateToInsights = () => {
    setActiveTab('insights');
  };

  // Phase 3: Navigation callback for Us → Love Languages / Insights
  const handleNavigateFromUs = (tab: 'love-languages' | 'insights') => {
    setActiveTab(tab);
  };

  if (showProfileSetup) {
    return (
      <>
        <ProfileSetup onSuccess={handleProfileSetupSuccess} />
        <Toaster />
      </>
    );
  }

  // Show main app content only if authenticated and profile exists
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-peach/10 px-6">
        <div className="text-center space-y-6 max-w-md">
          <img 
            src="/assets/generated/growinlove-logo-transparent.dim_120x40.png" 
            alt="GrowInLove" 
            className="h-12 object-contain mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-primary">Welcome to GrowInLove</h1>
          <p className="text-lg text-muted-foreground">
            Strengthen your relationship through daily rituals and shared moments
          </p>
          <LoginButton />
        </div>
        <Toaster />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigateToInsights={handleNavigateToInsights} />;
      case 'insights':
        return <Insights />;
      case 'love-languages':
        return <LoveLanguages />;
      case 'activities':
        return <Activities />;
      case 'us':
        return <Us onNavigate={handleNavigateFromUs} />;
      case 'memories':
        return <Memories />;
      default:
        return <Home onNavigateToInsights={handleNavigateToInsights} />;
    }
  };

  return (
    <>
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
      <Toaster />
    </>
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
