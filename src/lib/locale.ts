// @polsia:user-owned — HTML locale read by the framework layout for <html lang>/dir.
// Set `lang` (e.g. 'fr') and `dir: 'rtl'` for RTL languages. Edit freely.

export const locale: { lang: string; dir: 'ltr' | 'rtl' } = {
  // Every page is written in Spanish for a Colombia audience — <html lang="en">
  // was the template default and was never updated. This is a real SEO/a11y bug:
  // it tells Google and screen readers the page is English when it isn't.
  lang: 'es-CO',
  dir: 'ltr',
};
