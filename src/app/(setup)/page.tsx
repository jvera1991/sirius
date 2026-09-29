// @polsia:user-owned — onboarding edits this composition. See docs/landing.md.

import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  Fingerprint,
  MessagesSquare,
  Plus,
  Radar,
  ScanLine,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CyberCanvasMount } from '@/components/custom/landing/cyber-canvas-mount';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { siteDescription, siteName } from '@/lib/brand';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: siteName },
  description: siteDescription,
  alternates: { canonical: '/' },
  // Google ignores meta keywords for ranking, but they're free, harmless, and
  // some non-Google crawlers/directories still read them — real target terms
  // for this business, not generic filler.
  keywords: [
    'ciberseguridad para pymes',
    'SOC gestionado Medellín',
    'SOC as a service Colombia',
    'consultoría ISO 27001 Medellín',
    'auditor líder ISO 27001',
    'pentest Colombia',
    'pruebas de penetración caja negra',
    'hacker ético certificado',
    'monitoreo de marca dark web',
    'automatización con IA para pymes',
  ],
};

// Structured data (schema.org JSON-LD) — this is what actually earns rich
// results / a knowledge-panel style listing and reinforces the local (Medellín)
// signal for Google, independent of the meta-keywords tag above. Kept inline
// (not a shared component) because this content is specific to the homepage.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: siteName,
  description: siteDescription,
  url: siteUrl,
  telephone: '+57 322 513 0054',
  areaServed: ['Medellín', 'Colombia'],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Medellín',
    addressCountry: 'CO',
  },
  knowsAbout: [
    'SOC as a service',
    'ISO 27001',
    'ISO 22301',
    'Pruebas de penetración',
    'Protección de marca',
    'Automatización con inteligencia artificial',
  ],
};

const services = [
  {
    number: '01',
    title: 'Monitoreo y respuesta gestionada',
    description:
      'Wazuh y automatización con IA para detectar, priorizar y atender señales de riesgo en tus equipos y servicios, 24/7 — incluyendo fines de semana y madrugadas.',
    icon: ShieldCheck,
  },
  {
    number: '02',
    title: 'Marca y superficie de ataque',
    description:
      'Identificación de dominios que imitan tu marca, credenciales expuestas y activos visibles desde internet, sin instalar agentes pesados.',
    icon: Radar,
  },
  {
    number: '03',
    title: 'Pruebas de intrusión',
    description:
      'Evaluaciones de caja blanca, gris o negra, realizadas por un hacker ético certificado bajo autorización y alcance acordado.',
    icon: ScanLine,
  },
  {
    number: '04',
    title: 'Acompañamiento ISO',
    description:
      'Brechas, políticas y continuidad de negocio con una ruta práctica hacia buenas prácticas de ISO 27001 e ISO 22301.',
    icon: BadgeCheck,
  },
  {
    number: '05',
    title: 'Automatización de atención y ventas',
    description:
      'Chatbots y flujos para que tus canales respondan a clientes y oportunidades con menos tareas manuales.',
    icon: Workflow,
  },
  {
    number: '06',
    title: 'Cultura de seguridad',
    description:
      'Charlas y sesiones para que cada persona del equipo reconozca riesgos y sepa cómo actuar.',
    icon: Fingerprint,
  },
];

const channels = ['WhatsApp', 'Instagram', 'Telegram', 'LinkedIn'];

const plans = [
  {
    name: 'Escudo Esencial',
    description: 'El punto de partida para una pyme sin equipo de seguridad propio.',
    hook: 'Hasta 20 equipos · crece por equipo adicional',
    features: [
      'SOC gestionado con Wazuh + IA',
      'Alertas 24/7, incluyendo fines de semana',
      'Reporte mensual de estado',
      'Se ajusta a medida que sumas equipos',
    ],
    cta: 'Cotizar Escudo Esencial',
    featured: false,
  },
  {
    name: 'Escudo Pro',
    description: 'Para empresas que ya manejan datos sensibles de clientes.',
    hook: 'Hasta 50 equipos + 2 servidores cloud',
    features: [
      'Todo lo de Escudo Esencial',
      'Protección de marca y credenciales filtradas',
      'Escaneo continuo de superficie de ataque',
      'El plan que más pymes en crecimiento eligen',
    ],
    cta: 'Cotizar Escudo Pro',
    featured: true,
  },
  {
    name: 'A la medida',
    description: 'Pentest, consultoría ISO 27001/22301 o proyectos puntuales.',
    hook: 'Alcance y calendario definidos contigo',
    features: [
      'Pentest caja blanca, gris o negra',
      'Consultoría e implementación ISO 27001 / 22301',
      'Automatización de chatbots y flujos con IA',
      'Charlas de concientización para tu equipo',
    ],
    cta: 'Hablar de mi proyecto',
    featured: false,
  },
];

// WhatsApp deep link — every "cotizar"/"solicitar diagnóstico" CTA on this page opens a chat
// with this number instead of routing to an internal page. Update the number here if it changes;
// every CTA below reads from this one constant.
const WHATSAPP_NUMBER = '573225130054';
function whatsappHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

const stats = [
  { value: '24/7', label: 'Monitoreo continuo', description: 'Incluye noches y fines de semana' },
  {
    value: '3',
    label: 'Certificaciones líderes',
    description: 'ISO 27001, ISO 22301 y hacking ético',
  },
  { value: '3', label: 'Modalidades de pentest', description: 'Caja blanca, gris y negra' },
  { value: '100%', label: 'Enfoque pyme', description: 'Precios diseñados para negocios medianos' },
];

const faqs = [
  {
    question: '¿Necesito instalar software pesado en mis equipos?',
    answer:
      'El SOC usa un agente ligero de Wazuh. Los módulos de protección de marca y superficie de ataque funcionan sin instalar nada en tu infraestructura.',
  },
  {
    question: '¿Qué pasa con mis datos y los de mis clientes?',
    answer:
      'Tratamos la información conforme a la Ley 1581 de 2012 (Habeas Data). Solo accedemos a lo necesario para monitorear y proteger tus activos.',
  },
  {
    question: '¿Puedo empezar solo con un diagnóstico?',
    answer:
      'Sí. El diagnóstico inicial no tiene costo y te muestra tu nivel real de exposición antes de contratar cualquier plan.',
  },
  {
    question: '¿Hacen consultoría para certificarme en ISO 27001?',
    answer:
      'Te acompañamos en el diseño e implementación de las buenas prácticas de la norma. La certificación formal la emite un ente acreditado externo cuando decidas certificarte.',
  },
  {
    question: '¿Cómo autorizan las pruebas de pentest?',
    answer:
      'Toda prueba de intrusión se ejecuta únicamente bajo un contrato de autorización firmado, con alcance, activos y ventana de tiempo claramente definidos.',
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify of a static object above, not user input
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <CyberCanvasMount />
      <main className="relative">
        <section
          id="inicio"
          aria-labelledby="hero-title"
          className="relative isolate overflow-hidden"
        >
          <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center sm:px-8 sm:py-32">
            <Badge
              variant="outline"
              className="mb-7 gap-2 rounded-full border-border/60 bg-card/60 px-3 py-1.5 backdrop-blur"
            >
              <span className="size-2 rounded-full bg-primary" />
              Medellín · Colombia
            </Badge>
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
              {siteName}
            </p>
            <h1
              id="hero-title"
              className="max-w-3xl text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.03em] [text-shadow:0_2px_4px_rgba(0,0,0,0.6),0_12px_40px_rgba(0,0,0,0.55)] sm:text-6xl lg:text-7xl"
            >
              Crece con protección digital de nivel enterprise, a precio de pyme.
            </h1>
            <p className="mt-7 max-w-2xl text-xl font-medium leading-relaxed text-foreground/90 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)] sm:text-2xl">
              Monitoreamos tu operación 24/7 con un SOC potenciado por IA, protegemos tu marca y te
              acompañamos a cumplir la ISO 27001 — todo a un costo que una pyme puede pagar.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="group h-12 rounded-full px-6">
                <a
                  href={whatsappHref(
                    'Hola, quiero solicitar un diagnóstico gratuito de ciberseguridad para mi empresa.',
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Solicitar un diagnóstico
                  <ArrowUpRight className="transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-border/60 bg-card/40 px-6 backdrop-blur"
              >
                <Link href="#servicios">Ver servicios</Link>
              </Button>
            </div>
            <p className="mt-8 font-mono text-xs tracking-wide text-muted-foreground">
              DEFENSA DIGITAL <span className="px-2 text-primary">/</span> CUMPLIMIENTO{' '}
              <span className="px-2 text-primary">/</span> AUTOMATIZACIÓN
            </p>
          </div>
        </section>

        <section
          id="enfoque"
          aria-labelledby="approach-title"
          className="px-4 py-20 sm:px-8 sm:py-28 lg:px-12"
        >
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                Seguridad sin fragmentar
              </p>
              <h2
                id="approach-title"
                className="mt-5 max-w-lg text-4xl font-semibold tracking-tight sm:text-5xl"
              >
                Tecnología especializada. Trato cercano.
              </h2>
            </div>
            <div className="lg:pt-2">
              <p className="text-xl leading-relaxed text-muted-foreground sm:text-2xl">
                Una pyme no debería coordinar varios proveedores para proteger su operación, cumplir
                buenas prácticas y atender mejor a sus clientes.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                Sirius Cyber Security conecta monitoreo gestionado, seguridad ofensiva,
                acompañamiento en normas ISO y automatización de canales para pymes de Medellín y
                Colombia. El alcance se adapta a las necesidades y recursos de cada empresa.
              </p>
              <div className="mt-9 grid gap-4 sm:grid-cols-3">
                {[
                  ['01', 'Anticipar', 'Visibilidad sobre amenazas y exposición.'],
                  ['02', 'Responder', 'Alertas priorizadas y acciones claras.'],
                  ['03', 'Continuar', 'Procesos y equipos mejor preparados.'],
                ].map(([number, title, description]) => (
                  <div
                    key={number}
                    className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur"
                  >
                    <span className="font-mono text-xs text-brand-700">{number}</span>
                    <h3 className="mt-2 font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="servicios"
          aria-labelledby="services-title"
          className="border-y border-border/60 px-4 py-20 sm:px-8 sm:py-28 lg:px-12"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 grid gap-5 sm:mb-16 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                  Capacidades coordinadas
                </p>
                <h2
                  id="services-title"
                  className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl"
                >
                  Protección para cada frente de tu negocio.
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                Servicios que pueden comenzar por separado y crecer junto con tu operación.
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
              <ol className="grid gap-4 sm:grid-cols-2">
                {services.map(({ number, title, description, icon: Icon }) => (
                  <li
                    key={number}
                    className="group rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className="size-5 text-primary transition-transform duration-200 ease-out group-hover:translate-x-1"
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                      <span className="font-mono text-xs text-muted-foreground">{number}</span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold tracking-tight">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                  </li>
                ))}
              </ol>

              <aside className="lg:pt-7">
                <Card className="rounded-2xl border-primary/20 shadow-none">
                  <CardContent className="p-6 sm:p-7">
                    <MessagesSquare
                      className="size-6 text-primary"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                    <h3 className="mt-5 text-xl font-semibold">Conecta tus canales</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Flujos y asistentes para acompañar conversaciones de atención y ventas.
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-2" aria-label="Canales disponibles">
                      {channels.map((channel) => (
                        <li key={channel}>
                          <Badge variant="secondary" className="rounded-full">
                            {channel}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                  Cada servicio se dimensiona según el contexto y los recursos de tu empresa.
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section
          id="planes"
          aria-labelledby="plans-title"
          className="px-4 py-20 sm:px-8 sm:py-28 lg:px-12"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                Diseñado para crecer contigo
              </p>
              <h2
                id="plans-title"
                className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl"
              >
                Un plan para cada etapa de tu pyme
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Sin tarifa genérica: cotizamos según tus equipos, servidores y dominios, para que
                pagues exactamente por lo que necesitas proteger hoy — y escalas cuando tu empresa
                lo haga.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`flex flex-col rounded-2xl p-2 shadow-none ${plan.featured ? 'border-primary/50 ring-1 ring-primary/30' : ''}`}
                >
                  <CardContent className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      {plan.featured && (
                        <Badge className="rounded-full bg-primary text-primary-foreground">
                          Más elegido
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                    <p className="mt-6 flex items-center gap-2 font-mono text-xs tracking-wide text-primary">
                      <ArrowUpRight className="size-3.5" />
                      {plan.hook}
                    </p>
                    <ul className="mt-6 flex flex-1 flex-col gap-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-foreground/90"
                        >
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className="mt-8 rounded-full"
                      variant={plan.featured ? 'default' : 'outline'}
                    >
                      <a
                        href={whatsappHref(
                          `Hola, quiero cotizar el plan ${plan.name} de Sirius Cyber Security para mi empresa.`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {plan.cta}
                      </a>
                    </Button>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      Cotización personalizada en menos de 24h
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          id="confianza"
          aria-labelledby="trust-title"
          className="border-y border-border/60 px-4 py-16 sm:px-8 lg:px-12"
        >
          <div className="mx-auto max-w-7xl">
            <h2 id="trust-title" className="sr-only">
              Por qué confiar en Sirius
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <p className="bg-gradient-to-b from-foreground to-primary bg-clip-text text-4xl font-semibold text-transparent sm:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm font-semibold">{stat.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="equipo"
          aria-labelledby="team-title"
          className="px-4 py-20 sm:px-8 sm:py-28 lg:px-12"
        >
          <div className="mx-auto max-w-3xl">
            <Card className="rounded-3xl p-2 shadow-none">
              <CardContent className="p-8 sm:p-10">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                  Quién está detrás de Sirius
                </p>
                <h2 id="team-title" className="mt-4 text-2xl font-semibold sm:text-3xl">
                  Threat Hunter · Auditor Líder ISO 27001 · Auditor Líder ISO 22301 · Hacker ético
                </h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Con experiencia activa en threat hunting y certificaciones como Auditor Líder e
                  Implementador Líder ISO 27001, Auditor Líder ISO 22301, y hacking ético con
                  pruebas de intrusión en caja blanca, gris y negra. Sirius nace para llevar ese
                  mismo nivel de seguridad a empresas que hoy no pueden pagar un SOC tradicional.
                </p>
                <Button asChild variant="outline" className="mt-6 rounded-full">
                  <a
                    href={whatsappHref(
                      'Hola, quiero conversar sobre los servicios de Sirius Cyber Security para mi empresa.',
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Conversemos
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          id="preguntas"
          aria-labelledby="faq-title"
          className="border-y border-border/60 px-4 py-20 sm:px-8 sm:py-28 lg:px-12"
        >
          <div className="mx-auto max-w-3xl">
            <h2 id="faq-title" className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Preguntas frecuentes
            </h2>
            <div className="mt-10 divide-y divide-border/60">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {faq.question}
                    <Plus className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          id="cta-final"
          aria-labelledby="cta-title"
          className="px-4 py-20 sm:px-8 sm:py-28 lg:px-12"
        >
          <div className="mx-auto max-w-3xl">
            <Card className="rounded-3xl p-2 text-center shadow-none">
              <CardContent className="p-10 sm:p-14">
                <h2 id="cta-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  ¿Listo para dejar de improvisar tu ciberseguridad?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                  Agenda un diagnóstico gratuito y te decimos exactamente dónde estás expuesto.
                </p>
                <Button asChild size="lg" className="group mt-8 h-12 rounded-full px-6">
                  <a
                    href={whatsappHref(
                      'Hola, quiero solicitar un diagnóstico gratuito de ciberseguridad para mi empresa.',
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Solicitar un diagnóstico
                    <ArrowUpRight className="transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
