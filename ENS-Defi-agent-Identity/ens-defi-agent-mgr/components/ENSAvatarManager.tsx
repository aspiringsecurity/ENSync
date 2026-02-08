'use client';

import { useState } from 'react';
import { useAccount, useEnsName, useEnsResolver, useWriteContract, useWaitForTransactionReceipt, useChainId, useEnsAvatar } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { ENS_PUBLIC_RESOLVER_ABI, getNamehash } from '@/lib/ens';
import Image from 'next/image';

export function ENSAvatarManager() {
  const [avatarType, setAvatarType] = useState<'url' | 'nft'>('url');
  const [avatarValue, setAvatarValue] = useState('');
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

  const { data: currentAvatar } = useEnsAvatar({
    name: ensName || undefined,
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
      let finalValue = avatarValue;
      
      // Format NFT avatar as eip155:1/erc721:contractAddress/tokenId
      if (avatarType === 'nft') {
        if (!avatarValue.includes('eip155:')) {
          setError('NFT format should be: eip155:1/erc721:0xContractAddress/tokenId');
          return;
        }
      }
      
      writeContract({
        address: resolver,
        abi: ENS_PUBLIC_RESOLVER_ABI,
        functionName: 'setText',
        args: [node, 'avatar', finalValue],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update avatar');
    }
  };

  if (!isConnected || chainId !== sepolia.id || !ensName || !resolver) {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">🖼️ Avatar Manager</h2>
      
      <div className="space-y-4">
        {currentAvatar && (
          <div className="bg-gray-700 rounded p-3 flex items-center gap-3">
            <Image
              src={currentAvatar}
              alt="Current Avatar"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <p className="text-xs text-gray-400">Current Avatar</p>
              <p className="text-sm text-gray-300 break-all">{currentAvatar}</p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Avatar Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => setAvatarType('url')}
              className={`flex-1 py-2 px-4 rounded transition ${
                avatarType === 'url'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🌐 URL
            </button>
            <button
              onClick={() => setAvatarType('nft')}
              className={`flex-1 py-2 px-4 rounded transition ${
                avatarType === 'nft'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🎨 NFT
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="avatar" className="block text-sm font-medium mb-2">
            {avatarType === 'url' ? 'Image URL' : 'NFT Identifier'}
          </label>
          <input
            id="avatar"
            type="text"
            value={avatarValue}
            onChange={(e) => setAvatarValue(e.target.value)}
            placeholder={
              avatarType === 'url'
                ? 'https://example.com/avatar.png'
                : 'eip155:1/erc721:0xContractAddress/tokenId'
            }
            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
            disabled={isPending || isConfirming}
          />
          <p className="text-xs text-gray-400 mt-1">
            {avatarType === 'url'
              ? 'Direct link to an image file'
              : 'Format: eip155:chainId/erc721:contractAddress/tokenId'}
          </p>
        </div>

        <button
          onClick={handleUpdate}
          disabled={!avatarValue.trim() || isPending || isConfirming}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition"
        >
          {isPending ? 'Waiting for approval...' : isConfirming ? 'Updating...' : 'Update Avatar'}
        </button>

        {isSuccess && (
          <div className="bg-green-900/20 border border-green-500 rounded p-3">
            <p className="text-green-400 text-sm">✅ Avatar updated successfully!</p>
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
