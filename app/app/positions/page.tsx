"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount, useReadContract, useBalance } from "wagmi";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Address, Chain, formatUnits } from "viem";

import { Chains, config } from "../../providers/config";
import {
  getRecordID,
  getWithdrawDetails,
  unstakeToken,
  withdrawToken,
  getTimeLeftToWithdraw,
} from "../../utils/staking";
import { stakingABI } from "../../abi/stakingABI";
import Image from "next/image";
import { STAKING_HEKLA, STAKING_HOLESKY } from "@/app/utils/address";
import { Bar, BarChart } from "recharts";

import * as React from "react";
import { formatTime } from "@/app/utils/utils";
import { switchChain } from "@wagmi/core";
import moment from "moment";

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const [selectchain, setSelectchain] = useState<any>(Chains[0]);
  const [recordID, setRecordID] = useState<bigint>(BigInt(0));
  const [withdrawTimeHolesky, setWithdrawTimeHolesky] = useState<number>(0);
  const [withdrawTimeHekla, setWithdrawTimeHekla] = useState<number>(0);
  const [isUnstakingHolesky, setIsUnstakingHolesky] = useState<boolean>(false);
  const [isUnstakingHekla, setIsUnstakingHekla] = useState<boolean>(false);
  const [withDrawAmountHolesky, setWithDrawAmountHolesky] = useState<bigint>(
    BigInt(0)
  );
  const [withDrawAmountHekla, setWithDrawAmountHekla] = useState<bigint>(
    BigInt(0)
  );

  useEffect(() => {
    if (chain?.id === 17000) {
      setSelectchain(Chains[1]);
    } else {
      setSelectchain(Chains[0]);
    }
  }, [chain]);

  const heklaContractBalance = useBalance({
    address: STAKING_HEKLA,
    chainId: Chains[0].id,
  });

  const holeskyContractBalance = useBalance({
    address: STAKING_HOLESKY,
    chainId: Chains[1].id,
  });

  const {
    data: holeskyBalance,
    isLoading: isStakedBalancesLoading,
    error: isStakedBalancesError,
  } = useReadContract({
    abi: stakingABI,
    address: STAKING_HOLESKY,
    functionName: "stakedBalances",
    chainId: Chains[1].id,
    args: [address!],
  });

  const {
    data: heklaBalance,
    isLoading: isL1StakedBalancesLoading,
    error: isL1StakedBalancesError,
  } = useReadContract({
    abi: stakingABI,
    address: STAKING_HEKLA,
    functionName: "stakedBalances",
    chainId: Chains[0].id,
    args: [address!],
  });

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    if (address) {
      _getRecordID(selectchain, address);
    }
  }, [selectchain, address]);

  const _getRecordID = async (chain: Chain, userAddress: Address) => {
    const recordID = await getRecordID(chain, userAddress);
    console.log(recordID);
    console.log(recordID && recordID >= BigInt(0));
    if (recordID !== null) {
      console.log("called");
      setRecordID(recordID);
      const withdrawHekla = await getWithdrawDetails(Chains[0], recordID);
      const withdrawHolesky = await getWithdrawDetails(Chains[1], recordID);
      setWithdrawTimeHolesky(Number(withdrawHolesky[1]));
      setWithdrawTimeHekla(Number(withdrawHekla[1]));
      setWithDrawAmountHolesky(withdrawHolesky[2]);
      setWithDrawAmountHekla(withdrawHekla[2]);
    }
  };

  useEffect(() => {
    if (withdrawTimeHolesky > 0) {
      const timer = setInterval(() => {
        setWithdrawTimeHolesky((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [withdrawTimeHolesky]);

  return (
    <main className="flex min-h-screen flex-col items-start justify-start gap-12 p-24 pt-16 text-slate-200">
      {/* <div className="w-full flex flex-col items-start justify-center gap-6">
        <h1 className="text-3xl font-bold text-slate-200">Points Earned</h1>
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="text-slate-800 bg-[#FF5D5D] rounded-xl px-8 py-6 flex flex-col justify-start items-start gap-4">
            <div className="flex flex-row justify-between items-center gap-4 w-full">
              <div className="flex flex-col justify-start items-start gap-1">
                <h3 className=" text-xl font-medium">Total Points</h3>
                <h4 className="text-4xl font-bold">5000</h4>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-4 text-slate-800 bg-[#FF5D5D] rounded-xl px-8 py-6">
            <div className="flex flex-row justify-between items-center gap-4 w-full">
              <div className="flex flex-col justify-start items-start gap-1">
                <h3 className=" text-xl font-medium">Bridging Points</h3>
                <h4 className="text-4xl font-bold">2500</h4>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-4 text-slate-800 bg-[#FF5D5D] rounded-xl px-8 py-6">
            <div className="flex flex-row justify-between items-center gap-4 w-full">
              <div className="flex flex-col justify-start items-start gap-1">
                <h3 className=" text-xl font-medium">Staking Points</h3>
                <h4 className="text-4xl font-bold">2500</h4>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="w-full flex flex-col items-start justify-center gap-6">
        <h1 className="text-3xl font-bold text-slate-200">
          Avaliable Liquidity
        </h1>
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col justify-start items-start gap-4 text-slate-800 bg-[#FF5D5D] rounded-xl px-8 py-6">
            <div className="flex flex-row justify-between items-center gap-4 w-full">
              <div className="flex flex-col justify-start items-start gap-1">
                <h3 className=" text-xl font-medium">Ethereum</h3>
                <h4 className="text-4xl font-bold">
                  {holeskyContractBalance.data
                    ? parseFloat(
                        formatUnits(holeskyContractBalance.data.value, 18)
                      ).toFixed(6)
                    : 0}{" "}
                  ETH
                </h4>
              </div>
              <div className="h-16 w-16 bg-slate-200 rounded-full flex justify-center items-center">
                <Image
                  src="/chains/icons/Ethereum.svg"
                  alt="Ethereum"
                  width={50}
                  height={50}
                />
              </div>
            </div>
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <BarChart accessibilityLayer data={chartData}>
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>

          <div className="text-slate-800 bg-[#FF5D5D] rounded-xl px-8 py-6 flex flex-col justify-start items-start gap-4">
            <div className="flex flex-row justify-between items-center gap-4 w-full">
              <div className="flex flex-col justify-start items-start gap-1">
                <h3 className=" text-xl font-medium">Taiko</h3>
                <h4 className="text-4xl font-bold">
                  {heklaContractBalance.data
                    ? parseFloat(
                        formatUnits(heklaContractBalance.data.value, 18)
                      ).toFixed(6)
                    : 0}{" "}
                  ETH
                </h4>
              </div>
              <div className="h-16 w-16 bg-slate-800 rounded-full flex justify-center items-center p-2">
                <Image
                  src="/chains/icons/Taiko.svg"
                  alt="Taiko"
                  width={50}
                  height={50}
                />
              </div>
            </div>
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <BarChart accessibilityLayer data={chartData}>
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-start justify-center gap-6">
        <h1 className="text-3xl font-bold text-slate-200">Your Staking</h1>
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-row justify-between items-center gap-2 text-slate-800 bg-[#FF5D5D] rounded-xl px-8 py-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-medium">Ethereum</h3>
              <h4 className="text-4xl font-bold w-max">
                {formatUnits(
                  holeskyBalance
                    ? holeskyBalance
                    : withDrawAmountHolesky
                    ? withDrawAmountHolesky
                    : BigInt("0"),
                  18
                )}{" "}
                ETH
              </h4>
            </div>

            {chain?.id === Chains[1].id ? (
              holeskyBalance && holeskyBalance > 0 ? (
                <div className="rounded-full px-4 py-1.5 border border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-[#FF5D5D]">
                  <button
                    className="font-semibold"
                    onClick={() => {
                      unstakeToken(selectchain, holeskyBalance, address!);
                    }}
                  >
                    Unstake
                  </button>
                </div>
              ) : withdrawTimeHolesky !== null && withdrawTimeHolesky > 0 ? (
                <div className="text-slate-800">
                  <p>
                    Unstake After: {moment(withdrawTimeHolesky).format("LLL")}
                  </p>
                </div>
              ) : (
                <div className="rounded-full px-4 py-1.5 border border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-[#FF5D5D]">
                  <button
                    className="font-semibold"
                    onClick={() => {
                      withdrawToken(Chains[1], recordID, address!);
                    }}
                  >
                    Withdraw
                  </button>
                </div>
              )
            ) : (
              <div className="rounded-full px-4 py-1.5 border border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-[#FF5D5D]">
                <button
                  className="font-semibold"
                  onClick={async () => {
                    // Logic to switch to Holesky chain
                    await switchChain(config, { chainId: Chains[1].id });
                  }}
                >
                  Switch to Holesky
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-row justify-between items-center gap-2 text-slate-800 bg-[#FF5D5D] rounded-xl px-8 py-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-medium">Taiko</h3>
              <h4 className="text-4xl font-bold w-max">
                {formatUnits(
                  heklaBalance
                    ? heklaBalance
                    : withDrawAmountHekla
                    ? withDrawAmountHekla
                    : BigInt("0"),
                  18
                )}{" "}
                ETH
              </h4>
            </div>

            {chain?.id === Chains[0].id ? (
              heklaBalance && heklaBalance > 0 ? (
                <div className="rounded-full px-4 py-1.5 border border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-[#FF5D5D]">
                  <button
                    className="font-semibold"
                    onClick={() => {
                      unstakeToken(selectchain, heklaBalance, address!);
                    }}
                  >
                    Unstake
                  </button>
                </div>
              ) : withdrawTimeHekla !== null && withdrawTimeHekla > 0 ? (
                <div className="text-slate-800">
                  <p>Time left to withdraw: {formatTime(withdrawTimeHekla)}</p>
                </div>
              ) : (
                <div className="rounded-full px-4 py-1.5 border border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-[#FF5D5D]">
                  <button
                    className="font-semibold"
                    onClick={() => {
                      withdrawToken(Chains[0], recordID, address!);
                    }}
                  >
                    Withdraw
                  </button>
                </div>
              )
            ) : (
              <div className="rounded-full px-4 py-1.5 border border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-[#FF5D5D]">
                <button
                  className="font-semibold"
                  onClick={async () => {
                    // Logic to switch to Taiko chain
                    await switchChain(config, { chainId: Chains[0].id });
                  }}
                >
                  Switch to Taiko
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <div className="w-full flex flex-col items-start justify-center gap-6">
        <h1 className="text-3xl font-bold text-[#FF5D5D]">Stake History</h1>
      </div> */}
    </main>
  );
}
