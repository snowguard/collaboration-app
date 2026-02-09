import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Collab Chat",
  description: "Invitation-only collaboration messaging app"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
