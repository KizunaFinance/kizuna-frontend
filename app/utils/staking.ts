import { Address, erc20Abi, formatUnits } from "viem";
import {
    readContract,
    writeContract,
    waitForTransactionReceipt,
} from "@wagmi/core";
import { config, hekla, holesky } from "../providers/config";
import { stakingABI } from "../abi/stakingABI";


const stakingToken = "0xdfa96d5E31177F182fc95790Be712D238d0d3b83";
const dEthToken = "0xD3f7FF12e5aeee30e08A59392726E51DCb3Cc256"
const l1StakingToken = "0xB458B11562646A662AB2Ded927c2e2e8564e0201";
const l1dEthToken = "0xc044DfbDba4E3A6B11961ee35512F66708de5d48";



const checkAllowance = async (erc20Token: Address, userAddress: Address) => {
    try {
        let result = await readContract(config, {
            abi: erc20Abi,
            address: erc20Token,
            functionName: "allowance",
            args: [userAddress, stakingToken],
        });
        return {
            success: true,
            data: result,
        };
    } catch (e: any) {
        throw e;
    }
};

const callApprove = async (isL1: boolean, erc20Token: Address, amountIn: bigint) => {
    try {
        let result = await writeContract(config, {
            abi: erc20Abi,
            address: erc20Token,
            functionName: "approve",
            chain: isL1 ? holesky : hekla,
            args: [stakingToken, amountIn],
        });
        await waitForTransaction(result);
        return {
            success: true,
            data: result,
        };
    } catch (e: any) {
        throw e;
    }
};

export const stakeToken = async (isL1: boolean, amount: number, userAddress: Address) => {
    try {
        let result = await writeContract(config, {
            abi: stakingABI,
            address: isL1 ? l1StakingToken : stakingToken,
            chain: isL1 ? holesky : hekla,
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


export const unstakeToken = async (isL1: boolean, amount: bigint, userAddress: Address) => {
    try {
        const allowance = await checkAllowance(isL1 ? l1dEthToken : dEthToken, userAddress);
        if (allowance.data < amount) {
            await callApprove(isL1, isL1 ? l1dEthToken : dEthToken, amount);
        }
        let result = await writeContract(config, {
            abi: stakingABI,
            address: isL1 ? l1StakingToken : stakingToken,
            chain: isL1 ? holesky : hekla,
            functionName: "withdraw",
            args: [amount],
        });
        await waitForTransaction(result);
        return {
            success: true,
            data: result,
        };
    } catch (e: any) {
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