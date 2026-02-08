'use client';

import { useAccount, useChainId } from 'wagmi';
import { useState, useEffect } from 'react';
import { getENSNamesForAddress, ENSDomain } from '@/lib/getENSNames';

export function AllMyENSNames() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [domains, setDomains] = useState<ENSDomain[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchENSNames = async () => {
    if (!address) {
      console.log('⚠️ No address provided');
      return;
    }

    setLoading(true);
    setError('');
    setDomains([]);

    console.log('🚀 Fetching ENS names for:', address, 'on chain:', chainId);
    
    const result = await getENSNamesForAddress(address, chainId);
    
    if (result.error) {
      console.error('❌ Error:', result.error);
      setError(result.error);
    } else {
      console.log('✅ Found domains:', result.domains);
      setDomains(result.domains);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchENSNames();
    }
  }, [address, chainId, isConnected]);

  if (!isConnected) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400 text-sm">Connect wallet to view your ENS names</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">🏷️ Your ENS Names</h3>
        <button
          onClick={fetchENSNames}
          disabled={loading}
          className="text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded transition flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Loading...
            </>
          ) : (
            <>🔄 Refresh</>
          )}
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Fetching your ENS names...</p>
          <p className="text-gray-500 text-xs mt-2">This may take a few seconds</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded p-4 mb-4">
          <p className="text-red-400 text-sm font-semibold">❌ Error</p>
          <p className="text-red-300 text-xs mt-2">{error}</p>
        </div>
      )}

      {!loading && !error && domains.length === 0 && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-400 mb-2">No ENS names found</p>
          <p className="text-gray-500 text-sm mb-4">
            Register an ENS name to get started
          </p>
        </div>
      )}

      {!loading && domains.length > 0 && (
        <div className="space-y-3">
          <div className="bg-green-900/20 border border-green-500 rounded p-3 mb-4">
            <p className="text-green-400 font-semibold">
              ✅ Found {domains.length} ENS {domains.length === 1 ? 'name' : 'names'}
            </p>
          </div>

          {domains.map((domain, index) => (
            <div
              key={domain.id || index}
              className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-lg font-semibold text-blue-400">{domain.name}</p>
                  {domain.labelName && !domain.tokenId && (
                    <p className="text-xs text-gray-400 mt-1">Label: {domain.labelName}</p>
                  )}
                  {domain.tokenId && (
                    <p className="text-xs text-gray-400 mt-1">Token ID: {domain.tokenId}</p>
                  )}
                  {domain.createdAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {new Date(parseInt(domain.createdAt) * 1000).toLocaleDateString()}
                    </p>
                  )}
                  {domain.expiryDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Expires: {new Date(parseInt(domain.expiryDate) * 1000).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <a
                    href={`https://${chainId === 11155111 ? 'sepolia.' : ''}etherscan.io/name-lookup-search?id=${domain.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded transition whitespace-nowrap"
                  >
                    View ↗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 bg-blue-900/20 border border-blue-500 rounded p-3">
        <p className="text-blue-300 text-xs">
          💡 <strong>Tip:</strong> To make an ENS name show as your primary name, set it in the "Edit Records" tab.
        </p>
      </div>
    </div>
  );
}
