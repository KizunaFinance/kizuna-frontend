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
  })

  const heklaContractBalance = useBalance({
    address: STAKING_HEKLA,
    chainId: Chains[0].id,
  })

  const holeskyContractBalance = useBalance({
    address: STAKING_HOLESKY,
    chainId: Chains[1].id,
  })


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
        <h1 className="text-3xl font-bold text-[#FF5D5D] w-full text-left">
          Stake ETH
        </h1>

        <div className="flex flex-col justify-start items-start gap-4 w-full">
          <div className="flex flex-col justify-start items-start gap-2  w-full">
            <div className="flex flex-row justify-between items-center gap-2 w-full">
              <div></div>
              <div className="flex flex-row justify-center items-center gap-2 text-sm">
                <div>Balance: {balanceResult.data ? parseFloat(formatUnits(balanceResult.data.value, balanceResult.data.decimals)).toFixed(6) : 0}</div>
                <button onClick={() => {
                  if (inputAmount.current && balanceResult.data) {
                    inputAmount.current.value = formatUnits(balanceResult.data.value, balanceResult.data.decimals);
                  }
                }} className="text-[#FF5D5D] font-bold">Max</button>
              </div>
            </div>
            <div className="flex flex-row justify-start items-start gap-2  w-full">
              <Select
                value={selectchain.id.toString()}
                onValueChange={(e) => handleSelectChainChange(e)}
              >
                <SelectTrigger className="w-36  bg-[#FF5D5D] py-2.5 px-2 rounded-lg border-0 font-medium focus:outline-none text-black">
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
              <Input
                ref={inputAmount}
                type="number"
                className="py-2.5 rounded-lg bg-transparent focus:outline-none text-right w-full border border-slate-500 text-2xl"
                placeholder={`0.1 - 0.5ETH`}
              />
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
            className="text-black w-full text-xl py-6 font-medium bg-[#FF5D5D] hover:bg-white"
          >
            Stake
          </Button>
        </div>

        <div className="flex flex-col items-start justify-center gap-4 w-full mt-6">
          <h2 className="text-2xl font-bold text-[#FF5D5D]">Your Staking</h2>
          <div className="grid grid-cols-2 justify-between items-start gap-4 w-full">
            <div className="flex flex-col justify-center items-start gap-2">
              <div>Staked on Ethereum</div>
              <div>
                {formatUnits(
                  holeskyBalance ? holeskyBalance : BigInt("0"),
                  18
                )}
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
      <div className="max-w-xl w-full flex flex-col items-start justify-center gap-6">
        <h1 className="text-3xl font-bold text-[#FF5D5D]">
          Avaliable Liquidity
        </h1>
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col justify-start items-start gap-2 border-4 border-[#FF5D5D] rounded-3xl px-8  py-6">
            <h3 className=" text-xl font-medium">Ethereum</h3>
            <h4 className="text-4xl font-bold text-[#FF5D5D]">{holeskyContractBalance.data ? formatUnits(holeskyContractBalance.data.value, 18) : 0} ETH</h4>
          </div>
          <div className="flex flex-col justify-start items-start gap-2 border-4 border-[#FF5D5D] rounded-3xl px-8  py-6">
            <h3 className=" text-xl font-medium">Taiko</h3>
            <h4 className="text-4xl font-bold text-[#FF5D5D]">{heklaContractBalance.data ? formatUnits(heklaContractBalance.data.value, 18) : 0} ETH</h4>
          </div>
        </div>
      </div>
    </main>
  );
}
