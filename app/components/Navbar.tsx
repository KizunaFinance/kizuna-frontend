"use client";
import Image from "next/image";
import NavLinks from "../data/NavLinks.json";
import { usePathname } from "next/navigation";
import Link from "next/link";
import WalletConnect from "./walletConnect";
export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed px-24 py-6 w-full">
      <div className="grid grid-cols-3 items-center justify-between w-full">
        <Link href="/">
          <Image src="/daiko-white.svg" alt="logo" width={140} height={40} />
        </Link>
        <ul className="flex flex-row justify-center items-center gap-8 text-[#FF5D5D] font-bold mt-2 text-lg">
          {NavLinks.map((link) => (
            <Link href={link.link} key={link.name}>
              <div className="flex flex-col justify-center items-center gap-1">
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
