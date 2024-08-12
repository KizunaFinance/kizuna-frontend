"use client";
import Link from "next/link";
import Image from "next/image";
import { Twitter, X } from "lucide-react";
import Socials from "./components/Socials";
export default function Home() {
  return (
    <div className="flex flex-col gap-12 justify-center items-center min-h-screen text-slate-200 text-center">
      <Image src="/kizuna-white.svg" alt="logo" width={300} height={300} />
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-5xl font-bold">Welcome to the Kizuna Bridge</h1>
        <p className="text-xl max-w-4xl">
          Kizuna Finance is a DeFi platform that connects Ethereum and Taiko,
          facilitating effortless asset transfers between these networks. We use
          LayerZero for secure and permissionless communication between the
          chains.
        </p>
      </div>

      <Link
        href={"/app/bridge"}
        className="bg-[#FF5D5D] px-8 py-2.5 font-bold rounded-3xl text-slate-800 text-xl flex justify-end items-center"
      >
        Launch App
      </Link>
      <div className="flex flex-col justify-center items-center gap-4 mt-4 text-slate-200 text-lg font-medium">
        <h3>Follow Us</h3>
        <Socials />
      </div>
    </div>
  );
}
