'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || target.isContentEditable) {
          return;
        }
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'l' || e.key === 'L') {
        if (pathname !== '/logbook') {
          e.preventDefault();
          router.push('/logbook');
        }
      } else if (e.key === 'Escape' && pathname === '/logbook') {
        e.preventDefault();
        router.push('/');
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pathname, router]);

  return null;
}
