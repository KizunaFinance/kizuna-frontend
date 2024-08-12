import { Address, erc20Abi, formatUnits } from "viem";
import {
    writeContract,
    waitForTransactionReceipt,
    readContract
} from "@wagmi/core";
import { config, hekla, holesky } from "../providers/config";
import { stakingABI } from "../abi/stakingABI";
import { Chain } from "@rainbow-me/rainbowkit";
import { STAKING_HOLESKY, STAKING_HEKLA } from "./address";

const COOLDOWN_PERIOD = 7 * 24 * 60 * 60; // 7 days in seconds

export const stakeToken = async (chain: Chain, amount: number, userAddress: Address) => {
    try {
        let result = await writeContract(config, {
            abi: stakingABI,
            address: chain.id === 17000 ? STAKING_HOLESKY : STAKING_HEKLA,
            chain: chain,
            functionName: "stake",
            value: convertToBigInt(amount, 18),
        });
        await waitForTransaction(result);
        return {
            success: true,
            data: result,
        };
    } catch (e: any) {
        console.log(e)
        return {
            success: false,
            data: e,
        }
    }
};

export const unstakeToken = async (chain: Chain, amount: bigint, userAddress: Address) => {
    try {
        let result = await writeContract(config, {
            abi: stakingABI,
            address: chain.id === 17000 ? STAKING_HOLESKY : STAKING_HEKLA,
            chain: chain,
            functionName: "unstake",
            args: [amount],
        });
        await waitForTransaction(result);
        return {
            success: true,
            data: result,
        };
    } catch (e: any) {
        console.log(e)
        return {
            success: false,
            data: e,
        }
    }
};

export const withdrawToken = async (chain: Chain, recordID: bigint, userAddress: Address) => {
    try {
        const canWithdraw = await getTimeLeftToWithdraw(chain, recordID) > 0;
        if (!canWithdraw) {
            throw new Error("Cannot withdraw funds yet. Please wait for the cooldown period to end.");
        }

        let result = await writeContract(config, {
            abi: stakingABI,
            address: chain.id === 17000 ? STAKING_HOLESKY : STAKING_HEKLA,
            chain: chain,
            functionName: "withdraw",
            args: [recordID],
        });
        await waitForTransaction(result);
        return {
            success: true,
            data: result,
        };
    } catch (e: any) {
        console.log(e)
        return {
            success: false,
            data: e,
        }
    }
};

const waitForTransaction = async (hash: Address) => {
    try {
        const transactionReceipt = await waitForTransactionReceipt(config, {
            confirmations: 2,
            hash,
        });
        if (transactionReceipt.status === "success") {
            return {
                success: true,
                data: transactionReceipt,
            };
        }
        throw transactionReceipt.status;
    } catch (e: any) {
        throw e;
    }
};

export const getTimeLeftToWithdraw = async (chain: Chain, recordID: bigint) => {
    const withdrawClaim = await readContract(config, {
        abi: stakingABI,
        address: chain.id === 17000 ? STAKING_HOLESKY : STAKING_HEKLA,
        chainId: chain.id,
        functionName: "withdrawClaims",
        args: [recordID],
    });
    const currentTime = BigInt(Math.floor(Date.now() / 1000));
    const timeLeft = (withdrawClaim[1] + BigInt(COOLDOWN_PERIOD)) - currentTime;
    return timeLeft > BigInt(0) ? Number(timeLeft) : 0;
};

export const getWithdrawDetails = async (chain: Chain, recordID: bigint) => {
    const withdrawClaim = await readContract(config, {
        abi: stakingABI,
        address: chain.id === 17000 ? STAKING_HOLESKY : STAKING_HEKLA,
        chainId: chain.id,
        functionName: "withdrawClaims",
        args: [recordID],
    });
    return withdrawClaim;
};

export const getRecordID = async (chain: Chain, userAddress: Address) => {
    const userClaims = await readContract(config, {
        abi: stakingABI,
        address: chain.id === 17000 ? STAKING_HOLESKY : STAKING_HEKLA,
        chainId: chain.id,
        functionName: "getUserClaims",
        args: [userAddress],
    });

    // Assuming userClaims is an array of records
    return userClaims.length > 0 ? userClaims[userClaims.length - 1] : null;
};

export const isUnstaking = async (chain: Chain, recordID: bigint) => {
    const withdrawTime = await getTimeLeftToWithdraw(chain, recordID);
    return withdrawTime > 0;
};

export function convertToBigInt(amount: number, decimals: number) {
    const parsedAmountIn = BigInt(Math.floor(amount * Math.pow(10, 6)));
    if (decimals >= 6) return parsedAmountIn * BigInt(10) ** BigInt(decimals - 6);
    else return parsedAmountIn / BigInt(10) ** BigInt(6 - decimals);
}