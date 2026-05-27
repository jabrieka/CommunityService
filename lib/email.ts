import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM ?? "Cosette Productions <onboarding@resend.dev>";

const resend = apiKey ? new Resend(apiKey) : null;

export type Attachment = {
  filename: string;
  content: Buffer;
};

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Attachment[];
  replyTo?: string;
}) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping send. Subject:", opts.subject);
    return { skipped: true as const };
  }

  const result = await resend.emails.send({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    replyTo: opts.replyTo,
    attachments: opts.attachments?.map((a) => ({
      filename: a.filename,
      content: a.content,
    })),
  });

  if (result.error) {
    throw new Error(`Resend error: ${result.error.message}`);
  }
  return { id: result.data?.id };
}

export function volunteerConfirmationHtml(opts: {
  firstName: string;
}): string {
  return `
<!doctype html>
<html>
<body style="font-family: -apple-system, Segoe UI, Helvetica, Arial, sans-serif; background:#f5efe0; padding:24px;">
  <div style="max-width:560px; margin:0 auto; background:#0A0A0A; color:#F5EFE0; border-radius:14px; overflow:hidden;">
    <div style="padding:28px 28px 8px; background:linear-gradient(180deg,#0A0A0A,#1a1a1a);">
      <div style="color:#D4A52A; letter-spacing:.3em; font-size:11px; text-transform:uppercase;">Cosette Productions</div>
      <h1 style="font-size:28px; line-height:1.1; margin:8px 0 0; color:#F5EFE0;">You're in, ${escapeHtml(opts.firstName)}! 🎨</h1>
    </div>
    <div style="padding:20px 28px 28px;">
      <p style="line-height:1.55;">Thanks for signing up to volunteer for our community mural at <strong>Thee Herbal Blessing</strong> in Jackson, MS.</p>
      <p style="line-height:1.55;">Attached to this email you'll find two documents:</p>
      <ol style="line-height:1.6;">
        <li><strong>Volunteer Waiver</strong> — please sign and return before the event (a photo or scan to <a href="mailto:cosetteproductions@gmail.com" style="color:#D4A52A;">cosetteproductions@gmail.com</a> works).</li>
        <li><strong>Volunteer Hours Tracking Sheet</strong> — use this to log your hours; a site supervisor will initial each entry. We can issue a verification letter for school, work, or court requirements.</li>
      </ol>
      <p style="line-height:1.55;">We'll follow up with the exact date and time as soon as they're locked in. Snacks and drinks will be provided!</p>
      <p style="margin-top:24px;">Questions? Just reply to this email or call <strong>(769) 243-0309</strong>.</p>
      <p style="margin-top:24px; font-style:italic; color:#D4A52A;">Let's create something beautiful.</p>
    </div>
  </div>
  <p style="text-align:center; color:#888; font-size:11px; margin-top:16px;">Cosette Productions · 614 N Farish St, Jackson, MS</p>
</body>
</html>
  `.trim();
}

export function adminNotificationHtml(opts: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  age?: string;
  experience?: string;
  skills?: string[];
  message?: string;
  submittedAt: string;
}): string {
  const row = (k: string, v?: string) =>
    v
      ? `<tr><td style="padding:6px 12px; color:#666; text-transform:uppercase; font-size:11px; letter-spacing:.08em;">${k}</td><td style="padding:6px 12px; color:#111;">${escapeHtml(v)}</td></tr>`
      : "";
  return `
<!doctype html>
<html>
<body style="font-family: -apple-system, Segoe UI, Helvetica, Arial, sans-serif; background:#f5efe0; padding:24px;">
  <div style="max-width:560px; margin:0 auto; background:#fff; border-radius:10px; overflow:hidden; border:1px solid #eee;">
    <div style="background:#0A0A0A; color:#D4A52A; padding:16px 20px; font-weight:700;">New Volunteer Sign-up</div>
    <table style="width:100%; border-collapse:collapse; font-size:14px;">
      ${row("Name", `${opts.firstName} ${opts.lastName}`)}
      ${row("Email", opts.email)}
      ${row("Phone", opts.phone)}
      ${row("Age", opts.age)}
      ${row("Experience", opts.experience)}
      ${row("Skills", opts.skills?.join(", "))}
      ${row("Message", opts.message)}
      ${row("Submitted", opts.submittedAt)}
    </table>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
