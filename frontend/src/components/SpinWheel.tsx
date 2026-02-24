import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { LoveLanguage } from '../backend';
import type { LoveLanguagesQuizResult } from '../backend';

interface SpinWheelProps {
  bothCompletedQuiz: boolean;
  combinedQuizState?: {
    callerResults?: LoveLanguagesQuizResult;
    partnerResults?: LoveLanguagesQuizResult;
  } | null;
}

const loveLanguages = [
  { 
    name: 'Quality Time', 
    color: 'oklch(0.75 0.15 280)', 
    bgColor: 'oklch(0.75 0.15 280 / 0.15)',
    enum: LoveLanguage.qualityTime,
    description: 'Shared activities and meaningful moments together'
  },
  { 
    name: 'Words of Affirmation', 
    color: 'oklch(0.70 0.18 45)', 
    bgColor: 'oklch(0.70 0.18 45 / 0.15)',
    enum: LoveLanguage.wordsOfAffirmation,
    description: 'Expressing love through kind words and encouragement'
  },
  { 
    name: 'Physical Touch', 
    color: 'oklch(0.65 0.20 15)', 
    bgColor: 'oklch(0.65 0.20 15 / 0.15)',
    enum: LoveLanguage.physicalTouch,
    description: 'Connection through gentle touch and closeness'
  },
  { 
    name: 'Acts of Service', 
    color: 'oklch(0.68 0.16 150)', 
    bgColor: 'oklch(0.68 0.16 150 / 0.15)',
    enum: LoveLanguage.actsOfService,
    description: 'Showing love through helpful actions'
  },
  { 
    name: 'Receiving Gifts', 
    color: 'oklch(0.72 0.17 340)', 
    bgColor: 'oklch(0.72 0.17 340 / 0.15)',
    enum: LoveLanguage.receivingGifts,
    description: 'Thoughtful surprises and tokens of affection'
  },
];

export function SpinWheel({ bothCompletedQuiz, combinedQuizState }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<typeof loveLanguages[0] | null>(null);
  const [rotation, setRotation] = useState(0);
  const [hasSpunToday, setHasSpunToday] = useState(false);

  const wheelRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const startRotationRef = useRef<number>(0);
  const targetRotationRef = useRef<number>(0);
  const spinDurationRef = useRef<number>(0);

  // Check if user has spun today (using localStorage)
  useEffect(() => {
    const lastSpinDate = localStorage.getItem('lastSpinDate');
    const today = new Date().toDateString();
    if (lastSpinDate === today) {
      setHasSpunToday(true);
      const savedLanguage = localStorage.getItem('todaySpinResult');
      if (savedLanguage) {
        const lang = loveLanguages.find(l => l.name === savedLanguage);
        if (lang) setSelectedLanguage(lang);
      }
    }
  }, []);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Ease-out cubic for smooth deceleration
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  const animateSpin = (timestamp: number) => {
    if (startTimeRef.current === 0) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / spinDurationRef.current, 1);

    // Apply easing function
    const easedProgress = easeOutCubic(progress);
    
    // Calculate current rotation
    const currentRotation = startRotationRef.current + 
      (targetRotationRef.current - startRotationRef.current) * easedProgress;
    
    setRotation(currentRotation);

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animateSpin);
    } else {
      // Animation complete - add slight bounce effect
      const bounceAmount = 5; // degrees
      const bounceRotation = currentRotation + bounceAmount;
      setRotation(bounceRotation);
      
      setTimeout(() => {
        setRotation(currentRotation);
        setIsSpinning(false);
        
        // Calculate final selected language
        const normalizedRotation = currentRotation % 360;
        const segmentAngle = 360 / loveLanguages.length;
        const selectedIndex = Math.floor(normalizedRotation / segmentAngle);
        
        setSelectedLanguage(loveLanguages[selectedIndex]);
        setHasSpunToday(true);
        
        // Save to localStorage
        const today = new Date().toDateString();
        localStorage.setItem('lastSpinDate', today);
        localStorage.setItem('todaySpinResult', loveLanguages[selectedIndex].name);
      }, 150);
    }
  };

  const handleSpin = () => {
    if (isSpinning || hasSpunToday) return;

    setIsSpinning(true);
    setSelectedLanguage(null);

    // Calculate weighted random selection based on quiz results
    let selectedIndex = 0;
    
    if (bothCompletedQuiz && combinedQuizState?.callerResults && combinedQuizState?.partnerResults) {
      // Get top 3 love languages from both partners
      const callerTop3 = combinedQuizState.callerResults.rankings.slice(0, 3).map(r => r.language);
      const partnerTop3 = combinedQuizState.partnerResults.rankings.slice(0, 3).map(r => r.language);
      
      // Find shared languages
      const sharedLanguages = callerTop3.filter(lang => partnerTop3.includes(lang));
      
      // If there are shared languages, bias towards them
      if (sharedLanguages.length > 0) {
        const randomShared = sharedLanguages[Math.floor(Math.random() * sharedLanguages.length)];
        selectedIndex = loveLanguages.findIndex(l => l.enum === randomShared);
      } else {
        // Otherwise pick from combined top languages
        const combinedTop = [...new Set([...callerTop3, ...partnerTop3])];
        const randomTop = combinedTop[Math.floor(Math.random() * combinedTop.length)];
        selectedIndex = loveLanguages.findIndex(l => l.enum === randomTop);
      }
    } else {
      // Random selection if quiz not completed
      selectedIndex = Math.floor(Math.random() * loveLanguages.length);
    }

    // Calculate rotation with randomized offset to avoid landing on dividing lines
    const segmentAngle = 360 / loveLanguages.length;
    const segmentCenter = selectedIndex * segmentAngle + segmentAngle / 2;
    
    // Add random offset between 5-10 degrees from center to avoid landing on lines
    const offsetRange = 10;
    const minOffset = 5;
    const randomOffset = (Math.random() * offsetRange + minOffset) * (Math.random() > 0.5 ? 1 : -1);
    const targetAngle = segmentCenter + randomOffset;
    
    // Random 3-5 full spins
    const spins = 3 + Math.floor(Math.random() * 3);
    const finalRotation = rotation + spins * 360 + targetAngle;

    // Set up animation parameters with random duration between 3-5 seconds
    spinDurationRef.current = 3000 + Math.random() * 2000;
    startRotationRef.current = rotation;
    targetRotationRef.current = finalRotation;
    startTimeRef.current = 0;

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animateSpin);
  };

  const handleReset = () => {
    setSelectedLanguage(null);
    setHasSpunToday(false);
    setRotation(0);
    localStorage.removeItem('lastSpinDate');
    localStorage.removeItem('todaySpinResult');
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Spin the wheel to discover your love language focus for today! The wheel is weighted towards your shared preferences.
      </p>

      {/* Wheel Container */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Pointer */}
        <div className="relative z-10 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-primary drop-shadow-lg" />
        
        {/* Wheel */}
        <div className="relative w-72 h-72 -mt-4">
          <div
            ref={wheelRef}
            className="absolute inset-0 rounded-full overflow-hidden shadow-2xl transition-transform"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: isSpinning ? '0ms' : '150ms',
              background: `conic-gradient(
                ${loveLanguages.map((lang, i) => {
                  const startAngle = (i * 360) / loveLanguages.length;
                  const endAngle = ((i + 1) * 360) / loveLanguages.length;
                  return `${lang.color} ${startAngle}deg ${endAngle}deg`;
                }).join(', ')}
              )`
            }}
          >
            {/* Wheel segments with text */}
            {loveLanguages.map((lang, i) => {
              const angle = (i * 360) / loveLanguages.length + (360 / loveLanguages.length / 2);
              return (
                <div
                  key={lang.name}
                  className="absolute top-1/2 left-1/2 origin-left"
                  style={{
                    transform: `rotate(${angle}deg) translateX(60px)`,
                    width: '80px',
                  }}
                >
                  <div 
                    className="text-white text-xs font-bold text-center drop-shadow-md"
                    style={{ transform: 'rotate(-90deg)' }}
                  >
                    {lang.name.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Center circle */}
          <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-card border-4 border-primary shadow-lg flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary fill-primary" />
          </div>
        </div>

        {/* Spin Button */}
        <Button
          onClick={handleSpin}
          disabled={isSpinning || hasSpunToday}
          className="rounded-2xl px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-accent hover:bg-accent/90"
        >
          {isSpinning ? (
            <>
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              Spinning...
            </>
          ) : hasSpunToday ? (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Spun Today
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Spin the Wheel
            </>
          )}
        </Button>
      </div>

      {/* Result Display */}
      {selectedLanguage && (
        <div className="space-y-4 gentle-entrance">
          <div 
            className="p-6 rounded-2xl border-2 shadow-md"
            style={{ 
              backgroundColor: selectedLanguage.bgColor,
              borderColor: selectedLanguage.color
            }}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: selectedLanguage.color }}
              >
                <Heart className="w-7 h-7 text-white fill-white" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold text-foreground">
                  Today's Focus: {selectedLanguage.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedLanguage.description}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
            <p className="text-sm text-foreground">
              💡 Your daily ritual will be themed around <span className="font-semibold">{selectedLanguage.name}</span> today!
            </p>
          </div>

          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full rounded-2xl"
          >
            Reset for Tomorrow
          </Button>
        </div>
      )}

      {!bothCompletedQuiz && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            💡 Complete the Love Languages quiz together to get personalized wheel results!
          </p>
        </div>
      )}
    </div>
  );
}
