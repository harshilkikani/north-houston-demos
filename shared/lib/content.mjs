// Structural content helpers. Deliberately style-free — no markup, no classes.
// Every site reads its facts from its own content/business.json, never from hardcoded strings.

export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
export const DAY_LABELS = {
  en: { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' },
  es: { mon: 'Lunes', tue: 'Martes', wed: 'Miércoles', thu: 'Jueves', fri: 'Viernes', sat: 'Sábado', sun: 'Domingo' },
}
export const DAY_SHORT = {
  en: { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' },
  es: { mon: 'Lun', tue: 'Mar', wed: 'Mié', thu: 'Jue', fri: 'Vie', sat: 'Sáb', sun: 'Dom' },
}

const CLOSED = { en: 'Closed', es: 'Cerrado' }

/** Rows of { key, label, short, value, closed } in Mon–Sun order. */
export function hourRows(hours, lang = 'en') {
  return DAY_KEYS.map((k) => {
    const raw = hours[k]
    const closed = /closed|cerrado/i.test(raw)
    return {
      key: k,
      label: DAY_LABELS[lang][k],
      short: DAY_SHORT[lang][k],
      value: closed ? CLOSED[lang] : raw,
      closed,
    }
  })
}

/** Collapses consecutive identical days: "Mon–Fri 9:00 AM – 5:00 PM". */
export function hourSummary(hours, lang = 'en') {
  const rows = hourRows(hours, lang)
  const out = []
  let i = 0
  while (i < rows.length) {
    let j = i
    while (j + 1 < rows.length && rows[j + 1].value === rows[i].value) j++
    const span = i === j ? rows[i].short : `${rows[i].short}–${rows[j].short}`
    out.push({ span, value: rows[i].value, closed: rows[i].closed })
    i = j + 1
  }
  return out
}

/** Digits-only tel: href from a display phone number. */
export function telHref(display) {
  const digits = String(display).replace(/\D/g, '')
  return `tel:+1${digits.length === 11 ? digits.slice(1) : digits}`
}

/** Prefixes a site-root-relative path with the deploy base. */
export function withBase(base, p) {
  const b = base.endsWith('/') ? base.slice(0, -1) : base
  const s = p.startsWith('/') ? p : `/${p}`
  return `${b}${s}`
}

/**
 * srcset + fallback for an asset produced by build-assets.mjs.
 * Every asset is generated at the same widths, so there is no per-call size to get wrong.
 */
export const ASSET_WIDTHS = [1920, 1200, 800, 480]
export const ASSET_JPG = 1200

export function img(base, name) {
  const fallback = withBase(base, `/assets/${name}-${ASSET_JPG}.jpg`)
  return {
    src: fallback,
    fallback,
    webp: ASSET_WIDTHS.map((x) => `${withBase(base, `/assets/${name}-${x}.webp`)} ${x}w`).join(', '),
    widths: ASSET_WIDTHS,
  }
}

/** Google-rating string with explicit source attribution — never a bare superlative. */
export function ratingLine(rating, lang = 'en') {
  return lang === 'es'
    ? `${rating.value} en Google · ${rating.count} reseñas`
    : `${rating.value} on Google · ${rating.count} reviews`
}
