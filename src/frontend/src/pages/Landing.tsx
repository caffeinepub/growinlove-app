import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LoginButton } from '@/components/LoginButton';
import { LandingScreenshotCarousel } from '@/components/LandingScreenshotCarousel';
import { LandingHeroScreenshotShowcase } from '@/components/LandingHeroScreenshotShowcase';
import { LandingFooterLinksDialog } from '@/components/LandingFooterLinksDialog';
import { LandingBrand } from '@/components/LandingBrand';
import { LandingOurStory } from '@/components/LandingOurStory';
import { Heart, Shield, TrendingUp, Calendar, Sparkles, Users } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useSectionEntrance } from '@/hooks/useSectionEntrance';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export function Landing() {
  const [dialogContent, setDialogContent] = useState<'about' | 'contact' | 'terms' | 'privacy' | 'investor' | null>(null);
  const [openFeature, setOpenFeature] = useState<string | null>(null);
  const { login } = useInternetIdentity();

  const heroSection = useSectionEntrance({ threshold: 0.2 });
  const benefitSection = useSectionEntrance({ threshold: 0.15 });
  const previewSection = useSectionEntrance({ threshold: 0.15 });
  const storySection = useSectionEntrance({ threshold: 0.15 });
  const privacySection = useSectionEntrance({ threshold: 0.15 });
  const featuresSection = useSectionEntrance({ threshold: 0.15 });
  const ctaSection = useSectionEntrance({ threshold: 0.2 });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    login();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 py-2.5 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-3">
            <LandingBrand variant="compact" />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LoginButton />
          </div>
        </div>
      </header>

      <div className="space-y-16 md:space-y-24">
        {/* Hero Section */}
        <section
          ref={heroSection.ref}
          className={`container mx-auto px-4 py-12 md:py-16 max-w-7xl transition-all duration-700 ${
            heroSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent blur-2xl -z-10" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-romantic-primary via-romantic-accent to-romantic-deep bg-clip-text text-transparent leading-tight">
                  Grow closer, one day at a time.
                </h1>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto md:mx-0">
                A gentle, private space for couples to deepen their connection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="rounded-full text-base px-8 py-4 bg-gradient-to-r from-romantic-primary via-romantic-accent to-romantic-deep hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Start your journey
                </Button>
              </div>
              <p className="text-sm text-muted-foreground italic pt-2">
                Your love story begins here — built by a couple, for couples.
              </p>
            </div>
            <div className="flex justify-center">
              <LandingHeroScreenshotShowcase />
            </div>
          </div>
        </section>

        {/* Benefit Trio */}
        <section
          id="features"
          ref={benefitSection.ref}
          className={`bg-muted/20 py-16 md:py-24 transition-all duration-700 delay-100 ${
            benefitSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-romantic-primary/50 hover:shadow-lg transition-all space-y-4">
                <div className="w-12 h-12 rounded-full bg-romantic-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-romantic-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground leading-snug">Daily rituals that spark connection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Share meaningful moments every day with thoughtful prompts designed to bring you closer.
                </p>
              </div>
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-romantic-accent/50 hover:shadow-lg transition-all space-y-4">
                <div className="w-12 h-12 rounded-full bg-romantic-accent/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-romantic-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground leading-snug">Discover your shared love languages</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Take the quiz together and unlock personalized insights about how you both give and receive love.
                </p>
              </div>
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:border-romantic-deep/50 hover:shadow-lg transition-all space-y-4">
                <div className="w-12 h-12 rounded-full bg-romantic-deep/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-romantic-deep" />
                </div>
                <h3 className="text-xl font-bold text-foreground leading-snug">Build memories, streaks, and harmony</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track your journey together with beautiful insights, milestone badges, and a shared scrapbook.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Preview Carousel */}
        <section
          ref={previewSection.ref}
          className={`container mx-auto px-4 max-w-7xl transition-all duration-700 delay-150 ${
            previewSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">See it in action</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A glimpse into your daily ritual experience
            </p>
          </div>
          <LandingScreenshotCarousel />
        </section>

        {/* Founder Story */}
        <section
          id="about"
          ref={storySection.ref}
          className={`bg-muted/30 py-16 md:py-24 transition-all duration-700 delay-200 ${
            storySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl mx-auto space-y-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-romantic-primary/10 flex items-center justify-center">
                  <Users className="w-7 h-7 text-romantic-primary" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Story</h2>
              <LandingOurStory />
            </div>
          </div>
        </section>

        {/* Privacy Reassurance */}
        <section
          ref={privacySection.ref}
          className={`container mx-auto px-4 max-w-7xl transition-all duration-700 delay-100 ${
            privacySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-3 mb-10">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-romantic-accent/10 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-romantic-accent" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Your privacy matters</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-full bg-romantic-primary/10 flex items-center justify-center mx-auto">
                  <Shield className="w-5 h-5 text-romantic-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Your data is yours.</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We never sell or share your personal information.
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-full bg-romantic-accent/10 flex items-center justify-center mx-auto">
                  <Sparkles className="w-5 h-5 text-romantic-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Stored securely on the Internet Computer.</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Decentralized, private, and built for trust.
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-full bg-romantic-deep/10 flex items-center justify-center mx-auto">
                  <Heart className="w-5 h-5 text-romantic-deep" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No emails, no tracking, no ads.</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Just you, your partner, and your journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Optional Feature Deep-dives */}
        <section
          ref={featuresSection.ref}
          className={`bg-muted/20 py-16 md:py-24 transition-all duration-700 delay-150 ${
            featuresSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-8">
                Everything you need to grow together
              </h2>

              <Collapsible
                open={openFeature === 'rituals'}
                onOpenChange={(open) => setOpenFeature(open ? 'rituals' : null)}
              >
                <CollapsibleTrigger className="w-full bg-card/60 backdrop-blur-sm rounded-xl p-5 border border-border/50 hover:border-romantic-primary/50 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-romantic-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-romantic-primary" />
                    </div>
                    <span className="text-lg font-semibold text-foreground">Daily Rituals</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      openFeature === 'rituals' ? 'rotate-180' : ''
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-5 pt-4 pb-2">
                  <p className="text-muted-foreground leading-relaxed">
                    Start each day with a thoughtful prompt designed to spark meaningful conversation and connection. Share your thoughts, feelings, and moments through text, emojis, or photos.
                  </p>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                open={openFeature === 'languages'}
                onOpenChange={(open) => setOpenFeature(open ? 'languages' : null)}
              >
                <CollapsibleTrigger className="w-full bg-card/60 backdrop-blur-sm rounded-xl p-5 border border-border/50 hover:border-romantic-accent/50 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-romantic-accent/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-romantic-accent" />
                    </div>
                    <span className="text-lg font-semibold text-foreground">Love Languages</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      openFeature === 'languages' ? 'rotate-180' : ''
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-5 pt-4 pb-2">
                  <p className="text-muted-foreground leading-relaxed">
                    Discover how you and your partner give and receive love. Take the quiz together to unlock personalized insights and activities tailored to your unique relationship.
                  </p>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                open={openFeature === 'insights'}
                onOpenChange={(open) => setOpenFeature(open ? 'insights' : null)}
              >
                <CollapsibleTrigger className="w-full bg-card/60 backdrop-blur-sm rounded-xl p-5 border border-border/50 hover:border-romantic-deep/50 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-romantic-deep/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-romantic-deep" />
                    </div>
                    <span className="text-lg font-semibold text-foreground">Insights & Milestones</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      openFeature === 'insights' ? 'rotate-180' : ''
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-5 pt-4 pb-2">
                  <p className="text-muted-foreground leading-relaxed">
                    Track your journey with beautiful visualizations of your streak, harmony meter, and milestone badges. Celebrate your progress and see how your relationship grows over time.
                  </p>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                open={openFeature === 'memories'}
                onOpenChange={(open) => setOpenFeature(open ? 'memories' : null)}
              >
                <CollapsibleTrigger className="w-full bg-card/60 backdrop-blur-sm rounded-xl p-5 border border-border/50 hover:border-romantic-primary/50 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-romantic-primary/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-romantic-primary" />
                    </div>
                    <span className="text-lg font-semibold text-foreground">Shared Scrapbook</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      openFeature === 'memories' ? 'rotate-180' : ''
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-5 pt-4 pb-2">
                  <p className="text-muted-foreground leading-relaxed">
                    Revisit your favorite moments together in your private scrapbook. Every ritual response, photo, and memory is preserved for you to cherish and reflect on.
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section
          ref={ctaSection.ref}
          className={`container mx-auto px-4 max-w-7xl transition-all duration-700 delay-200 ${
            ctaSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="max-w-2xl mx-auto text-center space-y-8 bg-gradient-to-br from-romantic-primary/5 via-romantic-accent/5 to-romantic-deep/5 rounded-3xl p-10 md:p-12 border border-romantic-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to grow closer?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Join couples who are strengthening their relationships, one day at a time.
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="rounded-full text-base px-10 py-5 bg-gradient-to-r from-romantic-primary via-romantic-accent to-romantic-deep hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Start your journey
            </Button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border/50 py-10 mt-16 md:mt-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <LandingBrand variant="compact" />
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <button
                onClick={() => setDialogContent('about')}
                className="hover:text-foreground transition-colors"
              >
                About
              </button>
              <button
                onClick={() => setDialogContent('contact')}
                className="hover:text-foreground transition-colors"
              >
                Contact
              </button>
              <button
                onClick={() => setDialogContent('terms')}
                className="hover:text-foreground transition-colors"
              >
                Terms
              </button>
              <button
                onClick={() => setDialogContent('privacy')}
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </button>
              <button
                onClick={() => setDialogContent('investor')}
                className="hover:text-foreground transition-colors"
              >
                Investor
              </button>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} GrowInLove. Built with{' '}
              <Heart className="inline w-4 h-4 text-romantic-accent" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'growinlove-app'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      <LandingFooterLinksDialog
        content={dialogContent}
        onClose={() => setDialogContent(null)}
      />
    </div>
  );
}
