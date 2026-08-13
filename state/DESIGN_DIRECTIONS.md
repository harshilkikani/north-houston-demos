# DESIGN DIRECTIONS

Facts live in `SITE_MANIFEST.json`. This file holds direction only.
Columns for hero/nav/type/radius/palette/motion live in `DIFFERENTIATION_LEDGER.md`.

---

## 01 — Countertops of Texas
- **Mood:** Craftsman workshop. Dust, precision, one man's hands. Deliberately *not* a luxury showroom.
- **Hero concept:** Full-bleed dark stone macro; a hairline copper edge-profile cross-section drawn over it like a shop drawing. Headline set as a spec plate.
- **Industry feature:** **Edge Profile Studio** — an SVG cross-section that redraws live as you pick Eased / Bullnose / Ogee / Mitred. Chosen because edge-profile matching is his single most-praised skill.
- **Wow thesis:** The thing most likely to make Victor say "wow" is *seeing the seam-and-edge precision his reviews praise turned into an interactive drawing that a customer can actually operate.*
- **Demo moment (20s):** Open Edge Studio → tap through four profiles → the stone edge redraws → carry the choice into the quote request.
- **Routes:** `/` · `/materials` · `/quote`
- **Anti-overlap note:** The only dark *and* sparse *and* serif site. 02 must never go dark.
- **Copy voice:** First-person, plain, tradesman-proud. Short sentences. No adjectives he wouldn't use.

## 02 — D&D Granite
- **Mood:** Bright browsable inventory. A gallery of stone you can walk.
- **Hero concept:** Mosaic wall of slab tiles that scan like a real slab yard, with a floating white info card.
- **Industry feature:** **Filterable Stone Wall** — filter by granite / quartz / marble / solid surface, open any slab into a full-bleed viewer, add it to a quote request.
- **Wow thesis:** The thing most likely to make Diana say "wow" is *seeing their slab selection — the thing every review mentions — turned into something a customer can browse before they drive out.*
- **Demo moment (30s):** Tap a material filter → the wall re-flows → open a slab full-bleed → "add to my quote" → the quote panel shows the chosen stone.
- **Routes:** `/` · `/stone` · `/quote`
- **Anti-overlap note:** Showroom language is allowed here and **only** here among the stone pair (01 has no verified showroom).
- **Copy voice:** Welcoming, practical, showroom-floor.

## 03 — Sosa Hardwood Floors
- **Mood:** Warm, wide, domestic calm. A design firm's portfolio for a one-crew installer.
- **Hero concept:** The before/after slider **is** the hero — carpet on one side, finished hardwood on the other, dragged immediately on load with a nudge animation.
- **Industry feature:** **Room-by-room scope builder** — add rooms, set approximate square footage, pick material; outputs a styled scope sheet for a free in-home estimate. Deliberately no dollar figure (never a fabricated price).
- **Wow thesis:** The thing most likely to make Ismael say "wow" is *seeing the strongest reputation on Cypresswood — 86 reviews at 4.8 — finally have somewhere to live, with his carpet-to-hardwood transformations as the headline.*
- **Demo moment (20s):** Drag the hero slider back and forth, then build a two-room scope sheet.
- **Routes:** `/` · `/work` · `/estimate`
- **Anti-overlap note:** Wide letterbox crops are this site's signature; no other site uses 21:9.
- **Copy voice:** Calm, competent, homeowner-reassuring. Emphasise *hassle-free* — the recurring review word.

## 04 — Richey Collision
- **Mood:** Dark automotive editorial. High gloss, deep black, specialist confidence. The highest-value target in the portfolio.
- **Hero concept:** Near-black field, extreme macro of glossy red paint, a slow specular highlight sweeping across it (CSS, not video). Condensed uppercase headline about colour.
- **Industry feature:** **Three-step estimate request** — vehicle → damage location picked on an interactive top-down car diagram → photo drop → styled confirmation with a reference code.
- **Wow thesis:** The thing most likely to make Chris say "wow" is *"your domain doesn't load — here is the site your Corvette customers already assume you have."*
- **Demo moment (45s):** Tap two panels on the car diagram, drop a photo, submit, land on the confirmation card.
- **Routes:** `/` · `/paint` · `/estimate`
- **Anti-overlap note:** Only site permitted to go full cinematic-dark. 09 is dark but saturated-fashion, not automotive.
- **Copy voice:** Understated specialist. Let the tri-coat story and the Corvette community do the bragging. **Never print "25 years."**

## 05 — La-Tino Hair
- **Mood:** Warm editorial. Colour work as craft. A decade of loyalty.
- **Hero concept:** 60/40 asymmetric split — editorial serif statement left over ivory, warm colour-work photograph right, thin rule dividing.
- **Industry feature:** **Four-step booking** (service → stylist → day/time → contact) plus a full **ES/EN** page toggle.
- **Wow thesis:** The thing most likely to make Ivonne say "wow" is *watching the whole page turn into Spanish in one tap, and then booking an appointment — the destination her Facebook posts have never had.*
- **Demo moment (40s):** Tap **ES** → the entire page re-renders in Spanish → run the booking flow to the confirmation card.
- **Routes:** `/` · `/services` · `/book`
- **Anti-overlap note:** The only high-contrast serif in the hair cluster. Wednesday-closed must render correctly everywhere hours appear.
- **Copy voice:** Warm, personal, first-person-plural. Loyalty is the theme, not luxury.

## 06 — CutMasters
- **Mood:** Family salon. Bright, kind, unpretentious. Where a one-year-old gets a first haircut and a mother gets colour.
- **Hero concept:** Bright photograph with a white card overlapping its lower-left corner carrying the headline and four stylist chips.
- **Industry feature:** **Stylist-first booking** — every stylist card is a button that opens the booking panel pre-filled with that stylist.
- **Wow thesis:** The thing most likely to make this owner say "wow" is *seeing Mario, Angie, Amanda and Ricky as named specialists a customer can pick — the salon stops being "a salon" and becomes "your stylist."*
- **Demo moment (25s):** Tap Mario's card → booking panel opens with Mario selected → pick a slot → confirm.
- **Routes:** `/` · `/team` · `/book`
- **Anti-overlap note:** Only site with a mobile bottom tab bar. Only site using circular crops.
- **Copy voice:** Friendly, plain, parent-to-parent. The first-haircut review is the emotional centre.

## 07 — Latin Cuts
- **Mood:** Loud, confident, street-poster energy. The busiest shop on the strip, finally organised.
- **Hero concept:** Type *is* the hero — an oversized Anton headline in marigold on ink, colour blocks sliding in, a thin marquee of open times underneath.
- **Industry feature:** **Live queue board** — see today's slots, claim the next open one, watch the board reorder with your name on it. Plus a published sample price list.
- **Wow thesis:** The thing most likely to make this owner say "wow" is *"the two complaints in your reviews — nobody tracks whose turn it is, and prices change — are both fixed on this one screen."*
- **Demo moment (30s):** Open the queue board → claim 4:30 → the board reorders and shows the position and estimated start.
- **Routes:** `/` · `/precios` (prices) · `/turno` (queue/booking)
- **Anti-overlap note:** **Opens in Spanish** — the only site in the portfolio that does. Never display the negative reviews.
- **Copy voice:** Direct, energetic, bilingual-native. Spanish written idiomatically, not translated word-for-word.

## 08 — Marytere Image Salon & Barbershop
- **Mood:** Intimate personal brand. Quiet, considered, the smallest shop presented as the most established.
- **Hero concept:** Centred, generous whitespace, a single tall arched-top portrait-format image, delicate Italiana wordmark, one line of type.
- **Industry feature:** **Lookbook column → booking carry-over.** Tap a look in the vertical lookbook and it travels into the reservation sheet as the requested style.
- **Wow thesis:** The thing most likely to make this owner say "wow" is *seeing a personal Instagram become an actual salon brand — arched frames, a real lookbook, and a reservation sheet with her shop's name on it.*
- **Demo moment (30s):** Scroll the lookbook → tap a look → the reserve sheet opens with that look attached → confirm.
- **Routes:** `/` · `/lookbook` · `/reserve`
- **Anti-overlap note:** Only site using arched image frames and a single narrow column. **Never print an owner's personal name** — unverified.
- **Copy voice:** Soft, first-person, hospitable. "Hospitality" is the verified review word — build on it.

## 09 — VNN Nails
- **Mood:** Saturated nail-art fashion. Dark, glossy, dense, a little club-lit.
- **Hero concept:** A horizontally scrolling band of nail-art macros across the top of a plum-black page, oversized Syne headline sitting over it.
- **Industry feature:** **Price Builder with a live running total** — service → length → design tier → add-ons, total updating as you tap, before you book.
- **Wow thesis:** The thing most likely to make this owner say "wow" is *watching the price appear on screen as the customer builds their set — the surprise-pricing complaint that costs them stars simply cannot happen anymore — and seeing Ben's design work finally get a gallery.*
- **Demo moment (35s):** Build a set — full set → long → custom art → chrome — and watch the total tick up, then reserve.
- **Routes:** `/` · `/prices` · `/book`
- **Anti-overlap note:** Dark like 04, but fashion-saturated rather than automotive. Floating bottom pill nav is unique to this site.
- **Copy voice:** Confident, current, a little playful. Price transparency framed as respect, never as an apology.

## 10 — Cali New Nails
- **Mood:** Calm, soft, spa-adjacent. Quiet competence. The deliberate opposite of 09.
- **Hero concept:** Inverted split — soft desaturated image left, wide-tracked light Figtree statement right on pale sage, enormous breathing room.
- **Industry feature:** **Two-chair day view** — the salon's real constraint (two technicians) presented as intimacy; reserve a time and watch both chairs fill.
- **Wow thesis:** The thing most likely to make this owner say "wow" is *seeing the one thing customers keep writing about — that they are gentle when nobody else is — become the headline of the entire site.*
- **Demo moment (25s):** Open the two-chair day view → pick a time → the chair locks in and the day view updates.
- **Routes:** `/` · `/services` · `/reserve`
- **Anti-overlap note:** Lowest content density in the portfolio. Nothing on this site may be loud.
- **Copy voice:** Gentle, unhurried, specific. Lead with sensitive-care competence, not spa clichés.
