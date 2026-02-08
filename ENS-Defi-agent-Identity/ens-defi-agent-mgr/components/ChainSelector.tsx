'use client';

import { useSwitchChain, useChainId } from 'wagmi';
import { SUPPORTED_CHAINS } from '@/lib/wagmi';

export function ChainSelector() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-sm font-semibold mb-1">Select Network</h3>
          <p className="text-xs text-gray-400">Choose which chain to query ENS data from</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {SUPPORTED_CHAINS.map((chain) => (
            <button
              key={chain.id}
              onClick={() => switchChain({ chainId: chain.id })}
              disabled={isPending || chainId === chain.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                chainId === chain.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {chain.name}
              {chain.isDefault && ' ⭐'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
