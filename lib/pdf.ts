import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";

const GOLD = rgb(0.83, 0.65, 0.16); // ~#D4A52A
const INK = rgb(0.04, 0.04, 0.04);
const GREY = rgb(0.35, 0.35, 0.35);

const EVENT_NAME = "Cosette Productions — Community Mural Volunteer";
const LOCATION = "Thee Herbal Blessing, 614 N Farish St, Jackson, MS";
const ORG_EMAIL = "cosetteproductions@gmail.com";
const ORG_PHONE = "(769) 243-0309";

type DrawCtx = {
  page: PDFPage;
  font: PDFFont;
  bold: PDFFont;
  italic: PDFFont;
  margin: number;
  width: number;
  y: number;
};

function header(ctx: DrawCtx, title: string, subtitle: string) {
  // Gold band
  ctx.page.drawRectangle({
    x: 0,
    y: ctx.page.getHeight() - 70,
    width: ctx.page.getWidth(),
    height: 70,
    color: INK,
  });
  ctx.page.drawText("COSETTE PRODUCTIONS", {
    x: ctx.margin,
    y: ctx.page.getHeight() - 32,
    font: ctx.bold,
    size: 14,
    color: GOLD,
  });
  ctx.page.drawText(title, {
    x: ctx.margin,
    y: ctx.page.getHeight() - 55,
    font: ctx.bold,
    size: 20,
    color: rgb(1, 1, 1),
  });
  ctx.page.drawText(subtitle, {
    x: ctx.page.getWidth() - ctx.margin - ctx.bold.widthOfTextAtSize(subtitle, 9),
    y: ctx.page.getHeight() - 30,
    font: ctx.font,
    size: 9,
    color: rgb(1, 1, 1),
  });
  ctx.y = ctx.page.getHeight() - 100;
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const candidate = line ? line + " " + w : w;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function paragraph(ctx: DrawCtx, text: string, opts: { size?: number; bold?: boolean; gap?: number } = {}) {
  const size = opts.size ?? 10.5;
  const font = opts.bold ? ctx.bold : ctx.font;
  const gap = opts.gap ?? 14;
  const maxWidth = ctx.width - ctx.margin * 2;
  const lines = wrap(text, font, size, maxWidth);
  for (const line of lines) {
    ctx.page.drawText(line, { x: ctx.margin, y: ctx.y, font, size, color: INK });
    ctx.y -= gap;
  }
  ctx.y -= 4;
}

function heading(ctx: DrawCtx, text: string) {
  ctx.y -= 4;
  ctx.page.drawText(text, {
    x: ctx.margin,
    y: ctx.y,
    font: ctx.bold,
    size: 12,
    color: INK,
  });
  ctx.y -= 4;
  ctx.page.drawLine({
    start: { x: ctx.margin, y: ctx.y },
    end: { x: ctx.margin + 60, y: ctx.y },
    thickness: 2,
    color: GOLD,
  });
  ctx.y -= 14;
}

function field(ctx: DrawCtx, label: string, value: string, opts: { width?: number; x?: number } = {}) {
  const x = opts.x ?? ctx.margin;
  const w = opts.width ?? ctx.width - ctx.margin * 2;
  ctx.page.drawText(label.toUpperCase(), {
    x,
    y: ctx.y,
    font: ctx.bold,
    size: 8,
    color: GREY,
  });
  ctx.y -= 12;
  // Line
  ctx.page.drawLine({
    start: { x, y: ctx.y },
    end: { x: x + w, y: ctx.y },
    thickness: 0.8,
    color: INK,
  });
  if (value) {
    ctx.page.drawText(value, { x: x + 4, y: ctx.y + 3, font: ctx.font, size: 10.5, color: INK });
  }
  ctx.y -= 18;
}

function signatureRow(ctx: DrawCtx) {
  const colW = (ctx.width - ctx.margin * 2 - 20) / 2;
  const startY = ctx.y;
  // Signature line
  ctx.page.drawLine({
    start: { x: ctx.margin, y: startY },
    end: { x: ctx.margin + colW, y: startY },
    thickness: 0.8,
    color: INK,
  });
  ctx.page.drawText("VOLUNTEER SIGNATURE", {
    x: ctx.margin,
    y: startY - 12,
    font: ctx.bold,
    size: 8,
    color: GREY,
  });
  // Date line
  ctx.page.drawLine({
    start: { x: ctx.margin + colW + 20, y: startY },
    end: { x: ctx.margin + colW * 2 + 20, y: startY },
    thickness: 0.8,
    color: INK,
  });
  ctx.page.drawText("DATE", {
    x: ctx.margin + colW + 20,
    y: startY - 12,
    font: ctx.bold,
    size: 8,
    color: GREY,
  });
  ctx.y -= 32;
}

// ============================================================
// WAIVER
// ============================================================
export async function generateWaiverPDF(opts: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]); // US Letter
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);

  const ctx: DrawCtx = {
    page,
    font,
    bold,
    italic,
    margin: 50,
    width: page.getWidth(),
    y: page.getHeight() - 80,
  };

  header(ctx, "Volunteer Liability Waiver & Release", new Date().toLocaleDateString());

  paragraph(
    ctx,
    `This Volunteer Liability Waiver and Release of Claims ("Waiver") is entered into between the undersigned volunteer ("Volunteer") and Cosette Productions and its partners, including ${LOCATION.split(",")[0]} (collectively, the "Organization"), in connection with the community mural project at ${LOCATION}.`,
  );

  heading(ctx, "1. Volunteer Information");
  field(ctx, "Full Name", `${opts.firstName} ${opts.lastName}`);
  field(ctx, "Email", opts.email, { width: 240 });
  ctx.y += 18; // back up to draw second column at same row
  field(ctx, "Phone", opts.phone ?? "", { width: 240, x: ctx.margin + 260 });

  heading(ctx, "2. Acknowledgment of Risk");
  paragraph(
    ctx,
    "Volunteer acknowledges that participation in a community mural and painting activity involves inherent risks, including but not limited to: exposure to paint, solvents, and art materials; minor cuts or abrasions; use of ladders or scaffolding; lifting; slips, trips, and falls; and contact with other participants. Volunteer voluntarily assumes all such risks.",
  );

  heading(ctx, "3. Release of Liability");
  paragraph(
    ctx,
    "In consideration of being permitted to participate, Volunteer releases, waives, and discharges the Organization, its officers, employees, volunteers, sponsors, and property owners from any and all liability, claims, demands, or causes of action arising out of or related to any loss, damage, or injury sustained while participating, except where caused by gross negligence or willful misconduct.",
  );

  heading(ctx, "4. Photo & Media Release");
  paragraph(
    ctx,
    "Volunteer grants the Organization permission to photograph, film, or record Volunteer's likeness during the event and to use such media for promotional, educational, and non-commercial purposes without compensation.",
  );

  heading(ctx, "5. Minors");
  paragraph(
    ctx,
    "If Volunteer is under 18, a parent or legal guardian must also sign below to consent on Volunteer's behalf.",
  );

  ctx.y -= 10;
  signatureRow(ctx);
  ctx.y -= 6;
  signatureRow(ctx); // parent/guardian if applicable

  ctx.page.drawText("Parent/Guardian (if Volunteer is under 18)", {
    x: ctx.margin,
    y: ctx.y + 18,
    font: italic,
    size: 8,
    color: GREY,
  });

  // Footer
  ctx.page.drawText(
    `Questions? Contact ${ORG_EMAIL} · ${ORG_PHONE}`,
    {
      x: ctx.margin,
      y: 30,
      font: italic,
      size: 8,
      color: GREY,
    },
  );

  return pdf.save();
}

// ============================================================
// VOLUNTEER HOURS LOG
// ============================================================
export async function generateHoursLogPDF(opts: {
  firstName: string;
  lastName: string;
}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);

  const ctx: DrawCtx = {
    page,
    font,
    bold,
    italic,
    margin: 50,
    width: page.getWidth(),
    y: page.getHeight() - 80,
  };

  header(ctx, "Volunteer Hours Tracking Sheet", EVENT_NAME);

  paragraph(
    ctx,
    `Use this sheet to log the hours you contribute to the community mural project at ${LOCATION}. Have a site supervisor initial each entry. Submit a copy to ${ORG_EMAIL} when complete — we'll issue a verification letter for school, work, or court requirements.`,
  );

  heading(ctx, "Volunteer");
  field(ctx, "Full Name", `${opts.firstName} ${opts.lastName}`);

  heading(ctx, "Hours Log");

  // Table
  const cols = [
    { label: "DATE", width: 80 },
    { label: "START", width: 60 },
    { label: "END", width: 60 },
    { label: "TASK / NOTES", width: 200 },
    { label: "HOURS", width: 50 },
    { label: "INITIALS", width: 62 },
  ];
  const rowH = 24;
  const tableX = ctx.margin;
  const tableW = cols.reduce((s, c) => s + c.width, 0);

  // Header row
  ctx.page.drawRectangle({
    x: tableX,
    y: ctx.y - rowH + 6,
    width: tableW,
    height: rowH,
    color: INK,
  });
  let cx = tableX;
  for (const c of cols) {
    ctx.page.drawText(c.label, {
      x: cx + 6,
      y: ctx.y - 10,
      font: bold,
      size: 8,
      color: GOLD,
    });
    cx += c.width;
  }
  ctx.y -= rowH;

  // Body rows
  const rows = 14;
  for (let i = 0; i < rows; i++) {
    const top = ctx.y;
    // row outline
    ctx.page.drawRectangle({
      x: tableX,
      y: top - rowH + 6,
      width: tableW,
      height: rowH,
      borderColor: GREY,
      borderWidth: 0.5,
    });
    // column dividers
    let dx = tableX;
    for (let c = 0; c < cols.length - 1; c++) {
      dx += cols[c].width;
      ctx.page.drawLine({
        start: { x: dx, y: top + 6 },
        end: { x: dx, y: top - rowH + 6 },
        thickness: 0.5,
        color: GREY,
      });
    }
    ctx.y -= rowH;
  }

  // Total row
  ctx.y -= 6;
  ctx.page.drawText("TOTAL HOURS:", {
    x: tableX + tableW - 180,
    y: ctx.y,
    font: bold,
    size: 10,
    color: INK,
  });
  ctx.page.drawLine({
    start: { x: tableX + tableW - 70, y: ctx.y - 2 },
    end: { x: tableX + tableW, y: ctx.y - 2 },
    thickness: 1,
    color: INK,
  });

  ctx.y -= 30;
  heading(ctx, "Supervisor Verification");
  paragraph(
    ctx,
    "I verify that the hours logged above were performed by the volunteer named on this sheet in connection with the Cosette Productions community mural project.",
    { size: 9.5 },
  );
  ctx.y -= 4;
  signatureRow(ctx);

  ctx.page.drawText(
    `Return to ${ORG_EMAIL} · Questions? ${ORG_PHONE}`,
    { x: ctx.margin, y: 30, font: italic, size: 8, color: GREY },
  );

  return pdf.save();
}
