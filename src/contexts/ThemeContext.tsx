import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Use proper Carbon theme names
type Theme = 'white' | 'g10' | 'g90' | 'g100';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('g10');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load theme from settings on initialization
  useEffect(() => {
    const loadTheme = async () => {
      if (window.electronAPI) {
        try {
          const savedTheme = await window.electronAPI.invoke('get-setting', 'theme');
          if (savedTheme && (savedTheme === 'white' || savedTheme === 'g10' || savedTheme === 'g90' || savedTheme === 'g100')) {
            setThemeState(savedTheme as Theme);
          }
        } catch (error) {
          console.error('Failed to load theme setting:', error);
        }
      }
      setIsInitialized(true);
    };

    loadTheme();
  }, []);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    
    // Save theme to settings
    if (window.electronAPI) {
      try {
        await window.electronAPI.invoke('set-setting', 'theme', newTheme);
        await window.electronAPI.invoke('log-message', `Theme changed to: ${newTheme}`);
      } catch (error) {
        console.error('Failed to save theme setting:', error);
      }
    }
  };

  const toggleTheme = async () => {
    // Toggle between light and dark themes
    const newTheme = theme === 'g10' || theme === 'white' ? 'g100' : 'g10';
    await setTheme(newTheme);
  };

  // Don't render until theme is loaded to prevent flash
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 