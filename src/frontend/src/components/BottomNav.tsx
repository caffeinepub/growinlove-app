import { Heart, Lightbulb, HeartHandshake, Sparkles, Users, BookHeart, Flower2 } from 'lucide-react';
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
  { id: 'memories', label: 'Memories', icon: BookHeart },
  { id: 'garden', label: 'Garden', icon: Flower2 },
  { id: 'activities', label: 'Activities', icon: Sparkles },
  { id: 'us', label: 'Us', icon: Users },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2 max-w-2xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-romantic-primary glow-pulse'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-romantic-primary/20' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
