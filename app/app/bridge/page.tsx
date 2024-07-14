"use client";
import { Chains, config } from "@/app/providers/config";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { bridgeToken } from "@/app/utils/bridge";
import { switchChain, getBalance } from "@wagmi/core";
import Link from "next/link";
import { Link2, LoaderCircleIcon } from "lucide-react";

export default function Home() {
  const [tokenIn, setTokenIn] = useState<any>(Chains[0]);
  const [tokenOut, setTokenOut] = useState<any>(Chains[1]);

  const { address, isConnected, chain } = useAccount();

  const inputamountRef = useRef<HTMLInputElement>(null);

  const holeskyBalanceResult = useBalance({
    address: address!,
    chainId: Chains[1].id,
  });

  const heklaBalanceResult = useBalance({
    address: address!,
    chainId: Chains[0].id,
  });

  async function handleSelectTokenChange(e: string) {
    const chainID = parseInt(e);
    if (chainID === tokenIn.id || chainID === tokenOut.id) {
      const a = tokenIn;
      const b = tokenOut;
      setTokenIn(b);
      setTokenOut(a);
      await _switchChain(tokenIn.id === 17000);
    }
  }

  useEffect(() => {
    if (chain?.id === 17000) {
      setTokenIn(Chains[1]);
      setTokenOut(Chains[0]);
    } else {
      setTokenIn(Chains[0]);
      setTokenOut(Chains[1]);
    }
  }, [chain]);

  async function handleExchange() {
    const a = tokenIn;
    const b = tokenOut;
    setTokenIn(b);
    setTokenOut(a);
    await _switchChain(b.id === 17000);
  }

  const _switchChain = async (isL1: boolean) => {
    try {
      if (isL1) {
        await switchChain(config, { chainId: Chains[1].id });
      } else {
        await switchChain(config, { chainId: Chains[0].id });
      }
      return {
        success: true,
        message: "Chain switched",
      };
    } catch (e) {
      return {
        success: false,
        message: "Chain switch failed",
      };
    }
  };

  function TxStatus({ txStatus }: { txStatus: string }): {
    name: string;
    bg: string;
  } {
    if (
      txStatus === "INFLIGHT" ||
      txStatus === "PAYLOAD_STORED" ||
      txStatus === "CONFIRMING"
    ) {
      return {
        name: "In Progress",
        bg: "bg-blue-500",
      };
    } else if (txStatus === "SUCCESS") {
      return {
        name: "Success",
        bg: "bg-green-500",
      };
    } else if (txStatus === "FAILED" || txStatus === "BLOCKED") {
      return {
        name: "Failed",
        bg: "bg-red-500",
      };
    }
    return {
      name: "Failed",
      bg: "bg-red-500",
    };
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
                  <div>
                    Balance:{" "}
                    {holeskyBalanceResult.data && heklaBalanceResult.data
                      ? tokenIn.id === 17000
                        ? parseFloat(
                            formatUnits(holeskyBalanceResult.data.value, 18)
                          ).toFixed(6)
                        : parseFloat(
                            formatUnits(heklaBalanceResult.data.value, 18)
                          ).toFixed(6)
                      : 0}
                  </div>
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
                        <div className="flex flex-row justify-center items-center gap-2">
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
                  ref={inputamountRef}
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
                  <div>
                    Balance:{" "}
                    {holeskyBalanceResult.data && heklaBalanceResult.data
                      ? tokenOut.id === 17000
                        ? parseFloat(
                            formatUnits(holeskyBalanceResult.data.value, 18)
                          ).toFixed(6)
                        : parseFloat(
                            formatUnits(heklaBalanceResult.data.value, 18)
                          ).toFixed(6)
                      : 0}
                  </div>
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
                        <div className="flex flex-row justify-center items-center gap-2">
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
                  value={inputamountRef.current?.value}
                  type="number"
                  className="py-1.5 rounded-lg bg-transparent focus:outline-none text-right w-full text-2xl"
                  placeholder="0"
                  disabled={true}
                />
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              if (tokenIn.id === chain?.id) {
                bridgeToken(
                  tokenIn,
                  tokenOut,
                  inputamountRef.current?.value.toString() || "0",
                  address!
                );
              } else {
                _switchChain(tokenIn.id === 17000);
              }
            }}
            className="text-black w-full text-xl py-6 font-medium bg-[#FF5D5D] hover:bg-white mt-4"
          >
            {tokenIn.id === chain?.id ? "Send" : "Wrong Network"}
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-6 max-w-xl w-full border-4 border-[#FF5D5D] rounded-3xl shadow-md px-8 py-10">
        <div className="flex flex-row justify-between items-center gap-4 w-full px-12">
          <div className="flex flex-col gap-2 justify-center items-center">
            <Image
              className="bg-white rounded-full p-1 pb-1.5"
              src={tokenIn.iconUrl as string}
              alt="Token"
              width={50}
              height={50}
            />
            <h4>{tokenIn.name}</h4>
            <Link
              href={`/bridge/${tokenIn.id}`}
              className="flex flex-row justify-center items-center gap-1 text-sm text-[#FF5D5D]"
            >
              <Link2 size={18} />
              <h5>Explorer</h5>
            </Link>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center">
            {TxStatus({ txStatus: "INFLIGHT" })?.name === "In Progress" ? (
              <LoaderCircleIcon
                size={"40"}
                className="text-[#FF5D5D] animate-spin"
              />
            ) : TxStatus({ txStatus: "INFLIGHT" })?.name === "Success" ? (
              <Image
                src={"/public/icons/success.svg"}
                alt="Success"
                width={40}
                height={40}
              />
            ) : (
              <Image
                src={"/public/icons/failed.svg"}
                alt="Failed"
                width={40}
                height={40}
              />
            )}

            <div
              className={`text-white px-2 py-1 rounded-full text-xs ${
                TxStatus({ txStatus: "INFLIGHT" })?.bg
              }`}
            >
              {
                TxStatus({
                  txStatus: "INFLIGHT",
                })?.name
              }
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center">
            <Image
              className="bg-white rounded-full p-1 pb-1.5"
              src={tokenOut.iconUrl as string}
              alt="Token"
              width={50}
              height={50}
            />
            <h4>{tokenOut.name}</h4>
            <Link
              href={`/bridge/${tokenIn.id}`}
              className="flex flex-row justify-center items-center gap-1 text-sm text-[#FF5D5D]"
            >
              <Link2 size={18} />
              <h5>Explorer</h5>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
