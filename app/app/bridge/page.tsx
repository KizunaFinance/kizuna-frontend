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

import {
  useAccount,
  useBalance,
  useReadContract,
  usePublicClient,
} from "wagmi";
import { formatEther, formatUnits } from "viem";
import { bridgeToken, convertToBigInt } from "@/app/utils/bridge";
import { switchChain } from "@wagmi/core";
import Link from "next/link";
import { Link2, LoaderCircleIcon, X, History, Undo2, Fuel } from "lucide-react";
import { Message } from "@/app/utils/types";
import { createClient } from "@layerzerolabs/scan-client";
import { BridgeAbi } from "@/app/abi/brdigeABI";
import { BRIDGE_HOLESKY, BRIDGE_HEKLA } from "@/app/utils/address";
import axios from "axios";

export default function Home() {
  const [tokenIn, setTokenIn] = useState<any>(Chains[0]);
  const [tokenOut, setTokenOut] = useState<any>(Chains[1]);
  const [txHash, setTxhash] = useState<string | null>(null);
  const [txFailed, setTxFailed] = useState<boolean>(false);
  const [message, setMessage] = useState<Message | undefined>(undefined);
  const [txInitiating, setTxInitiating] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [gasFee, setGasFee] = useState<string>("0");
  const { address, chain } = useAccount();
  const [amountIn, setAmountIn] = useState<string>("0");
  const [price, setPrice] = useState<number | null>(null);

  const inputamountRef = useRef<HTMLInputElement>(null);

  const publicClient = usePublicClient();

  const HEKLA_V2_TESTNET = 40274;
  const HOLESKY_V2_TESTNET = 40217;

  let options: `0x${string}` = "0x00030100110100000000000000000000000000030d40";

  let { data: nativeFeeResult } = useReadContract({
    abi: BridgeAbi,
    address: tokenIn.id === 17000 ? BRIDGE_HOLESKY : BRIDGE_HEKLA,
    functionName: "quote",
    args: [
      tokenIn.id === 17000 ? HEKLA_V2_TESTNET : HOLESKY_V2_TESTNET,
      options,
      false,
    ],
  });

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        setPrice(response.data.ethereum.usd);
      } catch (err) {
        setPrice(0);
      }
    };

    fetchEthPrice();
  }, []);

  useEffect(() => {
    console.log("useEffect called");
    if (nativeFeeResult?.nativeFee && inputamountRef.current?.value) {
      getGasFees(nativeFeeResult.nativeFee);
    }
  }, [nativeFeeResult, amountIn]);

  const getGasFees = async (nativeFee: bigint) => {
    if (!publicClient || !inputamountRef.current?.value) {
      return;
    }
    const tx = await publicClient.estimateContractGas({
      abi: BridgeAbi,
      functionName: "send",
      address: tokenIn.id === 17000 ? BRIDGE_HOLESKY : BRIDGE_HEKLA,
      args: [
        tokenIn.id === 17000 ? HEKLA_V2_TESTNET : HOLESKY_V2_TESTNET,
        nativeFee,
        address!,
        options,
      ],
      value:
        convertToBigInt(Number(inputamountRef.current?.value || "0"), 18) +
        nativeFee,
    });
    setGasFee(formatEther(tx + nativeFee));
  };

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
    if (txHash) {
      setTxFailed(false);
      getTxpoolStatus(txHash);
    }
  }, [txHash]);

  const getTxpoolStatus = async (txHash: string) => {
    try {
      const client = createClient("testnet");
      const { messages } = await client.getMessagesBySrcTxHash(txHash);
      const _message: Message = messages[0] as Message;
      setMessage(_message);
      if (
        !_message ||
        (_message.status !== "DELIVERED" &&
          _message.status !== "FAILED" &&
          _message.status !== "BLOCKED")
      ) {
        setTimeout(() => {
          getTxpoolStatus(txHash);
        }, 60 * 1000);
      }
    } catch (e) {
      setTimeout(() => {
        getTxpoolStatus(txHash);
      }, 60 * 1000);
    }
  };

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
    icon: string;
  } {
    if (txFailed) {
      return {
        name: "Failed",
        bg: "bg-red-500",
        icon: "/icons/failed.svg",
      };
    }
    if (
      txStatus === "INFLIGHT" ||
      txStatus === "PAYLOAD_STORED" ||
      txStatus === "CONFIRMING"
    ) {
      return {
        name: "In Progress",
        bg: "bg-blue-500",
        icon: "/icons/inprogress.svg",
      };
    } else if (txStatus === "DELIVERED") {
      return {
        name: "Success",
        bg: "bg-green-500",
        icon: "/icons/success.svg",
      };
    } else if (txStatus === "FAILED" || txStatus === "BLOCKED") {
      return {
        name: "Failed",
        bg: "bg-red-500",
        icon: "/icons/failed.svg",
      };
    }
    return {
      name: "In Progress",
      bg: "bg-blue-500",
      icon: "/icons/inprogress.svg",
    };
  }

  return (
    <div className="flex flex-col gap-8 justify-start items-center min-h-screen text-slate-200">
      <div className="max-w-xl w-full border-4 border-[#FF5D5D] rounded-xl shadow-md px-8 pb-9 pt-6 mt-36">
        {showHistory ? (
          <div className="flex flex-col items-center justify-between gap-6 w-full">
            <div className="grid grid-cols-3 gap-2 items-center w-full">
              <button onClick={() => setShowHistory(false)}>
                <Undo2 size={35} color="#FF5D5D" />
              </button>
              <h2 className="text-2xl font-bold text-[#FF5D5D] text-center">
                History
              </h2>
              <div></div>
            </div>
            <div className="text-slate-200 font-bold text-2xl">Coming Soon</div>
          </div>
        ) : (
          <div className="flex flex-col items-start justify-center gap-6">
            <div className="flex flex-row justify-between items-center gap-4 w-full">
              <h1 className="text-3xl font-bold text-[#FF5D5D] flex flex-row justify-center place-items-end gap-2">
                Bridge{" "}
                <span className="font-black">
                  <Image
                    src={"/rainbow.svg"}
                    alt="Rainbow"
                    width={35}
                    height={35}
                  />
                </span>
              </h1>
              <button onClick={() => setShowHistory(true)}>
                <History size={35} color="#FF5D5D" />
              </button>
            </div>
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
                      <SelectTrigger className="w-40  bg-[#FF5D5D] py-2 px-2 rounded-lg border-0 font-medium focus:outline-none text-slate-800">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {Chains.map((chain) => (
                          <SelectItem
                            key={chain.id}
                            value={chain.id.toString()}
                          >
                            <div className="flex flex-row justify-center items-center gap-2">
                              <div className="bg-white rounded-full p-1 h-7 w-7">
                                <Image
                                  src={chain.iconUrl as string}
                                  alt={chain.name}
                                  width={25}
                                  height={25}
                                />
                              </div>

                              <div className="truncate w-fit">{chain.name}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="number"
                      ref={inputamountRef}
                      onChange={(e) => {
                        setAmountIn(e.target.value);
                      }}
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
                      <SelectTrigger className="w-40  bg-[#FF5D5D] py-2 px-2 rounded-lg text-slate-800 font-medium border-0 focus:outline-none  focus:ring-offset-0">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {Chains.map((chain) => (
                          <SelectItem
                            key={chain.id}
                            value={chain.id.toString()}
                          >
                            <div className="flex flex-row justify-center items-center gap-2">
                              <div className="bg-white rounded-full p-1 h-7 w-7">
                                <Image
                                  src={chain.iconUrl as string}
                                  alt={chain.name}
                                  width={25}
                                  height={25}
                                />
                              </div>

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
                onClick={async () => {
                  if (tokenIn.id === chain?.id) {
                    setTxInitiating(true);
                    setTxFailed(false);
                    const result = await bridgeToken(
                      tokenIn,
                      inputamountRef.current?.value.toString() || "0",
                      address!
                    );
                    if (result.success) {
                      setTxhash(result.data);
                    } else {
                      setTxFailed(true);
                      setTxhash(null);
                      setTxInitiating(false);
                    }
                  } else {
                    _switchChain(tokenIn.id === 17000);
                  }
                }}
                className="text-slate-800 w-full text-xl py-6 font-medium bg-[#FF5D5D] rounded-lg hover:bg-white mt-4"
              >
                {tokenIn.id === chain?.id ? "Send" : "Wrong Network"}
              </Button>
              {parseFloat(gasFee) > 0 && (
                <div className="flex justify-between items-center w-full mt-4 text-slate-200 rounded-lg px-6 py-2.5 bg-slate-700 font-medium text-sm">
                  <div className="flex flex-row gap-1 justify-start items-center">
                    <Fuel size={15} />
                    <h6>Gas Fee</h6>
                  </div>
                  <h6>
                    ~ ${price ? (parseFloat(gasFee) * price).toFixed(2) : 0}
                  </h6>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {txInitiating && (
        <div className="relative flex flex-col items-center justify-between gap-6 max-w-xl w-full border-4 border-[#FF5D5D] rounded-xl shadow-md px-8 pt-10 pb-6">
          <div className="absolute top-3 right-3">
            <X
              className="cursor-pointer"
              onClick={() => setTxInitiating(false)}
              size={25}
              color="#FF5D5D"
              strokeWidth={4}
            />
          </div>
          <div className="flex flex-row justify-between items-center gap-4 w-full px-12">
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="bg-white rounded-full p-2 h-14 w-14 flex justify-center items-center">
                <Image
                  src={tokenIn.iconUrl as string}
                  alt="Token"
                  width={50}
                  height={50}
                />
              </div>
              <h4>{tokenIn.name}</h4>
              {
                <Link
                  href={`${tokenIn.blockExplorers.default.url}/tx/${txHash}`}
                  target="_blank"
                  className={`flex flex-row justify-center items-center gap-1 text-sm text-[#FF5D5D] ${
                    txHash ? "flex" : "invisible"
                  }`}
                >
                  <Link2 size={18} />
                  <h5>Explorer</h5>
                </Link>
              }
            </div>
            <div className="flex flex-col gap-4 justify-center items-center pb-4">
              {TxStatus({ txStatus: message?.status || "INFLIGHT" })?.name ===
              "In Progress" ? (
                <LoaderCircleIcon
                  size={"40"}
                  className="text-[#FF5D5D] animate-spin"
                />
              ) : (
                <Image
                  src={
                    TxStatus({ txStatus: message?.status || "INFLIGHT" })?.icon
                  }
                  alt={
                    TxStatus({ txStatus: message?.status || "INFLIGHT" })?.name
                  }
                  width={40}
                  height={40}
                />
              )}
              <div
                className={`text-slate-200 px-2 py-1 rounded-full text-xs ${
                  TxStatus({ txStatus: message?.status || "INFLIGHT" })?.bg
                }`}
              >
                {
                  TxStatus({
                    txStatus: message?.status || "INFLIGHT",
                  })?.name
                }
              </div>

              {message?.srcTxHash && (
                <Link
                  href={
                    message?.srcTxHash
                      ? `https://testnet.layerzeroscan.com/tx/${message?.srcTxHash}`
                      : "#"
                  }
                  target="_blank"
                  className={`flex flex-row justify-center items-center gap-1 text-sm text-[#FF5D5D] ${
                    txHash ? "flex" : "invisible"
                  }`}
                >
                  <Link2 size={18} />
                  <h5>LayerZero Scan</h5>
                </Link>
              )}

              {/* {message?.srcTxHash ? (
                <Link
                  href={
                    message?.srcTxHash
                      ? `https://testnet.layerzeroscan.com/tx/${message?.srcTxHash}`
                      : "#"
                  }
                  target="_blank"
                  className={`text-slate-200 px-2 py-1 rounded-full text-xs ${TxStatus({ txStatus: message?.status || "INFLIGHT" })?.bg
                    }`}
                >
                  {
                    TxStatus({
                      txStatus: message?.status || "INFLIGHT",
                    })?.name
                  }
                </Link>
              ) : (
                <div
                  className={`text-slate-200 px-2 py-1 rounded-full text-xs ${TxStatus({ txStatus: message?.status || "INFLIGHT" })?.bg
                    }`}
                >
                  {
                    TxStatus({
                      txStatus: message?.status || "INFLIGHT",
                    })?.name
                  }
                </div>
              )} */}
            </div>
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="bg-white rounded-full p-2 h-14 w-14 flex justify-center items-center">
                <Image
                  src={tokenOut.iconUrl as string}
                  alt="Token"
                  width={50}
                  height={50}
                />
              </div>

              <h4>{tokenOut.name}</h4>
              {
                <Link
                  href={`${tokenOut.blockExplorers.default.url}/tx/${message?.dstTxHash}`}
                  target="_blank"
                  className={`flex flex-row justify-center items-center gap-1 text-sm text-[#FF5D5D] ${
                    message?.dstTxHash ? "flex" : "invisible"
                  }`}
                >
                  <Link2 size={18} />
                  <h5>Explorer</h5>
                </Link>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function usePrepareContractWrite(arg0: {
  addressOrName: any;
  contractInterface: any;
  functionName: string;
  args: never[];
}): { config: any } {
  throw new Error("Function not implemented.");
}
