import { Heart, Lightbulb, HeartHandshake, Sparkles, Users } from 'lucide-react';
import type { TabId } from '../App';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Heart },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'love-languages', label: 'Love Languages', icon: HeartHandshake },
  { id: 'activities', label: 'Activities', icon: Sparkles },
  { id: 'us', label: 'Us', icon: Users },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border/50 shadow-lg z-50">
      <div className="flex items-center justify-around px-2 py-3 max-w-2xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                flex flex-col items-center justify-center gap-1 
                px-4 py-2 rounded-2xl transition-all duration-300 ease-in-out
                min-w-[64px] touch-manipulation
                ${isActive 
                  ? 'text-primary scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:scale-105'
                }
              `}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={isActive ? 'nav-glow' : ''}>
                <Icon 
                  className={`
                    w-6 h-6 transition-all duration-300
                    ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}
                  `} 
                />
              </div>
              <span 
                className={`
                  text-xs font-medium transition-all duration-300
                  ${isActive ? 'opacity-100' : 'opacity-70'}
                `}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
