import type { Metadata } from "next";
import { Outfit, Poppins } from "next/font/google";
import "./globals.css";
import WagmiProviderWrapper from "./providers/wagmi";
import { Toaster } from "@/components/ui/sonner";

const outfit = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kizuna Finance",
  description:
    "Kizuna Finance is a decentralized bridge to send and receive crypto assets from and to Taiko & Ethereum.",
  openGraph: {
    title: "Kizuna Finance",
    url: "https://alpha.kizuna.fi",
    description:
      "Kizuna Finance is a decentralized bridge to send and receive crypto assets from and to Taiko & Ethereum.",
    images: [
      {
        url: "https://alpha.kizuna.fi/og/og-image.png",
        secureUrl: "https://alpha.kizuna.fi/og/og-image.png",
        alt: "Kizuna Finance",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  alternates: {
    canonical: "https://alpha.kizuna.fi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kizuna Finance",
    description:
      "Kizuna Finance is a decentralized bridge to send and receive crypto assets from and to Taiko & Ethereum.",
    creator: "@Kizunafi",
    images: ["https://alpha.kizuna.fi/og/og-image.png"],
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
        <WagmiProviderWrapper>
          <Toaster />
          {children}
        </WagmiProviderWrapper>
      </body>
    </html>
  );
}
