import React, { createContext, useContext, useState, useEffect } from 'react';

export const GLASS_THEMES = [
  {
    id: 'light-liquid-glass',
    name: 'Liquid Glass (Default)',
    tag: 'Base Glass',
    desc: 'Solid 95% milky-white with soft blue specular highlights',
    icon: 'Sun',
    accentColor: '#2879E8',
    dotClass: 'bg-[#2879E8]'
  },
  {
    id: 'ice-liquid-glass',
    name: 'Liquid Ice Glass',
    tag: 'Specular Tint',
    desc: 'Arctic cyan & cerulean reflections for high daylight visibility',
    icon: 'Sparkles',
    accentColor: '#0284C7',
    dotClass: 'bg-[#0284C7]'
  },
  {
    id: 'crystal-liquid-glass',
    name: 'Crystal Platinum Glass',
    tag: 'Ultra Contrast',
    desc: 'Pure crisp white surfaces with high-definition edge refraction',
    icon: 'Layers',
    accentColor: '#4F46E5',
    dotClass: 'bg-[#4F46E5]'
  },
  {
    id: 'dark-liquid-glass',
    name: 'Liquid Obsidian Glass',
    tag: 'Night Flight',
    desc: 'Charcoal obsidian glass surfaces with luminescent telemetry',
    icon: 'Moon',
    accentColor: '#38BDF8',
    dotClass: 'bg-[#38BDF8]'
  }
];

const ThemeContext = createContext({
  theme: 'light-liquid-glass',
  setTheme: () => {},
  toggleTheme: () => {},
  toggleDayNight: () => {},
  isDark: false,
  currentTheme: GLASS_THEMES[0],
  themes: GLASS_THEMES
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('autrail_theme_pref') || 'light-liquid-glass';
    } catch {
      return 'light-liquid-glass';
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark-liquid-glass') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('autrail_theme_pref', theme);
    } catch (e) {
      console.warn('Theme storage unavailable:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const idx = GLASS_THEMES.findIndex((t) => t.id === prev);
      const nextIdx = (idx + 1) % GLASS_THEMES.length;
      return GLASS_THEMES[nextIdx].id;
    });
  };

  const toggleDayNight = () => {
    setTheme((prev) => (prev === 'dark-liquid-glass' ? 'light-liquid-glass' : 'dark-liquid-glass'));
  };

  const isDark = theme === 'dark-liquid-glass';
  const currentTheme = GLASS_THEMES.find((t) => t.id === theme) || GLASS_THEMES[0];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        toggleDayNight,
        isDark,
        currentTheme,
        themes: GLASS_THEMES
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
