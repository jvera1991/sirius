// @polsia:user-owned
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiFetch } from '@/lib/api-client';
import {
  type ContactInput,
  type ContactService,
  contactResponseSchema,
  contactServices,
} from '@/lib/contact/schema';

type ContactErrors = Partial<Record<keyof ContactInput, string>>;

function getContactService(value: string): ContactService | '' {
  return contactServices.find((service) => service === value) ?? '';
}

export function ContactForm() {
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState<ContactService | ''>('');
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setFormError(null);

    if (!service) {
      setErrors({ service: 'Selecciona un servicio de interés.' });
      return;
    }

    const input: ContactInput = { company, email, service };
    setPending(true);
    try {
      await apiFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(input),
        schema: contactResponseSchema,
      });
      setOk(true);
    } catch (err) {
      const cause = (
        err as {
          cause?: {
            errors?: ContactErrors & { form?: string };
          };
        }
      ).cause;
      setErrors(cause?.errors ?? {});
      setFormError(
        cause?.errors?.form ??
          (!cause?.errors ? 'No fue posible enviar tu solicitud. Intenta de nuevo.' : null),
      );
    } finally {
      setPending(false);
    }
  }

  if (ok) {
    return (
      <output aria-live="polite" className="py-4 text-center text-sm font-medium text-foreground">
        Gracias. Recibimos tu solicitud de diagnóstico.
      </output>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="contact-company">Empresa</Label>
        <Input
          id="contact-company"
          name="company"
          type="text"
          autoComplete="organization"
          placeholder="Nombre de tu empresa"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          aria-invalid={errors.company ? true : undefined}
          aria-describedby={errors.company ? 'contact-company-error' : undefined}
        />
        {errors.company ? (
          <p id="contact-company-error" role="alert" className="text-sm text-destructive">
            {errors.company}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-email">Correo electrónico</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
        />
        {errors.email ? (
          <p id="contact-email-error" role="alert" className="text-sm text-destructive">
            {errors.email}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-service">Servicio de interés</Label>
        <select
          id="contact-service"
          name="service"
          value={service}
          onChange={(event) => {
            setService(getContactService(event.currentTarget.value));
          }}
          required
          aria-invalid={errors.service ? true : undefined}
          aria-describedby={errors.service ? 'contact-service-error' : undefined}
          className="flex h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20"
        >
          <option value="">Selecciona un servicio de interés</option>
          {contactServices.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.service ? (
          <p id="contact-service-error" role="alert" className="text-sm text-destructive">
            {errors.service}
          </p>
        ) : null}
      </div>
      {formError ? (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Enviando…' : 'Enviar solicitud'}
      </Button>
    </form>
  );
}
