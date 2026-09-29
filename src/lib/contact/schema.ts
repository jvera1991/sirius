// @polsia:user-owned
//
// Contrato compartido por la isla cliente y POST /api/contact.

import { z } from 'zod';

export const contactServices = [
  'Monitoreo y respuesta gestionada',
  'Marca y superficie de ataque',
  'Pruebas de intrusión',
  'Acompañamiento ISO',
  'Automatización de atención y ventas',
  'Cultura de seguridad',
] as const;

export const contactServiceSchema = z.enum(contactServices, {
  errorMap: () => ({ message: 'Selecciona un servicio de interés válido.' }),
});

export const contactSchema = z.object({
  company: z.string().trim().min(1, 'Escribe el nombre de tu empresa.'),
  email: z.string().trim().email('Escribe un correo electrónico válido.'),
  service: contactServiceSchema,
});

export const contactResponseSchema = z.object({ ok: z.literal(true) });

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactService = z.infer<typeof contactServiceSchema>;
