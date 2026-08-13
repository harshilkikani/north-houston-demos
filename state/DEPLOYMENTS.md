# DEPLOYMENTS

**Host:** GitHub Pages (see `DECISIONS.md` D3 — the only authenticated static-hosting path in this environment)
**Repo:** https://github.com/harshilkikani/north-houston-demos (public)
**Mechanism:** GitHub Actions → build all ten → assemble into one artifact → `actions/deploy-pages`
**HTTPS:** enforced by GitHub Pages (`https_enforced: true`)
**Operator index:** https://harshilkikani.github.io/north-houston-demos/

| # | Site | Live URL | Status |
|---|------|----------|--------|
| 01 | Countertops of Texas | https://harshilkikani.github.io/north-houston-demos/countertops-of-texas/ | LIVE |
| 02 | D&D Granite | https://harshilkikani.github.io/north-houston-demos/dd-granite/ | LIVE |
| 03 | Sosa Hardwood Floors | https://harshilkikani.github.io/north-houston-demos/sosa-hardwood-floors/ | LIVE |
| 04 | Richey Collision | https://harshilkikani.github.io/north-houston-demos/richey-collision/ | LIVE |
| 05 | La-Tino Hair | https://harshilkikani.github.io/north-houston-demos/la-tino-hair/ | LIVE |
| 06 | CutMasters | https://harshilkikani.github.io/north-houston-demos/cutmasters/ | LIVE |
| 07 | Latin Cuts | https://harshilkikani.github.io/north-houston-demos/latin-cuts/ | LIVE |
| 08 | Marytere Image Salon | https://harshilkikani.github.io/north-houston-demos/marytere-image-salon/ | LIVE |
| 09 | VNN Nails | https://harshilkikani.github.io/north-houston-demos/vnn-nails/ | LIVE |
| 10 | Cali New Nails | https://harshilkikani.github.io/north-houston-demos/cali-new-nails/ | LIVE |

## Redeploying

Any push to `main` rebuilds and redeploys all ten. Manual trigger: `gh workflow run "Deploy demo portfolio"`.

## Offline fallback for a bad-Wi-Fi pitch (§28)

`node shared/scripts/build-all.mjs && node shared/scripts/assemble.mjs` produces `_site/`, a complete
static copy of all ten sites that opens from disk. Final live screenshots for every site are in
`qa/<site-id>/live/final/` (`desktop.png`, `desktop-full.png`, `mobile.png`, `mobile-full.png`).
