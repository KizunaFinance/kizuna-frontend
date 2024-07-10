"use client";
import { Chains } from "@/app/providers/config";
import Image from "next/image";
export default function Home() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center min-h-screen text-white">
      <div>Bridge</div>
      <div className="flex flex-row justify-center items-center gap-4">
        {Chains.map((chain) => (
          <div
            className="flex flex-row justify-center items-center gap-2"
            key={chain.id}
          >
            <Image
              src={chain.iconUrl as string}
              alt={chain.name}
              width={20}
              height={20}
            />
            <div>{chain.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
