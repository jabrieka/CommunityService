/**
 * Posts the submission to a Google Apps Script web app webhook. Set up
 * instructions are in README.md. If GOOGLE_SHEETS_WEBHOOK_URL isn't set, this
 * silently no-ops so local dev still works.
 */
export async function appendToSheet(row: Record<string, unknown>) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    console.warn("[sheets] GOOGLE_SHEETS_WEBHOOK_URL not set — skipping.");
    return { skipped: true as const };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    throw new Error(`Sheets webhook ${res.status}: ${await res.text().catch(() => "")}`);
  }
  return { ok: true as const };
}
