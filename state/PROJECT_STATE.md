# PROJECT STATE

**ACTIVE PHASE:** 10 — Portfolio audits (complete)

| # | Site | Research | Strategy | Build | Art dir | Responsive | QA | Deployed | Live QA | Status |
|---|------|----------|----------|-------|---------|------------|----|----------|---------|--------|
| 01 | Countertops of Texas | DONE | DONE | DONE | DONE | DONE | PASS | LIVE | PASS | READY_WITH_KNOWN_LIMITATION |
| 02 | D&D Granite | DONE | DONE | DONE | DONE | DONE | PASS | LIVE | PASS | READY_WITH_KNOWN_LIMITATION |
| 03 | Sosa Hardwood Floors | DONE | DONE | DONE | DONE | DONE | PASS | LIVE | PASS | READY_WITH_KNOWN_LIMITATION |
| 04 | Richey Collision | DONE | DONE | DONE | DONE | DONE | PASS | LIVE | PASS | READY_WITH_KNOWN_LIMITATION |
| 05 | La-Tino Hair | DONE | DONE | DONE | DONE | DONE | PASS | LIVE | PASS | READY_WITH_KNOWN_LIMITATION |
| 06 | CutMasters | DONE | DONE | DONE | DONE | DONE | PASS | LIVE | PASS | READY_WITH_KNOWN_LIMITATION |
| 07 | Latin Cuts | DONE | DONE | DONE | DONE | DONE | PASS | LIVE | PASS | READY_WITH_KNOWN_LIMITATION |
| 08 | Marytere Image Salon | DONE | DONE | DONE | DONE | DONE | PASS | LIVE | PASS | READY_WITH_KNOWN_LIMITATION |
| 09 | VNN Nails | DONE | DONE | DONE | DONE | DONE | PASS | LIVE | PASS | READY_WITH_KNOWN_LIMITATION |
| 10 | Cali New Nails | DONE | DONE | DONE | DONE | DONE | PASS | LIVE | PASS | READY_WITH_KNOWN_LIMITATION |

All ten are `READY_WITH_KNOWN_LIMITATION` for the same two intentional reasons (§30 states this is a
fully acceptable end state, not a downgrade):

1. Booking / quote / estimate flows are complete front-end simulations that transmit nothing.
2. Photography is licensed stock used as material, finish and style reference — it is labelled as such
   on every page and must be replaced with owner-supplied originals if a business signs.

## NEXT

Nothing outstanding. If the run resumes:

1. Replace stock imagery per site as owner photos are supplied (`ASSET_LEDGER.csv` lists every file)
2. Drop each owner's real prices into the sample menus (sites 07, 08, 09, 10)
3. Re-verify ratings and review counts before a pitch — they drift

## BLOCKED

none

## Commands

```
node shared/scripts/build-all.mjs      # build all ten (accepts site ids)
node shared/scripts/assemble.mjs       # assemble _site/ for offline use
node shared/qa/audit.mjs               # routes, links, console, overflow, a11y, manifest facts
node shared/qa/contamination.mjs       # cross-business identity audit
node shared/qa/screenshot.mjs pass-NN  # local screenshots + contact sheets
node shared/qa/live.mjs                # live-URL QA + final pitch screenshots
```
