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
