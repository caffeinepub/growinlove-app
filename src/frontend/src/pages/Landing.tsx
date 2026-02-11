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

interface LandingProps {
  onEnterApp: () => void;
}

export function Landing({ onEnterApp }: LandingProps) {
  const [dialogContent, setDialogContent] = useState<'about' | 'contact' | 'terms' | 'privacy' | 'investor' | null>(null);
  const [openFeature, setOpenFeature] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 py-2.5 flex items-center justify-between">
          <LandingBrand variant="compact" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroSection.ref}
        className={`container mx-auto px-4 py-8 md:py-12 transition-all duration-700 ${
          heroSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4 text-center md:text-left">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent blur-2xl -z-10" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-br from-romantic-primary via-romantic-accent to-romantic-deep bg-clip-text text-transparent leading-tight">
                Grow closer, one day at a time.
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              A gentle, private space for couples to deepen their connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-1">
              <Button
                size="lg"
                onClick={onEnterApp}
                className="rounded-full text-base px-8 py-5 bg-gradient-to-r from-romantic-primary via-romantic-accent to-romantic-deep hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start your journey
              </Button>
            </div>
            <p className="text-sm text-muted-foreground italic pt-0.5">
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
        className={`container mx-auto px-4 py-8 transition-all duration-700 delay-100 ${
          benefitSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-5 border border-border/50 hover:border-romantic-primary/50 hover:shadow-lg transition-all space-y-3">
            <div className="w-12 h-12 rounded-full bg-romantic-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-romantic-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground leading-snug">Daily rituals that spark connection</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Share meaningful moments every day with thoughtful prompts designed to bring you closer.
            </p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-5 border border-border/50 hover:border-romantic-accent/50 hover:shadow-lg transition-all space-y-3">
            <div className="w-12 h-12 rounded-full bg-romantic-accent/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-romantic-accent" />
            </div>
            <h3 className="text-lg font-bold text-foreground leading-snug">Discover your shared love languages</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Take the quiz together and unlock personalized insights about how you both give and receive love.
            </p>
          </div>
          <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-5 border border-border/50 hover:border-romantic-deep/50 hover:shadow-lg transition-all space-y-3">
            <div className="w-12 h-12 rounded-full bg-romantic-deep/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-romantic-deep" />
            </div>
            <h3 className="text-lg font-bold text-foreground leading-snug">Build memories, streaks, and harmony</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Track your journey together with beautiful insights, milestone badges, and a shared scrapbook.
            </p>
          </div>
        </div>
      </section>

      {/* Product Preview Carousel */}
      <section
        ref={previewSection.ref}
        className={`container mx-auto px-4 py-8 transition-all duration-700 delay-150 ${
          previewSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">See it in action</h2>
          <p className="text-base md:text-lg text-muted-foreground">
            A glimpse into your daily ritual experience
          </p>
        </div>
        <LandingScreenshotCarousel />
      </section>

      {/* Founder Story */}
      <section
        id="about"
        ref={storySection.ref}
        className={`bg-muted/30 py-8 transition-all duration-700 delay-200 ${
          storySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-4 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-full bg-romantic-primary/10 flex items-center justify-center">
                <Users className="w-7 h-7 text-romantic-primary" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Story</h2>
            <LandingOurStory />
          </div>
        </div>
      </section>

      {/* Privacy Reassurance */}
      <section
        ref={privacySection.ref}
        className={`container mx-auto px-4 py-8 transition-all duration-700 delay-100 ${
          privacySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-6">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-full bg-romantic-accent/10 flex items-center justify-center">
                <Shield className="w-7 h-7 text-romantic-accent" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Your privacy matters</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-11 h-11 rounded-full bg-romantic-primary/10 flex items-center justify-center mx-auto">
                <Shield className="w-5 h-5 text-romantic-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Your data is yours.</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                We never sell or share your personal information.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-11 h-11 rounded-full bg-romantic-accent/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5 text-romantic-accent" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Stored securely on the Internet Computer.</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Decentralized, private, and built for trust.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-11 h-11 rounded-full bg-romantic-deep/10 flex items-center justify-center mx-auto">
                <Heart className="w-5 h-5 text-romantic-deep" />
              </div>
              <h3 className="text-base font-semibold text-foreground">No emails, no tracking, no ads.</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Just you, your partner, and your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Optional Feature Deep-dives */}
      <section
        ref={featuresSection.ref}
        className={`container mx-auto px-4 py-8 transition-all duration-700 delay-150 ${
          featuresSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-6">Explore the features</h2>
          
          <Collapsible 
            open={openFeature === 'rituals'}
            onOpenChange={(isOpen) => setOpenFeature(isOpen ? 'rituals' : null)}
            className="bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden hover:border-romantic-primary/50 transition-all"
          >
            <CollapsibleTrigger className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <h3 className="text-base font-semibold text-foreground">Daily Rituals</h3>
              <ChevronDown 
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  openFeature === 'rituals' ? 'rotate-180' : ''
                }`} 
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-5 pb-3.5 text-muted-foreground leading-relaxed text-sm">
              <p>
                Every day, you and your partner receive a thoughtful prompt designed to spark connection. 
                Share your responses through text, emojis, or photos. Complete rituals together to build 
                your streak and deepen your bond.
              </p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible 
            open={openFeature === 'languages'}
            onOpenChange={(isOpen) => setOpenFeature(isOpen ? 'languages' : null)}
            className="bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden hover:border-romantic-primary/50 transition-all"
          >
            <CollapsibleTrigger className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <h3 className="text-base font-semibold text-foreground">Love Languages</h3>
              <ChevronDown 
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  openFeature === 'languages' ? 'rotate-180' : ''
                }`} 
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-5 pb-3.5 text-muted-foreground leading-relaxed text-sm">
              <p>
                Take the Love Languages quiz together to discover how you each prefer to give and receive love. 
                Your results unlock personalized prompts and activities tailored to your unique relationship dynamic.
              </p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible 
            open={openFeature === 'insights'}
            onOpenChange={(isOpen) => setOpenFeature(isOpen ? 'insights' : null)}
            className="bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden hover:border-romantic-primary/50 transition-all"
          >
            <CollapsibleTrigger className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <h3 className="text-base font-semibold text-foreground">Insights & Harmony</h3>
              <ChevronDown 
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  openFeature === 'insights' ? 'rotate-180' : ''
                }`} 
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-5 pb-3.5 text-muted-foreground leading-relaxed text-sm">
              <p>
                Track your relationship journey with beautiful visualizations. See your streak, harmony meter, 
                milestone badges, and shared memories. Celebrate your progress and discover patterns in how you connect.
              </p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible 
            open={openFeature === 'memories'}
            onOpenChange={(isOpen) => setOpenFeature(isOpen ? 'memories' : null)}
            className="bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden hover:border-romantic-primary/50 transition-all"
          >
            <CollapsibleTrigger className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <h3 className="text-base font-semibold text-foreground">Shared Scrapbook</h3>
              <ChevronDown 
                className={`w-5 h-5 text-muted-foreground transition-transform ${
                  openFeature === 'memories' ? 'rotate-180' : ''
                }`} 
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-5 pb-3.5 text-muted-foreground leading-relaxed text-sm">
              <p>
                Your Memories tab is a beautiful timeline of all your shared rituals. Revisit past moments, 
                see photos you've shared, and watch your love story unfold day by day.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>

      {/* Final CTA */}
      <section
        ref={ctaSection.ref}
        className={`container mx-auto px-4 py-12 transition-all duration-700 delay-200 ${
          ctaSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Ready to grow closer?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Start your journey today. No credit card required.
          </p>
          <Button
            size="lg"
            onClick={onEnterApp}
            className="rounded-full text-base px-8 py-5 bg-gradient-to-r from-romantic-primary via-romantic-accent to-romantic-deep hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Begin your love story
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <LandingBrand variant="compact" />
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
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
            <p className="text-sm text-muted-foreground text-center md:text-right">
              © {new Date().getFullYear()} Built with <Heart className="inline w-4 h-4 text-romantic-accent" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'growinlove'
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
