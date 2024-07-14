"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useEffect, useRef, useState } from "react";
import { useAccount, useReadContract, useBalance } from "wagmi";

import { formatUnits } from "viem";

import { switchChain, getBalance } from "@wagmi/core";
import { Chains, config } from "../../providers/config";
import { stakeToken, unstakeToken } from "../../utils/staking";
import { stakingABI } from "../../abi/stakingABI";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { STAKING_HEKLA, STAKING_HOLESKY } from "@/app/utils/address";

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

  const inputAmount = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    if (chain?.id === 17000) {
      setChecked(true);
      setSelectchain(Chains[1]);
    } else {
      setChecked(false);
      setSelectchain(Chains[0]);
    }
  }, [chain]);

  const _switchChain = async (isL1: boolean) => {
    try {
      if (isL1) {
        await switchChain(config, { chainId: 17000 });
      } else {
        await switchChain(config, { chainId: 167009 });
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

  function handleSelectChainChange(e: string) {
    const chainID = parseInt(e);
    const chain = Chains.find((c) => c.id === chainID);
    if (chain) {
      setSelectchain(chain);
      _switchChain(chain.id === 17000);
    }
  }

  const [checked, setChecked] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center gap-12 mt-56  text-slate-200">
      <div className="flex flex-col items-center justify-center gap-6 max-w-xl w-full border-4 border-[#FF5D5D] rounded-xl px-8 pb-10 pt-6">
        <h1 className="text-3xl font-medium text-[#FF5D5D] w-full text-left">
          Stake ETH
        </h1>

        <div className="flex flex-col justify-start items-start gap-4 w-full">
          <div className="flex flex-col justify-start items-start gap-2  w-full">
            <div className="flex flex-col justify-start items-start gap-2 bg-slate-700 border-0 border-slate-500 rounded-lg px-6 py-4 w-full">
              <div className="flex flex-row justify-between items-center gap-2 w-full">
                <div>From</div>
                <div className="flex flex-row justify-center items-center gap-2 text-sm">
                  <div>
                    Balance:{" "}
                    {balanceResult.data
                      ? parseFloat(
                          formatUnits(
                            balanceResult.data.value,
                            balanceResult.data.decimals
                          )
                        ).toFixed(6)
                      : 0}
                  </div>
                  <button className="text-[#FF5D5D] font-bold">Max</button>
                </div>
              </div>
              <div className="flex flex-row justify-start items-start gap-2 w-full">
                <Select
                  value={selectchain.id.toString()}
                  onValueChange={(e) => handleSelectChainChange(e)}
                >
                  <SelectTrigger className="w-36  bg-[#FF5D5D] py-2.5 px-2 rounded-lg border-0 font-medium focus:outline-none text-slate-800">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {Chains.map((chain) => (
                      <SelectItem key={chain.id} value={chain.id.toString()}>
                        <div className="flex flex-row justify-center items-center gap-1">
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
                  ref={inputAmount}
                  type="number"
                  className="py-1.5 rounded-lg bg-transparent focus:outline-none text-right w-full text-2xl"
                  placeholder={`0.1 - 0.5`}
                />
              </div>
            </div>
          </div>
          <Button
            onClick={async () => {
              const stakeResp = await stakeToken(
                selectchain,
                Number(inputAmount.current?.value),
                address!
              );
              if (stakeResp.success) {
                alert("Staked successfully");
              } else {
                alert("Failed to stake");
              }
            }}
            className="text-slate-800 w-full text-xl py-6 font-medium bg-[#FF5D5D] hover:bg-white"
          >
            Stake
          </Button>
        </div>
      </div>
    </main>
  );
}
