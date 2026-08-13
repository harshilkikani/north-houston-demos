# DIFFERENTIATION LEDGER

Filled in Phase 2, **before any site-specific CSS was written**. Re-checked in Phase 5 and Phase 10.

**Warning rule:** no two sites may match on more than two columns.

| Site | Hero type | Nav style | Type pairing | Radius philosophy | Palette base | Accent | Motion language | Section order signature | Image treatment | Density |
|---|---|---|---|---|---|---|---|---|---|---|
| 01 Countertops of TX | Material/texture-led (full-bleed stone macro, drawn edge line) | Minimal: wordmark left, single CTA right, no centre nav; full-screen mobile overlay | Instrument Serif + IBM Plex Mono | **0px — square, like a slab edge** | Warm graphite near-black `#16130F` | Burnt copper `#B4622D` | Precise, mechanical; straight-line reveals, zero bounce | Hero → **Edge Studio** → Materials → Process → Reviews → Quote | Full-bleed macro, warm duotone, high contrast | Sparse, editorial |
| 02 D&D Granite | Image-grid mosaic (wall of slab tiles) | Sticky horizontal **pill** nav | Space Grotesk + Inter | **20px soft cards** | Cool white `#F7F5F1` | Verdigris `#2E6B5E` | Gentle cross-fades, filter transitions | Hero mosaic → **Stone Wall filter** → Showroom → Services → Reviews → Quote | Uniform square crops, bright, saturated | Dense grid |
| 03 Sosa Hardwood | **Before/after slider hero** (carpet → hardwood) | Centred wordmark, split nav left/right | Fraunces + Karla | 4px + long horizontal rules | Cream `#FAF6EF` | Brass `#A8763E` | Horizontal wipes, plank-staggered reveals | Hero slider → Transformations → Species → **Scope builder** → Process → Reviews | Wide 21:9 letterbox, warm | Airy, wide |
| 04 Richey Collision | Layered depth, full-bleed dark + **corner nav**, animated specular sweep | Corner nav (logo TL / menu TR) on **all** viewports | Oswald + Barlow | 2px, hard | Near-black `#0A0A0B` | Tri-coat red `#C8102E` | Slow specular sweep, scroll parallax | Hero → Paint problem → Corvette → Insurance → **Estimate** → Reviews | Dark duotone, extreme paint macro, vignette | Cinematic, high-contrast |
| 05 La-Tino Hair | Split asymmetric 60/40, image right | Wordmark left + link row right under a hairline rule | Cormorant Garamond + Jost | Pill buttons, **0px on images** | Warm ivory `#FBF7F2` | Plum `#7D2E4A` + gold `#C9A227` | Soft slow fade-up | Hero → Colour work → Ivonne's chair → Services → Loyalty → **Booking** | Warm-graded, tall 4:5 crops | Generous, magazine |
| 06 CutMasters | **Offset card overlay** (photo + overlapping card) | **Bottom tab bar on mobile**, simple top bar desktop | Outfit + Source Sans 3 | **28px, circular avatars** | Bright white `#FFFDF8` | Tomato `#E8503A` + blue `#2F6FED` | Springy, restrained micro-bounce | Hero → **Meet the team** → Kids/first cuts → Services → Reviews → Book | Bright high-key, rounded/circular crops | Comfortable, card-driven |
| 07 Latin Cuts | **Editorial type-led poster** (type is the hero) | Full-width solid colour bar, uppercase links, big ES/EN switch | Anton + DM Sans | 0px + **hard offset shadows** | Ink `#101010` + marigold `#FFB800` | Vermilion `#E5322D` | Snappy sliding colour blocks, marquee ticker | Hero poster → **Live queue** → Price list → Services → Team → Reviews | High-contrast duotone in brand colours, hard crops | Dense, poster-like |
| 08 Marytere | **Centred minimal**, single tall portrait | Slim sticky bar, wordmark left, Reserve right; links in slide-down sheet | Italiana + Mulish | 8px + **arched-top image frames** | Rose-taupe `#F3EDE9` | Dusty rose `#B08375` / aubergine `#43303A` | Slow gentle scale, scroll-driven column | Hero portrait → **Lookbook column** → Services → Reserve → Visit → Reviews | Arched frames, muted film grade, 3:4 | Narrow measure, single column |
| 09 VNN Nails | **Horizontal-scroll intro band** of nail-art macros | **Floating pill nav, bottom-centre, all viewports** | Syne + Manrope | Pills + 24px squircles | Plum-black `#120A14` | Neon fuchsia `#FF2E88` + chrome lilac `#C9B6FF` | Horizontal scroll, glow pulse, ticking total | Hero band → **Price Builder** → Ben's gallery → Services → Reviews → Visit | Dark ground, saturated glossy macro, tight crops | Dense, fashion-editorial |
| 10 Cali New Nails | Split asymmetric **inverted** (soft image left, type right) | Centred text nav, generous spacing | Figtree (light, wide-tracked) + Lora | **32px+, fully soft** | Pale sage `#EFF2EC` | Soft clay `#C98F73` / eucalyptus `#7E9682` | Very slow fades only; reduced-motion native | Hero → **Gentle promise** → Sensitive care → Services → **Two-chair reserve** → Reviews | Soft, desaturated, light, no hard crops | Very airy, low density |

## Cluster conflict check

**Hair cluster (05 / 06 / 07 / 08)** — pairwise column matches: all pairs match on **0** columns. Hero types: split / offset card / type-led / centred minimal. Palettes: warm ivory / bright white / ink+marigold / rose-taupe. Radius: pill+0 / 28 / 0+shadow / 8+arch. Density: magazine / card / poster / single-column. **PASS.**

**Nail cluster (09 / 10)** — matches on **0** columns. Deliberate opposites: dark saturated dense vs light soft airy. **PASS.**

**Stone cluster (01 / 02)** — matches on **0** columns. Craftsman-dark-sparse vs showroom-bright-dense. **PASS.**

**Contractor pair (03 / 04)** — matches on **0** columns. **PASS.**

## Portfolio-wide near-misses being watched

- **01 and 07 both use 0px radius.** Mitigated: 07 adds hard offset shadows and a saturated poster palette; 01 is dark, sparse and serif-led. One column — within rule.
- **05 and 10 both use split-asymmetric heroes.** Mitigated: mirrored orientation, opposite palettes (warm plum vs pale sage), opposite type voice (high-contrast serif vs light wide sans). One column — within rule; hero type appears exactly twice, which the distribution rule allows.
- **Four sites carry a language toggle (05, 06, 07, 08).** Translation is evidence-gated, not a style column, and each toggle has a different visual treatment (inline text pair / tab-bar item / large bar switch / sheet item).
