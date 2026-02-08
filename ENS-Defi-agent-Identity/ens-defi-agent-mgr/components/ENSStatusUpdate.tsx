'use client';

import { useState } from 'react';
import { useAccount, useEnsResolver, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { ENS_PUBLIC_RESOLVER_ABI, getNamehash } from '@/lib/ens';
import { useENS } from './ENSContext';

export function ENSStatusUpdate() {
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState('');
  
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { selectedName } = useENS();
  
  const { data: resolver } = useEnsResolver({
    name: selectedName || undefined,
    chainId: sepolia.id,
  });

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const canUpdate = isConnected && selectedName && resolver && chainId === sepolia.id;

  const handleUpdate = async () => {
    if (!canUpdate || !selectedName || !resolver) return;
    
    setError('');
    
    try {
      const node = getNamehash(selectedName);
      
      writeContract({
        address: resolver,
        abi: ENS_PUBLIC_RESOLVER_ABI,
        functionName: 'setText',
        args: [node, 'status', newStatus],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">Connect your wallet to update status</p>
      </div>
    );
  }

  if (chainId !== sepolia.id) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
        <p className="text-red-400">⚠️ Switch to Sepolia to update status</p>
      </div>
    );
  }

  if (!selectedName) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">Select an ENS name to update status</p>
      </div>
    );
  }

  if (!resolver) {
    return (
      <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-6 text-center">
        <p className="text-yellow-400">⚠️ No resolver set for {selectedName}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Update Status</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-2">
            New Status Message
          </label>
          <input
            id="status"
            type="text"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            disabled={isPending || isConfirming}
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={!newStatus.trim() || isPending || isConfirming}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition"
        >
          {isPending ? 'Waiting for approval...' : isConfirming ? 'Confirming...' : 'Update Status'}
        </button>

        {isSuccess && (
          <div className="bg-green-900/20 border border-green-500 rounded p-3">
            <p className="text-green-400 text-sm">✅ Status updated successfully!</p>
            <p className="text-xs text-gray-400 mt-1">Transaction: {hash?.slice(0, 10)}...{hash?.slice(-8)}</p>
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
