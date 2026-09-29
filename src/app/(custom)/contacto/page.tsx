// @polsia:user-owned
import type { Metadata } from 'next';
import { ContactForm } from '@/components/custom/contact-form';
import { Card, CardContent } from '@/components/ui/card';
import { siteName } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Indica tu empresa, correo electrónico y servicio de interés para solicitar un diagnóstico de ciberseguridad con Sirius Cyber Security.',
  alternates: { canonical: '/contacto' },
};

export default function ContactPage() {
  return (
    <main className="px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <section aria-labelledby="contact-title" className="lg:pt-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">
            {siteName}
          </p>
          <h1 id="contact-title" className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Solicita un diagnóstico de ciberseguridad
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Déjanos los datos de tu empresa, un correo de contacto y el servicio que te interesa.
            Así podremos orientar la conversación hacia la necesidad de tu operación.
          </p>
          <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
            Selecciona entre los servicios de ciberseguridad y automatización de Sirius. No
            necesitas definir de antemano el alcance del diagnóstico.
          </p>
        </section>

        <Card className="rounded-3xl border-brand-500/20 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Cuéntanos qué necesita tu empresa</h2>
            <p className="mt-2 mb-7 text-sm leading-6 text-muted-foreground">
              El equipo de {siteName} recibirá tu solicitud.
            </p>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
