// @polsia:user-owned — per-app content for /llms.txt (route.ts is
// framework-owned). Applied only when the deploy is indexable (SEO_INDEXABLE).
//
// The SHAPE (types) is framework-owned in src/lib/llms.ts; here you declare the
// VALUE. The `## Pages` list is generated for you from the public
// routes in src/lib/nav.ts + src/lib/seo-routes.ts — enrich it here with an
// intro, per-page descriptions, extra curated sections, and an `## Optional`
// section. Example:
//
//   export const llmsConfig: LlmsConfig = {
//     intro: 'Acme helps teams ship faster with a hosted CI pipeline.',
//     pageDescriptions: {
//       '/': 'Product overview and sign-up.',
//       '/pricing': 'Plans, limits, and pricing.',
//     },
//     sections: [
//       {
//         title: 'Docs',
//         links: [
//           { label: 'API reference', href: '/docs/api', description: 'REST endpoints.' },
//           { label: 'Status', href: 'https://status.acme.com' }, // external URL, kept as-is
//         ],
//       },
//     ],
//     optional: [{ label: 'Changelog', href: '/changelog' }],
//   };
import type { LlmsConfig } from '@/lib/llms';

export const llmsConfig: LlmsConfig = {
  intro:
    'Sirius Cyber Security ofrece SOC gestionado (Wazuh + IA), protección de marca y superficie ' +
    'de ataque, pruebas de intrusión (caja blanca, gris y negra), consultoría e implementación ' +
    'ISO 27001 / ISO 22301, y automatización de canales con IA, para pymes y medianas empresas en ' +
    'Medellín y Colombia.',
  pageDescriptions: {
    '/': 'Página principal: servicios, planes, credenciales del equipo y preguntas frecuentes.',
    '/contacto': 'Formulario para solicitar un diagnóstico gratuito de ciberseguridad.',
  },
};
