import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://kodo-millet-way-theni.hyfib-0937.chatgpt.site",
  ),
  title: "KODO — Food that smiles back",
  description:
    "Globally loved quick bites, reimagined with millets and a whole lot of joy.",
  openGraph: {
    title: "KODO — Pick your happy",
    description:
      "Explore millet-powered burgers, pizzas, momos, munchies, coffee and more.",
    images: [{ url: "/og.png", width: 1680, height: 936, alt: "KODO menu" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KODO — Pick your happy",
    description:
      "Explore millet-powered burgers, pizzas, momos, munchies, coffee and more.",
    images: ["/og.png"],
  },
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
