# Nick Walks Melbourne

Architectural walking tour site for Nick Heydon.

**Live:** https://nickwalksmelbourne.com.au

## Structure

Plain static HTML, no build step. Five files render the live site and three alternate concept drafts.

```
.
├── index.html              # Homepage (live) — mirrors concept-3
├── concept-1/index.html    # Editorial draft (Outfit, bold colour)
├── concept-2/index.html    # Field Notes draft (sage panels, dossier)
├── concept-3/index.html    # Terrain — current live concept
├── concept-4/index.html    # Quiet draft (Insel Hombroich-inspired)
├── vercel.json             # Clean URLs, no trailing slash
├── preferredphoto1.jpg     # Top portrait — Nick + Tudor house
├── preferredphoto2.jpg     # Bottom strip — tour group only (cropped)
└── design{1,2,3,4}.js      # Original React design refs (unused, kept for archive)
```

The homepage and `concept-3/index.html` are kept in sync by hand. If you change one, change the other.

## The walks

| # | Title | Subhead | Duration / Price | TryBooking |
|---|---|---|---|---|
| 01 | Building Creative Melbourne | How architecture, art and big ideas shaped our city | 2 hr / $50 | [DOMNY](https://www.trybooking.com/DOMNY) |
| 02 | Howard Lawson | Glamour by the Yarra | 2 hr / $50 | [events/landing/1597379](https://www.trybooking.com/events/landing/1597379) |
| 03 | CBD Lunchtime Walk | Top End of Town | 45 min / $25 | [DMWRF](https://www.trybooking.com/DMWRF) |
| 04 | Train & Walk | South Yarra to Anzac Station | 2 hr / $50 | [DMWYX](https://www.trybooking.com/DMWYX) |
| 05 | CBD Espresso & Architecture | Early morning | 1 hr / $25 incl coffee | _Coming Soon — booking disabled_ |

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
