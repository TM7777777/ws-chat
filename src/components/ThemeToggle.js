import React, { useState, useEffect } from 'react';
import { eventBus } from '../utils/eventBus';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    const initialTheme = savedTheme || 'light';
    const isInitiallyDark = initialTheme === 'dark';
    setIsDark(isInitiallyDark);
    document.documentElement.setAttribute('data-theme', initialTheme);

    eventBus.emit('themeChanged', isInitiallyDark);
  }, []);

  useEffect(() => {
    const handleRiveThemeChange = (isDarkFromRive) => {
      const newTheme = isDarkFromRive ? 'dark' : 'light';
      setIsDark(isDarkFromRive);
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    };

    eventBus.on('riveThemeToggle', handleRiveThemeChange);

    return () => {
      eventBus.off('riveThemeToggle', handleRiveThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    eventBus.emit('themeChanged', newIsDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}>
      Theme:
      {isDark ? ' 🌙' : ' ☀️'}
    </button>
  );
};

export default ThemeToggle;
