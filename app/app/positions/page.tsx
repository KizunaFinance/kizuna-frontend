"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount, useReadContract, useBalance } from "wagmi";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { formatUnits } from "viem";

import { Chains } from "../../providers/config";
import { unstakeToken } from "../../utils/staking";
import { stakingABI } from "../../abi/stakingABI";
import Image from "next/image";
import { STAKING_HEKLA, STAKING_HOLESKY } from "@/app/utils/address";
import { Bar, BarChart } from "recharts";

export default function Home() {
  const { address, isConnected, chain } = useAccount();

  const balanceResult = useBalance({
    address: address!,
    chainId: chain?.id,
  });

  const heklaContractBalance = useBalance({
    address: STAKING_HEKLA,
    chainId: Chains[0].id,
  });

  const holeskyContractBalance = useBalance({
    address: STAKING_HOLESKY,
    chainId: Chains[1].id,
  });

  const [selectchain, setSelectchain] = useState<any>(Chains[0]);
  const {
    data: holeskyBalance,
    isLoading: isStakedBalancesLoading,
    isError: isStakedBalancesError,
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
    isError: isL1StakedBalancesError,
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
  return (
    <main className="flex min-h-screen flex-col items-start justify-start gap-12 p-24 pt-36 text-slate-200">
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
                    ? formatUnits(holeskyContractBalance.data.value, 18)
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
                    ? formatUnits(heklaContractBalance.data.value, 18)
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
          <div className="flex flex-row justify-between items-center gap-2 text-slate-800 bg-[#FF5D5D] rounded-xl px-8  py-6">
            <div className="flex flex-col gap-1">
              <h3 className=" text-xl font-medium">Ethereum</h3>
              <h4 className="text-4xl font-bold w-max">
                {formatUnits(holeskyBalance ? holeskyBalance : BigInt("0"), 18)}{" "}
                ETH
              </h4>
            </div>

            {holeskyBalance && holeskyBalance > 0 && (
              <div className="rounded-full px-4 py-1.5 border border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-[#FF5D5D]">
                <button
                  className="font-semibold"
                  onClick={() => {
                    unstakeToken(selectchain, holeskyBalance, address!);
                  }}
                >
                  Withdraw
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-row justify-between items-center gap-2 text-slate-800 bg-[#FF5D5D] rounded-xl px-8  py-6">
            <div className="flex flex-col gap-1">
              <h3 className=" text-xl font-medium">Taiko</h3>
              <h4 className="text-4xl font-bold w-max">
                {formatUnits(heklaBalance ? heklaBalance : BigInt("0"), 18)} ETH
              </h4>
            </div>

            {heklaBalance && heklaBalance > 0 && (
              <div className="rounded-full px-4 py-1.5 border border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-[#FF5D5D]">
                <button
                  className="font-semibold"
                  onClick={() => {
                    unstakeToken(selectchain, heklaBalance, address!);
                  }}
                >
                  Withdraw
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
