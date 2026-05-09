import type { Metadata } from 'next';
import { loadLogEntries } from '@/lib/content';
import { Logbook } from '@/components/Logbook';

export const metadata: Metadata = {
  title: 'Logbook',
  description:
    'A record of things John McGinn has made, built, and gone after — outside the design world.',
  openGraph: {
    title: 'Logbook · John McGinn',
    description:
      'Other things John McGinn has made, built, and gone after.',
    url: 'https://mcginn.co/logbook',
  },
  alternates: {
    canonical: 'https://mcginn.co/logbook',
  },
};

export default function LogbookPage() {
  const entries = loadLogEntries();
  return <Logbook entries={entries} />;
}
