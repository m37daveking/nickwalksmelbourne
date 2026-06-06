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
| 01 | CBD Lunchtime Walk | Top End of Town | 45 min / $15 | [DMWRF](https://www.trybooking.com/DMWRF) |
| 02 | Train & Walk | South Yarra to Anzac Station | 2 hr / $40 | [DMWYX](https://www.trybooking.com/DMWYX) |
| 03 | Howard Lawson | Glamour by the Yarra | 2 hr / $40 | [events/landing/1597379](https://www.trybooking.com/events/landing/1597379) |
| 04 | CBD Espresso & Architecture | Early morning | 1 hr / $20 incl coffee | _Coming Soon — booking disabled_ |
| 05 | Arts Precinct | Flying Saucers & Stolen Picassos | 2 hr / $40 | [DMXDT](https://www.trybooking.com/DMXDT) |

## Type & palette (Concept 3 / live)

- Display: Inter 500 (`--display`)
- Body: Instrument Serif (`--serif`)
- Mono / metadata: JetBrains Mono (`--mono`)
- Page: `#fdfcf8` warm off-white
- Ink: `#1c1c1c`
- Lime highlight: `#e9f0a6` (used for em / book buttons / portrait pill)

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

Pushing to `main` does **not** auto-deploy — the Vercel project isn't linked to the GitHub repo. Deploy manually with the Vercel CLI from this directory:

```sh
npx vercel@latest deploy --prod --yes
```

The custom domain `nickwalksmelbourne.com.au` is aliased to the latest production deployment under the `dave-7597` Vercel account.
