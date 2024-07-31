"use client";
import Image from "next/image";
import NavLinks from "../data/NavLinks.json";
import { usePathname } from "next/navigation";
import Link from "next/link";
import WalletConnect from "./walletConnect";
export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="absolute px-24 py-6 w-full top-0">
      <div className="grid grid-cols-3 items-center justify-between w-full">
        <Link href="/">
          <Image src="/kizuna-white.svg" alt="logo" width={140} height={40} />
        </Link>
        <ul className="flex flex-row justify-center items-center gap-12 text-[#FF5D5D] mt-2 text-lg">
          {NavLinks.map((link) => (
            <Link href={link.link} key={link.name}>
              <div
                className={`flex flex-col justify-center items-center gap-1 ${
                  pathname === link.link ? "font-bold" : "font-medium"
                }`}
              >
                <div>{link.name}</div>
                <div
                  className={`h-1 w-2  rounded-full ${
                    pathname === link.link ? "bg-[#FF5D5D]" : "bg-transparent"
                  }`}
                ></div>
              </div>
            </Link>
          ))}
        </ul>
        <WalletConnect />
      </div>
    </nav>
  );
}
