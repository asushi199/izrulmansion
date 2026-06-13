import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tempahan Bilik PKG Pantai Remis",
  description: "Sistem tempahan Bilik Mesyuarat dan Studio PKG Pantai Remis."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  );
}
