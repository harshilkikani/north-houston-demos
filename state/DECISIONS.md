# DECISIONS

Only decisions that are expensive to reverse or relearn.

## D1 — Repo root is the working directory
`C:\Users\HARSHILKUMARKIKANI\VSCodeProjects\Aug13_10websites` is the repo root. No nested `/portfolio` folder (§10's tree is reproduced from `/sites` down).

## D2 — Stack: Astro static + Tailwind v4 (CSS-first) + per-site hand-authored CSS
Astro, `output: 'static'`, near-zero JS. Tailwind v4 via `@tailwindcss/vite`, configured **per site** with its own `@theme` token block — no shared theme, no `tailwind.config.js`. Substantial per-site hand-authored CSS sits alongside it, because §16 (anti-template) outranks §12 (reuse) in the priority hierarchy and a shared utility vocabulary is the main mechanism by which ten sites converge.

## D3 — Host: GitHub Pages, one monorepo, one Pages site, ten sub-paths
Only authenticated deploy path available: `gh` is logged in with `repo` + `workflow` scopes. No Cloudflare / Netlify / Vercel credentials exist in this environment, and §21 forbids asking the operator for them. Monorepo `harshilkikani/north-houston-demos` (public — GitHub Pages on free plans cannot serve a private repo). A GitHub Actions workflow builds all ten and assembles them into one artifact.

URLs: `https://harshilkikani.github.io/north-houston-demos/<segment>/`
Each site's Astro `base` is set accordingly. A root index page lists all ten for the operator.

## D4 — Every map/directions link uses the Google Business Profile CID URL
`https://maps.google.com/?cid=<id>` resolves to the exact verified business pin. Never geocode an address string — a wrong map destination is a §29 blocking failure, and two of these businesses have contested unit numbers.

## D5 — Published prices are labelled sample pricing
No verified price list exists for any of the four salons or two nail salons. Inventing prices would be a §5 fabrication, but price transparency is the wow thesis for 07 and 09. Resolution: price tables ship with a short, tasteful "sample menu — the shop sets the real numbers" line. Honest, still demoable, and it turns into a good pitch beat ("give me your real prices and I'll drop them in").

## D6 — No hero video anywhere in the portfolio
No authentic footage exists for any of the ten businesses, and §19 warns that a great still beats mediocre stock footage. Richey Collision's motion need is met with a CSS specular sweep over a static paint macro — lighter, more reliable on bad Wi-Fi, and impossible to stall mid-pitch.

## D7 — Photography is licensed stock used as *material and atmosphere*, never as documentary evidence
No business-posted photography could be acquired (Google/Facebook/Instagram CDNs are bot-blocked, and public visibility is not production reuse rights anyway). Images ship under the Unsplash License (commercial use, no attribution required), self-hosted and optimised.

**Hard rule enforced in copy:** no image is ever captioned or framed as this business's own work, premises, staff or customers. Galleries are framed as material libraries, finish references, and style lookbooks. `ASSET_LEDGER.csv` marks every shipped asset `LICENSED` so the replace-with-owner-photos step is obvious later.

## D8 — Facts deliberately withheld from display
- **04 Richey Collision:** "25 years in business" is REPORTED (Nextdoor only). Never printed.
- **08 Marytere:** the owner's personal name is inferred from an Instagram handle, not observed. Never printed. Phone conflict resolved to **(713) 231-8940** — the GBP number, independently corroborated by the business's own Fresha listing, against two directories showing (281) 781-7534.
- **02 D&D Granite:** unit number contested (C1 vs A1). Address displays without a unit; the CID link resolves the suite.
- **05 La-Tino** and **10 Cali New Nails:** candidate Facebook pages exist but could not be tied unambiguously to the business. No social link ships for either — linking the wrong account is a contamination failure.
- **09 VNN Nails:** directory-only suite number (Ste 135) omitted.

## D9 — Address display mode is a per-site field
`address.display_mode` in the manifest is `SERVICE_AREA_ANCHOR` for 01 and 03 (no verified public premises — no "visit our showroom" language anywhere), `SHOWROOM` for 02, `SHOP` for 04, `SALON` for 05–10.

## D10 — Bilingual sites: 05, 06, 07, 08 only
Evidence-gated per §20. 07 Latin Cuts opens in Spanish; 05, 06, 08 open in English with a Spanish toggle. Implementation is a per-site content JSON with a language key and a client-side switch — no i18n framework.

## D11 — Playwright Chromium headless-shell is the QA renderer
Installed at the user level. Screenshots at 390 / 768 / 1440. Contact sheets are composited with Sharp.

## D13 — Copy register: plain-spoken, not poster-clever
Operator feedback on the first pass: the headlines read as advertising, and the display sizes amplified
it. Three rules now apply portfolio-wide and any future copy must follow them.

1. **A headline says what the business does.** No slogans, no reversals ("Don't book a salon. Book your
   person."), no rhetorical set-ups. If the owner would not say it out loud to a customer, it does not
   go in 60px type.
2. **Never write about the website.** Lines like "not one of them had a website to find him on" or
   "Ben's work deserves a gallery" are pitch arguments aimed at the owner. The customer is the audience;
   the pitch happens out loud, not on the page.
3. **No comparative or boastful claims**, even when a verified review supplies them. "Two shops couldn't
   match it" and "Everywhere else was too rough" were both review-derived and both removed — a review
   can sit in the reviews section as a quote, but it must not become the site's own voice.

Display sizes were cut across all ten (Latin Cuts hardest, 152px → 78px; Richey 108px → 68px). Two
layout consequences were corrected in the same pass: Countertops' h1 max-width widened to 26ch, and
Latin Cuts' hero grid realigned to the top so the shorter headline did not leave a gap.

## D12 — Required environment variable names
None. Deployment authenticates through the existing `gh` keyring session and the Actions-provided `GITHUB_TOKEN`. No secrets are stored in the repo.
