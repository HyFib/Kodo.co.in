import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KODO — Food that smiles back",
  description:
    "Globally loved quick bites, reimagined with millets and a whole lot of joy.",
  icons: {
    icon: "/brand/kodo-favicon.png",
    shortcut: "/brand/kodo-favicon.png",
    apple: "/brand/kodo-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
