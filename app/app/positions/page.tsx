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
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 p-24  text-white">
      <div className="flex flex-col items-center justify-center gap-0 max-w-xl w-full border-4 border-[#FF5D5D] rounded-3xl px-8 pb-10 pt-6">
        <div className="flex flex-col justify-start items-start gap-4 w-full"></div>

        <div className="flex flex-col items-start justify-center gap-4 w-full">
          <h2 className="text-2xl font-bold text-[#FF5D5D]">Your Staking</h2>
          <div className="grid grid-cols-2 justify-between items-start gap-4 w-full">
            <div className="flex flex-col justify-center items-start gap-2">
              <div>Staked on Ethereum</div>
              <div>
                {formatUnits(holeskyBalance ? holeskyBalance : BigInt("0"), 18)}
              </div>
              {holeskyBalance && holeskyBalance > 0 && (
                <div
                  className="text-red-500 cursor-pointer"
                  onClick={() => {
                    unstakeToken(selectchain, holeskyBalance, address!);
                  }}
                >
                  Withdraw
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center items-start gap-2">
              <div>Staked on Taiko</div>
              <div>
                {formatUnits(heklaBalance ? heklaBalance : BigInt("0"), 18)}
              </div>
              {heklaBalance && heklaBalance > 0 && (
                <div
                  className="text-red-500 cursor-pointer"
                  onClick={() => {
                    unstakeToken(selectchain, heklaBalance, address!);
                  }}
                >
                  Withdraw
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
