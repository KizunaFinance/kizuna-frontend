"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useEffect, useRef, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import WalletConnect from "./components/walletConnect";
import { stakeToken } from "./utils/staking";
import { stakingABI } from "./abi/stakingABI";
import { formatUnits } from "viem";
import { config } from "./providers/config";
import { switchChain } from '@wagmi/core'



export default function Home() {

  const stakingToken = "0xdfa96d5E31177F182fc95790Be712D238d0d3b83";
  const dEthToken = "0xD3f7FF12e5aeee30e08A59392726E51DCb3Cc256"
  const l1StakingToken = "0xB458B11562646A662AB2Ded927c2e2e8564e0201";
  const l1dEthToken = "0xc044DfbDba4E3A6B11961ee35512F66708de5d48";


  const { address, isConnected, chain } = useAccount();
  const inputAmount = useRef<HTMLInputElement>(null);
  const { data: stakedBalances, isLoading: isStakedBalancesLoading, isError: isStakedBalancesError } = useReadContract(
    {
      abi: stakingABI,
      address: stakingToken,
      functionName: "stakedBalances",
      chainId: 167009,
      args: [address!],
    }
  )

  const { data: l1StakedBalances, isLoading: isL1StakedBalancesLoading, isError: isL1StakedBalancesError } = useReadContract(
    {
      abi: stakingABI,
      address: l1StakingToken,
      functionName: "stakedBalances",
      chainId: 17000,
      args: [address!],
    }
  )


  useEffect(() => {
    if (chain?.id === 17000) {
      setChecked(true)
    } else {
      setChecked(false)
    }
  }, [chain])


  const _switchChain = async (isL1: boolean) => {
    try {
      if (isL1) {
        await switchChain(config, { chainId: 17000 })
      } else {
        await switchChain(config, { chainId: 167009 })
      }
      return {
        success: true,
        message: "Chain switched"
      }
    } catch (e) {
      return {
        success: false,
        message: "Chain switch failed"
      }
    }
  }


  const [checked, setChecked] = useState(false);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24 bg-black text-white">
      <div className="flex flex-col items-center justify-center gap-8 max-w-xl w-full border-2 border-white rounded-3xl px-8 pb-10 pt-6">
        <h1 className="text-3xl font-bold">Stake ETH</h1>
        <div className="flex flex-row justify-center items-center gap-2">
          <Switch onCheckedChange={async (e) => {
            const chainResp = await _switchChain(e)
            if (chainResp.success) {
              setChecked(e)
            } else {
              alert("Please switch chain from your wallet")
            }
          }} checked={checked} />
          <div>{checked ? "Ethereum" : "Taiko"}</div>
        </div>
        <div className="flex flex-col justify-start items-start gap-4 w-full">
          <div className="flex flex-col justify-start items-start gap-2  w-full">
            <Input
              ref={inputAmount}
              type="number"
              className="w-full text-black py-5"
              placeholder="Enter the amount"
            />
          </div>
          <Button
            onClick={async () => {
              const stakeResp = await stakeToken(checked, Number(inputAmount.current?.value), address!)
              if (stakeResp.success) {
                alert("Staked successfully")
              } else {
                alert("Failed to stake")
              }
            }}
            className="text-black w-full text-xl py-6 font-medium"
            variant="outline"
          >
            Stake
          </Button>
          <WalletConnect />
        </div>

        <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex flex-col justify-center items-center gap-2">
            <div>Staked Balances</div>
            <div>{formatUnits(stakedBalances ? stakedBalances : BigInt("0"), 18)}</div>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <div>Staked Balances ETH</div>
            <div>{formatUnits(l1StakedBalances ? l1StakedBalances : BigInt("0"), 18)}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
