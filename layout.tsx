import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Premier Supplier Portal",
  description: "Premier Leasing & Finance supplier finance portal",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
