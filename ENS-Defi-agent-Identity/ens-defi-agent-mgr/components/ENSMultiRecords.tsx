'use client';

import { useState } from 'react';
import { useAccount, useEnsResolver, useWriteContract, useWaitForTransactionReceipt, useChainId, useEnsText } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { ENS_PUBLIC_RESOLVER_ABI, getNamehash } from '@/lib/ens';
import { useENS } from './ENSContext';

const EDITABLE_RECORDS = [
  { key: 'email', label: 'Email', icon: '📧', placeholder: 'your@email.com' },
  { key: 'url', label: 'Website', icon: '🌐', placeholder: 'https://yoursite.com' },
  { key: 'description', label: 'Bio', icon: '📝', placeholder: 'Tell us about yourself' },
  { key: 'location', label: 'Location', icon: '📍', placeholder: 'City, Country' },
  { key: 'com.discord', label: 'Discord', icon: '💬', placeholder: 'username#1234' },
  { key: 'com.twitter', label: 'Twitter', icon: '🐦', placeholder: '@username' },
  { key: 'com.github', label: 'GitHub', icon: '💻', placeholder: 'username' },
  { key: 'org.telegram', label: 'Telegram', icon: '✈️', placeholder: '@username' },
];

export function ENSMultiRecords() {
  const [selectedRecord, setSelectedRecord] = useState(EDITABLE_RECORDS[0].key);
  const [newValue, setNewValue] = useState('');
  const [error, setError] = useState('');
  
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { selectedName } = useENS();
  
  const { data: resolver } = useEnsResolver({
    name: selectedName || undefined,
    chainId: sepolia.id,
  });

  const { data: currentValue } = useEnsText({
    name: selectedName || undefined,
    key: selectedRecord,
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
        args: [node, selectedRecord, newValue],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update record');
    }
  };

  if (!isConnected || chainId !== sepolia.id || !selectedName || !resolver) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400 text-sm">
          {!isConnected ? 'Connect wallet to edit records' : 
           chainId !== sepolia.id ? 'Switch to Sepolia network' :
           !selectedName ? 'Select an ENS name' : 'Loading...'}
        </p>
      </div>
    );
  }

  const selectedRecordInfo = EDITABLE_RECORDS.find(r => r.key === selectedRecord)!;

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit Text Records</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Record</label>
          <select
            value={selectedRecord}
            onChange={(e) => {
              setSelectedRecord(e.target.value);
              setNewValue('');
              setError('');
            }}
            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            {EDITABLE_RECORDS.map((record) => (
              <option key={record.key} value={record.key}>
                {record.icon} {record.label}
              </option>
            ))}
          </select>
        </div>

        {currentValue && (
          <div className="bg-gray-700 rounded p-3">
            <p className="text-xs text-gray-400 mb-1">Current Value:</p>
            <p className="text-sm text-gray-300 break-all">{currentValue}</p>
          </div>
        )}

        <div>
          <label htmlFor="recordValue" className="block text-sm font-medium mb-2">
            New Value
          </label>
          <input
            id="recordValue"
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={selectedRecordInfo.placeholder}
            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            disabled={isPending || isConfirming}
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={!newValue.trim() || isPending || isConfirming}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition"
        >
          {isPending ? 'Waiting for approval...' : isConfirming ? 'Confirming...' : `Update ${selectedRecordInfo.label}`}
        </button>

        {isSuccess && (
          <div className="bg-green-900/20 border border-green-500 rounded p-3">
            <p className="text-green-400 text-sm">✅ Record updated successfully!</p>
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
