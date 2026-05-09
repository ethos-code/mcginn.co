import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

export type WorkStatus = 'locked' | 'open';

export interface WorkEntry {
  slug: string;
  title: string;
  year: string;
  order: number;
  status: WorkStatus;
  role?: string;
  client?: string;
  description?: string;
  publicReference?: string | null;
  href?: string | null;
  external?: boolean;
  /** Background color for the section wash. */
  bg?: string;
  /** Foreground/text color for the section. */
  ink?: string;
  /** Accent color (links, mono metadata). */
  accent?: string;
  /** Short statement that types into the top-right typewriter. */
  statement?: string;
  /** Optional artwork image path (relative to /public). */
  image?: string | null;
  /** Alt text for the artwork image. */
  imageAlt?: string | null;
  /** Override label for the primary CTA on the work card. Defaults to "Open case study". */
  cta?: string;
  /** Custom metrics shown in the case-study "At a glance" chapter. */
  metrics?: Array<{ label: string; value: string }>;
  /** Client roll-call shown in the case-study "Clients" chapter. */
  clients?: string[];
  body: string;
  /** Body rendered as HTML — populated by `enrichWorkEntries` at build time. */
  bodyHtml?: string;
}

export interface LogEntry {
  slug: string;
  title: string;
  year: string;
  order: number;
  image?: string | null;
  imageAlt?: string | null;
  /** Short blurb shown on the index for locked/draft entries. */
  description?: string;
  /** When true, the entry is shown on the index but not yet published — no detail page generated. */
  locked?: boolean;
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content');

function readMarkdownDir<T extends { slug: string; order: number }>(
  dir: string,
  defaults: (data: Record<string, unknown>, slug: string) => Omit<T, 'body'>
): T[] {
  const fullDir = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(fullDir)) return [];

  const files = fs.readdirSync(fullDir).filter((f) => f.endsWith('.md'));

  const entries = files.map((file) => {
    const raw = fs.readFileSync(path.join(fullDir, file), 'utf8');
    const { data, content } = matter(raw);
    const slug = (data.slug as string) ?? file.replace(/\.md$/, '');
    const meta = defaults(data, slug);
    return { ...meta, body: content } as unknown as T;
  });

  return entries.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export function loadWorkEntries(): WorkEntry[] {
  return readMarkdownDir<WorkEntry>('work', (data, slug) => ({
    slug,
    title: (data.title as string) ?? slug,
    year: (data.year as string) ?? '',
    order: (data.order as number) ?? 999,
    status: ((data.status as WorkStatus) ?? 'locked'),
    role: data.role as string | undefined,
    client: data.client as string | undefined,
    description: data.description as string | undefined,
    publicReference: (data.publicReference as string | null | undefined) ?? null,
    href: (data.href as string | null | undefined) ?? null,
    external: (data.external as boolean | undefined) ?? false,
    bg: data.bg as string | undefined,
    ink: data.ink as string | undefined,
    accent: data.accent as string | undefined,
    statement: data.statement as string | undefined,
    image: (data.image as string | null | undefined) ?? null,
    imageAlt: (data.imageAlt as string | null | undefined) ?? null,
    cta: data.cta as string | undefined,
    metrics: data.metrics as
      | Array<{ label: string; value: string }>
      | undefined,
    clients: data.clients as string[] | undefined,
  }));
}

export function loadWorkEntry(slug: string): WorkEntry | undefined {
  return loadWorkEntries().find((entry) => entry.slug === slug);
}

export function loadLogEntry(slug: string): LogEntry | undefined {
  return loadLogEntries().find((entry) => entry.slug === slug);
}

export function loadLogEntries(): LogEntry[] {
  return readMarkdownDir<LogEntry>('log', (data, slug) => ({
    slug,
    title: (data.title as string) ?? slug,
    year: (data.year as string) ?? '',
    order: (data.order as number) ?? 999,
    image: (data.image as string | null | undefined) ?? null,
    imageAlt: (data.imageAlt as string | null | undefined) ?? null,
    description: data.description as string | undefined,
    locked: (data.locked as boolean | undefined) ?? false,
  }));
}

export async function enrichWorkEntries(entries: WorkEntry[]): Promise<WorkEntry[]> {
  return Promise.all(
    entries.map(async (e) => ({
      ...e,
      bodyHtml: e.body?.trim() ? await renderMarkdown(e.body) : '',
    }))
  );
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}
