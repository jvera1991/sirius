// @polsia:user-owned — was framework-owned (polsia/modules/email@0.5.1), POSTing to the
// Polsia-hosted email proxy. This app no longer deploys on Polsia's own platform (it's moving to
// a self-hosted EasyPanel server), so that internal proxy is unreachable from here — replaced with
// plain SMTP via nodemailer. Import from your app's OWN server route handlers (never expose a
// generic /api/email route). Compose subject/html/text in @/lib/email/templates, then:
//   sendEmail({ to, ...welcomeEmail({ name }) });
//
// Configure via env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS. For Gmail: SMTP_HOST=smtp.gmail.com,
// SMTP_PORT=465, SMTP_USER=<the sending Gmail address>, SMTP_PASS=<a 16-char Google "app password",
// NOT the account password — requires 2-Step Verification on: myaccount.google.com/apppasswords>.
// Left unconfigured, sendEmail() logs and no-ops instead of throwing, so a missing SMTP setup never
// breaks the request that called it (the contact form still saves to Postgres regardless).

import 'server-only';
import nodemailer from 'nodemailer';
import { env } from '@/lib/env';

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailResult {
  /** The transport's message id, or '' when SMTP wasn't configured (no-op). */
  id: string;
}

let cachedTransport: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransport() {
  if (cachedTransport) return cachedTransport;
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) return null;
  cachedTransport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ?? 465,
    secure: (env.SMTP_PORT ?? 465) === 465, // 465 = implicit TLS; 587 = STARTTLS
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  return cachedTransport;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const transport = getTransport();
  if (!transport) {
    // biome-ignore lint/suspicious/noConsole: only diagnostics path when SMTP isn't set up yet
    console.error(
      'sendEmail: SMTP_HOST/SMTP_USER/SMTP_PASS not configured — email not sent. ' +
        'Set them in the deploy environment to enable contact-form notifications.',
    );
    return { id: '' };
  }
  const info = await transport.sendMail({
    from: env.SMTP_USER,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
  return { id: info.messageId ?? '' };
}
