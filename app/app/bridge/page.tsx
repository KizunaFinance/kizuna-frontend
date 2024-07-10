"use client";
import { Chains } from "@/app/providers/config";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
export default function Home() {
  const [tokenIn, setTokenIn] = useState<any>(Chains[0]);
  const [tokenOut, setTokenOut] = useState<any>(Chains[1]);
  return (
    <div className="flex flex-col gap-4 justify-center items-center min-h-screen text-white">
      <div className="flex flex-col items-center justify-center gap-8 max-w-xl w-full border-4 border-[#FF5D5D] rounded-3xl px-8 pb-10 pt-6">
        <h1 className="text-3xl font-bold text-[#FF5D5D]">Bridge</h1>
        <div className="flex flex-col justify-start items-start gap-4 w-full">
          <div className="flex flex-col justify-start items-start gap-2 bg-slate-700 border-2 border-slate-500 rounded-lg px-6 py-4 w-full">
            <div className="flex flex-row justify-between items-center gap-2 w-full">
              <div>From</div>
              <div className="flex flex-row justify-center items-center gap-2 text-sm">
                <div>Balance: 0.0011</div>
                <div className="text-[#FF5D5D] font-bold">Max</div>
              </div>
            </div>
            <div className="flex flex-row justify-start items-center gap-2 w-full">
              <div
                className="flex flex-row justify-center items-center gap-1 w-32 border-2 border-[#FF5D5D] py-2 px-2 rounded-lg"
                key={tokenIn.id}
              >
                <Image
                  src={tokenIn.iconUrl as string}
                  alt={tokenIn.name}
                  width={20}
                  height={20}
                />
                <div className="truncate w-fit">{tokenIn.name}</div>
              </div>
              <input
                type="number"
                className="py-1.5 rounded-lg bg-transparent focus:outline-none text-right w-full text-2xl"
                placeholder="0.001 - 0.5"
              />
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-2 bg-slate-700 border-2 border-slate-500 rounded-lg px-6 py-4 w-full">
            <div>To</div>
            <div className="flex flex-row justify-start items-center gap-2 w-full">
              <div
                className="flex flex-row justify-center items-center gap-1 w-32 border-2 border-[#FF5D5D] py-2 px-2 rounded-lg"
                key={tokenOut.id}
              >
                <Image
                  src={tokenOut.iconUrl as string}
                  alt={tokenOut.name}
                  width={20}
                  height={20}
                />
                <div className="truncate w-fit">{tokenOut.name}</div>
              </div>
              <input
                type="number"
                className="py-1.5 rounded-lg bg-transparent focus:outline-none text-right w-full text-2xl"
                placeholder="0"
                disabled={true}
              />
            </div>
          </div>
          <Button className="text-black w-full text-xl py-6 font-medium bg-[#FF5D5D] hover:bg-white">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
