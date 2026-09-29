import { describe, expect, it } from 'vitest';
import { contactSchema, contactServices } from '@/lib/contact/schema';

describe('diagnostic contact request contract', () => {
  it('accepts each published service with company and email', () => {
    for (const service of contactServices) {
      expect(
        contactSchema.safeParse({
          company: 'Empresa QA',
          email: 'diagnostico@example.test',
          service,
        }).success,
      ).toBe(true);
    }
  });

  it('rejects missing company, invalid email, and unknown service', () => {
    expect(
      contactSchema.safeParse({
        company: '   ',
        email: 'diagnostico@example.test',
        service: contactServices[0],
      }).success,
    ).toBe(false);
    expect(
      contactSchema.safeParse({
        company: 'Empresa QA',
        email: 'not-an-email',
        service: contactServices[0],
      }).success,
    ).toBe(false);
    expect(
      contactSchema.safeParse({
        company: 'Empresa QA',
        email: 'diagnostico@example.test',
        service: 'Servicio inventado',
      }).success,
    ).toBe(false);
  });
});
