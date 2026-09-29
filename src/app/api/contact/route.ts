// @polsia:user-owned
//
// POST /api/contact — plain REST route handler that writes a ContactMessage and
// then surfaces it in the founder's Polsia dashboard, so a submission is actually
// READ by someone — and can be answered.
// Lives under /api, which proxy.ts's matcher excludes (no CSP/nonce, not proxied).
// PUBLIC — no auth check.
//
// Requires the `email` module (@/lib/email/submissions + send + templates).

import 'server-only';
import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/contact/schema';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email/send';
import { recordSubmission } from '@/lib/email/submissions';
import { notificationEmail } from '@/lib/email/templates';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { errors: { form: 'La solicitud no tiene un formato válido.' } },
      { status: 400 },
    );
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return NextResponse.json(
      {
        errors: {
          company: fieldErrors.company?.[0],
          email: fieldErrors.email?.[0],
          service: fieldErrors.service?.[0],
        },
      },
      { status: 400 },
    );
  }

  let saved: { id: string };
  try {
    saved = await prisma.contactMessage.create({
      data: {
        name: result.data.company,
        email: result.data.email,
        message: `Servicio de interés: ${result.data.service}`,
      },
    });
  } catch {
    return NextResponse.json(
      { errors: { form: 'No fue posible guardar tu solicitud. Intenta de nuevo.' } },
      { status: 500 },
    );
  }

  await notifyCompany(
    {
      name: result.data.company,
      email: result.data.email,
      message: `Servicio de interés: ${result.data.service}`,
    },
    saved.id,
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}

/**
 * Surface the message to the founder. The row above is already committed and is
 * the source of truth, so this whole function is best-effort by design: a
 * rate-limited or failing call must never turn a captured message into an error
 * for the visitor.
 *
 * `recordSubmission` always returns `recorded: false` now (see
 * src/lib/email/submissions.ts — the Polsia founder dashboard it used to post to
 * doesn't exist for this deploy), so every submission falls through to the email
 * step: an SMTP notification to CONTACT_NOTIFY_EMAIL (src/lib/env.ts). The
 * founder can't hit "reply" on that email and have it thread back to the
 * visitor — that's why the visitor's own address is written into the BODY of
 * the notification, not just the envelope.
 */
async function notifyCompany(
  input: { name: string; email: string; message: string },
  submissionId: string,
) {
  try {
    const { recorded } = await recordSubmission({
      source: 'contact_form',
      email: input.email,
      name: input.name,
      message: input.message,
      // The row id — dedupes a retried submission on the platform side.
      idempotencyKey: submissionId,
    });
    if (recorded) return;
  } catch {
    // Anomaly (validation, cap, transport). Fall through to the email fallback
    // rather than lose the notification.
  }

  // Defaults to jorgeantonioverahernandez@gmail.com (see src/lib/env.ts); override with
  // CONTACT_NOTIFY_EMAIL if the inbox that should receive these ever changes.
  const to = env.CONTACT_NOTIFY_EMAIL;

  try {
    await sendEmail({
      to,
      ...notificationEmail({
        subject: `Nueva solicitud de diagnóstico de ${input.name}`,
        title: 'Nueva solicitud de diagnóstico',
        lines: [`De: ${input.name} <${input.email}>`, input.message],
      }),
    });
  } catch {
    // Deliberately swallowed — see the best-effort note above.
  }
}
