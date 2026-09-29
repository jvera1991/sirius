// @polsia:user-owned
import { describe, expect, it } from 'vitest';
import { contactSchema, contactServices } from '@/lib/contact/schema';

describe('contrato de solicitud de diagnóstico', () => {
  it.each(contactServices)('acepta el servicio publicado «%s»', (service) => {
    const result = contactSchema.safeParse({
      company: 'Empresa de prueba',
      email: 'persona@example.test',
      service,
    });

    expect(result.success).toBe(true);
  });

  it('rechaza una empresa vacía o compuesta por espacios', () => {
    const result = contactSchema.safeParse({
      company: '   ',
      email: 'persona@example.test',
      service: contactServices[0],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.company?.[0]).toBe(
        'Escribe el nombre de tu empresa.',
      );
    }
  });

  it('rechaza un correo inválido', () => {
    const result = contactSchema.safeParse({
      company: 'Empresa de prueba',
      email: 'correo-no-valido',
      service: contactServices[0],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email?.[0]).toBe(
        'Escribe un correo electrónico válido.',
      );
    }
  });

  it('rechaza un servicio ausente o ajeno a las opciones', () => {
    const base = { company: 'Empresa de prueba', email: 'persona@example.test' };

    for (const input of [base, { ...base, service: 'Servicio no publicado' }]) {
      const result = contactSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.service?.[0]).toBe(
          'Selecciona un servicio de interés válido.',
        );
      }
    }
  });
});
