'use client';

import { useAccount, useBalance, useEnsName, useChainId } from 'wagmi';
import { shortenAddress } from '@/lib/ens';
import { SUPPORTED_CHAINS } from '@/lib/wagmi';

export function WalletInfo() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const currentChain = SUPPORTED_CHAINS.find(c => c.id === chainId);
  
  const { data: ensName } = useEnsName({
    address,
    chainId,
  });

  const { data: balance } = useBalance({
    address,
  });

  if (!isConnected) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center">
        <p className="text-gray-400 text-sm">Connect wallet to view details</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <span>💼</span>
        <span>Wallet Info</span>
      </h3>
      
      <div className="space-y-2">
        <div className="bg-gray-700 rounded p-3">
          <p className="text-xs text-gray-400 mb-1">Address</p>
          <p className="text-sm font-mono">{address && shortenAddress(address)}</p>
        </div>

        {ensName && (
          <div className="bg-gray-700 rounded p-3">
            <p className="text-xs text-gray-400 mb-1">ENS Name</p>
            <p className="text-sm font-semibold text-blue-400">{ensName}</p>
          </div>
        )}

        <div className="bg-gray-700 rounded p-3">
          <p className="text-xs text-gray-400 mb-1">Network</p>
          <p className="text-sm">{currentChain?.name}</p>
        </div>

        {balance && (
          <div className="bg-gray-700 rounded p-3">
            <p className="text-xs text-gray-400 mb-1">Balance</p>
            <p className="text-sm font-semibold">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
