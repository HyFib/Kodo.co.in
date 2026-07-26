# KODO - Food that smiles back

A modern, responsive website for KODO's millet-based quick bites. The experience
uses a sticky scroll story, playful brand motion, KODO's approved identity
assets, and original food photography to bring "The Millet Way" to life.

Live site: [kodo-millet-way-theni.hyfib-0937.chatgpt.site](https://kodo-millet-way-theni.hyfib-0937.chatgpt.site)

## Prerequisites

- Node.js `>=22.13.0`

## Local development

```bash
npm install
npm run dev
npm run build
```

The local server prints the preview URL when it starts.

## Experience

- Full-screen KODO hero and branded navigation
- Scroll-reactive dish showcase for the burger, momos, and wraps
- Responsive mobile layouts and reduced-motion support
- KODO English and Tamil identity lockups
- Cloudflare-compatible Vinext production output

## Project structure

- `app/page.tsx` - content and scroll behavior
- `app/globals.css` - KODO design system, layout, and motion
- `public/brand/` - approved KODO identity assets
- `public/food/` - optimized food photography
- `.openai/hosting.json` - Sites deployment binding
