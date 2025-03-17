
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('theme');
    // Check for user preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return (savedTheme as Theme) || (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', theme);
    
    // Update the document class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = (newTheme?: Theme) => {
    if (newTheme) {
      setTheme(newTheme);
    } else {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }
  };

  return { theme, toggleTheme };
}
