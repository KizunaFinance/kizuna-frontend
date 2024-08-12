import { Address, erc20Abi, formatUnits } from "viem";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
  estimateGas,
} from "@wagmi/core";
import { config } from "../providers/config";
import { Chain } from "@rainbow-me/rainbowkit";
import { BridgeAbi } from "../abi/brdigeABI";
import { BRIDGE_HEKLA, BRIDGE_HOLESKY } from "./address";
import { Options } from "@layerzerolabs/lz-v2-utilities";

const HEKLA_V2_TESTNET = 40274;
const HOLESKY_V2_TESTNET = 40217;

export const bridgeToken = async (
  tokenIn: Chain,
  amount: string,
  userAddress: Address
) => {
  try {
    const options = Options.newOptions().addExecutorLzReceiveOption(600000, 2).toHex() as `0x${string}`

    let nativeFeeResult = await readContract(config, {
      abi: BridgeAbi,
      address: tokenIn.id === 17000 ? BRIDGE_HOLESKY : BRIDGE_HEKLA,
      functionName: "quoteAmount",
      args: [
        tokenIn.id === 17000 ? HEKLA_V2_TESTNET : HOLESKY_V2_TESTNET,
        convertToBigInt(Number(amount), 18),
        userAddress,
        options,
      ],
    });

    let result = await writeContract(config, {
      abi: BridgeAbi,
      address: tokenIn.id === 17000 ? BRIDGE_HOLESKY : BRIDGE_HEKLA,
      chain: tokenIn,
      functionName: "sendAmount",
      args: [
        tokenIn.id === 17000 ? HEKLA_V2_TESTNET : HOLESKY_V2_TESTNET,
        convertToBigInt(Number(amount), 18),
        userAddress,
        options,
      ],
      value: convertToBigInt(Number(amount), 18) + nativeFeeResult.nativeFee,
    });
    await waitForTransaction(result);
    return {
      success: true,
      data: result,
    };
  } catch (e: any) {
    console.log(e);
    return {
      success: false,
      data: e,
    };
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

export function convertToBigInt(amount: number, decimals: number) {
  const parsedAmountIn = BigInt(Math.floor(amount * Math.pow(10, 6)));
  if (decimals >= 6) return parsedAmountIn * BigInt(10) ** BigInt(decimals - 6);
  else return parsedAmountIn / BigInt(10) ** BigInt(6 - decimals);
}