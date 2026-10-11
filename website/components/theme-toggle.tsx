'use client';

import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { setTheme } = useTheme();
  return <button className="theme-toggle" type="button" aria-label="Switch color theme" onClick={() => setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9Z"/></svg></button>;
}
