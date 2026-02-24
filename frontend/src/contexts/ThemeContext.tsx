import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
type EffectiveTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  effectiveTheme: EffectiveTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme from localStorage (lazy init)
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('theme') as Theme | null;
      return saved || 'system';
    } catch {
      return 'system';
    }
  });

  // Derive effective theme from theme preference and system preference
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  });

  // Single effect to apply theme class to DOM (Tailwind-compatible: only 'dark' class)
  useEffect(() => {
    const root = document.documentElement;
    
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [effectiveTheme]);

  // Effect to watch system theme changes (only when theme is 'system')
  useEffect(() => {
    if (theme !== 'system') {
      // When not using system preference, derive effective theme directly
      setEffectiveTheme(theme);
      return;
    }

    // Set up system theme watcher
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateEffectiveTheme = () => {
      setEffectiveTheme(mediaQuery.matches ? 'dark' : 'light');
    };

    // Set initial value
    updateEffectiveTheme();

    // Listen for changes
    mediaQuery.addEventListener('change', updateEffectiveTheme);
    
    return () => {
      mediaQuery.removeEventListener('change', updateEffectiveTheme);
    };
  }, [theme]);

  // Action: set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch {
      // Ignore localStorage errors
    }
    
    // Immediately update effective theme if not system
    if (newTheme !== 'system') {
      setEffectiveTheme(newTheme);
    }
  };

  // Action: toggle between light and dark (never sets to system)
  const toggleTheme = () => {
    const newTheme: Theme = effectiveTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
