// Metadata helper. Every demo site ships noindex,nofollow (§22) plus a robots.txt disallow.
export function meta({ title, description, base, lang = 'en' }) {
  return {
    title,
    description,
    lang,
    robots: 'noindex, nofollow',
    favicon: `${base.replace(/\/$/, '')}/favicon.svg`,
    ogImage: `${base.replace(/\/$/, '')}/og.png`,
  }
}
