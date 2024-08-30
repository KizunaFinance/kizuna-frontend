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
  blockExplorers: {
    default: {
      name: "Taiko",
      url: "https://explorer.hekla.taiko.xyz",
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
  blockExplorers: {
    default: {
      name: "Holesky",
      url: "https://holesky.etherscan.io",
    },
  },
};

export const Chains = [hekla, holesky];

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "9872212bffbbb924a14f597794fab3dc",
  chains: [hekla, holesky],
  ssr: true,
});
