"use client";
import { Chains } from "@/app/providers/config";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [tokenIn, setTokenIn] = useState<any>(Chains[0]);
  const [tokenOut, setTokenOut] = useState<any>(Chains[1]);

  function handleSelectTokenChange(e: string) {
    const chainID = parseInt(e);
    if (chainID === tokenIn.id || chainID === tokenOut.id) {
      const a = tokenIn;
      const b = tokenOut;
      setTokenIn(b);
      setTokenOut(a);
    }
  }

  function handleExchange() {
    const a = tokenIn;
    const b = tokenOut;
    setTokenIn(b);
    setTokenOut(a);
  }
  return (
    <div className="flex flex-col gap-4 justify-start items-center min-h-screen text-white">
      <div className="flex flex-col items-start justify-center gap-6 max-w-xl w-full border-4 border-[#FF5D5D] rounded-3xl shadow-md px-8 pb-10 pt-6 mt-56">
        <h1 className="text-3xl font-medium text-[#FF5D5D] flex flex-row justify-center place-items-end gap-2">
          Bridge{" "}
          <span className="font-black">
            <Image src={"/rainbow.svg"} alt="Rainbow" width={35} height={35} />
          </span>
        </h1>
        <div className="flex flex-col justify-start items-start w-full">
          <div className="flex flex-col gap-1.5 justify-start items-start w-full relative">
            <div className="flex flex-col justify-start items-start gap-2 bg-slate-700 border-0 border-slate-500 rounded-lg px-6 py-4 w-full">
              <div className="flex flex-row justify-between items-center gap-2 w-full">
                <div>From</div>
                <div className="flex flex-row justify-center items-center gap-2 text-sm">
                  <div>Balance: 0.0011</div>
                  <button className="text-[#FF5D5D] font-bold">Max</button>
                </div>
              </div>
              <div className="flex flex-row justify-start items-center gap-2 w-full">
                <Select
                  onValueChange={(e) => handleSelectTokenChange(e)}
                  value={tokenIn.id.toString()}
                >
                  <SelectTrigger className="w-36  bg-[#FF5D5D] py-2 px-2 rounded-lg border-0 font-medium focus:outline-none text-black">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {Chains.map((chain) => (
                      <SelectItem key={chain.id} value={chain.id.toString()}>
                        <div className="flex flex-row justify-center items-center gap-1">
                          <Image
                            className="bg-white rounded-full p-1"
                            src={chain.iconUrl as string}
                            alt={chain.name}
                            width={25}
                            height={25}
                          />
                          <div className="truncate w-fit">{chain.name}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="number"
                  className="py-1.5 rounded-lg bg-transparent focus:outline-none text-right w-full text-2xl"
                  placeholder="0.001 - 0.5"
                />
              </div>
            </div>
            <button
              className="flex flex-row justify-center items-center w-full absolute centered"
              onClick={() => handleExchange()}
            >
              <Image
                className="bg-slate-700 border-[5px] border-slate-800 rounded-3xl p-2.5 hover:opacity-90"
                src={"/exchange.svg"}
                alt="Exchange"
                width={50}
                height={50}
              />
            </button>
            <div className="flex flex-col justify-start items-start gap-2 bg-slate-700 border-0 border-slate-500 rounded-lg px-6 py-4 w-full">
              <div className="flex flex-row justify-between items-center gap-2 w-full">
                <div>To</div>
                <div className="flex flex-row justify-center items-center gap-2 text-sm">
                  <div>Balance: 0.0011</div>
                </div>
              </div>
              <div className="flex flex-row justify-start items-center gap-2 w-full">
                <Select
                  onValueChange={(e) => handleSelectTokenChange(e)}
                  value={tokenOut.id.toString()}
                >
                  <SelectTrigger className="w-36  bg-[#FF5D5D] py-2 px-2 rounded-lg text-black font-medium border-0 focus:outline-none  focus:ring-offset-0">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {Chains.map((chain) => (
                      <SelectItem key={chain.id} value={chain.id.toString()}>
                        <div className="flex flex-row justify-center items-center gap-1">
                          <Image
                            className="bg-white rounded-full p-1"
                            src={chain.iconUrl as string}
                            alt={chain.name}
                            width={25}
                            height={25}
                          />
                          <div className="truncate w-fit">{chain.name}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="number"
                  className="py-1.5 rounded-lg bg-transparent focus:outline-none text-right w-full text-2xl"
                  placeholder="0"
                  disabled={true}
                />
              </div>
            </div>
          </div>
          <Button className="text-black w-full text-xl py-6 font-medium bg-[#FF5D5D] hover:bg-white mt-4">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
