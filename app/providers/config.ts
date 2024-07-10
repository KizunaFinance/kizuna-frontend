import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";

export const hekla: Chain = {
  id: 167009,
  name: "Hekla",
  iconUrl: "/chains/icons/Taiko.svg",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.hekla.taiko.xyz"],
      webSocket: undefined,
    },
  },
};

export const holesky: Chain = {
  id: 17000,
  name: "Holesky",
  iconUrl: "/chains/icons/Ethereum.svg",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://1rpc.io/holesky"],
      webSocket: undefined,
    },
  },
};

export const Chains = [hekla, holesky];

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [hekla, holesky],
  ssr: true,
});
