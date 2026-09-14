# Nick Walks Melbourne

Architectural walking tour site for Nick Heydon.

**Live:** https://nickwalksmelbourne.com.au

## Structure

Plain static HTML, no build step. The homepage keeps its styles inline; the tour pages and the hub share `site.css`.

```
.
├── index.html                                    # Homepage (live)
├── melbourne-architecture-walking-tours.html     # Hub page listing every walk
├── melbourne-lunchtime-walking-tour.html         # Route 01 · City Lunchtime Walk
├── building-creative-melbourne-walking-tour.html # Route 02 · Building Creative Melbourne
├── howard-lawson-walking-tour-melbourne.html     # Route 03 · Howard Lawson
├── south-yarra-architecture-walking-tour.html    # Route 04 · Train & Walk
├── site.css                                      # Shared styles for the hub and tour pages
├── sitemap.xml / robots.txt                      # Crawl config (submit sitemap in Search Console)
├── favicon.svg, favicon-32.png, apple-touch-icon.png
├── logo.png                                      # Wordmark used in Organization schema
├── og-image.png                                  # Social share image
├── concept-{1..4}/index.html                     # Design drafts, noindexed
├── vercel.json                                   # Clean URLs, no trailing slash
├── image9.jpeg                                   # Portrait — Nick with a group in South Yarra
├── preferredphoto1.jpg                           # Closing quote — Nick + Tudor house
├── preferredphoto2.jpg                           # FIELD strip — tour group only (mirrored)
├── *.webp                                        # Optimised copies used on the tour pages
└── design{1,2,3,4}.js                            # Original React design refs (unused, archive)
```

Clean URLs mean `melbourne-lunchtime-walking-tour.html` is served at `/melbourne-lunchtime-walking-tour`. Locally with `python3 -m http.server` you need the `.html`.

The concept drafts diverged from the homepage in August 2026 and are no longer kept in sync. They carry a `noindex` meta tag so Google does not treat them as duplicates.

## SEO and AI search

Implemented September 2026 from the NWM Website SEO / AI Search Brief:

- Homepage title, meta description and a visible H1 ("Architecture Walking Tours of Melbourne") alongside the "Melbourne rewards curiosity" brand line. The big wordmark is a `div`, so each page has one H1.
- One permanent page per walk with unique copy, meeting point, practical details, a short FAQ and a booking CTA. Meeting points come from the TryBooking event pages.
- A hub page at `/melbourne-architecture-walking-tours` linking every walk.
- Canonical URLs, Open Graph tags, favicon, `sitemap.xml`, `robots.txt`.
- JSON-LD: `LocalBusiness` + `WebSite` on the homepage, `TouristTrip` + `FAQPage` + `BreadcrumbList` on each tour page, `CollectionPage` + `ItemList` + `FAQPage` on the hub.
- Internal links: homepage walk cards link to their pages, a footer nav on every page, and a "More walks" block on each tour page.

After each deploy that changes these pages: validate with Google's Rich Results Test, then in Search Console submit `sitemap.xml` and request indexing of the changed URLs.

Things Nick should confirm on the tour pages: the private/corporate walk offer, the "Names that come up" lists (taken from the route loop graphics), and the short Howard Lawson biography.

## The walks

| # | Title | Subhead | Duration / Price | TryBooking |
|---|---|---|---|---|
| 01 | City Lunchtime Walk | See Melbourne in your lunch break | 45 min / $25 | [DPCPF](https://www.trybooking.com/DPCPF) |
| 02 | Building Creative Melbourne | How architecture, art and big ideas shaped our city | 2 hr / $50 | [DOMNY](https://www.trybooking.com/DOMNY) |
| 03 | Howard Lawson | Glamour by the Yarra | 2.5 hr / $50 | [events/landing/1597379](https://www.trybooking.com/events/landing/1597379) |
| 04 | Train & Walk | South Yarra to Anzac Station | 2 hr / $50 | [DMWYX](https://www.trybooking.com/DMWYX) |

The CBD Espresso & Architecture walk was dropped from the site on 8 September 2026 and has no page. The brief suggested `/melbourne-cbd-architecture-walking-tour/` for it; add that page if the walk comes back.

## Type & palette (Concept 3 / live)

- Display: Inter 500 (`--display`)
- Body: Instrument Serif (`--serif`)
- Mono / metadata: JetBrains Mono (`--mono`)
- Page: `#fdfcf8` warm off-white
- Ink: `#1c1c1c`
- Lime highlight: `#e9f0a6` (used for em / book buttons / portrait pill)

## Newsletter (planned)

Research findings from July 2026. No signup form on the site yet.

The form itself is just styled HTML that POSTs to a provider endpoint, so any of these work without adding a build step. The decision is the sending platform:

| Provider | Free tier | Verdict |
|---|---|---|
| MailerLite | 1,000 subs, 12k emails/mo | **Recommended.** Easiest editor for a non-technical sender, no meaningful feature cuts on free, cheap beyond it |
| Kit (ex-ConvertKit) | 10,000 subs | Close second. Bigger free ceiling, good plain-HTML embeds, pushier about upgrades |
| Buttondown | 100 subs | Simplest and most tasteful, but the free ceiling arrives fast |
| Mailchimp | 500 subs, 1k emails/mo | Stingy free tier, bloated editor. Skip |
| Substack | Unlimited | Wrong shape: a publishing destination, not operational email. Embeds via clunky iframe. Skip |

Implementation plan when ready:

- Nick creates the account; the site needs only the form ID / endpoint URL
- Build the signup block in our own HTML/CSS (lime highlight, JetBrains Mono labels) rather than the provider's widget
- Add to both `index.html` and `concept-3/index.html`
- Seed the list from TryBooking booking exports (attendee emails; add a consent checkbox at booking ideally). Providers handle unsubscribe links and Australian spam-act compliance

## Contact

- Email: nick@risefilms.com.au (footer mailto link)
- Instagram: [@nickwalksmelbourne](https://instagram.com/nickwalksmelbourne)

## Local preview

```sh
python3 -m http.server 8000
# open http://localhost:8000/
```

## Deploy

GitHub: https://github.com/m37daveking/nickwalksmelbourne

The Vercel project is linked to the GitHub repo, so pushing to `main` auto-deploys to production (confirmed working 1 Aug 2026). No manual deploy step needed, though the CLI still works if required:

```sh
npx vercel@latest deploy --prod --yes
```

The custom domain `nickwalksmelbourne.com.au` is aliased to the latest production deployment under the `dave-7597` Vercel account.
