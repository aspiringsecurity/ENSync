'use client';

import { useState } from 'react';
import { useAccount, useEnsName, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { isAddress } from 'viem';
import { ENS_REGISTRY_ABI, getNamehash } from '@/lib/ens';

const ENS_REGISTRY_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

export function ENSTransfer() {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: ensName } = useEnsName({
    address,
    chainId: sepolia.id,
  });

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const canTransfer = isConnected && ensName && chainId === sepolia.id;

  const handleTransfer = async () => {
    if (!canTransfer || !ensName || !recipientAddress) return;
    
    if (!isAddress(recipientAddress)) {
      setError('Invalid Ethereum address');
      return;
    }

    if (confirmText !== ensName) {
      setError(`Please type "${ensName}" to confirm`);
      return;
    }
    
    setError('');
    
    try {
      const node = getNamehash(ensName);
      
      writeContract({
        address: ENS_REGISTRY_ADDRESS,
        abi: ENS_REGISTRY_ABI,
        functionName: 'setOwner',
        args: [node, recipientAddress as `0x${string}`],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transfer ENS');
    }
  };

  if (!isConnected || chainId !== sepolia.id || !ensName) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border-2 border-red-900">
      <h2 className="text-2xl font-bold mb-4 text-red-400">⚠️ Transfer ENS Name</h2>
      
      <div className="space-y-4">
        <div className="bg-red-900/20 border border-red-500 rounded p-3">
          <p className="text-red-400 text-sm font-semibold">⚠️ WARNING: This action is irreversible!</p>
          <p className="text-red-300 text-xs mt-1">
            Transferring your ENS name will give full ownership to the recipient. You will lose all control.
          </p>
        </div>

        <div>
          <label htmlFor="recipient" className="block text-sm font-medium mb-2">
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x..."
            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-red-500 font-mono text-sm"
            disabled={isPending || isConfirming}
          />
        </div>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!recipientAddress || !isAddress(recipientAddress)}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition"
          >
            Continue to Confirmation
          </button>
        ) : (
          <>
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium mb-2">
                Type "{ensName}" to confirm transfer
              </label>
              <input
                id="confirm"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={ensName}
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-red-500"
                disabled={isPending || isConfirming}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmText('');
                }}
                disabled={isPending || isConfirming}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                disabled={confirmText !== ensName || isPending || isConfirming}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition"
              >
                {isPending ? 'Approving...' : isConfirming ? 'Transferring...' : 'Transfer Now'}
              </button>
            </div>
          </>
        )}

        {isSuccess && (
          <div className="bg-green-900/20 border border-green-500 rounded p-3">
            <p className="text-green-400 text-sm">✅ ENS name transferred successfully!</p>
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
