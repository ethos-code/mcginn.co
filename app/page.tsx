import { enrichWorkEntries, loadWorkEntries } from '@/lib/content';
import { WorkSections } from '@/components/WorkSections';
import { NextSection } from '@/components/NextSection';
import { Footer } from '@/components/Footer';

export default async function HomePage() {
  const entries = await enrichWorkEntries(loadWorkEntries());

  return (
    <main>
      {/* Hidden H1 for SEO/a11y; the visible page leads with Fountain. */}
      <h1 className="sr-only">John McGinn — Designer & Founder</h1>
      <WorkSections entries={entries} />
      <NextSection />
      <Footer sticky />
    </main>
  );
}
