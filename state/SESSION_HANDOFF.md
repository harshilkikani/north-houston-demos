# SESSION HANDOFF

## MISSION
Ten speculative redesign websites for ten North Houston local businesses that all have real reputations
and no working website. They are sales assets: the operator walks in, asks for the owner, and opens the
site full-screen on a laptop. Every decision serves that moment.

## NON-NEGOTIABLES
- Never fabricate a factual claim about a business. Only `VERIFIED` manifest facts may be asserted.
- Never cross-contaminate — one business's identity must never appear on another's site.
- No dead interactive elements.
- No lorem ipsum, no AI filler copy.
- Every site ships `noindex, nofollow` plus a robots.txt disallow.
- Every site is visually inspected as a rendered screenshot at three viewports before READY.
- Every site's live hosted URL is loaded and inspected.
- The filesystem and GitHub are memory; the conversation is not.
- Demo forms never transmit data anywhere.

## STACK
Astro 5 (static) · Tailwind v4 CSS-first `@theme` per site · per-site hand-authored CSS · pnpm workspaces
· Sharp (images) · Playwright (QA) · GitHub Pages via Actions. Node 24, pnpm 11.

## REPO MAP
```
/shared        lib/ (content, seo, ui — structural only), qa/, scripts/, sites.config.json
/sites/NN-slug src/{layouts,pages,components,styles,data}, content/business.json, public/{assets,fonts}
/state         canonical project memory (see index below)
/qa/<id>       local/pass-NN/ and live/final/ screenshots
/research      raw/ downloaded candidates, sheets/ contact sheets  (gitignored)
```

## STATE FILE INDEX
| File | Holds |
|---|---|
| `state/SITE_MANIFEST.json` | **Single source of truth for every business fact**, with provenance |
| `state/DESIGN_DIRECTIONS.md` | Per-site mood, hero concept, industry feature, wow thesis, demo moment |
| `state/DIFFERENTIATION_LEDGER.md` | The anti-template matrix and cluster conflict checks |
| `state/DECISIONS.md` | D1–D12, the expensive-to-reverse decisions |
| `state/ASSET_LEDGER.csv` | Every shipped image: source, licence, provenance |
| `state/QA_MATRIX.csv` | Per-site QA evidence |
| `state/DEPLOYMENTS.md` | Live URLs and redeploy instructions |
| `state/PROJECT_STATE.md` | Status table and next queue |

## STATUS
All ten: built, art-directed, QA'd at 390/768/1440, deployed, live-verified.
All ten are `READY_WITH_KNOWN_LIMITATION` — mock flows and licensed stock imagery, both disclosed on-page.

## BUSINESS ONE-LINERS
| # | Business | Direction | Wow thesis |
|---|---|---|---|
| 01 | Countertops of Texas | Dark craftsman, material-led, square | Interactive edge-profile studio for the man whose reviews praise edge matching |
| 02 | D&D Granite | Bright showroom, browsable slab grid | Their slab selection becomes a filterable wall instead of two half-built Facebook pages |
| 03 | Sosa Hardwood Floors | Warm wide editorial, drag comparison | 86 reviews at 4.8 finally have somewhere to live |
| 04 | Richey Collision | Dark automotive, specular gloss | "Your domain doesn't load" — plus a site matching his Corvette reputation |
| 05 | La-Tino Hair | Warm editorial serif, colour-led | Whole page flips to Spanish, then books an appointment |
| 06 | CutMasters | Bright family cards, stylist-first | Mario, Angie, Amanda and Ricky become bookable named specialists |
| 07 | Latin Cuts | Loud Spanish-first poster | The two complaints in his reviews are both fixed on one screen |
| 08 | Marytere Image Salon | Intimate arched single column | A personal Instagram becomes an actual salon brand |
| 09 | VNN Nails | Dark saturated nail-art fashion | The price appears on screen as the customer builds their set |
| 10 | Cali New Nails | Calm pale sage, very airy | "They are gentle when nobody else is" becomes the headline |

## KNOWN PROBLEMS
None open. Deliberate, documented limitations only:
- No business-supplied photography exists; all imagery is licensed stock, labelled on-page.
- Sample pricing on sites 07, 08, 09, 10 — labelled as samples; owners supply real figures.
- No social link ships for 05 or 10 (candidate pages could not be tied to the business unambiguously).

## DEPLOYMENT STATE
GitHub Pages, repo `harshilkikani/north-houston-demos`, HTTPS enforced.
`https://harshilkikani.github.io/north-houston-demos/<segment>/` — see `DEPLOYMENTS.md`.

## NEXT ACTIONS
1. Swap stock imagery for owner photos as businesses sign (`ASSET_LEDGER.csv`)
2. Drop real prices into the four sample menus
3. Re-verify ratings/counts immediately before a pitch — they drift

## COMMANDS
See the block at the end of `PROJECT_STATE.md`.

## SECRETS
None. Deployment authenticates through the existing `gh` session and the Actions-provided
`GITHUB_TOKEN`. No environment variables are required and no secrets are stored in the repo.
