import type { Metadata } from "next";
import { Dosis, Inter, Josefin_Sans, Outfit, Poppins } from "next/font/google";
import "./globals.css";
import WagmiProviderWrapper from "./providers/wagmi";
import Image from "next/image";

const inter = Outfit({
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
      <body className={inter.className + " bg-slate-800"}>
        <WagmiProviderWrapper>{children}</WagmiProviderWrapper>
      </body>
    </html>
  );
}
