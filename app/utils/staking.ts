import { Address, erc20Abi, formatUnits } from "viem";
import {
    readContract,
    writeContract,
    waitForTransactionReceipt,
    estimateGas
} from "@wagmi/core";
import { config, hekla, holesky } from "../providers/config";
import { stakingABI } from "../abi/stakingABI";
import { Chain } from "@rainbow-me/rainbowkit";
import { STAKING_HOLESKY, STAKING_HEKLA } from "./address";



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

// export const getGasEstimate = async (isL1: boolean, amount: bigint) => {
//     const gasEstimate = await estimateGas(config, {
//         account: "0x",
//         to: isL1 ? l1StakingToken : stakingToken,
//         chain: isL1 ? holesky : hekla,
//         functionName: 'stake',
//         args: [amount],
//     });
// }



export const unstakeToken = async (chain: Chain, amount: bigint, userAddress: Address) => {
    try {
        let result = await writeContract(config, {
            abi: stakingABI,
            address: chain.id === 17000 ? STAKING_HOLESKY : STAKING_HEKLA,
            chain: chain,
            functionName: "withdraw",
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
}

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

export function convertToBigInt(amount: number, decimals: number) {
    const parsedAmountIn = BigInt(Math.floor(amount * Math.pow(10, 6)));
    if (decimals >= 6) return parsedAmountIn * BigInt(10) ** BigInt(decimals - 6);
    else return parsedAmountIn / BigInt(10) ** BigInt(6 - decimals);
}