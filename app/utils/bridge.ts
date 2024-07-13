import { Address, erc20Abi, formatUnits } from "viem";
import {
    readContract,
    writeContract,
    waitForTransactionReceipt,
    estimateGas
} from "@wagmi/core";
import { config } from "../providers/config";
import { Chain } from "@rainbow-me/rainbowkit";
import { BridgeAbi } from "../abi/brdigeABI";
import { BRIDGE_HEKLA, BRIDGE_HOLESKY } from "./address";


const HEKLA_V2_TESTNET = 40274
const HOLESKY_V2_TESTNET = 40217


export const bridgeToken = async (tokenIn: Chain, tokenOut: Chain, amount: string, userAddress: Address) => {
    try {
        let options: `0x${string}` = "0x00030100110100000000000000000000000000030d40"
        console.log("args", [tokenIn.id === 17000 ? HEKLA_V2_TESTNET : HOLESKY_V2_TESTNET, options, false].toString())
        let nativeFeeResult = await readContract(config, {
            abi: BridgeAbi,
            address: tokenIn.id === 17000 ? BRIDGE_HOLESKY : BRIDGE_HEKLA,
            functionName: "quote",
            args: [tokenIn.id === 17000 ? HEKLA_V2_TESTNET : HOLESKY_V2_TESTNET, options, false],
        })

        console.log("nativeFeeResult", nativeFeeResult)

        console.log("amount", convertToBigInt(Number(amount), 18) + nativeFeeResult.nativeFee)
        console.log("Bridge Args", [tokenIn.id === 17000 ? HEKLA_V2_TESTNET : HOLESKY_V2_TESTNET, nativeFeeResult.nativeFee, userAddress, options].toString())

        let result = await writeContract(config, {
            abi: BridgeAbi,
            address: tokenIn.id === 17000 ? BRIDGE_HOLESKY : BRIDGE_HEKLA,
            chain: tokenIn,
            functionName: "send",
            args: [tokenIn.id === 17000 ? HEKLA_V2_TESTNET : HOLESKY_V2_TESTNET, nativeFeeResult.nativeFee, userAddress, options],
            value: convertToBigInt(Number(amount), 18) + nativeFeeResult.nativeFee,
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