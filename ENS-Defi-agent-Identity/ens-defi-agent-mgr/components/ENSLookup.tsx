'use client';

import { useState } from 'react';
import { useEnsName, useEnsAvatar, useEnsText, useChainId } from 'wagmi';
import { isAddress } from 'viem';
import { shortenAddress } from '@/lib/ens';
import Image from 'next/image';
import { SUPPORTED_CHAINS } from '@/lib/wagmi';

export function ENSLookup() {
  const [lookupType, setLookupType] = useState<'address' | 'name'>('address');
  const [inputValue, setInputValue] = useState('');
  const [searchAddress, setSearchAddress] = useState<`0x${string}` | undefined>();
  const [searchName, setSearchName] = useState<string | undefined>();
  const chainId = useChainId();

  const currentChain = SUPPORTED_CHAINS.find(c => c.id === chainId);

  // Lookup ENS name from address
  const { data: ensName, isLoading: nameLoading, error: nameError } = useEnsName({
    address: searchAddress,
    chainId,
  });

  // Lookup avatar
  const { data: ensAvatar } = useEnsAvatar({
    name: lookupType === 'address' ? ensName || undefined : searchName,
    chainId,
  });

  // Lookup text records
  const { data: statusRecord } = useEnsText({
    name: lookupType === 'address' ? ensName || undefined : searchName,
    key: 'status',
    chainId,
  });

  const { data: twitterRecord } = useEnsText({
    name: lookupType === 'address' ? ensName || undefined : searchName,
    key: 'com.twitter',
    chainId,
  });

  const { data: emailRecord } = useEnsText({
    name: lookupType === 'address' ? ensName || undefined : searchName,
    key: 'email',
    chainId,
  });

  const handleSearch = () => {
    if (!inputValue.trim()) return;

    if (lookupType === 'address') {
      if (isAddress(inputValue)) {
        setSearchAddress(inputValue as `0x${string}`);
        setSearchName(undefined);
      }
    } else {
      setSearchName(inputValue);
      setSearchAddress(undefined);
    }
  };

  const displayName = lookupType === 'address' ? ensName : searchName;
  const hasResults = lookupType === 'address' ? ensName : searchName;

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">🔍 ENS Lookup (Any Address/Name)</h2>
      
      <div className="space-y-4">
        <div className="bg-blue-900/20 border border-blue-500 rounded p-3">
          <p className="text-blue-300 text-sm">
            🌐 Currently searching on: <span className="font-semibold">{currentChain?.name}</span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Lookup Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setLookupType('address');
                setInputValue('');
                setSearchAddress(undefined);
                setSearchName(undefined);
              }}
              className={`flex-1 py-2 px-4 rounded transition ${
                lookupType === 'address'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Address → Name
            </button>
            <button
              onClick={() => {
                setLookupType('name');
                setInputValue('');
                setSearchAddress(undefined);
                setSearchName(undefined);
              }}
              className={`flex-1 py-2 px-4 rounded transition ${
                lookupType === 'name'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Name → Data
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="lookup" className="block text-sm font-medium mb-2">
            {lookupType === 'address' ? 'Ethereum Address' : 'ENS Name'}
          </label>
          <div className="flex gap-2">
            <input
              id="lookup"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={lookupType === 'address' ? '0x...' : 'vitalik.eth'}
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500 font-mono text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
            >
              Search
            </button>
          </div>
        </div>

        {nameLoading && (
          <div className="bg-gray-700 rounded p-4 text-center">
            <p className="text-gray-300">Searching...</p>
          </div>
        )}

        {nameError && (
          <div className="bg-red-900/20 border border-red-500 rounded p-3">
            <p className="text-red-400 text-sm">❌ Error: {nameError.message}</p>
          </div>
        )}

        {hasResults && !nameLoading && (
          <div className="bg-gray-700 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-4">
              {ensAvatar ? (
                <Image
                  src={ensAvatar}
                  alt="ENS Avatar"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
              )}
              
              <div>
                <p className="text-xl font-semibold text-blue-400">{displayName}</p>
                {lookupType === 'address' && searchAddress && (
                  <p className="text-sm text-gray-400">{shortenAddress(searchAddress)}</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-600 pt-4 space-y-2">
              <h3 className="font-semibold text-sm text-gray-300 mb-2">Text Records:</h3>
              
              {statusRecord && (
                <div className="bg-gray-600 rounded p-2">
                  <p className="text-xs text-gray-400">💬 Status</p>
                  <p className="text-sm text-gray-200">{statusRecord}</p>
                </div>
              )}
              
              {twitterRecord && (
                <div className="bg-gray-600 rounded p-2">
                  <p className="text-xs text-gray-400">🐦 Twitter</p>
                  <p className="text-sm text-gray-200">{twitterRecord}</p>
                </div>
              )}
              
              {emailRecord && (
                <div className="bg-gray-600 rounded p-2">
                  <p className="text-xs text-gray-400">📧 Email</p>
                  <p className="text-sm text-gray-200">{emailRecord}</p>
                </div>
              )}

              {!statusRecord && !twitterRecord && !emailRecord && (
                <p className="text-sm text-gray-400 italic">No text records found</p>
              )}
            </div>
          </div>
        )}

        {lookupType === 'address' && searchAddress && !ensName && !nameLoading && (
          <div className="bg-yellow-900/20 border border-yellow-500 rounded p-3">
            <p className="text-yellow-400 text-sm">⚠️ No ENS name found for this address on {currentChain?.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
