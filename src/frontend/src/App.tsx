import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { InternetIdentityProvider, useInternetIdentity } from './hooks/useInternetIdentity';
import { LoginButton } from './components/LoginButton';
import BottomNav from './components/BottomNav';
import { Home } from './pages/Home';
import { Insights } from './pages/Insights';
import { Memories } from './pages/Memories';
import Garden from './pages/Garden';
import { Activities } from './pages/Activities';
import { Us } from './pages/Us';
import { Landing } from './pages/Landing';
import { getDraftBuildLabel } from './config/draftBuildLabel';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export type TabId = 'home' | 'insights' | 'memories' | 'garden' | 'activities' | 'us';

function AppContent() {
  const { identity, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity && loginStatus === 'success';

  const [activeTab, setActiveTab] = useState<TabId>('home');

  // Show landing page when not authenticated
  if (!isAuthenticated) {
    return <Landing />;
  }

  // Main app content
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-romantic-light/10">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/growinlove-tree-logo-transparent.dim_256x256.png"
              alt="GrowInLove"
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl font-bold gradient-text">GrowInLove</h1>
              <p className="text-xs text-muted-foreground">{getDraftBuildLabel()}</p>
            </div>
          </div>
          <LoginButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        {activeTab === 'home' && <Home />}
        {activeTab === 'insights' && <Insights />}
        {activeTab === 'memories' && <Memories />}
        {activeTab === 'garden' && <Garden />}
        {activeTab === 'activities' && <Activities />}
        {activeTab === 'us' && <Us />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <InternetIdentityProvider>
          <AppContent />
        </InternetIdentityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
