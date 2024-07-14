import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import WagmiProviderWrapper from "./providers/wagmi";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Daiko Finance",
  description:
    "Daiko Finance is a decentralized bridge to send and receive crypto assets from and to Taiko & Ethereum.",
  openGraph: {
    title: "Daiko Finance",
    url: "https://alpha.daiko.fi",
    description:
      "Daiko Finance is a decentralized bridge to send and receive crypto assets from and to Taiko & Ethereum.",
    images: [
      {
        url: "https://alpha.daiko.fi/og/og-image.png",
        secureUrl: "https://alpha.daiko.fi/og/og-image.png",
        alt: "Daiko Finance",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  alternates: {
    canonical: "https://alpha.daiko.fi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daiko Finance",
    description:
      "Daiko Finance is a decentralized bridge to send and receive crypto assets from and to Taiko & Ethereum.",
    creator: "@DaikoFinance",
    images: ["https://alpha.daiko.fi/og/og-image.png"],
  },
  robots: {
    index: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className + " bg-slate-800"}>
        <WagmiProviderWrapper>{children}</WagmiProviderWrapper>
      </body>
    </html>
  );
}
