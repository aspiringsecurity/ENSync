import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, goerli, holesky } from 'wagmi/chains';
import { http } from 'wagmi';
import { createStorage, cookieStorage } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'ENS Profile dApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [sepolia, mainnet, goerli, holesky],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
    [goerli.id]: http(),
    [holesky.id]: http(),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export const SUPPORTED_CHAINS = [
  { id: sepolia.id, name: 'Sepolia', chain: sepolia, isDefault: true },
  { id: mainnet.id, name: 'Ethereum Mainnet', chain: mainnet, isDefault: false },
  { id: goerli.id, name: 'Goerli', chain: goerli, isDefault: false },
  { id: holesky.id, name: 'Holesky', chain: holesky, isDefault: false },
] as const;
