// @polsia:user-owned — was framework-owned (polsia/modules/email@0.5.0), recording a form
// submission into the Polsia founder dashboard. This app no longer deploys on Polsia's own
// platform, so that dashboard doesn't exist for it — this always reports `recorded: false`,
// which is exactly the signal the framework already defined for "nothing was recorded, fall back
// to emailing the inbox with sendEmail()" (see src/app/api/contact/route.ts's notifyCompany).
// Kept as a same-shaped function, rather than deleted, so route.ts's two-path fallback logic
// doesn't need to change and stays easy to re-point at a real dashboard later if you build one.

import 'server-only';

export type SubmissionSource = 'contact_form' | 'waitlist';

export interface RecordSubmissionInput {
  source: SubmissionSource;
  email: string;
  name?: string;
  message?: string;
  fields?: Record<string, string | number | boolean>;
  idempotencyKey?: string;
}

export interface RecordSubmissionResult {
  recorded: boolean;
}

export async function recordSubmission(
  _input: RecordSubmissionInput,
): Promise<RecordSubmissionResult> {
  return { recorded: false };
}
