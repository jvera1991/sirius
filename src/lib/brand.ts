// @polsia:user-owned — brand identity. Edit freely. `site.ts` re-exports
// siteName/siteDescription; `manifest.ts` + `opengraph-image.tsx` read `brandVisual`.

export const siteName = 'Sirius Cyber Security';
export const siteDescription =
  'Ciberseguridad para que las pymes de Medellín y Colombia crezcan con protección digital.';

// PWA + social-share colors. HEX only (CSS variables aren't readable here) — set
// them to match the theme you define in src/app/brand-theme.css. The starter
// values are achromatic placeholders, not a palette.
export const brandVisual = {
  /** PWA browser-UI / status-bar color — usually your background or primary. */
  themeColor: '#a94316',
  /** PWA splash + install background. */
  backgroundColor: '#f8f6f1',
  /** Social-share (OG/Twitter) image. */
  og: {
    background: '#191815',
    foreground: '#f7f1e8',
    /** Second line under the site name; '' hides it. */
    tagline: 'Crece con protección digital',
  },
} as const;
