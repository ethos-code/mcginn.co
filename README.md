# mcginn.co

Personal site of John McGinn — designer & founder. Built with Next.js 16
(App Router) + TypeScript + Tailwind CSS + Framer Motion. Statically exported
and hosted on GitHub Pages.

## Local development

```sh
npm install
npm run dev          # http://localhost:3000
```

Hot-reload everything: components, content markdown, styles.

## Static build

```sh
npm run build        # outputs ./out — fully static HTML/CSS/JS
```

The site is configured for [Next.js static export](https://nextjs.org/docs/app/guides/static-exports)
(`output: 'export'`). No server, no API routes — every page is pre-rendered
HTML at build time and content is read from `/content/**.md` files.

## Deployment (GitHub Pages)

Pushes to `main` are built and deployed by
[.github/workflows/deploy.yml](.github/workflows/deploy.yml) using
`actions/deploy-pages`.

### One-time setup

1. **Create the GitHub repo** and push the code to `main`.
2. **Repo → Settings → Pages → Source: GitHub Actions.**
3. **Repo → Settings → Pages → Custom domain: `mcginn.co`** and check
   "Enforce HTTPS" once the cert provisions.
4. The `public/CNAME` file (containing `mcginn.co`) is included in the
   build artifact, so Pages will keep the custom domain across deploys.

### DNS records (at your registrar)

For an apex domain (`mcginn.co`), add these `A` records pointing at the
GitHub Pages anycast IPs:

```
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
```

Plus AAAA records for IPv6:

```
AAAA   @   2606:50c0:8000::153
AAAA   @   2606:50c0:8001::153
AAAA   @   2606:50c0:8002::153
AAAA   @   2606:50c0:8003::153
```

If you also want `www.mcginn.co` to redirect to apex, add:

```
CNAME   www   <your-github-username>.github.io
```

DNS changes typically propagate within minutes; the HTTPS cert provisions
within ~10 minutes after the domain verifies.

### Subsequent deploys

Just push to `main`. The workflow runs on every push:

```sh
git add -A
git commit -m "Update content"
git push origin main
```

You can also trigger a manual deploy from the Actions tab (`workflow_dispatch`).

## Editing content

Content lives in `/content`:

- `/content/work/*.md` — work entries (one section per file). Set
  `status: open` for public, `status: locked` for NDA. The locked-cards
  modal requires the password defined in `lib/config.ts`.
- `/content/log/*.md` — Logbook posts. `locked: true` keeps drafts
  visible on the index but blocks the detail page.

Frontmatter fields are documented in `lib/content.ts`. Edit a file and
re-run `npm run dev` (or just save — Next picks up the change live).

## Notes

- The Spline pen on the Fountain section loads from `prod.spline.design` at
  runtime. If you ever fork the scene, swap the URL in
  `components/FountainArtwork.tsx`.
- The variable fonts currently load from jsdelivr's font CDN. Swap to
  `@fontsource-variable/*` packages if you want full self-hosting.
- The OG image referenced in `app/layout.tsx` is `/assets/og.jpg`
  (1200×630). Drop it in `/public/assets/` before launch.
