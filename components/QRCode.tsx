"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Props = {
  /** Override the URL the QR encodes. Defaults to the current page URL. */
  value?: string;
  size?: number;
  className?: string;
};

export default function QRCodeImage({ value, size = 220, className }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const target =
      value ??
      (typeof window !== "undefined"
        ? window.location.origin + window.location.pathname
        : process.env.NEXT_PUBLIC_SITE_URL ?? "");

    if (!target) return;

    QRCode.toDataURL(target, {
      width: size,
      margin: 1,
      errorCorrectionLevel: "H",
      color: { dark: "#0A0A0A", light: "#FFFFFF" },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [value, size]);

  return (
    <div
      className={className}
      style={{ width: size, height: size, background: "#fff", padding: 8, borderRadius: 8 }}
    >
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          alt="QR code to sign up"
          width={size - 16}
          height={size - 16}
          style={{ display: "block" }}
        />
      ) : (
        <div className="w-full h-full animate-pulse bg-neutral-200" />
      )}
    </div>
  );
}
