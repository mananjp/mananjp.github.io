# Future Updates — Manan Panchal Portfolio

Status of the Neural Silence portfolio and planned roadmap.

## Live Now

- [x] Dark premium design (Neural Silence) inspired by worldlabs.ai / velyxlabs.in
- [x] Three.js neural-network hero (synapse connections, data sparks, node firing, mouse attention fan)
- [x] GSAP scroll animations, 3D tilt cards, magnetic buttons
- [x] Custom cursor, preloader, typewriter, project filter
- [x] Working contact form via Web3Forms (access key set)
- [x] SEO baseline: sitemap.xml, robots.txt, og-image, GSC verification, Person JSON-LD
- [x] GitHub Pages auto-deploy workflow (`.github/workflows/deploy.yml`)

## Phase 1 — Quick Wins

- [x] Downloadable resume PDF (button in hero CTA area)
- [ ] Custom themed `404.html` ("signal lost" page) — GitHub Pages serves automatically
- [ ] Scrollspy — active nav link highlights while scrolling sections
- [ ] Tab-visibility pause + smaller particle budget on low-end/small screens
- [ ] `og:image:width` / `og:image:height` + `og:locale` meta tags

## Phase 2 — Richer Content

- [ ] Project detail modals/pages (stack, problem, approach, metrics, role, links)
- [x] Wire blog cards to real posts (dedicated HTML pages with full SEO)
- [ ] Certifications & awards strip (SSIP grant, NVIDIA Jetson Nano, Perplexity ambassador)
- [ ] Project screenshots + lightbox

## Phase 3 — Metrics & Performance

- [ ] Privacy-friendly analytics (GoatCounter / Plausible / GA4)
- [x] Rich JSON-LD: `Article` / `BlogPosting` schema for blog posts
- [ ] Google Fonts font-display already swap — verify / preload critical fonts
- [ ] Full favicon set + apple-touch-icon (currently only `favicon.svg`)
- [ ] Lighthouse CI step in the deploy workflow

## Phase 4 — Infrastructure / Brand

- [ ] Custom domain (e.g. `mananpanchal.dev`) — CNAME + DNS
- [ ] RSS feed for blog
- [ ] Link check / Lighthouse budget on every push

## Notes

- og-image regenerated to 1200x630 Neural Silence style (104 KB). Social platforms cache aggressively — refresh via debug tools (LinkedIn Post Inspector, X Card Validator, Facebook Sharing Debugger) after deploys.
- Web3Forms access key lives in `assets/script.js` (`WEB3FORMS_ACCESS_KEY`). If it ever leaks or you want to rotate, regenerate at web3forms.com.