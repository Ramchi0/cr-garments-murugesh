import { useEffect, useState } from 'react';
import { MoonStar, SunMedium } from 'lucide-react';

const getPreferredTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  const savedTheme = window.localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

export function ExecutiveHeader() {
  const [theme, setTheme] = useState(getPreferredTheme);

  useEffect(() => {
    document.body.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <header className="executive-header" aria-label="Corporate header">
      <span className="brand-mark">C.R. GARMENTS</span>
      <div className="header-actions">
        <span className="brand-location">INDIA</span>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <SunMedium size={15} strokeWidth={2} /> : <MoonStar size={15} strokeWidth={2} />}
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </header>
  );
}
