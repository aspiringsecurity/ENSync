'use client';

import { useState } from 'react';
import { useAccount, useEnsName, useEnsResolver, useWriteContract, useWaitForTransactionReceipt, useChainId, useReadContract } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { ENS_PUBLIC_RESOLVER_ABI, getNamehash } from '@/lib/ens';

export function ENSContentHash() {
  const [newContentHash, setNewContentHash] = useState('');
  const [error, setError] = useState('');
  
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: ensName } = useEnsName({
    address,
    chainId: sepolia.id,
  });
  
  const { data: resolver } = useEnsResolver({
    name: ensName || undefined,
    chainId: sepolia.id,
  });

  const { data: currentContentHash } = useReadContract({
    address: resolver,
    abi: ENS_PUBLIC_RESOLVER_ABI,
    functionName: 'contenthash',
    args: ensName ? [getNamehash(ensName)] : undefined,
    chainId: sepolia.id,
  });

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const canUpdate = isConnected && ensName && resolver && chainId === sepolia.id;

  const handleUpdate = async () => {
    if (!canUpdate || !ensName || !resolver) return;
    
    setError('');
    
    try {
      const node = getNamehash(ensName);
      
      // Convert IPFS hash to bytes if it starts with ipfs://
      let contentHashBytes = newContentHash;
      if (newContentHash.startsWith('ipfs://')) {
        contentHashBytes = newContentHash.slice(7);
      }
      
      writeContract({
        address: resolver,
        abi: ENS_PUBLIC_RESOLVER_ABI,
        functionName: 'setContenthash',
        args: [node, contentHashBytes as `0x${string}`],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content hash');
    }
  };

  if (!isConnected || chainId !== sepolia.id || !ensName || !resolver) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Content Hash</h2>
      
      <div className="space-y-4">
        {currentContentHash && (
          <div className="bg-gray-700 rounded p-3">
            <p className="text-xs text-gray-400 mb-1">Current Content Hash:</p>
            <p className="text-sm text-gray-300 break-all font-mono">{currentContentHash.toString()}</p>
          </div>
        )}

        <div>
          <label htmlFor="contenthash" className="block text-sm font-medium mb-2">
            New Content Hash (IPFS CID or bytes)
          </label>
          <input
            id="contenthash"
            type="text"
            value={newContentHash}
            onChange={(e) => setNewContentHash(e.target.value)}
            placeholder="ipfs://Qm... or 0x..."
            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500 font-mono text-sm"
            disabled={isPending || isConfirming}
          />
          <p className="text-xs text-gray-400 mt-1">
            Used for decentralized website hosting
          </p>
        </div>

        <button
          onClick={handleUpdate}
          disabled={!newContentHash.trim() || isPending || isConfirming}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition"
        >
          {isPending ? 'Waiting for approval...' : isConfirming ? 'Confirming...' : 'Update Content Hash'}
        </button>

        {isSuccess && (
          <div className="bg-green-900/20 border border-green-500 rounded p-3">
            <p className="text-green-400 text-sm">✅ Content hash updated!</p>
          </div>
        )}

        {(error || writeError) && (
          <div className="bg-red-900/20 border border-red-500 rounded p-3">
            <p className="text-red-400 text-sm">❌ {error || writeError?.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
