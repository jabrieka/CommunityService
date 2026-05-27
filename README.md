# Cosette Productions — Volunteer Sign-up Site

A Next.js site that mimics the Cosette Productions volunteer flyer, with:

- A volunteer **sign-up form**
- **Email delivery** of submissions to you (admin notification)
- **Auto-emailed waiver + volunteer hours log** (PDFs generated on the fly) to each new volunteer
- Optional **Google Sheets logging** of every submission
- A **dynamically generated QR code** that always points at the deployed URL

Built to deploy on **Vercel** in one click.

---

## 1. Local setup

```bash
npm install
cp .env.example .env.local
# fill in RESEND_API_KEY, RESEND_FROM, ADMIN_EMAIL, etc.
npm run dev
```

Open <http://localhost:3000>.

> The QR code in the footer encodes whatever URL the page is being served from
> — `http://localhost:3000` in dev, your real Vercel URL in production.

---

## 2. Email setup (Resend) — required for waiver delivery

1. Sign up at <https://resend.com> (free tier: 100 emails/day, 3000/month).
2. Create an API key and put it in `RESEND_API_KEY`.
3. Verify a sending domain in Resend, then set
   `RESEND_FROM="Cosette Productions <volunteers@yourdomain.com>"`.

   **Don't have a domain?** You can test with
   `RESEND_FROM="Cosette Productions <onboarding@resend.dev>"` — but Resend
   will only deliver to the address you signed up with. Get a domain (or use
   a free subdomain) before going live.
4. Set `ADMIN_EMAIL=jabrieka1thornton@gmail.com` (or wherever you want
   sign-up notifications to land).

Without these env vars, the site still renders and the form still "submits"
— but emails are skipped (and a warning is logged).

---

## 3. Google Sheets logging (optional but recommended)

This gives you a running spreadsheet of every sign-up in addition to the
email notifications.

1. Create a new Google Sheet. Note the URL.
2. In the Sheet, go to **Extensions → Apps Script**.
3. Replace the editor contents with the script below and save:

   ```javascript
   const SHEET_ID = "PASTE_YOUR_SHEET_ID_HERE"; // the long string in the URL
   const TAB_NAME = "Signups";

   function doPost(e) {
     const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME)
       || SpreadsheetApp.openById(SHEET_ID).insertSheet(TAB_NAME);
     const data = JSON.parse(e.postData.contents);

     // Write headers on first run
     if (sheet.getLastRow() === 0) {
       sheet.appendRow([
         "Submitted At","First Name","Last Name","Email","Phone",
         "Age","Experience","Skills","Message"
       ]);
     }
     sheet.appendRow([
       data.submittedAt, data.firstName, data.lastName, data.email, data.phone,
       data.age, data.experience, data.skills, data.message,
     ]);
     return ContentService.createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

4. Click **Deploy → New deployment → Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
   - Deploy and copy the resulting **Web app URL**.
5. Put that URL into `GOOGLE_SHEETS_WEBHOOK_URL` in your Vercel env vars.

If you skip this step, signups still get emailed — you just won't have a
spreadsheet copy.

---

## 4. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to <https://vercel.com/new> and import the repo.
3. Vercel auto-detects Next.js. Click **Deploy**.
4. After it's live, go to **Project → Settings → Environment Variables** and
   add all the keys from `.env.example`. Redeploy.
5. Update `NEXT_PUBLIC_SITE_URL` to your real Vercel URL (e.g.
   `https://cosette-volunteers.vercel.app`) and redeploy once more.

The QR code in the footer will now resolve to your live URL automatically.

---

## 5. Updating the event details

Edit `app/page.tsx`:

- `PHONE`, `EMAIL`, `IG`, `LOCATION_NAME`, `LOCATION_ADDR` at the top
- The `Date` and `Time` rows in the event-info section
- The two flyer headlines if you want different copy

The waiver and hours-log PDFs pull the org name, address, email, and phone
from constants at the top of `lib/pdf.ts` — edit them there.

---

## 6. What gets sent to volunteers

Each volunteer gets a single email with:

- A short confirmation message (HTML, branded)
- **Volunteer-Waiver-{LastName}.pdf** — fillable liability waiver with their
  name and contact info pre-filled
- **Volunteer-Hours-Log-{LastName}.pdf** — a 14-row hours-tracking sheet
  with their name pre-filled, ready for a supervisor's initials

Both PDFs are generated fresh from `lib/pdf.ts` on each submission — no
binary files to maintain. Want to change wording or layout? Edit
`generateWaiverPDF` and `generateHoursLogPDF` in `lib/pdf.ts`.

---

## File map

```
app/
  layout.tsx           — fonts + root HTML
  page.tsx             — the flyer-style landing page
  globals.css          — Tailwind + brush-stroke styles
  api/signup/route.ts  — POST handler: PDFs + emails + Sheets
components/
  SignupForm.tsx       — the volunteer form (client component)
  QRCode.tsx           — dynamic QR code (client component)
  Icons.tsx            — inline SVG icons used on the flyer
lib/
  pdf.ts               — generates the waiver + hours-log PDFs
  email.ts             — Resend wrapper + HTML email templates
  sheets.ts            — Google Apps Script webhook poster
public/assets/
  image0.png           — original reference flyer
  brush-mask.svg       — brush-stroke mask for the perks bar
  splash-mask.svg      — brush-stroke mask for splash callouts
  pyramid-logo.svg     — the pyramid/sun logo art
```
