import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { effectiveTheme, toggleTheme } = useTheme();
  
  const isDark = effectiveTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-muted-foreground" />
      ) : (
        <Moon className="w-5 h-5 text-muted-foreground" />
      )}
    </Button>
  );
}
