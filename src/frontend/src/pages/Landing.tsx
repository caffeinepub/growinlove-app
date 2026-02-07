import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LoginButton } from '@/components/LoginButton';
import { LandingScreenshotCarousel } from '@/components/LandingScreenshotCarousel';
import { LandingHeroScreenshotShowcase } from '@/components/LandingHeroScreenshotShowcase';
import { LandingFooterLinksDialog } from '@/components/LandingFooterLinksDialog';
import { Heart, Shield, TrendingUp, Calendar, Sparkles, Users } from 'lucide-react';
import { founderStory } from '@/content/founderStory';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface LandingProps {
  onEnterApp: () => void;
}

export function Landing({ onEnterApp }: LandingProps) {
  const [dialogContent, setDialogContent] = useState<'about' | 'contact' | 'terms' | 'privacy' | 'investor' | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-peach/10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/landing-logo-icon-transparent.v2.dim_256x256.png"
              alt="GrowInLove"
              className="h-10 w-10 object-contain"
            />
            <img
              src="/assets/generated/landing-wordmark-transparent.v2.dim_720x200.png"
              alt="GrowInLove"
              className="h-8 object-contain hidden sm:block"
            />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-primary leading-tight">
              Grow closer, one day at a time.
            </h1>
            <p className="text-xl text-muted-foreground">
              A gentle, private space for couples to deepen their connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                size="lg"
                onClick={onEnterApp}
                className="rounded-full text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                Start your journey
              </Button>
            </div>
            <p className="text-sm text-muted-foreground italic">
              Built by a couple, for couples.
            </p>
          </div>
          <div className="flex justify-center">
            <LandingHeroScreenshotShowcase />
          </div>
        </div>
      </section>

      {/* Benefit Trio */}
      <section id="features" className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-primary/50 transition-colors space-y-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Daily rituals that spark connection</h3>
            <p className="text-muted-foreground">
              Share meaningful moments every day with thoughtful prompts designed to bring you closer.
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-primary/50 transition-colors space-y-4">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
              <Heart className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Discover your shared love languages</h3>
            <p className="text-muted-foreground">
              Take the quiz together and unlock personalized insights about how you both give and receive love.
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:border-primary/50 transition-colors space-y-4">
            <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-secondary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Build memories, streaks, and harmony</h3>
            <p className="text-muted-foreground">
              Track your journey together with beautiful insights, milestone badges, and a shared scrapbook.
            </p>
          </div>
        </div>
      </section>

      {/* Product Preview Carousel */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-foreground">See it in action</h2>
          <p className="text-xl text-muted-foreground">
            A glimpse into your daily ritual experience
          </p>
        </div>
        <LandingScreenshotCarousel />
      </section>

      {/* Founder Story */}
      <section id="about" className="bg-gradient-to-br from-secondary/20 to-peach/20 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-foreground">Our Story</h2>
            <div className="prose prose-lg mx-auto text-muted-foreground space-y-4 text-left">
              {founderStory.split('\n\n').map((paragraph, index) => (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Reassurance */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-accent" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-foreground">Your privacy matters</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Your data is yours.</h3>
              <p className="text-muted-foreground">
                We never sell or share your personal information.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Stored securely on the Internet Computer.</h3>
              <p className="text-muted-foreground">
                Decentralized, private, and built for trust.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">No emails, no tracking, no ads.</h3>
              <p className="text-muted-foreground">
                Just you, your partner, and your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Optional Feature Deep-dives */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-4xl font-bold text-foreground text-center mb-8">Explore the features</h2>
          
          <Collapsible className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
            <CollapsibleTrigger className="w-full px-6 py-5 flex items-center justify-between hover:bg-secondary/10 transition-colors">
              <h3 className="text-xl font-semibold text-foreground">Daily Rituals</h3>
              <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-5 text-muted-foreground">
              <p>
                Every day, you and your partner receive a thoughtful prompt designed to spark connection. 
                Share your responses through text, emojis, or photos. Complete rituals together to build 
                your streak and deepen your bond.
              </p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
            <CollapsibleTrigger className="w-full px-6 py-5 flex items-center justify-between hover:bg-secondary/10 transition-colors">
              <h3 className="text-xl font-semibold text-foreground">Love Languages</h3>
              <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-5 text-muted-foreground">
              <p>
                Take the Love Languages quiz together to discover how you each prefer to give and receive love. 
                Your results unlock personalized prompts and activities tailored to your unique relationship dynamic.
              </p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
            <CollapsibleTrigger className="w-full px-6 py-5 flex items-center justify-between hover:bg-secondary/10 transition-colors">
              <h3 className="text-xl font-semibold text-foreground">Insights</h3>
              <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-5 text-muted-foreground">
              <p>
                Track your relationship journey with beautiful visualizations. See your current streak, 
                harmony meter, completion trends, and unlock milestone badges as you grow together.
              </p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
            <CollapsibleTrigger className="w-full px-6 py-5 flex items-center justify-between hover:bg-secondary/10 transition-colors">
              <h3 className="text-xl font-semibold text-foreground">Memories</h3>
              <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-5 text-muted-foreground">
              <p>
                Your shared scrapbook of every ritual you've completed together. Scroll through your history, 
                relive special moments, and see how far you've come as a couple.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Start Growing Together
          </h2>
          <p className="text-xl text-muted-foreground">
            Join couples who are choosing connection, one day at a time.
          </p>
          <Button
            size="lg"
            onClick={onEnterApp}
            className="rounded-full text-lg px-10 py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            Open GrowInLove
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-card/50 backdrop-blur-sm border-t border-border/50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/landing-logo-icon-transparent.v2.dim_256x256.png"
                alt="GrowInLove"
                className="h-8 w-8 object-contain"
              />
              <span className="text-sm text-muted-foreground">
                © 2026. Built with <Heart className="inline w-4 h-4 text-primary" /> using{' '}
                <a
                  href="https://caffeine.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  caffeine.ai
                </a>
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <button
                onClick={() => scrollToSection('about')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </button>
              <button
                onClick={() => setDialogContent('contact')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </button>
              <button
                onClick={() => setDialogContent('terms')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms
              </button>
              <button
                onClick={() => setDialogContent('privacy')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy
              </button>
              <button
                onClick={() => setDialogContent('investor')}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Interested in supporting our growth?
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer Links Dialog */}
      <LandingFooterLinksDialog
        content={dialogContent}
        onClose={() => setDialogContent(null)}
      />
    </div>
  );
}
