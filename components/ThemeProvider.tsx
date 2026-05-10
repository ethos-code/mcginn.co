'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';

export interface SectionTheme {
  /** Stable id used to detect when the active section actually changed. */
  id: string;
  bg: string;
  ink: string;
  accent: string;
  statement: string;
}

export const DEFAULT_THEME: SectionTheme = {
  id: 'intro',
  bg: '#FAFAF7',
  ink: '#0A0908',
  accent: '#7A7672',
  statement: 'I design AI systems that act on behalf of people.',
};

interface ThemeContextValue {
  active: SectionTheme;
  register: (theme: SectionTheme, el: HTMLElement) => () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  active: DEFAULT_THEME,
  register: () => () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<SectionTheme>(DEFAULT_THEME);
  const themesRef = useRef<Map<HTMLElement, SectionTheme>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasFiredRef = useRef(false);
  const pathname = usePathname();

  // When the route changes, drop the previous page's active theme so pages
  // without sections (e.g. /resume) render with the default ink color
  // instead of inheriting whatever was active on the homepage.
  useEffect(() => {
    setActive(DEFAULT_THEME);
    hasFiredRef.current = false;
  }, [pathname]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const theme = themesRef.current.get(e.target as HTMLElement);
            if (theme) {
              hasFiredRef.current = true;
              setActive((prev) => (prev.id === theme.id ? prev : theme));
            }
          }
        }
      },
      // Trigger when a section's content crosses the viewport midline.
      { rootMargin: '-50% 0% -50% 0%' }
    );
    observerRef.current = observer;

    themesRef.current.forEach((_, el) => observer.observe(el));

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  // Mirror the active theme onto CSS vars so anything in the tree
  // can use `var(--theme-ink)` etc.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', active.bg);
    root.style.setProperty('--theme-ink', active.ink);
    root.style.setProperty('--theme-accent', active.accent);
  }, [active.bg, active.ink, active.accent]);

  // Keep the iOS Safari chrome (URL bar / status area) tinted in lock-step
  // with the active section. We fully replace the meta element instead of
  // mutating its `content` attribute — some Safari builds (notably the
  // chrome-tint feature on iOS 18) cache the SSR'd value and ignore in-place
  // mutations, which is why Salesforce Suite's blue would snap back to the
  // static fallback color partway through scrolling.
  useEffect(() => {
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((m) => m.remove());
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    meta.setAttribute('content', active.bg);
    document.head.appendChild(meta);
  }, [active.bg]);

  const register = useCallback<ThemeContextValue['register']>((theme, el) => {
    themesRef.current.set(el, theme);
    observerRef.current?.observe(el);

    // Until the IntersectionObserver fires, fall back to the first registered
    // section's theme so the page paints with the right wash on initial load
    // instead of flashing the default paper bg.
    if (!hasFiredRef.current) {
      setActive((prev) => (prev.id === DEFAULT_THEME.id ? theme : prev));
    }

    return () => {
      themesRef.current.delete(el);
      observerRef.current?.unobserve(el);
    };
  }, []);

  const value = useMemo(() => ({ active, register }), [active, register]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

interface SectionThemeWrapperProps extends React.HTMLAttributes<HTMLElement> {
  theme: SectionTheme;
  as?: 'section' | 'header' | 'footer' | 'div';
  children: React.ReactNode;
}

/**
 * Wraps a section in a div whose ref is registered with the ThemeProvider.
 * When this section crosses the viewport midline, the active theme switches.
 */
export function SectionThemeWrapper({
  theme,
  as = 'section',
  children,
  ...rest
}: SectionThemeWrapperProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { register } = useTheme();

  useEffect(() => {
    if (!ref.current) return;
    return register(theme, ref.current);
  }, [register, theme]);

  const Tag = as as 'section';

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      data-section={theme.id}
      {...rest}
    >
      {children}
    </Tag>
  );
}
