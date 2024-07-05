import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, } from 'wagmi/chains';

export const hekla: Chain = {
    id: 167009,
    name: 'Hekla',
    nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.hekla.taiko.xyz'],
            webSocket: undefined
        }
    }
}

export const holesky: Chain = {
    id: 17000,
    name: 'Holesky',
    nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
    },
    rpcUrls: {
        default: {
            http: ['https://1rpc.io/holesky'],
            webSocket: undefined
        }
    }
}

export const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [hekla, holesky],
    ssr: true,
});