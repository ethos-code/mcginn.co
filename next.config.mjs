/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static HTML export — produces a self-contained `out/` directory that any
  // static host (GitHub Pages, Vercel, S3 + CloudFront, etc.) can serve.
  output: 'export',
  // GitHub Pages serves /resume/ → /resume/index.html, so trailing slashes
  // play nicest with that default.
  trailingSlash: true,
  // We use plain <img> tags (not next/image), but unoptimized is required
  // for static export anyway.
  images: { unoptimized: true },
  // Pin the workspace root to this project. Without this, Next/Turbopack
  // walks up to ~/Desktop/dev/ (which has a stray package.json) and watches
  // every sibling project's files — enough to hang fsevents on macOS.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
