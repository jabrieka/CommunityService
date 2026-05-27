import { NextRequest, NextResponse } from "next/server";
import { generateWaiverPDF, generateHoursLogPDF } from "@/lib/pdf";
import {
  sendEmail,
  volunteerConfirmationHtml,
  adminNotificationHtml,
} from "@/lib/email";
import { appendToSheet } from "@/lib/sheets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  age?: string;
  experience?: string;
  skills?: string | string[];
  message?: string;
  agree?: string;
};

function toStringArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: NextRequest) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const firstName = body.firstName?.trim();
  const lastName = body.lastName?.trim();
  const email = body.email?.trim().toLowerCase();
  const phone = body.phone?.trim();

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (body.agree !== "yes") {
    return NextResponse.json(
      { error: "You must acknowledge the waiver delivery." },
      { status: 400 },
    );
  }

  const skills = toStringArray(body.skills);
  const submittedAt = new Date().toISOString();
  const adminEmail = process.env.ADMIN_EMAIL;

  // 1) Generate PDFs (waiver + hours sheet) in parallel.
  const [waiverBytes, hoursBytes] = await Promise.all([
    generateWaiverPDF({ firstName, lastName, email, phone }),
    generateHoursLogPDF({ firstName, lastName }),
  ]);

  const waiver = {
    filename: `Volunteer-Waiver-${lastName}.pdf`,
    content: Buffer.from(waiverBytes),
  };
  const hours = {
    filename: `Volunteer-Hours-Log-${lastName}.pdf`,
    content: Buffer.from(hoursBytes),
  };

  // 2) Email volunteer with attachments + email admin + log to Sheets, in parallel.
  //    Each is wrapped so one failing doesn't kill the others.
  const results = await Promise.allSettled([
    sendEmail({
      to: email,
      subject: "You're in! — Cosette Productions volunteer info",
      html: volunteerConfirmationHtml({ firstName }),
      attachments: [waiver, hours],
      replyTo: adminEmail,
    }),
    adminEmail
      ? sendEmail({
          to: adminEmail,
          subject: `New volunteer sign-up: ${firstName} ${lastName}`,
          html: adminNotificationHtml({
            firstName,
            lastName,
            email,
            phone,
            age: body.age,
            experience: body.experience,
            skills,
            message: body.message,
            submittedAt,
          }),
          replyTo: email,
        })
      : Promise.resolve({ skipped: true } as const),
    appendToSheet({
      submittedAt,
      firstName,
      lastName,
      email,
      phone,
      age: body.age,
      experience: body.experience,
      skills: skills.join(", "),
      message: body.message,
    }),
  ]);

  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r) => (r.reason instanceof Error ? r.reason.message : String(r.reason)));

  if (errors.length) {
    console.error("[signup] partial failures:", errors);
    // The volunteer email is the most important; if that one specifically failed, return an error.
    if (results[0].status === "rejected") {
      return NextResponse.json(
        { error: "We couldn't email your waiver. Please try again or contact us directly." },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
